"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getColors, Color } from "../../api/getColors";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { ChevronRight, ChevronDown } from "lucide-react";

interface ProductsColorFilterProps {
  selectedColorId?: number;
  setColor: (id?: number) => void;
}

const ProductsColorFilter: React.FC<ProductsColorFilterProps> = ({
  selectedColorId,
  setColor,
}) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as "ar" | "en";
  const [isOpen, setIsOpen] = useState(true);

  const {
    data: colors,
    isLoading,
    isError,
  } = useQuery<Color[], Error>({
    queryKey: ["colors"],
    queryFn: getColors,
    staleTime: 300000, // Cache for 5 minutes
  });

  const handleColorClick = (colorId: number) => {
    if (selectedColorId === colorId) {
      // Deselect if clicking the same color
      setColor(undefined);
    } else {
      setColor(colorId);
    }
  };

  const getColorName = (color: Color): string => {
    if (!color.name) return `Color ${color.id}`;
    if (typeof color.name === "string") return color.name;
    return color.name[locale] || color.name.en || `Color ${color.id}`;
  };

  return (
    <section className="w-[276px] h-auto dark:bg-[#242529] bg-[#FDFDFD] overflow-y-auto mt-6 mx-auto">
      <Accordion
        type="single"
        collapsible
        value={isOpen ? "color-filter" : undefined}
        onValueChange={(val) => setIsOpen(val === "color-filter")}
        className="w-full"
      >
        <AccordionItem value="color-filter" className="border-none">
          <AccordionTrigger className="hover:no-underline [&>svg]:hidden p-0">
            <div className="flex items-center justify-between w-full">
              <h1 className="md:text-2xl text-base font-semibold leading-[100%] p-4 ltr:border-l-4 rtl:border-r-4 border-main">
                {t("Products.color")}
              </h1>
              <div className="ltr:mr-4 rtl:ml-4">
                {isOpen ? (
                  <ChevronDown size={20} className="text-main" />
                ) : (
                  <ChevronRight size={20} className="text-main" />
                )}
              </div>
            </div>
          </AccordionTrigger>

          <div className="w-full h-px dark:bg-[#FDFDFD] bg-[#EAEAEA]"></div>

          <AccordionContent className="p-4">
            {isLoading && (
              <p className="text-sm text-gray-400">{t("Common.loading")}</p>
            )}

            {isError && (
              <p className="text-sm text-red-400">
                {t("Products.failedToLoadColors")}
              </p>
            )}

            {colors && colors.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleColorClick(color.id)}
                    className={`relative w-[36px] h-[35px] rounded-full transition-all ${
                      selectedColorId === color.id
                        ? "ring-2 ring-main ring-offset-2"
                        : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-2"
                    }`}
                    // prefer `special_value` when available (some payloads include the hex here)
                    style={{
                      backgroundColor:
                        color.special_value ?? color.hex_code ?? "#E5E7EB",
                    }}
                    title={getColorName(color)}
                    aria-label={`Select ${getColorName(color)} color`}
                  >
                    {selectedColorId === color.id && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.3333 4L6 11.3333L2.66666 8"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {colors?.length === 0 && (
              <p className="text-sm text-gray-500">
                {t("Products.noColorsAvailable")}
              </p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};

export default ProductsColorFilter;
