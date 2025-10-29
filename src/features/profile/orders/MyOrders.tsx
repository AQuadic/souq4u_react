"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getOrders, GetOrdersResponse, Order } from "./api/getOrders";
import OrdersEmpty from "./OrdersEmpty";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { normalizeOrderStatus, getStatusColors } from "./utils/orderStatus";

import BackArrow from "@/features/products/icons/BackArrow";

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

  const { data, isLoading, isError } = useQuery<GetOrdersResponse, Error>({
    queryKey: ["orders"],
    queryFn: async () => {
      try {
        return await getOrders({ pagination: "simple", per_page: 50 });
      } catch (err) {
        toast.error("Failed to fetch orders");
        throw err;
      }
    },
  });

  if (isLoading)
    return (
      <p className="text-neutral-600">
        {t("Profile.loadingOrders")}
      </p>
  );
  if (isError) return <p className="text-red-500">Something went wrong.</p>;

  const ordersToShow = statusFilter
    ? data?.items?.data?.filter((order) => {
        if (!order.status) return false;
        const normalizedStatus = normalizeOrderStatus(order.status);
        return statusFilter.includes(normalizedStatus);
      })
    : data?.items?.data;

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
            <BackArrow />
            <h2 className="text-[32px] font-bold leading-[100%]">
              {t("Profile.orders")}
            </h2>
          </Link>
        </>
      )}

      {ordersToShow?.length ? (
        ordersToShow.map((order: Order) => {
          const normalizedStatus = normalizeOrderStatus(order.status);
          const { bg, text } = getStatusColors(normalizedStatus);

          const productName =
            locale === "ar" ? order.product_name?.ar : order.product_name?.en;

          return (
            <div
              key={order.id}
              className="relative w-full md:h-[172px] h-24 dark:bg-[#242529] shadow-md hover:shadow-lg rounded-2xl px-3 my-4"
            >
              <Link to={`/profile/orders/tracking/${order.order_id}`}>
                <div className="flex items-center cursor-pointer h-full">
                  <img
                    src={
                      order.productable?.image?.responsive_urls?.[0] ??
                      "/placeholder-image.jpg"
                    }
                    alt={productName ?? "Product"}
                    width={156}
                    height={156}
                    className="md:w-[156px] w-20 md:h-[156px] h-20 "
                  />
                  <div className="px-2">
                    <p className="text-[#C0C0C0] md:text-sm text-xs font-normal leading-[100%]">
                      {t("id")} #<span>{order.order_id}</span>
                    </p>
                    <h1 className=" md:text-2xl text-base font-semibold leading-[100%] md:mt-6 mt-4">
                      {productName}
                    </h1>
                    <p className="text-[#C0C0C0] md:text-sm text-xs font-normal leading-[100%] md:mt-6 mt-3">
                      {order.created_at
                        ? (() => {
                            const dateLocale =
                              locale === "ar" ? "ar-EG" : "en-GB";
                            return new Intl.DateTimeFormat(dateLocale, {
                              weekday: "long",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }).format(new Date(order.created_at));
                          })()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </Link>
              {order.status && (
                <div className="absolute top-4 ltr:right-6 rtl:left-6">
                  <div
                    className={`w-[110px] h-7 ${bg} rounded-[8px] ${text} text-xs flex items-center justify-center`}
                  >
                    {t(normalizedStatus)}
                  </div>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <OrdersEmpty />
      )}
    </section>
  );
};

export default MyOrders;
