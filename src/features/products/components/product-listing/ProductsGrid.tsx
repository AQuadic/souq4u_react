"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts, Product, PaginatedResponse } from "../../api/getProduct";
import { getPriceRange } from "../../api/getPriceRange";
import ProductCard from "../ProductCard";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import ProductsPriceFilter from "./ProductsPriceFilter";
import { Breadcrumbs } from "@/shared/components/BreadCrumbs/BreadCrumbs";
import ProductsSorting from "./ProductsSorting";
import ProductCardListing from "../ProductCardListing";
import { useProductFilters } from "../../hooks/useProductFilters";
import ProductsCategoryFilter from "./ProductsCategoryFilter";
import ProductsPagination from "@/shared/components/pagenation/ProductsPagenation";
import { useLocation } from "react-router-dom";

const ProductsGrid: React.FC = () => {
  const { t } = useTranslation();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { filters, setCategory, setPriceRange, setSorting } =
    useProductFilters();

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const searchQuery = searchParams.get("search") ?? undefined;

  // Fetch price range from API
  const { data: priceRangeData } = useQuery<{
    min_price: number;
    max_price: number;
  }>({
    queryKey: ["priceRange"],
    queryFn: getPriceRange,
    staleTime: 60000, // Cache for 1 minute
  });

  const {
    data: rawData,
    isLoading,
    isFetching,
    error,
  } = useQuery<Product[] | PaginatedResponse<Product>, Error>({
    queryKey: ["products", filters, searchQuery, currentPage],
    queryFn: () =>
      getProducts({
        q: searchQuery,
        // use server-side normal pagination
        pagination: "normal",
        sort_by: filters.sortBy ?? "updated_at",
        sort_order: filters.sortOrder ?? "desc",
        only_discount: filters.onlyDiscount ?? 0,
        category_id: filters.categoryId,
        min_price: filters.minPrice,
        max_price: filters.maxPrice,
        page: currentPage,
        per_page: 4,
      }),
    staleTime: 5000,
  });

  // Normalize API response (can be plain array or paginated object)
  const raw = rawData as any;
  const productsArray: Product[] = Array.isArray(raw) ? raw : raw?.data ?? [];
  const meta = !Array.isArray(raw) ? raw?.meta : undefined;

  // Derive pagination values. When server returns paginated meta, use it.
  const perPageFromServer = meta?.per_page ?? itemsPerPage;
  const totalProducts = meta?.total ?? productsArray.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / perPageFromServer));

  // If server returned paginated data, `productsArray` is already the current
  // page's items. If not, slice locally for client-side pagination.
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = meta
    ? productsArray
    : productsArray.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  if (error) {
    return (
      <section className="container md:py-[88px] py-8">
        <Breadcrumbs
          items={[
            { label: t("Navigation.home"), href: "/" },
            { label: t("Products.title") },
          ]}
        />
        <p className="text-center text-main mt-8">
          {t("ProductsGrid.failedToLoad")}
        </p>
      </section>
    );
  }

  return (
    <section className="container md:py-[44px] py-8">
      {/* <h1 className="text-main md:text-[32px] text-2xl font-normal leading-[100%] text-center uppercase font-anton-sc">
        {t("ProductsGrid.title")}
      </h1> */}

      <Breadcrumbs
        items={[
          { label: t("Navigation.home"), href: "/" },
          { label: t("Products.title") },
        ]}
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
            displayed={currentProducts.length}
            total={totalProducts}
          />

          {isFetching && !isLoading && (
            <div className="flex items-center justify-center py-4 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg mt-6">
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-main border-t-transparent rounded-full"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("ProductsGrid.loadingNewProducts")}
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

          {!isLoading && currentProducts.length > 0 && (
            <>
              <div
                className={`md:mt-12 mt-6 ${
                  view === "grid"
                    ? "grid lg:grid-cols-3 grid-cols-2 gap-6 justify-items-center"
                    : "flex flex-col gap-4"
                }`}
              >
                {currentProducts.map((product) =>
                  view === "grid" ? (
                    <ProductCard key={product.id} product={product} />
                  ) : (
                    <ProductCardListing key={product.id} product={product} />
                  )
                )}
              </div>

              {totalPages > 1 && (
                <ProductsPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}

          {!isLoading && productsArray && productsArray.length === 0 && (
            <p className="text-center dark:text-[#FDFDFD] mt-8">
              {t("ProductsGrid.noProducts")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsGrid;
