"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  Category,
  getCategories,
} from "@/features/categories/api/getCategories";
import { ChevronRight, ChevronDown } from "lucide-react";

interface ProductsCategoryFilterProps {
  setCategory: (id: number) => void;
}

const ProductsCategoryFilter: React.FC<ProductsCategoryFilterProps> = ({ setCategory }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [openItem, setOpenItem] = useState<string | null>(null);

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
  };

  const toggleItem = (val: string) => {
    setOpenItem(openItem === val ? null : val);
  };

  return (
    <section className="w-[276px] h-auto dark:bg-[#242529] bg-[#FDFDFD] overflow-y-auto mx-auto">
      <h1 className="md:text-2xl text-base font-semibold leading-[100%] p-4 ltr:border-l-4 rtl:border-r-4 border-main">
        {t("Products.categories")}
      </h1>
      <div className="w-full h-px dark:bg-[#FDFDFD] bg-[#EAEAEA]"></div>

      <div className="p-2">
        {isLoading && <p className="text-sm text-gray-400">{t("loading")}</p>}
        {isError && <p className="text-sm text-red-400">{error.message}</p>}

        <div className="w-full space-y-1">
          {categories?.map((cat) => {
            const hasChildren = (cat.children?.length ?? 0) > 0;
            const totalCount = hasChildren
              ? cat.children?.reduce(
                  (sum, ch) => sum + (Number(ch.active_products_count) || 0),
                  0
                ) ?? 0
              : Number(cat.active_products_count) || 0;

            if (hasChildren) {
              return (
                <div key={cat.id} className="border-none">
                  <button
                    onClick={() => toggleItem(`cat-${cat.id}`)}
                    className="group flex items-center justify-between py-2 px-2 text-sm rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 w-full"
                  >
                    <div className="flex items-center gap-2">
                      <div>
                        {openItem === `cat-${cat.id}` ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </div>
                      <span className="flex items-center gap-1">
                        {locale === "ar" ? cat.name.ar : cat.name.en}
                      </span>
                    </div>
                    <span className="text-sm">({totalCount})</span>
                  </button>

                  {openItem === `cat-${cat.id}` && (
                    <div className="mt-1 space-y-1 ltr:ml-8 rtl:mr-8 relative">
                      <div className="absolute ltr:left-[-20px] rtl:right-[-20px] top-0 bottom-[35px] w-px bg-gray-300 dark:bg-gray-600 pointer-events-none"></div>

                      {cat.children?.map((child) => {
                        const isSelected = selectedCategory === child.id;
                        return (
                          <div key={child.id} className="relative">
                            {/* Curved connector */}
                            <div className="absolute ltr:left-[-20px] rtl:right-[-20px] top-[6px]">
                              <svg
                                width="24"
                                height="20"
                                viewBox="0 0 24 20"
                                className="text-gray-300 dark:text-gray-600"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                {locale === "ar" ? (
                                  <path
                                    d="M24 2 Q 16 10, 8 14 L 0 14"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    fill="none"
                                  />
                                ) : (
                                  <path
                                    d="M0 2 Q 8 10, 16 14 L 24 14"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    fill="none"
                                  />
                                )}
                              </svg>
                              <div className="absolute top-[10px] ltr:right-[-4px] rtl:left-[-4px] rotate-[10deg]">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 8 8"
                                  width="8"
                                  height="8"
                                  className="text-gray-300 dark:text-gray-600"
                                  fill="currentColor"
                                >
                                  {locale === "ar" ? (
                                    <path d="M6 0L0 4l6 4V0z" />
                                  ) : (
                                    <path d="M2 0L8 4l-6 4V0z" />
                                  )}
                                </svg>
                              </div>
                            </div>

                            <button
                              onClick={() => handleClick(child.id)}
                              className={`w-full flex items-center justify-between mx-2 px-3 py-1.5 text-sm rounded-md text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                                isSelected ? "text-main bg-main/10" : ""
                              }`}
                            >
                              <span>
                                {locale === "ar"
                                  ? child.name.ar
                                  : child.name.en}
                              </span>
                              <span className="text-gray-500 text-xs">
                                ({child.active_products_count})
                              </span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

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
                {locale === "ar" ? cat.name.ar : cat.name.en}
              </span>
              <span className="text-gray-500 text-xs">({totalCount})</span>
              </button>
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductsCategoryFilter;
