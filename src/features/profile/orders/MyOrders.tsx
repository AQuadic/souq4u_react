"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getOrders, GetOrdersResponse, OrderItem } from "./api/getOrders";
import OrdersEmpty from "./OrdersEmpty";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import BackArrow from "@/features/products/icons/BackArrow";
import { formatOrderStatus } from "@/features/order/utils";
import ProductsPagination from "@/shared/components/pagenation/ProductsPagenation";
import { getTranslatedText } from "@/shared/utils/translationUtils";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { cartApi } from "@/features/cart/api";

interface MyOrdersProps {
  showHeader?: boolean;
  statusFilter?: string[];
}

const OrderItemSkeleton = () => (
  <div className="relative w-full py-4 h-full bg-[#F7F7F7] shadow-md rounded-2xl px-3 my-4">
    <div className="flex items-end justify-between">
      <div className="flex items-center h-full gap-2">
        <Skeleton className="md:w-[156px] w-20 md:h-[156px] h-20 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" /> 
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-4 w-20" />
    </div>
  </div>
);

const MyOrders: React.FC<MyOrdersProps> = ({
  showHeader = true,
  statusFilter,
}) => {
  const { t, i18n } = useTranslation("Orders");
  const locale = i18n.language;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"current" | "last">("current");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const itemsPerPage = 5;

  const { data, isLoading, isError } = useQuery<GetOrdersResponse, Error>({
    queryKey: ["orders"],
    queryFn: async () => {
      try {
        return await getOrders({ pagination: "simple", per_page: 100 });
      } catch (err) {
        toast.error("Failed to fetch orders");
        throw err;
      }
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: cartApi.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error("Failed to add item to cart:", error);
    },
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, activeTab]);

  const handleOrderAgain = async (orderId: number) => {
    if (isAddingToCart) return;
    const orderItems = data?.items?.data?.filter(
      (item) => item.order_id === orderId
    );

    if (!orderItems || orderItems.length === 0) {
      toast.error(t("Orders.noItemsFound") || "No items found in this order");
      return;
    }

    setIsAddingToCart(true);
    let successCount = 0;
    let failCount = 0;
    const errorMessages: string[] = [];
    for (const item of orderItems) {
      if (!item.productable?.id) {
        failCount++;
        const productName = locale === "ar" ? item.product_name?.ar : item.product_name?.en;
        errorMessages.push(`${productName || 'Unknown product'}: Product not available`);
        continue;
      }

      try {
        await addToCartMutation.mutateAsync({
          itemable_id: item.productable.id,
          itemable_type: item.productable_type || "Product",
          quantity: item.quantity || 1,
          variant_id: item.variant?.id,
        });
        successCount++;
      } catch (error: any) {
        failCount++;
        const productName = locale === "ar" ? item.product_name?.ar : item.product_name?.en;
        let errorMsg = "Failed to add to cart";
        if (error?.response?.data?.message) {
          errorMsg = error.response.data.message;
        } else if (error?.message) {
          errorMsg = error.message;
        }
        
        errorMessages.push(`${productName || 'Unknown product'}: ${errorMsg}`);
      }
    }

    setIsAddingToCart(false);

    if (successCount > 0 && failCount === 0) {
      toast.success(
        t("Orders.allItemsAdded") || `All ${successCount} items added to cart`
      );
      navigate("/cart");
    } else if (successCount > 0 && failCount > 0) {
      toast.success(
        t("Orders.someItemsAdded") ||
          `${successCount} items added, ${failCount} items unavailable`
      );
      errorMessages.forEach((msg) => {
        toast.error(msg, { duration: 4000 });
      });
      navigate("/cart");
    } else {
      errorMessages.forEach((msg) => {
        toast.error(msg, { duration: 4000 });
      });
    }
  };

  if (isLoading) {
    return (
      <section>
        {showHeader && (
          <>
            <h2 className="text-[32px] font-bold leading-[100%] mb-4 md:flex hidden">
              {t("Profile.orders")}
            </h2>

            <Link
              to="/profile/myAccount"
              className="flex items-center gap-2 mb-4 md:hidden"
            >
              <div className="transform ltr:scale-x-100 rtl:scale-x-[-1]">
                <BackArrow />
              </div>
              <h2 className="text-[32px] font-bold leading-[100%]">
                {t("Profile.orders")}
              </h2>
            </Link>
          </>
        )}

        {[...Array(5)].map((_, i) => (
          <OrderItemSkeleton key={i} />
        ))}
      </section>
    );
  }

  if (isError) return <p className="text-red-500">Something went wrong.</p>;

  const allOrders = statusFilter
    ? data?.items?.data?.filter((item) =>
        item.status ? statusFilter.includes(item.status) : false
      )
    : data?.items?.data;

  const currentOrders = allOrders?.filter((item) => item.status !== "completed") ?? [];
  const completedOrders = allOrders?.filter((item) => item.status === "completed") ?? [];
  const itemsToShow = activeTab === "current" ? currentOrders : completedOrders;

  // Calculate pagination
  const totalItems = itemsToShow.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = itemsToShow.slice(startIndex, endIndex);

  const renderOrderItem = (item: OrderItem) => {
    const fmt = item.status ? formatOrderStatus(item.status) : null;
    const label = fmt ? t(`Orders.${fmt.labelKey}`) ?? fmt.labelKey : item.status;
    const bgLight = fmt?.bgLight ?? "";
    const bgDark = fmt?.bgDark ?? "";
    const colorClass = fmt?.color ?? "";

    const productName =
      locale === "ar" ? item.product_name?.ar : item.product_name?.en;

    const isCompleted = activeTab === "last";

    return (
      <div
        key={item.id}
        className="relative w-full py-4 h-full bg-[#F7F7F7] shadow-md rounded-2xl px-3 my-4"
      >
        <Link to={`/profile/orders/tracking/${item.order_id}`}>
          <div className="flex items-end justify-between">
            <div className="flex items-center cursor-pointer h-full">
              <img
                src={
                  item.productable?.image?.url || "/placeholder-image.jpg"
                }
                alt={productName ?? "Product"}
                width={156}
                height={156}
                className="md:w-[156px] w-20 md:h-[156px] h-20"
              />
              <div className="px-2">
                <p className="text-[#C0C0C0] md:text-sm text-xs font-normal leading-[100%]">
                  {t('Orders.itemNumber')} : <span dir="ltr">#{item.code}</span>
                </p>
                <h1 className="md:text-2xl text-base font-semibold leading-tight md:mt-6 mt-4 line-clamp-2">
                  {productName}
                </h1>
                {Array.isArray(item.variant?.attributes) && item.variant.attributes.length > 0 && (
                  <div className="flex flex-wrap gap-1 my-4">
                    {item.variant.attributes.map((attr, index) => {
                      const attrName = getTranslatedText(attr.attribute?.name, locale);
                      const attrValue = getTranslatedText(attr.value?.value, locale);

                      const isColorAttr =
                        attr.attribute?.type === "Color" ||
                        /(color|colour|لون)/i.test(attrName);

                      return (
                        <div
                          key={index}
                          className="flex items-center gap-1 text-xs bg-main/10 text-[var(--color-main)] px-2 py-1 rounded-full"
                        >
                          {isColorAttr && attr.value?.special_value && (
                            <span
                              className="inline-block w-3 h-3 rounded-full border border-gray-300"
                              style={{ backgroundColor: attr.value.special_value }}
                            />
                          )}
                          <span>
                            {attrName}: {attrValue}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
                <p className="text-[#C0C0C0] md:text-sm text-xs font-normal leading-[100%] md:mt-6 mt-3">
                  {item.created_at
                    ? (() => {
                        const dateLocale =
                          locale === "ar" ? "ar-EG" : "en-GB";
                        return new Intl.DateTimeFormat(dateLocale, {
                          weekday: "long",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }).format(new Date(item.created_at));
                      })()
                    : "N/A"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-[#C0C0C0] md:text-sm text-xs font-normal leading-[100%]" dir="ltr">{t('Orders.orderNumber')} : {item.order_code}</p>
            </div>
          </div>
        </Link>
        {item.status && fmt && (
          <div className="absolute md:top-4 top-8 ltr:right-6">
            <div
              className={`w-full px-2 h-7 rounded-[8px] text-xs flex items-center justify-center ${colorClass} ${bgLight} dark:${bgDark}`}
            >
              {label}
            </div>
          </div>
        )}
        {isCompleted && (
          <div className="mt-4 flex">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleOrderAgain(item.order_id);
              }}
              disabled={isAddingToCart}
              className="bg-[var(--color-main)] hover:bg-[var(--color-main)]/90 text-white px-6 py-2 w-full h-14 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingToCart ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t('Orders.adding') || 'Adding...'}
                </span>
              ) : (
                t('Orders.orderAgain') || 'Order Again'
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <section>
      {showHeader && (
        <>
          <h2 className="text-[32px] font-bold leading-[100%] mb-4 md:flex hidden">
            {t("Profile.orders")}
          </h2>

          <Link
            to="/profile/myAccount"
            className="flex items-center gap-2 mb-4 md:hidden"
          >
            <div className="transform ltr:scale-x-100 rtl:scale-x-[-1]">
              <BackArrow />
            </div>
            <h2 className="text-[32px] font-bold leading-[100%]">
              {t("Profile.orders")}
            </h2>
          </Link>
        </>
      )}

      <Tabs
          value={activeTab}
          onValueChange={(value: string) => {
            if (value === "current" || value === "last") {
              setActiveTab(value);
            }
          }}
          className="w-full"
        >
        <TabsList className="bg-transparent mb-4">
          <TabsTrigger value="current" className="md:w-[446px] h-14">
            {t('Orders.currentOrders') || 'Current Orders'}
          </TabsTrigger>
          <TabsTrigger value="last" className="md:w-[446px] h-14">
            {t('Orders.lastOrders') || 'Last Orders'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="current">
          {currentItems.length ? (
            <>
              {currentItems.map(renderOrderItem)}
              {totalPages > 1 && (
                <ProductsPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          ) : (
            <OrdersEmpty />
          )}
        </TabsContent>
        
        <TabsContent value="last">
          {currentItems.length ? (
            <>
              {currentItems.map(renderOrderItem)}
              {totalPages > 1 && (
                <ProductsPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          ) : (
            <OrdersEmpty />
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default MyOrders;