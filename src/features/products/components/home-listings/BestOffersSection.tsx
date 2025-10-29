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
      // Request 8 items per page for home section
      queryParams={{ per_page: 8 }}
      onlyDiscounted={false}
      viewAllLink="/products"
      viewAllTextKey={t("Products.viewAllProducts")}
    />
  );
};

export default BestOffersSection;
