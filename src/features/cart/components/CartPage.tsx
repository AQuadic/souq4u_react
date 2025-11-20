"use client";

import React from "react";
import { Breadcrumbs } from "@/shared/components/BreadCrumbs/BreadCrumbs";
import { getTranslatedText } from "@/shared/utils/translationUtils";
import type { MultilingualText } from "@/shared/utils/translationUtils";
import { CartCard, type CartCardData } from "./CartCard";
import { CartPageSummary } from "./CartPageSummary";
import { YouMayBeInterestedIn } from "./YouMayBeInterestedIn";
import { useCartOperations } from "@/features/cart/hooks";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BackArrow from "@/features/products/icons/BackArrow";

export const CartPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const {
    cart,
    isLoading,
    appliedCoupon,
    isCouponLoading,
    removeItem,
    updateItemQuantity,
    applyCoupon,
    clearCoupon,
  } = useCartOperations();

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    return updateItemQuantity(Number.parseInt(itemId), quantity);
  };

  const handleRemoveItem = (itemId: string) => {
    const item = cart?.items?.find((i) => i.id.toString() === itemId);
    if (item) {
      return removeItem(item.id);
    }
  };

  const handleApplyPromocode = async (code: string) => {
    try {
      await applyCoupon(code);
    } catch (error) {
      console.error("Failed to apply promocode:", error);
    }
  };

  const handleClearPromocode = async () => {
    try {
      await clearCoupon();
    } catch (error) {
      console.error("Failed to clear promocode:", error);
    }
  };

  // Convert cart items to CartCardData format
  const cartItems: CartCardData[] =
    cart?.items?.map((item) => ({
      id: item.id.toString(),
      name: getTranslatedText(
        item.name as MultilingualText,
        locale || "en",
        ""
      ),
      price: item.variant.final_price,
      quantity: item.quantity,
      image: item.image?.url || "/placeholder-product.svg",
      stock: item.variant.stock,
      is_stock: item.variant.is_stock,
      attributes: item.variant.attributes,
      // pass the whole multilingual value object (or string) so child can translate based on locale
      size: (() => {
        const attr = item.variant.attributes.find((a) => {
          const nameField = a.attribute?.name;
          if (!nameField) return false;
          const enName =
            typeof nameField === "object"
              ? nameField.en || ""
              : String(nameField || "");
          return enName.toLowerCase().includes("size");
        });
        return attr?.value?.value;
      })(),
    })) || [];

  // Get calculations from API response - they come from the root level
  const calculations = cart?.calculations || {
    subtotal: 0,
    tax: 0,
    delivery_fees: 0,
    total: 0,
    discount: 0,
    total_discount: 0,
    product_discount: 0,
    addons: 0,
  };

  const totalItems =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  const subtotal = calculations.subtotal;
  const taxes = calculations.tax;
  const shippingCost = calculations.delivery_fees;
  const productDiscount = calculations.product_discount;
  const couponDiscount = calculations.discount;
  const totalDiscount = calculations.total_discount;
  const total = calculations.total;

  return (
    <div className="min-h-screen   py-4">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8 md:block hidden">
          <Breadcrumbs
            items={[
              { label: t("Cart.breadcrumbHome"), href: "/" },
              { label: t("Cart.breadcrumbCart") },
            ]}
          />
        </div>

        <Link to="/" className="md:hidden flex items-center gap-2 mb-6">
          <div className="transform ltr:scale-x-100 rtl:scale-x-[-1]">
            <BackArrow />
          </div>
          <h2 className="text-xl font-semibold text-black">
            {t("Navigation.cart")}
          </h2>
        </Link>

        {/* Main Content */}
        <h1 className="text-gray-900 dark:text-white text-2xl font-bold mb-8 md:block hidden">
          {t("Cart.title")}
        </h1>

        {(() => {
          if (isLoading) {
            return (
              <div className="text-center py-12">
                <div className="text-gray-700/60 dark:text-white/60 text-lg">
                  {t("Common.loading")}
                </div>
              </div>
            );
          }

          if (cartItems.length === 0) {
            return (
              <div className="text-center flex flex-col items-center py-12">
                <img
                  src="/images/cart/cartEmpty.png"
                  alt="cart empty"
                  width={330}
                  height={318}
                  className="mb-12"
                />
                <div className="text-gray-900 dark:text-white text-2xl font-semibold font-poppins mb-4">
                  {t("Cart.emptyCart")}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg font-medium leading-[150%] mb-8">
                  {t("Cart.cartEmptyDesc")}
                </p>
                <Link
                  to="/products"
                  className="bg-[var(--color-main)] hover:bg-main/50 text-white px-6 py-3 rounded transition-colors"
                >
                  {t("Cart.continueShopping")}
                </Link>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <CartCard
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>

              {/* Right Column - Summary */}
              <div className="lg:col-span-1">
                <CartPageSummary
                  totalItems={totalItems}
                  subtotal={subtotal}
                  totalProducts={subtotal}
                  shippingCost={shippingCost}
                  taxes={taxes}
                  productDiscount={productDiscount}
                  couponDiscount={couponDiscount}
                  totalDiscount={totalDiscount}
                  total={total}
                  appliedCoupon={appliedCoupon}
                  isCouponLoading={isCouponLoading}
                  onApplyPromocode={handleApplyPromocode}
                  onClearPromocode={handleClearPromocode}
                />
              </div>
            </div>
          );
        })()}

        {/* You may be interested in */}
        <YouMayBeInterestedIn />
      </div>
    </div>
  );
};
