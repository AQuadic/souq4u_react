"use client";
import React from "react";
import ProductList from "../ProductList";
import { useTranslation } from "react-i18next";

/**
 * MostViewedSection Component - Displays most viewed products
 *
 * Shows 8 products sorted by view count or featured status
 * Note: If backend supports a "views" field, update sort_by accordingly
 */
const MostViewedSection = () => {
  const { t } = useTranslation();
  return (
    <ProductList
      titleKey={t("Products.mostViewed")}
      titleAlign="center"
      maxItems={8}
      queryParams={{ per_page: 8, is_most_view: true }}
      viewAllLink="/products"
      viewAllTextKey={t("Products.viewAllProducts")}
    />
  );
};

export default MostViewedSection;
