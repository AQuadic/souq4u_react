"use client";

import React, { useState } from "react";
// import { useTranslations } from "next-intl";
// import Link from "next/link";
import { Product } from "../api/getProduct";
import TopRated from "../icons/TopRated";
import Favorite from "../icons/Favorite";
import Unfavorite from "../icons/Unfavorite";
import Star from "../icons/Star";
import { useQueryClient } from "@tanstack/react-query";
import {
  useTranslatedText,
  MultilingualText,
} from "@/shared/utils/translationUtils";
import { addFavorite } from "@/features/profile/favorites/api/postFavorites";
import { useAuthGuard } from "@/features/auth/hooks/useAuthGuard";
import { useFavoritesToast } from "@/features/profile/favorites/hooks/useFavoritesToast";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
  onToggleFavorite?: (productId: number) => void;
  showTopRated?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onToggleFavorite,
  showTopRated = true,
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
  const shortDescription = useTranslatedText(
    product.short_description as MultilingualText | string | undefined,
    ""
  );

  // const t = useTranslations("Common");
  // const p = useTranslations("Products");

  const discountPercentage = product.variants?.[0]?.discount_percentage ?? 0;

  // Check if product is out of stock by inspecting all variants.
  // Consider a product out of stock when there are no variants or every
  // variant is unavailable (either `is_stock` is falsy or `stock` is 0/null/undefined).
  const isOutOfStock =
    !product.variants ||
    (!product.variants[0]?.is_stock && product.variants.length === 0) ||
    product.variants.every(
      (v) =>
        !v?.is_stock ||
        v?.stock === 0 ||
        v?.stock === null ||
        v?.stock === undefined
    );

  // Extract unique color values (special_value) from variant attributes to show as swatches
  const colorSwatches: string[] = [];
  product.variants?.forEach((v) =>
    v?.attributes?.forEach((attr) => {
      // attribute.value.special_value is used in ProductSizeSelector as "special_value" (hex color)
      const value = (
        attr as {
          value?: { special_value?: string | null };
        }
      )?.value?.special_value;
      if (value && !colorSwatches.includes(value)) colorSwatches.push(value);
    })
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

  const formatPrice = (price: number) =>
    price.toLocaleString("en-US", { maximumFractionDigits: 0 });

  return (
    <Link
      to={`/products/${product.id}`}
      className="shadow-md hover:shadow-lg rounded-3xl py-4 w-full sm:w-[276px] h-[480px] flex flex-col border"
    >
      <div className="  dark:bg-[#242529] rounded-tl-3xl rounded-tr-3xl p-4 relative  transition-shadow duration-300 ">
        <div className="flex items-center justify-between">
          {showTopRated && product.is_top_rated === 1 && (
            <div className="flex items-center gap-2">
              <TopRated />
              <p className=" lg:text-xs text-[8px] font-normal leading-3">
                {("topRated")}
              </p>
            </div>
          )}
          <button
            onClick={handleFavoriteClick}
            className="ltr:ml-auto rtl:mr-auto"
            disabled={loading}
          >
            {/* Color swatches: render small 18x18 circles under price for available colors */}

            {favorite ? <Favorite /> : <Unfavorite />}
          </button>
        </div>

        <div className="relative lg:w-[246px] w-[86px] lg:h-[150px] h-[126px] flex items-center justify-center mx-auto lg:mt-8 mt-4">
          {product.images?.[0]?.url ? (
            <img
              src={product.images[0].url}
              alt={productName}
              // fill
              sizes="(max-width: 1024px) 126px, 276px"
              className={`object-contain ${isOutOfStock ? "opacity-50" : ""}`}
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:w-[70%] w-full bg-black/80 rounded-lg lg:px-4 py-2 flex items-center justify-center">
              <div className="text-white lg:text-base text-xs font-bold text-center">
                {("outOfStock")}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className=" border-t-0 dark:border-r-[1.5px] dark:border-b-[1.5px] dark:border-l-[1.5px] border-solid border-[var(--Card-BG-Color,#242529)] rounded-br-3xl rounded-bl-3xl p-4 flex flex-col h-full">
        <div className="flex items-center justify-between">
          <h2 className=" lg:text-base text-sm lg:font-bold font-semibold leading-[150%]">
            {productName.slice(0, 16)}
            {productName.length > 16 ? "…" : ""}
          </h2>
          <div className="flex items-center gap-1">
            <p className=" text-sm font-medium leading-3 font-Poppins">
              {product.rating}
            </p>
            <Star />
          </div>
        </div>

        <p className=" lg:text-base text-xs font-normal leading-[160%] lg:mt-4 mt-1 h-24 sm:h-12 overflow-y-hidden ">
          {shortDescription}
        </p>

        <div className=" mt-auto">
          <div className="mt-[18px] flex lg:flex-row flex-col lg:items-center gap-2  justify-between ">
            <h2 className="text-main text-base font-bold leading-4">
              {formatPrice(product.variants?.[0]?.final_price ?? 0)}{" "}
              <span className="font-normal">{("currency")}</span>
            </h2>

            {product.variants?.[0]?.has_discount && discountPercentage > 0 && (
              <div className="flex items-center gap-2">
                <h2 className=" text-xs font-normal leading-3 line-through">
                  {formatPrice(product.variants?.[0]?.price ?? 0)}{" "}
                  <span className="font-normal">{("currency")}</span>
                </h2>

                <div className="w-[59px] h-5 border border-[#3D9BE9] rounded-[8px] flex items-center justify-center">
                  <h2 className=" text-xs font-normal leading-3">
                    {parseFloat(discountPercentage.toFixed(1))} %
                  </h2>
                </div>
              </div>
            )}
          </div>
          {colorSwatches.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                {colorSwatches.slice(0, 6).map((c) => (
                  <span
                    key={c}
                    title={c}
                    aria-label={`color-${c}`}
                    className="w-[18px] h-[18px] rounded-full "
                    style={{ backgroundColor: c }}
                  />
                ))}
                {colorSwatches.length > 6 && (
                  <span className="text-xs text-gray-500">
                    +{colorSwatches.length - 6}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
