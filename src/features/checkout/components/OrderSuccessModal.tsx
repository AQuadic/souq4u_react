import React from "react";
import { useNavigate } from "react-router-dom";
import { type CheckoutResponse } from "../api/postAddress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { useTranslation } from "react-i18next";

interface OrderSuccessModalProps {
  isOpen: boolean;
  orderData: CheckoutResponse | null;
  couponCode?: string | null;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  orderData,
  couponCode,
}) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("Common");
  const locale = i18n.language || "en";

  const handleGoHome = () => {
    // Redirect to home without closing modal (modal will unmount when component unmounts)
    navigate("/");
  };

  if (!orderData) return null;

  const { order } = orderData;

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="dark:bg-[var(--color-cart-bg)] border-[#C0C0C0] max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="dark:text-white text-xl font-semibold text-center">
            🎉 {t("Common.orderCreated")}
          </DialogTitle>
          <DialogDescription className="text-center dark:text-[#C0C0C0]">
            {t("Common.orderPlaced")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Order Info */}
          <div className="dark:bg-[#1a1a1a] p-4 rounded-lg">
            <h3 className="dark:text-white font-semibold mb-3">
              {t("Common.orderDetails")}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="dark:text-[#C0C0C0]">{t("Common.orderCode")}</span>
                <span className="dark:text-white font-medium">
                  #{order.code}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="dark:text-[#C0C0C0]">{t("Common.status")}</span>
                <span className="text-yellow-400 capitalize font-medium">
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="dark:text-[#C0C0C0]">{t("Common.customer")}</span>
                <span className="dark:text-white">{order.user_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="dark:text-[#C0C0C0]">{t("Common.phone")}</span>
                <span className="dark:text-white" dir="ltr">
                  {order.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="dark:bg-[#1a1a1a] p-4 rounded-lg">
            <h3 className="dark:text-white font-semibold mb-3">
              {t("Common.itemsOrdered")}
            </h3>
            <div className="space-y-3">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="dark:text-white text-sm">
                      {item.product_name[locale as "en" | "ar"] ||
                        item.product_name.en}
                    </p>
                    <p className="dark:text-[#C0C0C0] text-xs">
                      {t("Common.Qty")} {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="dark:text-white font-medium">
                      {item.final_price.toLocaleString()} {t("Common.currency")}
                    </p>
                    {item.discount_amount > 0 && (
                      <p className="text-green-400 text-xs">
                        -{item.discount_amount.toLocaleString()} {t("Common.currency")}{" "}
                        {t("Common.saved")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="dark:bg-[#1a1a1a] p-4 rounded-lg">
            <h3 className="dark:text-white font-semibold mb-3">
              {t("Common.orderSummary")}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="dark:text-[#C0C0C0]">{t("Common.subtotal")}</span>
                <span className="dark:text-white">
                  {order.sub_total.toLocaleString()} {t("Common.currency")}
                </span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between">
                  <span className="dark:text-[#C0C0C0]">{t("Common.discount")}</span>
                  <span className="text-green-400">
                    -{order.discount_amount.toLocaleString()} {t("Common.currency")}
                  </span>
                </div>
              )}
              {couponCode && (
                <div className="flex justify-between">
                  <span className="dark:text-[#C0C0C0]">{t("Common.couponCode")}</span>
                  <span className="dark:text-white">{couponCode}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="dark:text-[#C0C0C0]">{t("Common.tax")}</span>
                <span className="dark:text-white">
                  {order.tax.toLocaleString()} {t("Common.currency")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="dark:text-[#C0C0C0]">{t("Common.shipping")}</span>
                <span className="dark:text-white">
                  {order.shipping.toLocaleString()} {t("Common.currency")}
                </span>
              </div>
              <div className="w-full h-px bg-[#C0C0C0] my-2"></div>
              <div className="flex justify-between">
                <span className="font-semibold">{t("Common.total")}</span>
                <span className="font-bold text-lg">
                  {order.total.toLocaleString()} {t("Common.currency")}
                </span>
              </div>
            </div>
          </div>

          {/* Success Message
          <div className="text-center dark:text-[#C0C0C0] text-sm">
            <p>{t("thankyou")}</p>
          </div> */}
        </div>

        <DialogFooter className="gap-3">
          <button
            onClick={handleGoHome}
            className="w-full bg-[var(--color-main)] hover:bg-main/50 text-white font-semibold py-3 px-4 rounded transition-colors duration-200 uppercase tracking-wide cursor-pointer"
          >
            {t("Common.goHome")}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
