"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts, Product } from "../../api/getProduct";
import { getPriceRange } from "../../api/getPriceRange";
import ProductCard from "../ProductCard";
import { Skeleton } from "@/shared/components/ui/skeleton";
// import { useTranslations } from "next-intl";
import ProductsPriceFilter from "./ProductsPriceFilter";
import { Breadcrumbs } from "@/shared/components/BreadCrumbs/BreadCrumbs";
import ProductsSorting from "./ProductsSorting";
import ProductCardListing from "../ProductCardListing";
import { useProductFilters } from "../../hooks/useProductFilters";
import { useSearchParams } from "next/navigation";
import ProductsCategoryFilter from "./ProductsCategoryFilter";

const ProductsGrid: React.FC = () => {
  // const t = useTranslations("ProductsGrid");
  const [view, setView] = useState<"grid" | "list">("grid");

  const { filters, setCategory, setPriceRange, setSorting } =
    useProductFilters();

  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get("search") ?? undefined;

  // Fetch price range from API
  const { data: priceRangeData } = useQuery<{
    min_price: number;
    max_price: number;
  }>({
    queryKey: ["priceRange"],
    queryFn: getPriceRange,
    staleTime: 60000, // Cache for 1 minute
  });

  const { data, isLoading, isFetching, error } = useQuery<Product[], Error>({
    queryKey: ["products", filters, searchQuery],
    queryFn: () => getProducts(), // Temporarily removed all params
    staleTime: 5000,
  });

  // favorites are handled inside ProductCard; no local favorites state needed here

  if (error) {
    return (
      <section className="container md:py-[88px] py-8">
        <Breadcrumbs
          items={[{ label: ("home"), href: "/" }, { label: "Product" }]}
        />
        <p className="text-center text-main mt-8">{("failedToLoad")}</p>
      </section>
    );
  }

  return (
    <section className="container md:py-[88px] py-8">
      {/* <h1 className="text-main md:text-[32px] text-2xl font-normal leading-[100%] text-center uppercase font-anton-sc">
        {t("title")}
      </h1> */}

      <Breadcrumbs
        items={[{ label: ("home"), href: "/" }, { label: ("product") }]}
      />

      <div className="flex lg:flex-row flex-col gap-8 mt-10">
        <div>
          <ProductsCategoryFilter setCategory={setCategory} />
          <ProductsPriceFilter
            minPrice={filters.minPrice ?? priceRangeData?.min_price ?? 0}
            maxPrice={filters.maxPrice ?? priceRangeData?.max_price ?? 10000}
            actualMinPrice={priceRangeData?.min_price ?? 0}
            actualMaxPrice={priceRangeData?.max_price ?? 10000}
            setPriceRange={setPriceRange}
          />
        </div>

        <div className="w-full">
          <ProductsSorting
            view={view}
            setView={setView}
            setSorting={setSorting}
            displayed={data?.length ?? 0}
            total={data?.length ?? 0}
          />

          {isFetching && !isLoading && (
            <div className="flex items-center justify-center py-4 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg mt-6">
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-main border-t-transparent rounded-full"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {("loadingNewProducts")}
                </p>
              </div>
            </div>
          )}

          {isLoading && (
            <div
              className={`md:mt-12 mt-6 ${
                view === "grid"
                  ? "flex flex-wrap gap-6 justify-items-center"
                  : "flex flex-col gap-4"
              }`}
            >
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="flex flex-col space-y-3 w-[276px]"
                >
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
          )}

          {!isLoading && data && data.length > 0 && (
            <div
              className={`md:mt-12 mt-6 ${
                view === "grid"
                  ? "grid lg:grid-cols-3 grid-cols-2 gap-6 justify-items-center"
                  : "flex flex-col gap-4"
              }`}
            >
              {data.map((product) =>
                view === "grid" ? (
                  <ProductCard key={product.id} product={product} />
                ) : (
                  <ProductCardListing key={product.id} product={product} />
                )
              )}
            </div>
          )}

          {!isLoading && data && data.length === 0 && (
            <p className="text-center dark:text-[#FDFDFD] mt-8">
              {("noProducts")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsGrid;
