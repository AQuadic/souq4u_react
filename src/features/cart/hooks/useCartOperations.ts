"use client";

import { useCartStore } from "@/features/cart/stores";
import { getTranslatedText } from "@/shared/utils/translationUtils";
import type { MultilingualText } from "@/shared/utils/translationUtils";
import { useCartToast } from "./useCartToast";
import { useTranslation } from "react-i18next";

export const useCartOperations = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const {
    cart,
    appliedCoupon,
    isCouponLoading,
    updateItemQuantity: updateQuantityStore,
    removeItem: removeItemStore,
    applyCoupon: applyCouponStore,
    clearCoupon: clearCouponStore,
    ...store
  } = useCartStore();

  const {
    showQuantityUpdateSuccess,
    showQuantityUpdateError,
    showItemRemoveSuccess,
    showItemRemoveError,
    showCouponApplySuccess,
    showCouponApplyError,
    showCouponClearSuccess,
    showCouponClearError,
  } = useCartToast();

  const updateItemQuantity = async (itemId: number, quantity: number) => {
    const item = cart?.items.find((item) => item.id === itemId);
    if (!item) return;

    const itemName = getTranslatedText(
      item.name as MultilingualText,
      locale || "en",
      String(item.name || "")
    );

    try {
      await updateQuantityStore(itemId, quantity);
      showQuantityUpdateSuccess({ productName: itemName, quantity });
    } catch (_error) {
      showQuantityUpdateError(itemName);
      throw _error;
    }
  };

  const removeItem = async (itemId: number) => {
    const item = cart?.items.find((item) => item.id === itemId);
    if (!item) return;

    const itemName = getTranslatedText(
      item.name as MultilingualText,
      locale || "en",
      String(item.name || "")
    );

    try {
      await removeItemStore(itemId);
      showItemRemoveSuccess(itemName);
    } catch (_error) {
      showItemRemoveError(itemName);
      throw _error;
    }
  };

  const applyCoupon = async (couponCode: string) => {
    try {
      await applyCouponStore(couponCode);
      showCouponApplySuccess();
    } catch (error) {
      showCouponApplyError();
      throw error;
    }
  };

  const clearCoupon = async () => {
    try {
      await clearCouponStore();
      showCouponClearSuccess();
    } catch (error) {
      showCouponClearError();
      throw error;
    }
  };

  return {
    ...store,
    cart,
    appliedCoupon,
    isCouponLoading,
    updateItemQuantity,
    removeItem,
    applyCoupon,
    clearCoupon,
  };
};
