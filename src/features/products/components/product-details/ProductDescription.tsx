"use client";

import React, { useState } from "react";
// import { useTranslations } from "next-intl";
import { useConfigStore } from "@/features/config";
import {
  getProductTheme,
  isClothesStore,
} from "@/features/products/utils/theme";

interface ProductDescriptionProps {
  shortDescription?: string;
  description?: string;
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({
  shortDescription,
  description,
}) => {
  // const t = useTranslations("Products");
  const config = useConfigStore((state: { config: unknown; }) => state.config);
  const storeType = config?.store_type;
  const theme = getProductTheme(storeType);
  const isClothes = isClothesStore(storeType);

  const [isExpanded, setIsExpanded] = useState(false);

  // For clothes store: show description with expand/collapse
  if (isClothes && theme.description.showCollapsible) {
    return (
      <div className="mt-6">
        {/* Short description */}
        {shortDescription && (
          <p className="text-base font-medium leading-[160%]">
            {shortDescription}
          </p>
        )}

        {/* Full description with expand/collapse */}
        {description && (
          <div className="mt-4">
            <div
              className={`text-base font-medium leading-[160%] transition-all duration-300 overflow-hidden ${
                isExpanded ? "max-h-none" : "max-h-24"
              }`}
              dangerouslySetInnerHTML={{ __html: description }}
            />
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`mt-2 ${theme.description.seeMoreColor} font-semibold text-sm hover:underline transition-colors`}
            >
              {isExpanded
                ? "Show Less"
                : "Show More"}
            </button>
          </div>
        )}
      </div>
    );
  }

  // For non-clothes stores: show full description
  if (description) {
    return (
      <div className="mt-6">
        <div
          className="text-base font-medium leading-[160%]"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    );
  }

  return null;
};
