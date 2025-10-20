"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  Category,
  getCategories,
} from "@/features/categories/api/getCategories";
import FilterArow from "../../icons/FilterArow";

const ProductsCategoryFilter = ({
  setCategory,
}: {
  setCategory: (id?: number) => void;
}) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: () => getCategories({ with_children: false }),
  });

  const handleClick = (id: number) => {
    setSelectedCategory(id);
    setCategory(id);
  };

  return (
    <section className="w-[276px] h-auto dark:bg-[#242529] bg-[#FDFDFD] overflow-y-auto mx-auto">
      <h1 className="md:text-2xl text-base font-semibold leading-[100%] p-4 ltr:border-l-4 rtl:border-r-4 border-main">
        {t("categories")}
      </h1>
      <div className="w-full h-px dark:bg-[#FDFDFD] bg-[#EAEAEA]"></div>

      <div className="p-2">
        {isLoading && <p className="text-sm text-gray-400">{t("loading")}</p>}
        {isError && <p className="text-sm text-red-400">{error.message}</p>}

          {categories?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleClick(cat.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition ${
                selectedCategory === cat.id
                  ? "text-main font-semibold"
                  : "text-gray-700"
              }`}
            >
              <span className="flex items-center gap-2">
                <div className="md:flex hidden">
                  <FilterArow />
                </div>
                {locale === "ar" ? cat.name.ar : cat.name.en}
              </span>
              <span className="text-gray-400 text-xs">
                ({cat.active_products_count})
              </span>
            </button>
          ))
        }
      </div>
    </section>
  );
};

export default ProductsCategoryFilter;
