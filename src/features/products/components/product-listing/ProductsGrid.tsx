"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getProductsPaginated,
  PaginatedResponse,
  Product,
} from "../../api/getProduct";
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
import ProductsColorFilter from "./ProductsColorFilter";
import ProductsPagination from "@/shared/components/pagenation/ProductsPagenation";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import BackArrow from "../../icons/BackArrow";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetBody,
  SheetClose,
} from "@/shared/components/ui/sheet";

const ProductsGrid: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const { filters, setCategory, setPriceRange, setSorting, setColor } =
    useProductFilters();

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const searchQuery = searchParams.get("search") ?? undefined;
  const categoryIdFromUrl = searchParams.get("category_id");

  const mostViewParam = searchParams?.get("is_most_view");
  const isMostViewedActive = mostViewParam === "1" || mostViewParam === "true";
  const onlyDiscountParam = searchParams?.get("only_discount");
  const isOnlyDiscountedActive =
    onlyDiscountParam === "1" || onlyDiscountParam === "true";

  const activeCategoryId = categoryIdFromUrl
    ? Number.parseInt(categoryIdFromUrl)
    : filters.categoryId;

  // Fetch price range from API
  const { data: priceRangeData } = useQuery<{
    min_price: number;
    max_price: number;
  }>({
    queryKey: ["priceRange"],
    queryFn: getPriceRange,
    staleTime: 60000, // Cache for 1 minute
  });

  const { data, isLoading, isFetching, error } = useQuery<
    PaginatedResponse<Product>,
    Error
  >({
    queryKey: [
      "products",
      currentPage,
      filters.sortBy,
      filters.sortOrder,
      filters.categoryId,
      filters.minPrice,
      filters.maxPrice,
      filters.colorId,
      isMostViewedActive,
      isOnlyDiscountedActive,
    ],
    queryFn: () =>
      getProductsPaginated({
        q: searchParams.get("search") ?? undefined,
        page: currentPage,
        sort_by: filters.sortBy,
        sort_order: filters.sortOrder,
        // Respect various query param names used around the app
        only_discount:
          searchParams.get("only_discount") === "1" ||
          searchParams.get("discount") === "1" ||
          searchParams.get("is_discounted") === "1",
        is_most_view:
          searchParams.get("is_most_view") === "1" ||
          searchParams.get("is_most_view") === "true",
        category_id: filters.categoryId,
        color_id: filters.colorId,
        min_price: filters.minPrice,
        max_price: filters.maxPrice,
      }),
    staleTime: 5000,
  });

  const products = data?.data ?? [];
  const totalProducts = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.last_page ?? 1;

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery, activeCategoryId]);

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

  const handleRemoveMostViewed = () => {
    // Redirect to the main products listing (no filters) so user sees all products
    navigate("/products");
  };

  const handleRemoveIsDiscounted = () => {
    // Redirect to the main products listing (no filters) so user sees all products
    navigate("/products");
  };

  return (
    <section className="container md:py-[44px] py-4">
      {/* <h1 className="text-main md:text-[32px] text-2xl font-normal leading-[100%] text-center uppercase font-anton-sc">
        {t("ProductsGrid.title")}
      </h1> */}

      <div className="md:block hidden">
        <Breadcrumbs
          items={[
            { label: t("Navigation.home"), href: "/" },
            { label: t("Products.title") },
          ]}
        />
      </div>

      <Link to="/" className="md:hidden flex items-center gap-2 mb-6">
        <div className="transform ltr:scale-x-100 rtl:scale-x-[-1]">
          <BackArrow />
        </div>
        <h2 className="text-xl font-semibold text-black">
          {t("Navigation.products")}
        </h2>
      </Link>

      {isMostViewedActive && (
        <div className="mt-6 flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-main/10 rounded-full border border-main/30">
            <span className="text-sm font-medium text-main">
              {t("Products.mostViewedProducts")}
            </span>
            <button
              onClick={handleRemoveMostViewed}
              className="hover:bg-main/20 rounded-full p-1 transition-colors"
              aria-label="Remove most viewed filter"
            >
              <X className="w-4 h-4 text-main" />
            </button>
          </div>
        </div>
      )}

      {isOnlyDiscountedActive && (
        <div className="mt-6 flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-main/10 rounded-full border border-main/30">
            <span className="text-sm font-medium text-main">
              {t("Products.bestOffersProducts")}
            </span>
            <button
              onClick={handleRemoveIsDiscounted}
              className="hover:bg-main/20 rounded-full p-1 transition-colors"
              aria-label="Remove discount filter"
            >
              <X className="w-4 h-4 text-main" />
            </button>
          </div>
        </div>
      )}

      <div className="flex lg:flex-row flex-col gap-8 mt-10">
        <div className="md:block hidden">
          <ProductsCategoryFilter setCategory={setCategory} />
          <ProductsPriceFilter
            minPrice={filters.minPrice ?? priceRangeData?.min_price ?? 0}
            maxPrice={filters.maxPrice ?? priceRangeData?.max_price ?? 10000}
            actualMinPrice={priceRangeData?.min_price ?? 0}
            actualMaxPrice={priceRangeData?.max_price ?? 10000}
            setPriceRange={setPriceRange}
          />
          <ProductsColorFilter
            selectedColorId={filters.colorId}
            setColor={setColor}
          />
        </div>

        <div className="w-full">
          <ProductsSorting
            view={view}
            setView={setView}
            setSorting={setSorting}
            displayed={products.length}
            total={totalProducts}
            onFiltersClick={() => setIsFiltersOpen(true)}
          />

          {/* Mobile Filters Sheet */}
          <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <SheetContent side="bottom" className="h-[90vh] flex flex-col">
              <SheetHeader className="flex flex-row items-center justify-between">
                <SheetTitle>{t("Products.filters")}</SheetTitle>
                <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100">
                  <X className="h-6 w-6" />
                  <span className="sr-only">Close</span>
                </SheetClose>
              </SheetHeader>
              <SheetBody className="flex-1 overflow-y-auto">
                <div className="space-y-6">
                  <ProductsCategoryFilter setCategory={setCategory} />
                  <ProductsPriceFilter
                    minPrice={
                      filters.minPrice ?? priceRangeData?.min_price ?? 0
                    }
                    maxPrice={
                      filters.maxPrice ?? priceRangeData?.max_price ?? 10000
                    }
                    actualMinPrice={priceRangeData?.min_price ?? 0}
                    actualMaxPrice={priceRangeData?.max_price ?? 10000}
                    setPriceRange={setPriceRange}
                  />
                  <ProductsColorFilter
                    selectedColorId={filters.colorId}
                    setColor={setColor}
                  />
                </div>
              </SheetBody>
            </SheetContent>
          </Sheet>

          {isFetching && !isLoading && (
            <div className="flex items-center justify-center py-4 mb-4 bg-gray-100 rounded-lg mt-6">
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-main border-t-transparent rounded-full"></div>
                <p className="text-sm text-gray-600">
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

          {!isLoading && products.length > 0 && (
            <>
              <div
                className={`md:mt-12 mt-6 ${
                  view === "grid"
                    ? "grid lg:grid-cols-3 grid-cols-2 gap-6 justify-items-center"
                    : "flex flex-col gap-4"
                }`}
              >
                {products.map((product) =>
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

          {!isLoading && products.length === 0 && (
            <p className="text-center mt-8 text-gray-700">
              {t("ProductsGrid.noProducts")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsGrid;
