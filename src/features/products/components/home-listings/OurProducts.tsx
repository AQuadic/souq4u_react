"use client";
import React from "react";
import ProductList from "../ProductList";

/**
 * OurProducts Component - Displays all products sorted by update date
 *
 * Reuses the unified ProductList component with specific configuration
 * for displaying all products on the home page.
 */
const OurProducts = () => {
  return (
    <ProductList
      titleKey="title"
      titleAlign="center"
      queryParams={{}}
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
