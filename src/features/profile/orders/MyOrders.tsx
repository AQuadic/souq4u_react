"use client";

import Image from "next/image";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getOrders, GetOrdersResponse, Order } from "./api/getOrders";
import OrdersEmpty from "./OrdersEmpty";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import ReviewDialog from "./ReviewDialog";
import BackArrow from "@/features/products/icons/BackArrow";

const statusStyles: Record<string, { bg: string; text: string }> = {
  pending: { bg: "bg-[#C8C8C812]", text: "text-[#C8C8C8]" },
  processing: { bg: "bg-[#DF7A0012]", text: "text-[#DF7A00]" },
  shipping: { bg: "bg-[#03A90012]", text: "text-[#03A900]" },
  cancelled: { bg: "bg-[#FF503112]", text: "text-[#FF5031]" },
  confirmed: { bg: "bg-[#03A90012]", text: "text-[#03A900]" },
};

interface MyOrdersProps {
  showHeader?: boolean;
  statusFilter?: string[];
}

const MyOrders: React.FC<MyOrdersProps> = ({
  showHeader = true,
  statusFilter,
}) => {
  const t = useTranslations("Orders");
  const locale = useLocale();

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

  if (isLoading) return <p className="text-white">Loading orders...</p>;
  if (isError) return <p className="text-red-500">Something went wrong.</p>;

  const ordersToShow = statusFilter
    ? data?.items?.data?.filter((order) =>
        order.status ? statusFilter.includes(order.status) : false
      )
    : data?.items?.data;

  return (
    <section>
      {showHeader && (
        <>
          <h2 className="text-[32px] font-bold leading-[100%] mb-4 md:flex hidden">
            {t("orders")}
          </h2>

          <Link
            href="/profile/account"
            className="flex items-center gap-2 mb-4 md:hidden"
          >
            <BackArrow />
            <h2 className="text-[32px] font-bold leading-[100%]">
              {t("orders")}
            </h2>
          </Link>
        </>
      )}

      {ordersToShow?.length ? (
        ordersToShow.map((order: Order) => {
          const statusKey =
            typeof order.status === "string" && statusStyles[order.status]
              ? order.status
              : null;
          const { bg, text } = statusKey
            ? statusStyles[statusKey]
            : { bg: "", text: "" };

          const productName =
            locale === "ar" ? order.product_name?.ar : order.product_name?.en;

          return (
            <div
              key={order.id}
              className="relative w-full md:h-[172px] h-24 dark:bg-[#242529] shadow-md hover:shadow-lg rounded-2xl px-3 my-4"
            >
              <Link href={`/profile/orders/tracking/${order.order_id}`}>
                <div className="flex items-center cursor-pointer h-full">
                  <Image
                    src={
                      order.productable?.image?.responsive_urls?.[0] ??
                      "/placeholder-image.jpg"
                    }
                    alt={productName ?? "Product"}
                    width={156}
                    height={156}
                    className="md:w-[156px] w-20 md:h-[156px] h-20 "
                  />
                  <div>
                    <p className="text-[#C0C0C0] md:text-sm text-xs font-normal leading-[100%]">
                      {t("id")} #<span>{order.order_id}</span>
                    </p>
                    <h1 className=" md:text-2xl text-base font-semibold leading-[100%] md:mt-6 mt-4">
                      {productName}
                    </h1>
                    <p className="text-[#C0C0C0] md:text-sm text-xs font-normal leading-[100%] md:mt-6 mt-3">
                      {order.created_at
                        ? new Intl.DateTimeFormat(
                            locale === "ar" ? "ar-EG" : "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          ).format(new Date(order.created_at))
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </Link>
              {order.status && (
                <div className="absolute top-4 ltr:right-6 rtl:left-6">
                  <div
                    className={`w-[101px] h-7 ${bg} rounded-[8px] ${text} text-xs flex items-center justify-center`}
                  >
                    {order.status}
                  </div>
                </div>
              )}

              <div className="absolute top-12 ltr:right-10 rtl:left-10">
                <ReviewDialog productName={productName} orderId={order.id} />
              </div>
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
