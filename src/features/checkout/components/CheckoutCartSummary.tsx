"use client";

import React from "react";
import { useCartStore } from "@/features/cart/stores";
import { getTranslatedText } from "@/shared/utils/translationUtils";
import { useTranslation } from "react-i18next";

interface CheckoutCartSummaryProps {
  className?: string;
}

export const CheckoutCartSummary: React.FC<CheckoutCartSummaryProps> = ({
  className = "",
}) => {
  const { cart } = useCartStore();
  const {t, i18n} = useTranslation("Common");
  const locale = i18n.language;

  if (!cart?.items?.length) {
    return (
      <div className={`rounded-lg p-6 ${className}`}>
        <h2 className="text-xl font-semibold text-white mb-4">{t('yourOrder')}</h2>
        <p className="text-gray-400">No items in cart</p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg md:p-6 ${className}`}>
      <h2 className="text-xl font-semibold mb-6">{t('yourOrder')}</h2>

      <div className="space-y-4">
        {cart.items.map((item) => (
          <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
            {/* Product Image */}
            <div className="relative w-16 h-16 flex-shrink-0">
              <img
                src={item.image?.url || "/placeholder-product.jpg"}
                alt={getTranslatedText(item.name, locale, "")}
                // fill
                className="object-cover rounded-md"
              />
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h3 className="dark:text-white font-medium text-sm leading-tight mb-1 line-clamp-2">
                {getTranslatedText(item.name, locale, "")}
              </h3>

              {/* Variant attributes if available */}
              {item.variant?.attributes &&
                item.variant.attributes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.variant.attributes.map((attr) => (
                      <span
                        key={`${attr.id}-${attr.attribute.id}-${attr.value.id}`}
                        className="bg-main/60 text-white px-2 py-1 rounded text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2"
                      >
                        {`${getTranslatedText(attr.attribute.name, locale)}: ${getTranslatedText(attr.value.value, locale)}`}
                      </span>
                    ))}
                  </div>
                )}

              {/* Quantity and Price */}
              <div className="flex items-center justify-between">
                <span className="dark:text-gray-400 text-sm">
                  {t('Qty')}: {item.quantity}
                </span>
                <div className="text-right">
                  {item.variant?.has_discount && (
                    <div className="text-xs text-gray-400 line-through">
                      {(item.variant.price * item.quantity).toLocaleString()}{" "}
                      {t("currency")}
                    </div>
                  )}
                  <div className="font-semibold">
                    {(
                      (item.variant?.final_price || item.variant?.price || 0) *
                      item.quantity
                    ).toLocaleString()}{" "}
                    {t("currency")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
