"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import ProductReviewsSummary from "./ProductReviewsSummary";
import ProductReviewsListing from "./ProductReviewsListing";
import { getReviews } from "@/features/products/api/getReviews";
import ReviewsEmptyState from "./ReviewsEmptyState";

interface Props {
  productId: number;
}

const MainProductReviews: React.FC<Props> = ({ productId }) => {
  const { t } = useTranslation();
  const { data } = useQuery({
    queryKey: ["productReviews", productId],
    queryFn: () => getReviews("product", productId),
    staleTime: 1000 * 60 * 5,
  });

  // temporary: log the fetched reviews so the user can tell me the shape
  React.useEffect(() => {
    if (data) console.log("product reviews:", data);
  }, [data]);
  // Normalize possible response shapes into an array of reviews or undefined while loading
  const reviews: unknown[] | undefined = React.useMemo(() => {
    if (!data) return undefined;
    if (Array.isArray(data)) return data as unknown[];
    const asObj = data as Record<string, unknown>;
    if (Array.isArray(asObj.data)) return asObj.data as unknown[];
    if (Array.isArray(asObj.reviews)) return asObj.reviews as unknown[];
    // Not an array response - return empty array to indicate no reviews
    return [];
  }, [data]);

  // If we have loaded and there are no reviews, show an empty state instead of the whole component
  if (reviews && reviews.length === 0) {
    return <ReviewsEmptyState />;
  }

  return (
    <div className="mt-6">
      <h3 className="font-bold text-[32px] mb-4">{t("Products.reviews")}</h3>
      <div className="flex gap-6 max-sm:flex-col">
        <ProductReviewsSummary reviewable_id={productId} />
        <ProductReviewsListing reviews={reviews} />
      </div>
    </div>
  );
};

export default MainProductReviews;
