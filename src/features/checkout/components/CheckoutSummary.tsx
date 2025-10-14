"use client";

import React, { useState } from "react";
import { useCheckoutCartSummary } from "../hooks";
import type { CartResponse } from "@/features/cart/api";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CheckoutSummaryProps {
  onCheckout?: () => void;
  loading?: boolean;
  cartWithShipping?: CartResponse;
  appliedCoupon?: string | null;
  onApplyPromocode?: (code: string) => Promise<void>;
  onClearPromocode?: () => Promise<void>;
  isCouponLoading?: boolean;
}

export const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  onCheckout,
  loading = false,
  cartWithShipping,
  appliedCoupon,
  onApplyPromocode,
  onClearPromocode,
  isCouponLoading = false,
}) => {
  const { t } = useTranslation("Checkout");
  const { t: p } = useTranslation("Cart");
  const { t: common } = useTranslation("Common");
  const { summaryData } = useCheckoutCartSummary();
  const [promocode, setPromocode] = useState("");

  // Use shipping cart data if available, otherwise use default cart data
  const displayData = cartWithShipping?.data
    ? {
        totalItems: cartWithShipping.data.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        ),
        subtotal: cartWithShipping.data.calculations.subtotal,
        totalProducts: cartWithShipping.data.calculations.subtotal,
        taxes: cartWithShipping.data.calculations.tax,
        discount: cartWithShipping.data.calculations.discount,
        total: cartWithShipping.data.calculations.total,
        shipping: cartWithShipping.data.calculations.delivery_fees,
      }
    : summaryData;

  const {
    totalItems,
    subtotal,
    totalProducts,
    taxes,
    discount,
    total,
    shipping,
  } = displayData;

  const handleCheckout = () => {
    onCheckout?.();
  };

  if (totalItems == 0) {
    return <div></div>;
  }

  const handleApplyPromocode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (promocode.trim()) {
      try {
        await onApplyPromocode?.(promocode.trim());
        setPromocode("");
      } catch (error) {
        console.error("Failed to apply promocode:", error);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-[var(--color-cart-bg)] text-slate-900 dark:text-slate-100 p-6 rounded-lg sticky top-6">
      <h2 className="text-slate-900 dark:text-white text-xl font-semibold mb-6">
        {t("summary")}
      </h2>
      {/* Promocode - mobile only: placed directly under title on small screens */}
      <div className="block md:hidden mb-6">
        <label
          htmlFor="promocode-input"
          className="block text-gray-900 dark:text-white text-sm font-semibold mb-2"
        >
          {p("addPromocode")}
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
              {p("remove")}
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyPromocode} className="flex gap-2">
            <input
              id="promocode-input"
              type="text"
              value={promocode}
              onChange={(e) => setPromocode(e.target.value)}
              placeholder={p("promocodePlaceholder")}
              className="flex-1 bg-transparent border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white px-3 py-2 rounded focus:outline-none focus-visible:outline-none focus:ring-0 focus:border-[var(--color-main)] transition-colors text-sm"
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
                {p("apply")}
              </button>
            )}
          </form>
        )}
      </div>

      <div className="w-full h-px bg-slate-200 dark:bg-[#C0C0C0] my-6"></div>
      {/* Summary Stats */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600 dark:text-slate-200">
            {t("totalItem")}
          </span>
          <span className="font-medium text-slate-900 dark:text-white">
            {totalItems}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600 dark:text-slate-200">
            {t("subtotal")}
          </span>
          <span className="font-medium text-slate-900 dark:text-white">
            {subtotal.toLocaleString()} {common("currency")}
          </span>
        </div>

        <div className="w-full h-px bg-[#C0C0C0] my-6"></div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600 dark:text-slate-200">
            {t("totalProducts")}
          </span>
          <span className="font-medium text-slate-900 dark:text-white">
            {totalProducts.toLocaleString()} {common("currency")}
          </span>
        </div>

        {taxes > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600 dark:text-slate-200">
              {t("taxes")}
            </span>
            <span className="font-medium text-slate-900 dark:text-white">
              {taxes.toLocaleString()} {common("currency")}
            </span>
          </div>
        )}

        {discount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600 dark:text-slate-200">
              {t("discount")}
            </span>
            <span className="font-medium text-green-600 dark:text-green-400">
              -{discount.toLocaleString()} {common("currency")}
            </span>
          </div>
        )}

        {shipping !== undefined && shipping > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600 dark:text-slate-200">
              {t('shipping')}
            </span>
            <span className="font-medium text-slate-900 dark:text-white">
              {shipping.toLocaleString()} {common("currency")}
            </span>
          </div>
        )}
      </div>

      {/* Promocode Section (desktop: visible md+; hidden on mobile because we show mobile-only block above) */}
      <div className="hidden md:block mb-6">
        <label
          htmlFor="promocode-input"
          className="block text-white text-sm font-medium mb-2"
        >
          {p("addPromocode")}
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
              {p("remove")}
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyPromocode} className="flex gap-2">
            <input
              id="promocode-input"
              type="text"
              value={promocode}
              onChange={(e) => setPromocode(e.target.value)}
              placeholder={p("promocodePlaceholder")}
              className="flex-1 bg-transparent border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white px-3 py-2 rounded focus:outline-none focus-visible:outline-none focus:ring-0 focus:border-[var(--color-main)] transition-colors text-sm"
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
                {p("apply")}
              </button>
            )}
          </form>
        )}
      </div>

      {/* Total */}
      <div className="mb-6">
        <div className="w-full h-px bg-slate-200 dark:bg-[#C0C0C0] my-6"></div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-slate-900 dark:text-white">
            {t("total")}
          </span>
          <div className="text-right">
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {total.toLocaleString()}{" "}
              <span className="text-sm font-normal text-slate-700 dark:text-slate-200">
                {common("currency")}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-[var(--color-main)] hover:bg-main/50 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded transition-colors duration-200 uppercase tracking-wide cursor-pointer"
      >
        {loading ? t("processing") : t("checkout")}
      </button>
    </div>
  );
};
