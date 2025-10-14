"use client";
import React from "react";
import ProductList from "../ProductList";
import { useConfig } from "@/features/config";

/**
 * OurProducts Component - Displays all products sorted by update date
 *
 * Reuses the unified ProductList component with specific configuration
 * for displaying all products on the home page.
 */
const OurProducts = () => {
  const config = useConfig();
  if (config?.store_type === "Clothes") return null;
  return (
    <ProductList
      titleKey="title"
      titleAlign="center"
      queryParams={{}} // Temporarily removed all params
      viewAllLink="/products"
      viewAllTextKey="viewAllProducts"
      showTopRated={true}
      theme={{
        gridClassName: "xl:grid-cols-4",
      }}
    />
  );
};

export default OurProducts;
