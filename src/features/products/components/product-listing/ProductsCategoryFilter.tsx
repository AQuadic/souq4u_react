"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Category,
  getCategories,
} from "@/features/categories/api/getCategories";

const ProductsCategoryFilter = ({
  setCategory,
}: {
  setCategory: (id?: number) => void;
}) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category_id");
    const categoryId = categoryFromUrl ? Number(categoryFromUrl) : null;
    setSelectedCategory(categoryId);
  }, [searchParams]);

  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery<Category[], Error>({
    queryKey: ["categories", { parent_only: true, with_children: true }],
    queryFn: () => getCategories({ parent_only: true, with_children: true }),
  });

  const handleClick = (id: number) => {
    setSelectedCategory(id);
    setCategory(id);

    const params = new URLSearchParams(searchParams);
    params.set("category_id", String(id));
    navigate({ search: params.toString() });
  };

  return (
    <section className="w-[276px] h-auto dark:bg-[#242529] bg-[#FDFDFD] overflow-y-auto mx-auto">
      <h1 className="md:text-2xl text-base font-semibold leading-[100%] p-4">
        {t("Products.categories")}
      </h1>
      <div className="w-full h-px dark:bg-[#FDFDFD] bg-[#EAEAEA]"></div>

      <div className="p-2">
        {isLoading && (
          <p className="text-sm text-gray-400">{t("Common.loading")}</p>
        )}
        {isError && <p className="text-sm text-red-400">{error.message}</p>}

        <div className="w-full space-y-1">
          {categories?.map((cat) => {
            const hasChildren = cat.children && cat.children.length > 0;
            const totalCount = hasChildren
              ? cat.children!.reduce(
                  (sum, ch) => sum + (Number(ch.active_products_count) || 0),
                  0
                )
              : Number(cat.active_products_count) || 0;

            if (hasChildren) {
              return (
                <div key={cat.id} className="border-none">
                  <button
                    onClick={() => handleClick(cat.id)}
                    className={`group w-full flex items-center justify-between py-2 px-3 text-sm rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      selectedCategory === cat.id
                        ? "text-main bg-main/10 font-medium"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        {locale === "ar" ? cat.name.ar : cat.name.en}
                      </span>
                    </div>
                    <span className="text-sm">({totalCount})</span>
                  </button>

                  <div className="mt-1 space-y-1 ltr:ml-8 rtl:mr-8 relative">
                    {/* Vertical connecting line */}
                    <div className="absolute ltr:left-[-20px] rtl:right-[-20px] top-0 bottom-[12px] w-px bg-gray-300 dark:bg-gray-600 pointer-events-none"></div>

                    {cat.children!.map((child) => {
                      return (
                        <div key={child.id} className="relative">
                          {/* Curved connector for each item - LTR */}
                          {locale !== "ar" && (
                            <>
                              <svg
                                className="absolute left-[-20px] top-[10px] text-gray-300 dark:text-gray-600"
                                width="20"
                                height="10"
                                viewBox="0 0 20 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M0.5 0 L 0.5 5 Q 0.5 9, 4 9 L 20 9"
                                  stroke="currentColor"
                                  strokeWidth="1"
                                  fill="none"
                                  strokeLinecap="square"
                                />
                              </svg>
                              {/* Arrow - LTR */}
                              <div className="absolute left-[-3px] top-[17px]">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 6 6"
                                  width="5"
                                  height="5"
                                  className="text-gray-300 dark:text-gray-600"
                                  fill="currentColor"
                                >
                                  <polygon points="5,3 0,0 0,6" />
                                </svg>
                              </div>
                            </>
                          )}

                          {/* Curved connector for each item - RTL */}
                          {locale === "ar" && (
                            <>
                              <svg
                                className="absolute right-[-20px] top-[10px] text-gray-300 dark:text-gray-600"
                                width="20"
                                height="10"
                                viewBox="0 0 20 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M19.5 0 L 19.5 5 Q 19.5 9, 16 9 L 0 9"
                                  stroke="currentColor"
                                  strokeWidth="1"
                                  fill="none"
                                  strokeLinecap="square"
                                />
                              </svg>
                              {/* Arrow - RTL */}
                              <div className="absolute right-[-3px] top-[17px]">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 6 6"
                                  width="5"
                                  height="5"
                                  className="text-gray-300 dark:text-gray-600"
                                  fill="currentColor"
                                >
                                  <polygon points="0,3 5,0 5,6" />
                                </svg>
                              </div>
                            </>
                          )}

                          <button
                            onClick={() => handleClick(child.id)}
                            className={`w-full flex items-center justify-between px-3 py-1.5 text-sm rounded-md text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                              selectedCategory === child.id
                                ? "text-main bg-main/10"
                                : ""
                            }`}
                          >
                            <span>
                              {locale === "ar" ? child.name.ar : child.name.en}
                            </span>
                            <span className="text-gray-500 text-xs">
                              ({child.active_products_count})
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }

            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleClick(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  isSelected
                    ? "text-main bg-main/10 font-medium"
                    : "text-gray-700"
                }`}
              >
                <span className="flex items-center gap-2">
                  {locale === "ar" ? cat.name.ar : cat.name.en}
                </span>
                <span className="text-gray-500 text-xs">({totalCount})</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductsCategoryFilter;
