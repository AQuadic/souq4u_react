"use client";
import React from "react";
import ProductList from "../ProductList";
import { useConfig } from "@/features/config";

/**
 * DiscountedProducts Component - Displays products with active discounts
 *
 * Reuses the unified ProductList component with filtering for products
 * that have variants with discounts.
 */
const DiscountedProducts = () => {
  const config = useConfig();
  return (
    <ProductList
      titleKey="discountedProducts"
      titleAlign={config?.store_type === "Clothes" ? "left" : "center"}
      queryParams={{}} // Temporarily removed all params
      theme={
        config?.store_type === "Clothes"
          ? { titleClassName: "font-poppins text-[32px] font-bold" }
          : undefined
      }
      onlyDiscounted={false} // Temporarily disabled filtering
      viewAllLink="/products"
      viewAllTextKey="viewAllProducts"
      showTopRated={true}
    />
  );
};

export default DiscountedProducts;
