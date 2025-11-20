"use client";

import React from "react";
import { useToast } from "@/shared/components/ui/toast";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { handleApiError } from "@/shared/utils/errorHandler";

interface CartToastOptions {
  productName: string;
  quantity?: number;
  variant?: string;
}

export const useCartToast = () => {
  const toast = useToast();
  const { t } = useTranslation("Cart");

  const showAddToCartSuccess = ({
    productName,
    quantity = 1,
    variant,
  }: CartToastOptions) => {
    const variantText = variant ? ` (${variant})` : "";
    const productLabel = `${productName}${variantText}`;

    const message = t("Cart.addToCartSentence", { product: productLabel });

    toast.success(message, {
      action: (
        <Link
          to="/cart"
          className="text-white underline text-sm font-medium hover:no-underline"
          onClick={() => {
            // Navigate to cart or show cart slider
            console.log("View cart clicked");
          }}
        >
          {t("Cart.viewCart")}
        </Link>
      ),
      duration: 5000,
    });
  };

  const showUpdateCartSuccess = ({
    productName,
    quantity = 1,
    variant,
  }: CartToastOptions) => {
    const variantText = variant ? ` (${variant})` : "";
    const productLabel = `${productName}${variantText}`;
    const quantityText = quantity > 1 ? `${quantity}x` : `${quantity}`;

    const message = t("Cart.updateCartSentence", {
      product: productLabel,
      quantity: quantityText,
    });

    toast.success(message, {
      action: (
        <Link
          to="/cart"
          className="text-white underline text-sm font-medium hover:no-underline"
          onClick={() => {
            console.log("View cart clicked");
          }}
        >
          {t("Cart.viewCart")}
        </Link>
      ),
      duration: 5000,
    });
  };

  const addedToCart = (
    productName: string,
    opts?: { quantity?: number; variant?: string; isUpdate?: boolean }
  ) => {
    if (opts?.isUpdate) {
      showUpdateCartSuccess({
        productName,
        quantity: opts?.quantity ?? 1,
        variant: opts?.variant,
      });
    } else {
      showAddToCartSuccess({
        productName,
        quantity: opts?.quantity ?? 1,
        variant: opts?.variant,
      });
    }
  };

  const showAddToCartError = (message?: string | Error) => {
    let errorMessage = t("failedToAdd");

    if (typeof message === "string") {
      errorMessage = message;
    } else if (message && typeof message === "object" && "message" in message) {
      errorMessage = (message as { message: string }).message;
    }

    toast.error(errorMessage, { duration: 5000 });
  };

  const showCartError = (message: string) => {
    toast.error(message, { duration: 5000 });
  };

  const showQuantityUpdateSuccess = ({
    productName,
    quantity,
  }: {
    productName: string;
    quantity: number;
  }) => {
    const message = t("Cart.updatedQuantity", {
      productName,
      quantity,
    });

    toast.success(message, { duration: 3000 });
  };

  const showQuantityUpdateError = (productName: string) => {
    const message = t("Cart.failedUpdateQuantity", { productName });
    toast.error(message, { duration: 5000 });
  };

  const showItemRemoveSuccess = (productName: string) => {
    const message = t("Cart.removedFromCart", { productName });
    toast.success(message, { duration: 3000 });
  };

  const showItemRemoveError = (productName: string) => {
    const message = t("Cart.failedRemoveFromCart", { productName });
    toast.error(message, { duration: 5000 });
  };

  const showCouponApplySuccess = () => {
    toast.success(t("Cart.couponAppliedSuccess"), { duration: 3000 });
  };

  const showCouponApplyError = (error?: unknown) => {
    if (error) {
      // If error is provided, use handleApiError to show backend error message
      handleApiError(error);
    } else {
      // Fallback to generic message
      toast.error(t("Cart.couponApplyError"), { duration: 5000 });
    }
  };

  const showCouponClearSuccess = () => {
    toast.success(t("Cart.couponRemovedSuccess"), { duration: 3000 });
  };

  const showCouponClearError = (error?: unknown) => {
    if (error) {
      // If error is provided, use handleApiError to show backend error message
      handleApiError(error);
    } else {
      // Fallback to generic message
      toast.error(t("Cart.couponRemoveError"), { duration: 5000 });
    }
  };

  const loginRequired = () => {
    const message =
      t("Cart.loginRequired") ||
      t("Cart.loginRequiredForCart") ||
      "Please login to continue.";
    toast.error(message, { duration: 5000 });
  };

  const failedToAddToCart = (message?: string) => {
    toast.error(
      message || t("Cart.failedToAdd") || "Failed to add item to cart",
      {
        duration: 5000,
      }
    );
  };

  return {
    showAddToCartSuccess,
    showAddToCartError,
    showCartError,
    showQuantityUpdateSuccess,
    showQuantityUpdateError,
    showItemRemoveSuccess,
    showItemRemoveError,
    showCouponApplySuccess,
    showCouponApplyError,
    showCouponClearSuccess,
    showCouponClearError,
    loginRequired,
    failedToAddToCart,
    addedToCart,
  };
};
