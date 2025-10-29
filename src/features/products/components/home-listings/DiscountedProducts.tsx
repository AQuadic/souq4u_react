"use client";
import React from "react";
import ProductList from "../ProductList";

/**
 * DiscountedProducts Component - Displays products with active discounts
 *
 * Reuses the unified ProductList component with filtering for products
 * that have variants with discounts.
 */
const DiscountedProducts = () => {
  return (
    <ProductList
      titleKey="discountedProducts"
      titleAlign="center"
      queryParams={{}}
      onlyDiscounted={false}
      viewAllLink="/products"
      viewAllTextKey="viewAllProducts"
      showTopRated={true}
    />
  );
};

export default DiscountedProducts;
