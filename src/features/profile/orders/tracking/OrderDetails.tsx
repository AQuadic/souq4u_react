"use client";

import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Order } from "../api/getOrdersById";
import { cancelOrder } from "../api/cancelOrder";
import { useTranslations, useLocale } from "next-intl";

type OrderDetailsProps = {
  order: Order;
};

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const t = useTranslations("Orders");
  const locale = useLocale();
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleCancel = async (orderId: number) => {
    try {
      setLoadingId(orderId);
      const res = await cancelOrder({ order_id: orderId });
      toast.success(res.message || "Order cancelled successfully");
    } catch (error: unknown) {
      // Narrow unknown to structured error with possible response message
      if (typeof error === "object" && error !== null) {
        const maybe = error as Record<string, unknown>;
        const response = maybe["response"] as
          | Record<string, unknown>
          | undefined;
        const data = response?.["data"] as Record<string, unknown> | undefined;
        const message = data?.["message"] || maybe["message"];
        if (typeof message === "string") {
          toast.error(message);
        } else {
          toast.error("Failed to cancel order");
        }
      } else {
        toast.error("Failed to cancel order");
      }
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <section className="mt-6">
      <h2 className="dark:text-[#FDFDFD] text-2xl font-semibold leading-[100%]">
        {t("itemSummary")}
      </h2>

      {order.orderItems.map((item) => {
        const productName =
          locale === "ar" ? item.product_name?.ar : item.product_name?.en;

        const productImage =
          item.variant?.images?.[0]?.url || "/images/products/productIMG.png";
        const price = item.final_price;

        return (
          <div
            key={item.id}
            className="w-full md:h-[174px] h-24 border border-[#C0C0C0] rounded-3xl mt-6 flex justify-between"
          >
            <div className="flex items-center">
              <img
                src={productImage}
                alt={productName}
                width={142}
                height={142}
                className="md:w-[142px] w-20 md:h-[142px] h-20"
              />
              <div className="ml-4">
                <span className="dark:text-[#C0C0C0] md:text-base text-xs font-poppins">
                  ID: #{item.id}
                </span>
                <h2 className="dark:text-[#FDFDFD] md:text-2xl text-base font-bold leading-[100%] md:mt-6 mt-4">
                  {productName}
                </h2>
                <p className="text-main md:text-2xl text-base font-bold md:mt-6 mt-2">
                  {price} <span className="font-normal">{t("egp")}</span>
                </p>
              </div>
            </div>
            {order.status?.toLowerCase() === "pending" && (
              <button
                type="button"
                className="text-[#CA1E00] text-base font-normal leading-[100%] px-4 py-8 cursor-pointer hover:underline"
                onClick={() => handleCancel(order.id)}
              >
                {loadingId === order.id ? "Cancelling..." : "Cancel"}
              </button>
            )}
          </div>
        );
      })}
    </section>
  );
};

export default OrderDetails;
