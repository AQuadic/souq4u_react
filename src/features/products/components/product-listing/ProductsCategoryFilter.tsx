"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  Category,
  getCategories,
} from "@/features/categories/api/getCategories";
import FilterArow from "../../icons/FilterArow";
import { useTranslatedText } from "@/shared/utils/translationUtils";

interface CategoryItemProps {
  cat: Category;
  isActive: boolean;
  onClick: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  cat,
  isActive,
  onClick,
}) => {
  const categoryName = useTranslatedText(cat.name, "Category");

  return (
    <div
      key={cat.id}
      className={`flex items-center justify-between cursor-pointer px-2 py-1 rounded ${
        isActive ? "bg-main text-white" : ""
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex items-center gap-1">
        <FilterArow />
        <p className="text-sm font-medium leading-[100%]">{categoryName}</p>
      </div>
      <p className="text-base font-medium leading-[100%]">
        ({cat.active_products_count})
      </p>
    </div>
  );
};

const ProductsCategoryFilter = ({
  setCategory,
}: {
  setCategory: (id?: number) => void;
}) => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery<Category[], Error>({
    queryKey: ["categories", { parent_only: true }],
    queryFn: () => getCategories({}),
  });

  const handleClick = (id: number) => {
    setSelectedCategory(id);
    setCategory(id);
  };

  return (
    <section className="w-[276px] h-auto dark:bg-[#242529] bg-[#FDFDFD] overflow-y-auto mx-auto">
      <h1 className="text-2xl font-semibold leading-[100%] p-4 ltr:border-l-4 rtl:border-r-4  border-main">
        {t("ProductsGrid.categories")}
      </h1>
      <div className="w-full h-px bg-[#FDFDFD]"></div>

      <div className="p-4 space-y-4">
        {isLoading && (
          <p className="text-sm text-gray-400">{t("Common.loading")}</p>
        )}
        {isError && <p className="text-sm text-red-400">{error.message}</p>}

        {categories?.map((cat) => (
          <CategoryItem
            key={cat.id}
            cat={cat}
            isActive={selectedCategory === cat.id}
            onClick={() => handleClick(cat.id)}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductsCategoryFilter;
