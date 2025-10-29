"use client";

import React from "react";
import ProductList from "@/features/products/components/ProductList";
import { useTranslation } from "react-i18next";

interface YouMayBeInterestedInProps {
  title?: string;
  maxItems?: number;
}

/**
 * YouMayBeInterestedIn Component - Displays featured products
 *
 * Used in cart and checkout pages to show products the user might be interested in.
 * Reuses the unified ProductList component with custom theme for cart context.
 */
export const YouMayBeInterestedIn: React.FC<YouMayBeInterestedInProps> = ({
  title,
  maxItems = 4,
}) => {
  const { t } = useTranslation();
  const displayTitle = title || t("Cart.youMayBeInterestedIn");

  return (
    <div className="mt-12">
      <ProductList
        title={displayTitle}
        titleAlign="left"
        maxItems={maxItems}
        skeletonCount={maxItems}
        queryParams={{
          // Use server-side normal pagination
          pagination: "normal",
          page: 1,
          per_page: maxItems,
          sort_by: "created_at",
          sort_order: "desc",
          is_featured: 1,
        }}
        queryKey={["products", "featured"]}
        onlyFeatured={true}
        viewAllLink={null}
        showTopRated={true}
        showSection={false}
        emptyMessageKey="noRecommendationsAvailable"
        theme={{
          containerClassName: "",
          titleClassName: " text-xl font-semibold mb-6",
          gridClassName: "lg:grid-cols-4 grid-cols-2",
          gapClassName: "gap-6",
          errorClassName: "text-white/60 text-center",
        }}
      />
    </div>
  );
};
