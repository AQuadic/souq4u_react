"use client";

import React from "react";
import { useToast } from "@/shared/components/ui/toast";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
    const productLabel = `${productName}${variantText}${
      quantity > 1 ? ` (${quantity}x)` : ""
    }`;

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

  const addedToCart = (
    productName: string,
    opts?: { quantity?: number; variant?: string }
  ) => {
    showAddToCartSuccess({
      productName,
      quantity: opts?.quantity ?? 1,
      variant: opts?.variant,
    });
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
    const message = t("failedRemoveFromCart", { productName });
    toast.error(message, { duration: 5000 });
  };

  const showCouponApplySuccess = () => {
    toast.success(t("couponAppliedSuccess"), { duration: 3000 });
  };

  const showCouponApplyError = () => {
    toast.error(t("couponApplyError"), { duration: 5000 });
  };

  const showCouponClearSuccess = () => {
    toast.success(t("couponRemovedSuccess"), { duration: 3000 });
  };

  const showCouponClearError = () => {
    toast.error(t("couponRemoveError"), { duration: 5000 });
  };

  const loginRequired = () => {
    const message =
      t("Cart.loginRequired") ||
      t("Cart.loginRequiredForCart") ||
      "Please login to continue.";
    toast.error(message, { duration: 5000 });
  };

  const failedToAddToCart = (message?: string) => {
    toast.error(message || t("failedToAdd") || "Failed to add item to cart", {
      duration: 5000,
    });
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
