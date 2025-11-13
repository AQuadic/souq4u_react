"use client";

import React from "react";
import { getTranslatedText, useTranslatedText } from "@/shared/utils/translationUtils";
import type { MultilingualText } from "@/shared/utils/translationUtils";
import { Minus, Plus } from "lucide-react";
import { useCartToast } from "@/features/cart/hooks/useCartToast";
import { useTranslation } from "react-i18next";

interface CartCardData {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  // allow size to be either a simple string or multilingual object from the API
  size?: MultilingualText | string;
  // variant stock info (added to enforce limits in UI)
  stock?: number;
  is_stock?: boolean;
  // pass through attributes array from API so card can render all attributes (size, color, etc.)
  attributes?: Array<{
    id: number;
    attribute: { id: number; name: MultilingualText | string; type: string };
    value: {
      id: number;
      value: MultilingualText | string;
      special_value?: string | null;
    };
  }>;
}

interface CartCardProps {
  item: CartCardData;
  onUpdateQuantity?: (id: string, quantity: number) => void | Promise<void>;
  onRemove?: (id: string) => void | Promise<void>;
}

export const CartCard: React.FC<CartCardProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const {t} = useTranslation();
  const common = useTranslation("Common");
  const {
    showQuantityUpdateSuccess,
    showQuantityUpdateError,
    showItemRemoveSuccess,
    showItemRemoveError,
  } = useCartToast();
  const name = useTranslatedText(item.name, "");
  const sizeText = useTranslatedText(
    item.size as MultilingualText | string | null | undefined,
    ""
  );
  // size (if present) is now rendered through attributes list
  // Precompute translated labels/values for attributes and the locale
  const locale =
    typeof document !== "undefined"
      ? document.documentElement.lang ||
        (navigator.language || "en").split("-")[0]
      : "en";

  const translatedAttributes = (item.attributes || []).map((attr) => {
    const label = getTranslatedText(attr.attribute?.name || "", locale, "");
    const value = getTranslatedText(attr.value?.value || "", locale, "");
    const type = (attr.attribute?.type || "").toLowerCase();
    const hex = attr.value?.special_value || null;
    return { id: attr.id, label, value, type, hex };
  });
  

  const renderAttributes = () => {
    if (!translatedAttributes || translatedAttributes.length === 0) return null;

    return (
      <div className="mt-2 flex flex-wrap gap-2">
        {translatedAttributes.map((attr) => (
          <div
            key={attr.id}
            className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 bg-main/10 md:px-2 px-1 py-1 rounded-md"
          >
            <span className="capitalize mr-1">{attr.label}:</span>
            {attr.type === "color" ? (
              <>
                <span
                  className="w-5 h-5 rounded-full border"
                  style={{ background: attr.hex || attr.value }}
                />
                <span className="font-medium text-gray-900 dark:text-white">
                  {attr.value}
                </span>
              </>
            ) : (
              <span className="font-medium text-gray-900 dark:text-white">
                {attr.value}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };
  const handleQuantityDecrease = () => {
    if (item.quantity > 1) {
      // optimistic toast immediately
      showQuantityUpdateSuccess({
        productName: name,
        quantity: item.quantity - 1,
      });
      const res = onUpdateQuantity?.(item.id, item.quantity - 1);
      // handle failure to revert toast/message
      if (res && typeof res.then === "function") {
        res.catch(() => showQuantityUpdateError(name));
      }
    }
  };

  const handleQuantityIncrease = () => {
    // If product uses stock tracking, prevent increasing beyond available stock
    if (item.is_stock && typeof item.stock === "number") {
      if (item.quantity + 1 > item.stock) {
        // show friendly out-of-stock / limited message
        showQuantityUpdateError(name);
        return;
      }
    }

    // optimistic toast immediately
    showQuantityUpdateSuccess({
      productName: name,
      quantity: item.quantity + 1,
    });
    const res = onUpdateQuantity?.(item.id, item.quantity + 1);
    if (res && typeof res.then === "function") {
      res.catch(() => showQuantityUpdateError(name));
    }
  };

  const handleRemove = () => {
    // optimistic remove toast
    showItemRemoveSuccess(name);
    const res = onRemove?.(item.id);
    if (res && typeof res.then === "function") {
      res.catch(() => showItemRemoveError(name));
    }
  };

  return (
    <div className="bg-white dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 p-6">
      <div className="flex gap-6">
        {/* Product Image */}
        <div className="relative md:w-24 w-[81px] md:h-24 h-[81px] flex-shrink-0">
          <img
            src={item.image}
            alt={name}
            // fill
            className="object-cover rounded"
            sizes="96px"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-900 dark:text-white md:text-lg text-base font-semibold mb-1">
                {name}
              </h3>

              {renderAttributes()}

              <div className="text-[var(--color-main)] md:text-xl text-lg font-bold">
                {item.price.toLocaleString()}{" "}
                <span className="text-sm font-normal">
                  {t("Common.currency")}
                </span>
              </div>
            </div>

            {/* Remove Button */}
            <button
              onClick={handleRemove}
              className="text-gray-600 dark:text-white/70 hover:text-[var(--color-main)] dark:hover:text-[var(--color-main)] transition-colors flex items-center gap-1 text-sm cursor-pointer"
            >
              <span className="text-lg">🗑️</span>
              <span className="md:flex hidden">{t("Cart.removeItem")}</span>
            </button>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={handleQuantityDecrease}
              disabled={item.quantity <= 1}
              className="w-8 h-8 rounded border border-gray-300 dark:border-white/20 flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus size={16} />
            </button>

            <span className="text-gray-900 dark:text-white text-lg min-w-[30px] text-center">
              {item.quantity}
            </span>

            <button
              onClick={handleQuantityIncrease}
              className="w-8 h-8 rounded border border-gray-300 dark:border-white/20 flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export type { CartCardData };
