"use client";

import React, { useState } from "react";
import { Product } from "../api/getProduct";
import Favorite from "../icons/Favorite";
import Unfavorite from "../icons/Unfavorite";
import Star from "../icons/Star";
import { useQueryClient } from "@tanstack/react-query";
import {
  useTranslatedText,
  MultilingualText,
} from "@/shared/utils/translationUtils";
import { useTranslation } from "react-i18next";
import { addFavorite } from "@/features/profile/favorites/api/postFavorites";
import { useAuthGuard } from "@/features/auth/hooks/useAuthGuard";
import { useFavoritesToast } from "@/features/profile/favorites/hooks/useFavoritesToast";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
  onToggleFavorite?: (productId: number) => void;
}

const ProductCardListing: React.FC<ProductCardProps> = ({
  product,
  onToggleFavorite,
}) => {
  const { isAuthenticated } = useAuthGuard();
  const favoritesToast = useFavoritesToast();
  const [favorite, setFavorite] = useState(product.is_favorite);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const productName = useTranslatedText(
    product.name as MultilingualText | string | undefined,
    "Product Name"
  );
  const { t } = useTranslation();

  // Prepare translated category name safely
  const categoryName = product.category?.name as
    | MultilingualText
    | string
    | undefined;
  const discountPercentage = product.variants?.[0]?.discount_percentage ?? 0;

  // Check if product is out of stock by inspecting all variants.
  // Consider a product out of stock when there are no variants or every
  // variant is unavailable (either `is_stock` is falsy or `stock` is 0/null/undefined).
  const isOutOfStock =
    !product.variants ||
    product.variants.length === 0 ||
    product.variants.every(
      (v) =>
        !v?.is_stock ||
        v?.stock === 0 ||
        v?.stock === null ||
        v?.stock === undefined
    );

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      favoritesToast.loginRequired();
      return;
    }

    setLoading(true);
    try {
      await addFavorite({
        favorable_id: product.id,
        favorable_type: "product",
      });

      // Update local favorite state
      const newFavoriteState = !favorite;
      setFavorite(newFavoriteState);

      // Invalidate favorites query so any pages listing favorites refetch and stay in sync
      queryClient.invalidateQueries({ queryKey: ["favorites"] });

      // Show appropriate toast
      if (newFavoriteState) {
        favoritesToast.addedToFavorites();
      } else {
        favoritesToast.removedFromFavorites();
      }

      if (onToggleFavorite) {
        onToggleFavorite(product.id);
      }
    } catch (err: unknown) {
      console.error("Failed to update favorites", err);
      favoritesToast.failedToUpdate();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="shadow-md hover:shadow-lg rounded-3xl"
    >
      <div className="w-full h-full dark:bg-[#242529] rounded-3xl p-4 relative  transition-shadow duration-300 flex items-center gap-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleFavoriteClick}
            className="absolute ltr:right-6 rtl:left-6 top-8"
            disabled={loading}
          >
            {favorite ? <Favorite /> : <Unfavorite />}
          </button>

          <div className="w-[150px] text-[#FFFFFF] h-14 bg-main rounded-[8px] text-lg font-bold flex items-center justify-center absolute ltr:right-6 rtl:left-6 top-40">
            {t("Common.readMore")}
          </div>
        </div>

        <div className="relative w-[200px] h-[200px]">
          {product.images?.[0]?.url ? (
            <img
              src={product.images[0].url}
              alt={productName}
              className={`object-contain ${
                isOutOfStock ? "opacity-50" : ""
              } w-full max-w-[276px] h-[204px]`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-400/50 dark:text-gray-600/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70%] bg-black/80 rounded-lg px-4 py-2 flex items-center justify-center">
              <div className="text-white text-base font-bold text-center">
                {t("Common.outOfStock")}
              </div>
            </div>
          )}
        </div>

        <div className="">
          <h2 className="text-base font-normal leading-[100%] mb-4">
            {useTranslatedText(categoryName, "Category Name")}
          </h2>
          <h2 className=" text-base font-bold leading-[150%]">
            {productName.slice(0, 16)}
            {productName.length > 16 ? "…" : ""}
          </h2>
          <div className="flex items-center gap-1 mt-4">
            <p className=" text-sm font-medium leading-3 font-Poppins">
              {product.rating}
            </p>
            <Star />
          </div>

          {/* <p className=" text-base font-normal leading-[160%] mt-4 max-h-12 overflow-y-hidden">
                {shortDescription}
                </p> */}

          <div className="mt-10 flex items-center gap-2  justify-between">
            <h2 className="text-main text-base font-bold leading-4">
              {product.variants?.[0]?.final_price ?? 0}{" "}
              <span className="font-normal">{t("Common.currency")}</span>
            </h2>

            {product.variants?.[0]?.has_discount && discountPercentage > 0 && (
              <div className="flex items-center gap-2">
                <h2 className=" text-xs font-normal leading-3 line-through">
                  {product.variants?.[0]?.price ?? 0}{" "}
                  <span className="font-normal">{t("Common.currency")}</span>
                </h2>

                <div className="w-[59px] h-5 border border-[#3D9BE9] rounded-[8px] flex items-center justify-center">
                  <h2 className=" text-xs font-normal leading-3">
                    {parseFloat(discountPercentage.toFixed(1))} %
                  </h2>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCardListing;
