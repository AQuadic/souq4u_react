"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getOrders, GetOrdersResponse, OrderItem } from "./api/getOrders";
import OrdersEmpty from "./OrdersEmpty";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import BackArrow from "@/features/products/icons/BackArrow";
import { formatOrderStatus } from "@/features/order/utils";
import ProductsPagination from "@/shared/components/pagenation/ProductsPagenation";
import { getTranslatedText } from "@/shared/utils/translationUtils";

interface MyOrdersProps {
  showHeader?: boolean;
  statusFilter?: string[];
}

const MyOrders: React.FC<MyOrdersProps> = ({
  showHeader = true,
  statusFilter,
}) => {
  const { t, i18n } = useTranslation("Orders");
  const locale = i18n.language;
  const [currentPage, setCurrentPage] = useState(1);
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
  

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  if (isLoading)
    return (
      <p className="text-neutral-600">
        {t("Profile.loadingOrders")}
      </p>
  );
  if (isError) return <p className="text-red-500">Something went wrong.</p>;

  const itemsToShow = statusFilter
    ? data?.items?.data?.filter((item) =>
        item.status ? statusFilter.includes(item.status) : false
      )
    : data?.items?.data;

  // Calculate pagination
  const totalItems = itemsToShow?.length ?? 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = itemsToShow?.slice(startIndex, endIndex) ?? [];

  return (
    <section>
      {showHeader && (
        <>
          <h2 className="text-[32px] font-bold leading-[100%] mb-4 md:flex hidden">
            {t("Profile.orders")}
          </h2>

          <Link
            to="/profile/account"
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

      {currentItems?.length ? (
        <>
          {currentItems.map((item: OrderItem) => {
            const fmt = item.status ? formatOrderStatus(item.status) : null;
            const label = fmt ? t(`Orders.${fmt.labelKey}`) ?? fmt.labelKey : item.status;
            const bgLight = fmt?.bgLight ?? "";
            const bgDark = fmt?.bgDark ?? "";
            const colorClass = fmt?.color ?? "";

            const productName =
              locale === "ar" ? item.product_name?.ar : item.product_name?.en;

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
                          {t("Common.orderCode")} <span dir="ltr">#{item.code}</span>
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
                        <p className="text-[#C0C0C0] md:text-sm text-xs font-normal leading-[100%]" dir="ltr">#{item.order_code}</p>
                      </div>
                  </div>
                </Link>
                {item.status && fmt && (
                  <div className="absolute md:top-4 top-8 ltr:right-6 rtl:left-6">
                    <div
                      className={`w-full px-2 h-7 rounded-[8px] text-xs flex items-center justify-center ${colorClass} ${bgLight} dark:${bgDark}`}
                    >
                      {label}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

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
    </section>
  );
};

export default MyOrders;
