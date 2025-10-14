"use client";

import React from "react";
// import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ProductQuantitySelector } from "./ProductQuantitySelector";
import { ProductSizeSelector } from "./ProductSizeSelector";
import { ProductDescription } from "./ProductDescription";
import GuideImage from "./GuideImage";
import { useConfigStore } from "@/features/config";
import { getProductTheme } from "@/features/products/utils/theme";

interface ProductVariant {
  id: number;
  attributes?: Array<{
    id: number;
    value?: {
      value?: {
        en: string;
      };
    };
  }>;
}

interface SelectedAttributes {
  [attributeId: number]: string;
}

interface ProductActionsProps {
  variants: ProductVariant[];
  quantity: number;
  selectedAttributes?: SelectedAttributes;
  isInStock: boolean;
  hasUnlimitedStock?: boolean;
  stockCount?: number;
  isAddingToCart?: boolean;
  onQuantityChange: (quantity: number) => void;
  onAttributeChange: (attributeId: number, value: string) => void;
  onAddToCart: () => void;
  guideImage?: {
    id: number;
    url: string;
    responsive_urls: string[];
  };
  shortDescription?: string;
  description?: string;
  storeType?: string;
}

export const ProductActions: React.FC<ProductActionsProps> = ({
  variants,
  quantity,
  selectedAttributes = {},
  isInStock,
  hasUnlimitedStock = false,
  stockCount = 0,
  isAddingToCart = false,
  onQuantityChange,
  onAttributeChange,
  onAddToCart,
  guideImage,
  shortDescription,
  description,
  storeType,
}) => {
  // const t = useTranslations("Products");

  // Get store config and theme
  const config = useConfigStore((state: { config: unknown; }) => state.config);
  const theme = getProductTheme(config?.store_type);

  // Use storeType prop if provided, otherwise fallback to config
  const currentStoreType = storeType || config?.store_type;

  return (
    <div>
      {guideImage && <GuideImage guideImage={guideImage} />}
      <ProductSizeSelector
        variants={variants}
        selectedAttributes={selectedAttributes}
        onAttributeChange={onAttributeChange}
        disabled={isAddingToCart}
      />

      <div className="mt-6 flex flex-col gap-4">
        <ProductQuantitySelector
          quantity={quantity}
          onQuantityChange={onQuantityChange}
          disabled={!isInStock || isAddingToCart}
          maxQuantity={hasUnlimitedStock ? undefined : stockCount}
        />

        <motion.button
          onClick={onAddToCart}
          disabled={!isInStock || isAddingToCart}
          className={`w-full ${theme.button.height} ${theme.button.rounded} flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden bg-main`}
          whileHover={{ scale: isInStock && !isAddingToCart ? 1.02 : 1 }}
          whileTap={{ scale: isInStock && !isAddingToCart ? 0.98 : 1 }}
          animate={isAddingToCart ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: isAddingToCart ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            <p className="text-white text-lg font-bold leading-[100%]">
              {!isInStock ? ("outOfStock") : ("addToCart")}
            </p>
          </motion.div>

          {isAddingToCart && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </motion.div>
          )}
        </motion.button>
      </div>

      {/* Description below add to cart button - only for clothes stores */}
      {currentStoreType === "Clothes" && (
        <ProductDescription
          shortDescription={shortDescription}
          description={description}
        />
      )}
    </div>
  );
};
