"use client";

import React from "react";
import { isClothesStore } from "@/features/products/utils/theme";

import ProductRatingCount from "./reviews/ProductRatingCount";

interface ProductInfoProps {
  categoryName?: string;
  productName: string;
  shortDescription?: string;
  productId?: number;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  categoryName,
  productName,
  shortDescription,
  productId,
}) => {
  // Default to non-clothes store
  const isClothes = isClothesStore();

  return (
    <div>
      <p className="md:text-lg text-sm font-medium leading-[100%]">
        {categoryName}
      </p>
      <h2 className="md:text-[40px] text-xl font-bold leading-[100%] md:mt-6 mt-4">
        {productName}
      </h2>

      {/* Rating count displayed under product name */}
      {productId && (
        <ProductRatingCount
          reviewable_id={productId}
          reviewable_type="product"
        />
      )}

      {/* Show short description only for non-clothes stores */}
      {shortDescription && !isClothes && (
        <p className="mt-4 text-base font-medium leading-[160%]">
          {shortDescription}
        </p>
      )}
    </div>
  );
};
