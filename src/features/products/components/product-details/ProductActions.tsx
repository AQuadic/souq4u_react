"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ProductQuantitySelector } from "./ProductQuantitySelector";
import { ProductSizeSelector } from "./ProductSizeSelector";
import GuideImage from "./GuideImage";
// import { getProductTheme } from "@/features/products/utils/theme";
import Favorite from "../../icons/Favorite";
import Unfavorite from "../../icons/Unfavorite";
import { useIsAuthenticated } from "@/features/auth";
import { useToast } from "@/shared/components/ui/toast";
import { addFavorite } from "@/features/profile/favorites/api/postFavorites";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

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
  product: {
    id: number;
    is_favorite?: boolean;
  };
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
  onToggleFavorite?: (productId: number) => void;
  guideImage?: {
    id: number;
    url: string;
    responsive_urls: string[];
  };
  shortDescription?: string;
  description?: string;
  storeType?: string;
  setFavoriteHandler?: (
    handler: (e: React.MouseEvent) => Promise<void>
  ) => void;
  onFavoriteStateChange?: (isFavorite: boolean) => void;
}

export const ProductActions: React.FC<ProductActionsProps> = ({
  product,
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
  onToggleFavorite,
  guideImage,
  setFavoriteHandler,
  onFavoriteStateChange,
  // shortDescription,
  // description,
}) => {
  const { t } = useTranslation("Common");
  const [loading, setLoading] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [favorite, setFavorite] = useState(product.is_favorite);

  // Sync local favorite state with product prop changes
  useEffect(() => {
    setFavorite(product.is_favorite);
  }, [product.is_favorite]);

  const handleFavoriteClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();

      if (!isAuthenticated) {
        // use product namespace translation key; fall back to common or literal
        const loginMsg =
          t("Products.loginRequiredForFavorites") ||
          t("Products.loginRequiredForFavorites") ||
          "You must be logged in to add favorites";
        toast.error(loginMsg);
        return;
      }

      setLoading(true);

      // Optimistically update the UI immediately
      const newFavoriteState = !favorite;
      setFavorite(newFavoriteState);
      if (onFavoriteStateChange) {
        onFavoriteStateChange(newFavoriteState);
      }

      try {
        await addFavorite({
          favorable_id: product.id,
          favorable_type: "product",
        });

        // Invalidate favorites query so any pages listing favorites refetch and stay in sync
        queryClient.invalidateQueries({ queryKey: ["favorites"] });
        toast.success(
          newFavoriteState
            ? t("Products.addedToFavorites") ||
                t("Products.addedToFavorites") ||
                "Added to favorites"
            : t("Products.removedFromFavorites") ||
                t("Products.removedFromFavorites") ||
                "Removed from favorites"
        );
        if (onToggleFavorite) {
          onToggleFavorite(product.id);
        }
      } catch (err: unknown) {
        // Revert the optimistic update on error
        setFavorite(!newFavoriteState);
        if (onFavoriteStateChange) {
          onFavoriteStateChange(!newFavoriteState);
        }

        // log error for debugging and show translated error message
        console.error("Failed to update favorites", err);
        toast.error(
          t("failedToUpdateFavorites") ||
            t("error") ||
            "Failed to update favorites"
        );
      } finally {
        setLoading(false);
      }
    },
    [
      isAuthenticated,
      favorite,
      onFavoriteStateChange,
      product.id,
      onToggleFavorite,
      queryClient,
      toast,
      t,
    ]
  );

  // Set the favorite handler for the parent component to call
  useEffect(() => {
    if (setFavoriteHandler) {
      setFavoriteHandler(handleFavoriteClick);
    }
  }, [setFavoriteHandler, handleFavoriteClick]);

  return (
    <div>
      {guideImage && <GuideImage guideImage={guideImage} />}
      <ProductSizeSelector
        variants={variants}
        selectedAttributes={selectedAttributes}
        onAttributeChange={onAttributeChange}
        disabled={isAddingToCart}
      />

      <div className="mt-6 flex gap-4">
        <ProductQuantitySelector
          quantity={quantity}
          onQuantityChange={onQuantityChange}
          disabled={!isInStock || isAddingToCart}
          maxQuantity={hasUnlimitedStock ? undefined : stockCount}
        />

        <motion.button
          onClick={onAddToCart}
          disabled={!isInStock || isAddingToCart}
          className={`w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden bg-main rounded-lg`}
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
              {!isInStock && t("Products.outOfStock")}
              {isInStock && t("Products.addToCart")}
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
        <button
          onClick={handleFavoriteClick}
          className="ltr:ml-auto rtl:mr-auto md:flex hidden"
          disabled={loading}
        >
          {favorite ? <Favorite /> : <Unfavorite />}
        </button>
      </div>
    </div>
  );
};
