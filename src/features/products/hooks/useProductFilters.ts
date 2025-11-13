"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export interface ProductFilters {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  colorId?: number;
  sortBy?: "id" | "price" | "created_at" | "updated_at";
  sortOrder?: "asc" | "desc";
  onlyDiscount?: boolean;
  is_most_view?: boolean;
}

export function useProductFilters() {
  const [filters, setFilters] = useState<ProductFilters>({});
  const { search, pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const categoryId = params.get("category_id")
      ? Number(params.get("category_id"))
      : undefined;

    const isMostView = params.get("is_most_view") === "true";

    setFilters((prev) => ({
      ...prev,
      categoryId,
      is_most_view: isMostView,
    }));
  }, [search]);

  const setCategory = (categoryId?: number) => {
    setFilters((prev) => ({ ...prev, categoryId }));

    const params = new URLSearchParams(search);
    if (categoryId) {
      params.set("category_id", categoryId.toString());
    } else {
      params.delete("category_id");
    }

    navigate(`${pathname}?${params.toString()}`, { replace: false });
  };

  const setPriceRange = (minPrice?: number, maxPrice?: number) => {
    setFilters((prev) => ({ ...prev, minPrice, maxPrice }));
  };

  const setColor = (colorId?: number) => {
    setFilters((prev) => ({ ...prev, colorId }));
  };

  const setSorting = (
    sortBy: ProductFilters["sortBy"],
    sortOrder: ProductFilters["sortOrder"]
  ) => {
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
    setColor,
    setSorting,
    toggleDiscountOnly,
    resetFilters,
  };
}
