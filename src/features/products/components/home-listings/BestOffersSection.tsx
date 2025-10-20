"use client";
import React from "react";
import ProductList from "../ProductList";
import { useTranslation } from "react-i18next";

/**
 * BestOffersSection Component - Displays products with best discounts
 *
 * Shows 8 products with active discounts sorted by discount percentage
 */
const BestOffersSection = () => {
  const { t } = useTranslation();
  return (
    <ProductList
      titleKey={t("Products.bestOffers")}
      titleAlign="center"
      maxItems={8}
      queryParams={{
        sort_by: "updated_at",
        sort_order: "desc",
        only_discount: 1,
      }}
      theme={{
        gridClassName: "xl:grid-cols-4 grid-cols-2",
      }}
      onlyDiscounted={true}
      viewAllLink="/products?is_discounted=1"
      viewAllTextKey={t("Products.viewAllProducts")}
      showTopRated={true}
      
    />
  );
};

export default BestOffersSection;
