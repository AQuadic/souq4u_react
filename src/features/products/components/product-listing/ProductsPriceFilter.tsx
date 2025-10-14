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
  // minPrice = 0,
  // maxPrice = 10000,
  // actualMinPrice,
  // actualMaxPrice,
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

  // Force slider to a fixed 0 - 10_000 range (ignore API-provided min/max which may be incorrect)
  const SLIDER_MIN = 0;
  const SLIDER_MAX = 10000;

  const [localRange, setLocalRange] = useState<[number, number]>([
    SLIDER_MIN,
    SLIDER_MAX,
  ]);

  // Keep slider bounds constant regardless of API values
  const sliderMin = SLIDER_MIN;
  const sliderMax = SLIDER_MAX;

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
      <h1 className="text-2xl font-semibold leading-[100%] p-4 ltr:border-l-4 rtl:border-r-4 border-main">
        {t("ProductsGrid.filterByPrice")}
      </h1>
      <div className="w-full h-px bg-[#FDFDFD]"></div>
      <div className="p-4">
        <div className="mt-4">
          <Slider
            dir={isRtl ? "rtl" : "ltr"}
            min={sliderMin}
            max={sliderMax}
            step={100}
            value={localRange}
            onValueChange={handleChange}
          />
        </div>
        <p className="text-xs font-medium leading-[100%] mt-4">
          {t("ProductsGrid.price")} {localRange[0]} - {localRange[1]}{" "}
          {t("ProductsGrid.egp")}
        </p>
      </div>
    </section>
  );
};

export default ProductsPriceFilter;
