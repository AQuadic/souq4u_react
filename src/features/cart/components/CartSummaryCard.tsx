"use client";

import React from "react";
import { useTranslatedText } from "@/shared/utils/translationUtils";
import type { MultilingualText } from "@/shared/utils/translationUtils";
import { Minus, Plus, X } from "lucide-react";
import type { CartItem as CartItemType } from "@/features/cart/types";
// import { useTranslation } from "react-i18next";

export interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity?: (id: number, quantity: number) => void;
  onRemove?: (id: number) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  // const t = useTranslation("Common");
  // const tCart = useTranslation("Cart");
  const name = useTranslatedText(item.name, "");
  // derive size attribute value (could be multilingual object)
  const sizeAttr = item.variant.attributes.find((a) => {
    const nameField = a.attribute?.name;
    if (!nameField) return false;
    // nameField might be an object like { en: 'Size' } or a string; normalize to string
    const enName =
      typeof nameField === "object"
        ? nameField.en || ""
        : String(nameField || "");
    return enName.toLowerCase().includes("size");
  });
  const sizeVal = sizeAttr?.value?.value as unknown as
    | MultilingualText
    | string
    | undefined;
  const sizeText = useTranslatedText(sizeVal, "");
  const handleQuantityDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity?.(item.id, item.quantity - 1);
    }
  };

  const handleQuantityIncrease = () => {
    onUpdateQuantity?.(item.id, item.quantity + 1);
  };

  const handleRemove = () => {
    onRemove?.(item.id);
  };

  return (
    <div className="flex gap-3 p-3 bg-white dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
      {/* Product Image */}
      <div className="relative w-16 h-16 flex-shrink-0">
        <img
          src={item.image?.url || "/placeholder-product.jpg"}
          alt={name}
          // fill
          className="object-cover rounded w-16 h-16"
          sizes="64px"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-gray-900 dark:text-white text-sm font-medium truncate pr-2">
            {name}
          </h3>
          <button
            onClick={handleRemove}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Size */}
        <div className="mb-2">
          <span className="text-gray-600 dark:text-gray-400 text-xs">
            {('size')} {sizeText || "N/A"}
          </span>
        </div>

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-main)] font-semibold">
              {item.variant.final_price.toLocaleString()} {("currency")}
            </span>
            {item.variant.has_discount && item.variant.discount_percentage > 0 && (
              <span className="text-gray-500 dark:text-gray-400 line-through text-sm">
                {item.variant.price.toLocaleString()} {("currency")}
              </span>
            )}
          </div>
          {item.variant.has_discount && item.variant.discount_percentage > 0 && (
            <div className="text-green-600 dark:text-green-400 text-xs">
              {/* {tCart("saveOffer", {
                amount: (
                  item.variant.price - item.variant.final_price
                ).toLocaleString(),
                currency: t("currency"),
                percent: item.variant.discount_percentage.toFixed(0),
              })} */}
            </div>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleQuantityDecrease}
            disabled={item.quantity <= 1}
            className="w-6 h-6 rounded-full border border-gray-300 dark:border-white/20 flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus size={12} />
          </button>

          <span className="text-gray-900 dark:text-white text-sm min-w-[20px] text-center">
            {item.quantity}
          </span>

          <button
            onClick={handleQuantityIncrease}
            className="w-6 h-6 rounded-full border border-gray-300 dark:border-white/20 flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Removed obsolete export
