"use client";

import { Slider } from "@/shared/components/ui/slider";
import { useTranslation } from "react-i18next";
import React, { useRef, useEffect, useState } from "react";

interface Props {
  minPrice?: number;
  maxPrice?: number;
  actualMinPrice: number;
  actualMaxPrice: number;
  setPriceRange: (min: number, max: number) => void;
}

const ProductsPriceFilter: React.FC<Props> = ({
  minPrice = 0,
  maxPrice = 10000,
  actualMinPrice,
  actualMaxPrice,
  setPriceRange,
}) => {
  const { t } = useTranslation();
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      setIsRtl(document.documentElement.lang?.startsWith("ar") ?? false);
    }
  }, []);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [localRange, setLocalRange] = useState<[number, number]>([
    minPrice ?? actualMinPrice,
    maxPrice ?? actualMaxPrice,
  ]);
  useEffect(() => {
    setLocalRange([minPrice ?? actualMinPrice, maxPrice ?? actualMaxPrice]);
  }, [minPrice, maxPrice, actualMinPrice, actualMaxPrice]);

  const handleChange = (value: [number, number]) => {
    setLocalRange(value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setPriceRange(value[0], value[1]);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <section className="w-[276px] h-[156px] dark:bg-[#242529] bg-[#FDFDFD] overflow-y-auto mt-6 mx-auto">
      <h1 className="md:text-2xl text-base font-semibold leading-[100%] p-4">
        {t("ProductsGrid.filterByPrice")}
      </h1>
      <div className="w-full h-px bg-[#FDFDFD]"></div>
      <div className="p-4">
        <div className="mt-4">
          <Slider
            dir={isRtl ? "rtl" : "ltr"}
            min={actualMinPrice}
            max={actualMaxPrice}
            step={1}
            value={localRange}
            onValueChange={handleChange}
          />
        </div>
        <p className="flex justify-between text-xs font-medium leading-[100%] mt-4">
          <span className="text-[#5D5D5D]">
            {t("ProductsGrid.from")} {localRange[0].toLocaleString()}{" "}
            {t("ProductsGrid.egp")}
          </span>
          <span className="text-[#5D5D5D]">
            {t("ProductsGrid.to")}{" "}
            <span className="text-main">{localRange[1].toLocaleString()}</span>{" "}
            {t("ProductsGrid.egp")}
          </span>
        </p>
      </div>
    </section>
  );
};

export default ProductsPriceFilter;
