"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { getProduct, Product } from "../api/getProduct";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useRecentlyViewedStore } from "../stores/recently-viewed-store";

interface RecentlyViewedProductsProps {
  currentProductId?: number;
  titleAlign?: "center" | "left" | "right";
}

const ProductListSkeletonGrid: React.FC<{
  count: number;
}> = ({ count }) => (
  <div className="md:mt-12 mt-6 grid xl:grid-cols-4 grid-cols-2 gap-6 justify-items-center">
    {Array.from(
      { length: count },
      (_, i) => `product-skeleton-${Date.now()}-${i}`
    ).map((skeletonId) => (
      <div key={skeletonId} className="flex flex-col space-y-3 w-[276px]">
        <Skeleton className="h-[287px] w-full rounded-tl-3xl rounded-tr-3xl" />
        <div className="p-4 border-t-[1.5px] border-solid border-[var(--Card-BG-Color,#242529)] rounded-br-3xl rounded-bl-3xl space-y-2">
          <Skeleton className="h-4 w-[70%]" />
          <Skeleton className="h-4 w-[50%]" />
          <div className="flex justify-between mt-2">
            <Skeleton className="h-4 w-[20%]" />
            <Skeleton className="h-4 w-[20%]" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const RecentlyViewedProducts: React.FC<RecentlyViewedProductsProps> = ({
  currentProductId,
  titleAlign = "left",
}) => {
  const t = useTranslations("Products");
  const productIds = useRecentlyViewedStore((state) => state.productIds);

  // Filter out the current product if it's in the list
  const filteredProductIds = currentProductId
    ? productIds.filter((id) => id !== currentProductId)
    : productIds;

  // Fetch all products using Promise.all
  const {
    data: products,
    isLoading,
    error,
  } = useQuery<Product[]>({
    queryKey: ["recently-viewed-products", filteredProductIds],
    queryFn: async () => {
      if (filteredProductIds.length === 0) {
        return [];
      }

      try {
        const productPromises = filteredProductIds.map((id) =>
          getProduct(String(id)).catch((err) => {
            console.error(`Failed to fetch product ${id}:`, err);
            return null;
          })
        );

        const results = await Promise.all(productPromises);

        // Filter out null values (failed requests)
        return results.filter(
          (product): product is Product => product !== null
        );
      } catch (error) {
        console.error("Error fetching recently viewed products:", error);
        return [];
      }
    },
    enabled: filteredProductIds.length > 0,
  });

  const getTitleAlignClass = () => {
    if (titleAlign === "center") return "text-center";
    if (titleAlign === "left") return "text-left rtl:text-right";
    return "text-right rtl:text-left";
  };

  // Don't render anything if there are no products to show
  if (filteredProductIds.length === 0) {
    return null;
  }

  return (
    <section className="container md:py-[88px] py-8">
      <h1
        className={`text-main md:text-[32px] text-2xl font-bold leading-[100%] font-poppins ${getTitleAlignClass()}`}
      >
        {t("recentlyViewed")}
      </h1>

      {isLoading && (
        <ProductListSkeletonGrid
          count={Math.min(filteredProductIds.length, 8)}
        />
      )}

      {error && (
        <p className="text-center text-main mt-8">{t("failedToLoad")}</p>
      )}

      {!isLoading && !error && products && products.length > 0 && (
        <div className="md:mt-12 mt-6 grid xl:grid-cols-4 grid-cols-2 gap-6 justify-items-center">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showTopRated={true}
            />
          ))}
        </div>
      )}

      {!isLoading && !error && (!products || products.length === 0) && (
        <p className="text-center text-main mt-8">{t("noProducts")}</p>
      )}
    </section>
  );
};

export default RecentlyViewedProducts;
