"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  Category,
  getCategories,
} from "@/features/categories/api/getCategories";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { ChevronRight, ChevronDown } from "lucide-react";
import FilterArow from "../../icons/FilterArow";

const ProductsCategoryFilter = ({
  setCategory,
}: {
  setCategory: (id?: number) => void;
}) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language
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

  return (
    <section className="w-[276px] h-auto dark:bg-[#242529] bg-[#FDFDFD] overflow-y-auto mx-auto">
      <h1 className="md:text-2xl text-base font-semibold leading-[100%] p-4 ltr:border-l-4 rtl:border-r-4  border-main">
        {t("categories")}
      </h1>
      <div className="w-full h-px dark:bg-[#FDFDFD] bg-[#EAEAEA]"></div>

      <div className="p-2">
        {isLoading && <p className="text-sm text-gray-400">{t("loading")}</p>}
        {isError && <p className="text-sm text-red-400">{error.message}</p>}

        <Accordion
          type="single"
          collapsible
          value={openItem ?? undefined}
          onValueChange={(val) => setOpenItem(val)}
          className="w-full space-y-1"
        >
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
                <AccordionItem
                  key={cat.id}
                  value={`cat-${cat.id}`}
                  className="border-none"
                >
                  <AccordionTrigger
                    className={`group flex items-center justify-between py-2 px-3 text-sm rounded-md ${
                      openItem === `cat-${cat.id}` ? "bg-main text-white" : ""
                    } [&>svg]:hidden`} 
                  >
                    <div className="flex items-center gap-2">
                      <div className="md:hidden flex">
                        {openItem === `cat-${cat.id}` ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                      </div>
                      <span className="flex items-center gap-1">
                        <div className="md:flex hidden">
                        <FilterArow />
                      </div>
                        {locale === "ar" ? cat.name.ar : cat.name.en}
                      </span>
                    </div>
                    <span className=" text-sm">({totalCount})</span>
                  </AccordionTrigger>

              <AccordionContent className="mt-1 space-y-1 ltr:ml-6 rtl:mr-6">
                    {cat.children!.map((child, index) => {
                      const isSelected = selectedCategory === child.id;
                      const isLast = index === cat.children!.length - 1;
                      return (
                        <div key={child.id} className="relative">
                          {/* Connecting line */}
                          <div className="absolute ltr:left-[-16px] rtl:right-[-16px] top-0 bottom-0 flex items-start">
                            <div className="relative h-full">
                              {/* Vertical line */}
                              {!isLast && (
                                <div className="absolute ltr:left-0 rtl:right-0 top-0 bottom-0 w-px bg-gray-600"></div>
                              )}
                              {/* Horizontal line with corner */}
                              <div className="absolute ltr:left-0 rtl:right-0 top-3 flex items-center">
                                <div className="w-4 h-px bg-gray-600"></div>
                              </div>
                              {/* Corner for last item */}
                              {isLast && (
                                <div className="absolute ltr:left-0 rtl:right-0 top-0 h-3 w-px bg-gray-600"></div>
                              )}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleClick(child.id)}
                            className={`w-full flex items-center justify-between px-3 py-1 text-sm rounded-md text-left transition ${
                              isSelected
                                ? "text-main"
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
                  </AccordionContent>
                </AccordionItem>
              );
            }

            return (
              <button
                key={cat.id}
                onClick={() => handleClick(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition ${
                  selectedCategory === cat.id
                    ? "text-main"
                    : "text-text-gray-300"
                }`}
              >
                <span className="flex items-center gap-2">
                  <div className="md:flex hidden">
                      <FilterArow />
                    </div>
                  {locale === "ar" ? cat.name.ar : cat.name.en}
                </span>
                <span className="text-text-gray-300 text-xs">({totalCount})</span>
              </button>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
};

export default ProductsCategoryFilter;
