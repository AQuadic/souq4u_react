"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface CartPageSummaryProps {
  totalItems?: number;
  subtotal?: number;
  totalProducts?: number;
  shippingCost?: number;
  taxes?: number;
  totalDiscount?: number;
  total?: number;
  appliedCoupon?: string | null;
  isCouponLoading?: boolean;
  onApplyPromocode?: (code: string) => Promise<void>;
  onClearPromocode?: () => Promise<void>;
}

export const CartPageSummary: React.FC<CartPageSummaryProps> = ({
  totalItems = 0,
  subtotal = 0,
  totalProducts = 0,
  shippingCost = 0,
  taxes = 0,
  totalDiscount = 0,
  total = 0,
  appliedCoupon,
  isCouponLoading = false,
  onApplyPromocode,
  onClearPromocode,
}) => {
  const { t } = useTranslation("Cart");
  const [promocode, setPromocode] = useState("");

  const handleApplyPromocode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (promocode.trim()) {
      try {
        await onApplyPromocode?.(promocode.trim());
        setPromocode(""); // Clear input on success
      } catch (error) {
        // Error is handled by the hook with toast notification
        console.error("Failed to apply promocode:", error);
      }
    }
  };

  return (
    <div className="bg-[#F2F2F2] p-6 rounded-lg sticky top-6 shadow-sm">
      <h2 className="text-gray-900 dark:text-white text-xl font-semibold mb-6">
        {t("Cart.summary")}
      </h2>

      {/* Promocode - mobile only: placed directly under title on small screens */}
      <div className="block md:hidden mb-6">
        <label
          htmlFor="promocode-input"
          className="block text-gray-900 dark:text-white text-sm font-semibold mb-2"
        >
          {t("Cart.addPromocode")}
        </label>

        {appliedCoupon ? (
          <div className="flex items-center justify-between bg-[var(--color-main)]/10 border border-[var(--color-main)]/20 rounded px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-[var(--color-main)] text-sm font-medium">
                {appliedCoupon}
              </span>
              <span className="text-green-600 dark:text-green-400 text-xs">
                ✓
              </span>
            </div>
            <button
              onClick={async () => {
                try {
                  await onClearPromocode?.();
                } catch (error) {
                  console.error("Failed to clear promocode:", error);
                }
              }}
              className="text-gray-700/60 dark:text-white/60 hover:text-gray-900 dark:hover:text-white text-xs px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              {t("remove")}
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyPromocode} className="flex gap-2">
            <input
              id="promocode-input"
              type="text"
              value={promocode}
              onChange={(e) => setPromocode(e.target.value)}
              placeholder={t("Cart.promocodePlaceholder")}
              className="flex-1 bg-transparent border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white px-3 py-2 rounded focus:outline-none focus:border-[var(--color-main)] transition-colors text-sm"
            />
            {promocode.trim() && (
              <button
                type="submit"
                disabled={isCouponLoading}
                className="bg-[var(--color-main)] hover:bg-main/50 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2"
              >
                {isCouponLoading && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {t("apply")}
              </button>
            )}
          </form>
        )}
      </div>

      {/* Summary Stats */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-white text-sm">
            {t("Cart.totalItem")}
          </span>
          <span className="text-gray-900 dark:text-white font-medium">
            {totalItems}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-white text-sm">
            {t("Cart.subtotal")}
          </span>
          <span className="text-gray-900 dark:text-white font-medium">
            {subtotal.toLocaleString()} {t("Common.currency")}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-white text-sm">
            {t("Cart.totalProducts")}
          </span>
          <span className="text-gray-900 dark:text-white font-medium">
            {totalProducts.toLocaleString()} {t("Common.currency")}
          </span>
        </div>

        {shippingCost > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-white text-sm">
              {t("Cart.shippingCost")}
            </span>
            <span className="text-gray-900 dark:text-white font-medium">
              {shippingCost.toLocaleString()} {t("Common.currency")}
            </span>
          </div>
        )}

        {taxes > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-white text-sm">
              {t("Cart.taxes")}
            </span>
            <span className="text-gray-900 dark:text-white font-medium">
              {taxes.toLocaleString()} {t("Common.currency")}
            </span>
          </div>
        )}

        {totalDiscount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-white text-sm">
              {t("Cart.discount")}
            </span>
            <span className="text-green-600 dark:text-green-400 font-medium">
              -{totalDiscount.toLocaleString()} {t("Common.currency")}
            </span>
          </div>
        )}
      </div>

      {/* Promocode Section (desktop: visible md+; hidden on mobile because we show mobile-only block above) */}
      <div className="hidden md:block mb-6">
        <label
          htmlFor="promocode-input"
          className="block text-gray-900 dark:text-white text-sm font-medium mb-2"
        >
          {t("Cart.addPromocode")}
        </label>

        {appliedCoupon ? (
          // Chip design for applied coupon
          <div className="flex items-center justify-between bg-[var(--color-main)]/10 border border-[var(--color-main)]/20 rounded px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-[var(--color-main)] text-sm font-medium">
                {appliedCoupon}
              </span>
              <span className="text-green-600 dark:text-green-400 text-xs">
                ✓
              </span>
            </div>
            <button
              onClick={async () => {
                try {
                  await onClearPromocode?.();
                } catch (error) {
                  console.error("Failed to clear promocode:", error);
                }
              }}
              className="text-gray-700/60 dark:text-white/60 hover:text-gray-900 dark:hover:text-white text-xs px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              {t("Cart.remove")}
            </button>
          </div>
        ) : (
          // Input with apply button
          <form onSubmit={handleApplyPromocode} className="flex gap-2">
            <input
              id="promocode-input"
              type="text"
              value={promocode}
              onChange={(e) => setPromocode(e.target.value)}
              placeholder={t("Cart.promocodePlaceholder")}
              className="flex-1 bg-transparent border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white px-3 py-2 rounded focus:outline-none focus:border-[var(--color-main)] transition-colors text-sm"
            />
            {promocode.trim() && (
              <button
                type="submit"
                disabled={isCouponLoading}
                className="bg-[var(--color-main)] hover:bg-main/50 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2"
              >
                {isCouponLoading && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {t("Cart.apply")}
              </button>
            )}
          </form>
        )}
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 dark:border-white/20 pt-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-900 dark:text-white text-lg font-semibold">
            {t("Cart.total")}:
          </span>
          <div className="text-right">
            <span className="text-gray-900 dark:text-white text-xl font-bold">
              {total.toLocaleString()}{" "}
              <span className="text-sm font-normal">
                {t("Common.currency")}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <Link
        to="/checkout"
        className="block w-full bg-[var(--color-main)] hover:bg-main/50 text-white font-semibold py-3 px-4 rounded transition-colors duration-200 uppercase tracking-wide text-center"
      >
        {t("Cart.checkout")}
      </Link>
    </div>
  );
};
