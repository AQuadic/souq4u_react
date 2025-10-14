import { useCartStore } from "@/features/cart/stores";
import { getTranslatedText } from "@/shared/utils/translationUtils";
import type { MultilingualText } from "@/shared/utils/translationUtils";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export interface CheckoutSummaryData {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  totalItems: number;
  subtotal: number;
  totalProducts: number;
  taxes: number;
  discount: number;
  discountPercentage: number;
  total: number;
  shipping?: number;
}

export const useCheckoutCartSummary = () => {
  const { cart, isLoading, error } = useCartStore();
  const { i18n } = useTranslation();

  // Get language from i18next
  const locale = i18n.language || "en";

  const summaryData: CheckoutSummaryData = useMemo(() => {
    if (!cart?.items) {
      return {
        items: [],
        totalItems: 0,
        subtotal: 0,
        totalProducts: 0,
        taxes: 0,
        discount: 0,
        discountPercentage: 0,
        total: 0,
        shipping: 0,
      };
    }

    const items = cart.items.map((item) => ({
      id: item.id.toString(),
      name: getTranslatedText(
        item.name as MultilingualText,
        locale,
        typeof item.name === "string" ? item.name : ""
      ),
      price: item.variant.final_price,
      quantity: item.quantity,
    }));

    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    const calculations = cart.calculations || {
      subtotal: 0,
      tax: 0,
      delivery_fees: 0,
      total: 0,
      discount: 0,
    };

    const subtotal = calculations.subtotal;
    const taxes = calculations.tax;
    const discount = calculations.discount;
    const total = calculations.total;

    const totalProducts = subtotal;
    const discountPercentage =
      subtotal > 0 ? Math.round((discount / subtotal) * 100) : 0;

    return {
      items,
      totalItems,
      subtotal,
      totalProducts,
      taxes,
      discount,
      discountPercentage,
      total,
      shipping: calculations.delivery_fees,
    };
  }, [cart, locale]);

  return {
    summaryData,
    isLoading,
    error,
    hasCart: !!cart,
  };
};
