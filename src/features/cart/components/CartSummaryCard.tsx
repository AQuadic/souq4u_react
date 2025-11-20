"use client";

import React from "react";
import {
  getTranslatedText,
  useTranslatedText,
} from "@/shared/utils/translationUtils";
import { Minus, Plus, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { CartItem as CartItemType } from "@/features/cart/types";
// ...existing code...

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
  const { t, i18n } = useTranslation();
  const name = useTranslatedText(item.name, "");

  const translatedAttributes =
    item.variant?.attributes?.map((attr) => {
      const attrName = getTranslatedText(attr.attribute?.name, i18n.language);
      const attrValue = getTranslatedText(attr.value?.value, i18n.language);
      return {
        id: attr.id,
        name: attrName,
        value: attrValue,
      };
    }) || [];
  const handleQuantityDecrease = () => {
    if (item.quantity > 1) {
      const res = onUpdateQuantity?.(item.id, item.quantity - 1);
      if (res && typeof res.then === "function") {
        res.catch(() => undefined);
      }
    }
  };

  const handleQuantityIncrease = () => {
    const res = onUpdateQuantity?.(item.id, item.quantity + 1);
    if (res && typeof res.then === "function") {
      res.catch(() => undefined);
    }
  };

  const handleRemove = () => {
    const res = onRemove?.(item.id);
    if (res && typeof res.then === "function") {
      res.catch(() => undefined);
    }
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
        <div className="flex flex-wrap gap-1 mb-2">
          {translatedAttributes.map((attr) => {
            const isColorAttr =
              /(color|colour)/i.test(attr.name) ||
              /^#([0-9A-F]{3}){1,2}$/i.test(attr.value);

            return (
              <div
                key={attr.id}
                className="flex items-center gap-1 text-xs bg-main/10 text-[var(--color-main)] px-2 py-1 rounded-full"
              >
                {isColorAttr && (
                  <span
                    className="inline-block w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: attr.value }}
                  />
                )}
                <span>
                  {attr.name}: {attr.value}
                </span>
              </div>
            );
          })}
        </div>

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-main)] font-semibold">
              {item.variant.final_price.toLocaleString()} {t("Common.currency")}
            </span>
            {item.variant.has_discount &&
              item.variant.discount_percentage > 0 && (
                <span className="text-gray-500 dark:text-gray-400 line-through text-sm">
                  {item.variant.price.toLocaleString()} {t("Common.currency")}
                </span>
              )}
          </div>
          {item.variant.has_discount &&
            item.variant.discount_percentage > 0 && (
              <div className="text-green-600 dark:text-green-400 text-xs">
                {/* Discount info handled elsewhere or via toast */}
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
