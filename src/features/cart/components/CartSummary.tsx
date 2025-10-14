"use client";

import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface CartSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
  onClose: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  tax,
  total,
  onClose,
}) => {
  const { t } = useTranslation();
  const handleCheckout = () => {
    onClose();
  };
  const handleViewCart = () => {
    onClose();
  };
  return (
    <div className="border-t border-white/10 p-4 space-y-4">
      {/* Breakdown */}
      <div className="space-y-2">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className=" text-sm">{t("Cart.subtotal")}</span>
          <span className=" text-sm">
            {subtotal.toLocaleString()} {t("Common.currency")}
          </span>
        </div>
        {/* Tax */}
        {tax > 0 && (
          <div className="flex items-center justify-between">
            <span className=" text-sm">{t("Cart.tax")}</span>
            <span className=" text-sm">
              {tax.toLocaleString()} {t("Common.currency")}
            </span>
          </div>
        )}
        {/* Total */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <span className=" text-lg font-semibold uppercase tracking-wider">
            {t("Cart.total")}
          </span>
          <span className=" text-lg font-bold">
            {total.toLocaleString()}{" "}
            <span className="text-sm font-normal">{t("Common.currency")}</span>
          </span>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Checkout Link */}
        <Link
          to="/checkout"
          onClick={handleCheckout}
          className="block w-full text-white bg-[var(--color-main)] hover:bg-main/50  font-semibold py-3 px-4 rounded transition-colors duration-200 uppercase tracking-wide text-center"
        >
          {t("Cart.checkout")}
        </Link>
        {/* View Cart Link */}
        <Link
          to="/cart"
          onClick={handleViewCart}
          className="block w-full border border-[var(--color-main)] text-[var(--color-main)] hover:bg-main/50 hover: font-semibold py-3 px-4 rounded transition-all duration-200 uppercase tracking-wide text-center"
        >
          {t("Cart.viewCart")}
        </Link>
      </div>
    </div>
  );
};
