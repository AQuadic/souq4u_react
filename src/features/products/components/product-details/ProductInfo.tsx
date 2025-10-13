"use client";

import React from "react";
import { useConfigStore } from "@/features/config";
import { isClothesStore } from "@/features/products/utils/theme";

interface ProductInfoProps {
  categoryName?: string;
  productName: string;
  shortDescription?: string;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  categoryName,
  productName,
  shortDescription,
}) => {
  const config = useConfigStore((state) => state.config);
  const storeType = config?.store_type;
  const isClothes = isClothesStore(storeType);

  return (
    <div>
      <p className="md:text-lg text-sm font-medium leading-[100%]">
        {categoryName}
      </p>
      <h2 className="md:text-[40px] text-xl font-bold leading-[100%] md:mt-6 mt-4">
        {productName}
      </h2>

      {/* Show short description only for non-clothes stores */}
      {shortDescription && !isClothes && (
        <p className="mt-4 text-base font-medium leading-[160%]">
          {shortDescription}
        </p>
      )}
    </div>
  );
};
