"use client";

import { useState } from "react";

export interface ProductFilters {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "id" | "price" | "created_at" | "updated_at";
  sortOrder?: "asc" | "desc";
  onlyDiscount?: boolean;
}

export function useProductFilters() {
  const [filters, setFilters] = useState<ProductFilters>({});

  const setCategory = (categoryId?: number) => {
    setFilters((prev) => ({ ...prev, categoryId }));
  };

  const setPriceRange = (minPrice?: number, maxPrice?: number) => {
    setFilters((prev) => ({ ...prev, minPrice, maxPrice }));
  };

  const setSorting = (sortBy: ProductFilters["sortBy"], sortOrder: ProductFilters["sortOrder"]) => {
    setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
  };

  const toggleDiscountOnly = () => {
    setFilters((prev) => ({ ...prev, onlyDiscount: !prev.onlyDiscount }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  return {
    filters,
    setCategory,
    setPriceRange,
    setSorting,
    toggleDiscountOnly,
    resetFilters,
  };
}
