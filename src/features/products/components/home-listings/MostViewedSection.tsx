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

export default MostViewedSection;
