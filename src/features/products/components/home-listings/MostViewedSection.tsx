"use client";
import React from "react";
import ProductList from "../ProductList";

/**
 * MostViewedSection Component - Displays most viewed products
 *
 * Shows 8 products sorted by view count or featured status
 * Note: If backend supports a "views" field, update sort_by accordingly
 */
const MostViewedSection = () => {
  return (
    <ProductList
      titleKey="mostViewed"
      titleAlign="center"
      maxItems={8}
      queryParams={{}} // Temporarily removed all params
      viewAllLink="/products"
      viewAllTextKey="viewAllProducts"
    />
  );
};

export default MostViewedSection;
