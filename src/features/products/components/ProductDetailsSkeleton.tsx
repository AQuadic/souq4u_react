"use client";

import React from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";

/**
 * Skeleton placeholder for the product details page.
 * Kept in a separate file to follow best-practices and reusability.
 */
const ProductDetailsSkeleton: React.FC = () => {
  const [isRtl, setIsRtl] = React.useState(false);

  React.useEffect(() => {
    const dir =
      typeof document !== "undefined"
        ? document.documentElement.dir || document.body.dir
        : undefined;
    setIsRtl(Boolean(dir && dir.toLowerCase() === "rtl"));
  }, []);

  return (
    <div className="container md:py-12">
      <div className="animate-pulse">
        {/* Breadcrumb / small header */}
        <div className="mb-6">
          <Skeleton className="h-4 w-40 md:w-60" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Left: product image */}
          <div className="w-full relative">
            <Skeleton className="w-full h-[420px] md:h-[590px] rounded-2xl" />

            {/* Favorite / quick actions (rtl-aware) */}
            <div
              className={`absolute top-6 ${isRtl ? "left-6" : "right-6"} z-10`}
            >
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>

            {/* Thumbnails column on md (simulated) */}
            <div className="hidden md:flex flex-col gap-4 absolute left-0 top-8">
              <Skeleton className="h-20 w-20 rounded-lg" />
              <Skeleton className="h-20 w-20 rounded-lg" />
              <Skeleton className="h-20 w-20 rounded-lg" />
            </div>
          </div>

          {/* Right: product info */}
          <div className="w-full space-y-6">
            <div className="space-y-3">
              {/* Category */}
              <Skeleton className="h-4 w-16" />

              {/* Title */}
              <Skeleton className="h-12 w-3/4 md:w-2/3" />

              {/* Rating + reviews */}
              <div
                className={`flex items-center gap-4 ${
                  isRtl ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex items-center gap-2">
                  {/* simulate 5 small star boxes */}
                  <Skeleton className="h-4 w-4 rounded-sm" />
                  <Skeleton className="h-4 w-4 rounded-sm" />
                  <Skeleton className="h-4 w-4 rounded-sm" />
                  <Skeleton className="h-4 w-4 rounded-sm" />
                  <Skeleton className="h-4 w-4 rounded-sm" />
                </div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>

              {/* Short description */}
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-8/12" />
                <Skeleton className="h-4 w-9/12" />
              </div>
            </div>

            {/* Result / highlight */}
            <div className="pt-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            {/* Price block */}
            <div className="pt-4">
              <div className="flex items-end gap-4 md:items-center md:gap-6">
                <Skeleton className="h-16 w-40 rounded-md" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-7 w-12 rounded-full" />
                </div>
              </div>
              <div className="mt-2">
                <Skeleton className="h-4 w-32" />
              </div>
            </div>

            {/* Size selector */}
            <div>
              <div className="flex gap-3 items-center flex-wrap">
                <Skeleton className="h-10 w-24 rounded-md" />
                <Skeleton className="h-10 w-24 rounded-md" />
                <Skeleton className="h-10 w-24 rounded-md" />
              </div>
            </div>

            {/* Quantity + Add to cart row */}
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Skeleton className="h-12 w-36 rounded-md" />
              <Skeleton className="h-14 w-full md:w-[320px] rounded-md" />
              <div className="hidden md:block">
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
