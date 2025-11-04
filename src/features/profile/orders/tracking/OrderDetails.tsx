"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { Order } from "../api/getOrdersById";
import { cancelOrder } from "../api/cancelOrder";
import { useTranslation } from "react-i18next";
import ProductReviewDialog from "../ProductReviewDialog";
import { canCancelOrder } from "../utils/orderStatus";

type OrderDetailsProps = {
  order: Order;
  refetch?: () => void;
};

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, refetch }) => {
  const { t, i18n } = useTranslation("Orders");
  const locale = i18n.language;
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [toCancelId, setToCancelId] = useState<number | null>(null);

  const handleCancel = async (orderId: number) => {
    try {
      setLoadingId(orderId);
      const res = await cancelOrder({ order_id: orderId });
      toast.success(res.message || "Order cancelled successfully");

      if (refetch) {
        await refetch();
      }

    } catch {
        toast.error("Failed to cancel order");
    } finally {
      setLoadingId(null);
      setIsDialogOpen(false);
      setToCancelId(null);
    }
  };

  return (
    <section className="mt-6">
      <h2 className="dark:text-[#FDFDFD] text-2xl font-semibold leading-[100%]">
        {t("Orders.itemSummary")}
      </h2>

      {order.orderItems.map((item) => {
        const productName =
          locale === "ar" ? item.product_name?.ar : item.product_name?.en;

        const productImage =
          item.variant?.images?.[0]?.url || "/images/products/productIMG.png";
        const price = item.final_price;

        const productId =
          item.variant?.product_id || item.productable?.product_id;

        return (
          <div
            key={item.id}
            className="w-full border border-[#C0C0C0] rounded-3xl mt-6 flex justify-between items-center min-h-[120px] md:min-h-[174px] py-4"
          >
            <div className="flex items-center px-4 h-full">
              <img
                src={productImage}
                alt={productName}
                width={142}
                height={142}
                className="md:w-[142px] w-20 md:h-[142px] h-20 rounded-lg"
              />
              <div className="mx-4 flex flex-col justify-between h-full">
                <span className="dark:text-[#C0C0C0] md:text-base text-xs font-poppins">
                  ID: #{order.id}
                </span>
                <h2 className="dark:text-[#FDFDFD] md:text-2xl text-base font-bold leading-[100%] md:mt-6 mt-4">
                  {productName}
                </h2>
                <p className="text-main md:text-2xl text-base font-bold md:mt-6 mt-2">
                  {price} <span className="font-normal">{t("Orders.egp")}</span>
                </p>
                {/* Show days since order */}
                {/* {order.created_at && (
                  <p className="text-[#C0C0C0] text-xs mt-1">
                    {Math.floor(
                      (Date.now() - new Date(order.created_at).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    {t("days", { defaultValue: "days" })}
                  </p>
                )} */}
                {/* Review button under product summary */}
                {productId && (
                  <div className="mt-3">
                    <ProductReviewDialog
                      productName={productName}
                      orderId={order.id}
                      productId={productId}
                      orderStatus={order.status}
                      isReviewed={order.is_reviewed}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 pr-4">
              {canCancelOrder(order.status) && (
                <>
                  <button
                    type="button"
                    className="text-main text-base font-normal leading-[100%] px-4 py-8 cursor-pointer hover:underline"
                    onClick={() => {
                      setToCancelId(order.id);
                      setIsDialogOpen(true);
                    }}
                  >
                    {loadingId === order.id
                      ? t("Orders.cancel")
                      : t("Orders.cancel")}
                  </button>

                  {isDialogOpen && toCancelId === order.id && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                      <button
                        aria-label={t("no")}
                        onClick={() => setIsDialogOpen(false)}
                        className="fixed inset-0 bg-black/50"
                      />

                      <div className="relative z-10 w-full max-w-[500px] mx-4">
                        <div className="rounded-3xl border-none bg-white dark:bg-[#121216] shadow-xl">
                          <div className="px-6 pt-6">
                            <h2 className="text-center leading-[150%] text-gray-900 dark:text-gray-100 text-2xl font-medium">
                              {t("Orders.confirm", { defaultValue: "Confirm" })}
                            </h2>
                          </div>

                          <div className="px-6 mt-4 text-center">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {t("Orders.confirmCancel")}
                            </p>
                          </div>

                          <div className="flex justify-center gap-4 px-6 py-6">
                            <button
                              onClick={() =>
                                toCancelId && handleCancel(toCancelId)
                              }
                              aria-label={t("Orders.confirm", {
                                defaultValue: "Confirm",
                              })}
                              className="w-[140px] h-12 rounded-[8px] bg-main hover:bg-main text-white text-base font-medium cursor-pointer transition-colors"
                            >
                              {t("Orders.confirm", { defaultValue: "Confirm" })}
                            </button>
                            <button
                              onClick={() => setIsDialogOpen(false)}
                              aria-label={t("no")}
                              className="w-[140px] h-12 rounded-[8px] border border-gray-300 dark:border-gray-700 text-base font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                            >
                              {t("Orders.cancel", { defaultValue: "Cancel" })}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Payment details (show once per order, placed under actions) */}
              {/* <div className="w-full md:w-[260px] text-right mt-2">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>{t("sub_total", { defaultValue: "Subtotal" })}</span>
                    <span>{formatCurrency(order.sub_total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("shipping", { defaultValue: "Shipping" })}</span>
                    <span>{formatCurrency(order.shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("tax", { defaultValue: "Tax" })}</span>
                    <span>{formatCurrency(order.tax)}</span>
                  </div>
                  {order.discount_amount > 0 && (
                    <div className="flex justify-between">
                      <span>{t("discount", { defaultValue: "Discount" })}</span>
                      <span>{formatCurrency(order.discount_amount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold mt-2">
                    <span>{t("total", { defaultValue: "Total" })}</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default OrderDetails;
