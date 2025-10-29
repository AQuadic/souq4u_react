"use client";
import React from "react";
import ProductList from "../ProductList";

/**
 * BestSeller Component - Displays best selling products
 *
 * Reuses the unified ProductList component with specific theming.
 */
const BestSeller = () => {
  return (
    <ProductList
      titleKey="bestSellers"
      titleAlign="center"
      queryParams={{ per_page: 8 }}
      onlyDiscounted={false}
      viewAllLink="/products"
      viewAllTextKey="viewAllProducts"
    />
  );
};

export default BestSeller;
