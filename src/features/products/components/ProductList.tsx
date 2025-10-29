"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getProducts, Product, GetProductsParams } from "../api/getProduct";
import ProductCard from "./ProductCard";
import Arrow from "../icons/Arrow";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Link } from "react-router-dom";

export interface ProductListTheme {
  containerClassName?: string;
  titleClassName?: string;
  gridClassName?: string;
  gapClassName?: string;
  errorClassName?: string;
  buttonClassName?: string;
  buttonIconClassName?: string;
}

export interface ProductListProps {
  title?: string;
  titleKey?: string;
  titleAlign?: "center" | "left" | "right";
  maxItems?: number;
  skeletonCount?: number;
  queryParams?: GetProductsParams;
  queryKey?: string[];
  excludeProductIds?: number[];
  onlyFeatured?: boolean;
  onlyDiscounted?: boolean;
  viewAllLink?: string | null;
  viewAllTextKey?: string;
  viewAllText?: string;
  showTopRated?: boolean;
  theme?: ProductListTheme;
  showSection?: boolean;
  emptyMessage?: string;
  emptyMessageKey?: string;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
}

const defaultTheme: Required<ProductListTheme> = {
  containerClassName: "container md:py-[88px] py-8",
  titleClassName:
    "text-main md:text-[32px] text-2xl font-normal leading-[100%] uppercase font-anton-sc",
  gridClassName: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  gapClassName: "gap-6",
  errorClassName: "text-center text-main mt-8",
  buttonClassName:
    "flex items-center justify-center gap-2 md:w-[255px] w-[188px] h-14 bg-main rounded-[8px] text-[#FDFDFD] md:text-lg text-base font-bold leading-[100%]",
  buttonIconClassName: "md:flex hidden rtl:rotate-180",
};

const ProductListSkeletonGrid: React.FC<{
  count: number;
  gridClassName: string;
  gapClassName: string;
}> = ({ count, gridClassName, gapClassName }) => (
  <div
    className={`md:mt-12 mt-6 grid ${gridClassName} ${gapClassName} justify-items-center`}
  >
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

const WrapWithSection: React.FC<{
  showSection: boolean;
  className: string;
  children: React.ReactNode;
}> = ({ showSection, className, children }) =>
  showSection ? (
    <section className={className}>{children}</section>
  ) : (
    <>{children}</>
  );

const ProductList: React.FC<ProductListProps> = ({
  title,
  titleKey = "title",
  titleAlign = "center",
  maxItems,
  skeletonCount = 8,
  queryParams = {},
  queryKey,
  excludeProductIds,
  onlyFeatured,
  onlyDiscounted,
  viewAllLink = "/products",
  viewAllTextKey = "viewAllProducts",
  viewAllText,
  showTopRated = true,
  theme = {},
  showSection = true,
  // emptyMessage and emptyMessageKey removed: component hides itself when no products
  loadingComponent,
  errorComponent,
}) => {
  const { t } = useTranslation("Products");

  const mergedTheme: Required<ProductListTheme> = {
    ...defaultTheme,
    ...theme,
  };

  const getTitleAlignClass = () => {
    if (titleAlign === "center") return "text-center";
    if (titleAlign === "left") return "text-left rtl:text-right";
    return "text-right rtl:text-left";
  };
  const titleAlignClass = getTitleAlignClass();

  const finalQueryKey = queryKey || ["products", JSON.stringify(queryParams)];

  const { data, isLoading, error } = useQuery<Product[]>({
    queryKey: finalQueryKey,
    queryFn: () => getProducts(queryParams),
  });

  let processedProducts = data || [];

  if (excludeProductIds && excludeProductIds.length > 0) {
    processedProducts = processedProducts.filter(
      (p) => !excludeProductIds.includes(p.id)
    );
  }

  if (onlyFeatured) {
    processedProducts = processedProducts.filter((p) => p.is_featured === 1);
  }

  if (onlyDiscounted) {
    processedProducts = processedProducts.filter((product) =>
      product.variants?.some((variant) => variant.has_discount)
    );
  }

  if (maxItems && maxItems > 0) {
    processedProducts = processedProducts.slice(0, maxItems);
  }

  const displayTitle = title || (titleKey ? t(titleKey) : "");
  const displayButtonText =
    viewAllText || (viewAllTextKey ? t(viewAllTextKey) : "");

  if (isLoading) {
    if (loadingComponent) return <>{loadingComponent}</>;

    return (
      <WrapWithSection
        showSection={showSection}
        className={mergedTheme.containerClassName}
      >
        <h1 className={`${mergedTheme.titleClassName} ${titleAlignClass}`}>
          {displayTitle}
        </h1>
        <ProductListSkeletonGrid
          count={skeletonCount}
          gridClassName={mergedTheme.gridClassName}
          gapClassName={mergedTheme.gapClassName}
        />
      </WrapWithSection>
    );
  }

  if (error) {
    if (errorComponent) return <>{errorComponent}</>;

    return (
      <WrapWithSection
        showSection={showSection}
        className={mergedTheme.containerClassName}
      >
        <h1 className={`${mergedTheme.titleClassName} ${titleAlignClass}`}>
          {displayTitle}
        </h1>
        <p className={mergedTheme.errorClassName}>{t("failedToLoad")}</p>
      </WrapWithSection>
    );
  }

  if (processedProducts.length === 0) {
    // Hide the entire component when there are no products to display.
    // Consumers that require an explicit empty state should pass a
    // specific `errorComponent` or `loadingComponent` prop.
    return null;
  }

  return (
    <WrapWithSection
      showSection={showSection}
      className={mergedTheme.containerClassName}
    >
      <h1 className={`${mergedTheme.titleClassName} ${titleAlignClass}`}>
        {displayTitle}
      </h1>

      <div
        className={`md:mt-12 mt-6 grid ${mergedTheme.gridClassName} ${mergedTheme.gapClassName} justify-items-center`}
      >
        {processedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showTopRated={showTopRated}
          />
        ))}
      </div>

      {viewAllLink && (
        <div className="flex items-center justify-center mt-12">
          <Link to={viewAllLink} className={mergedTheme.buttonClassName}>
            {displayButtonText}
            <div className={mergedTheme.buttonIconClassName}>
              <Arrow />
            </div>
          </Link>
        </div>
      )}
    </WrapWithSection>
  );
};

export default ProductList;
