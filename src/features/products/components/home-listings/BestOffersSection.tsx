"use client";
import React from "react";
import ProductList from "../ProductList";

/**
 * BestOffersSection Component - Displays products with best discounts
 *
 * Shows 8 products with active discounts sorted by discount percentage
 */
const BestOffersSection = () => {
  return (
    <ProductList
      titleKey="bestOffers"
      titleAlign="center"
      maxItems={8}
      queryParams={{}} // Temporarily removed all params
      onlyDiscounted={false} // Temporarily disabled filtering
      viewAllLink="/products"
      viewAllTextKey="viewAllProducts"
    />
  );
};

export default BestOffersSection;
