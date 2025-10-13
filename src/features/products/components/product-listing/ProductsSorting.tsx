"use client";

import React from "react";
import GridViewIcon from "../../icons/GridViewIcons";
import ListViewIcon from "../../icons/ListViewIcon";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import ProductsFilter from "../../icons/ProductsFilter";
import { useTranslations } from "next-intl";

interface ProductsSortingProps {
  view: "grid" | "list";
  setView: (view: "grid" | "list") => void;
  setSorting: (
    sortBy: "id" | "price" | "created_at" | "updated_at",
    sortOrder: "asc" | "desc"
  ) => void;
  total?: number;
  displayed?: number;
}

const ProductsSorting: React.FC<ProductsSortingProps> = ({
  view,
  setView,
  setSorting,
  total,
  displayed,
}) => {
  const t = useTranslations("Products");
  const darkMode = document.documentElement.classList.contains("dark");

  const handleSortChange = (value: string) => {
    switch (value) {
      case "default":
        setSorting("updated_at", "desc");
        break;
      case "price-asc":
        setSorting("price", "asc");
        break;
      case "price-desc":
        setSorting("price", "desc");
        break;
      case "newest":
        setSorting("created_at", "desc");
        break;
      default:
        setSorting("updated_at", "desc");
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="md:flex hidden" onClick={() => setView("grid")}>
            <GridViewIcon selected={view === "grid"} darkMode={darkMode} />
          </button>

          <button className="md:flex hidden" onClick={() => setView("list")}>
            <ListViewIcon selected={view === "list"} darkMode={darkMode} />
          </button>

          <div className="md:hidden flex">
            <ProductsFilter />
          </div>

          <Select onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px] h-12 dark:border-[#FDFDFD] border-[#C0C0C0]">
              <SelectValue placeholder={t("defaultSorting")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="default">{t("defaultSorting")}</SelectItem>
                <SelectItem value="price-asc">{t("asc")}</SelectItem>
                <SelectItem value="price-desc">{t("desc")}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <p className="md:flex hidden text-lg font-medium leading-[100%]">
          {t("showingResults", {
            displayed: displayed ?? 0,
            total: total ?? 0,
          })}
        </p>
      </div>

      <div className="md:flex hidden w-full h-px dark:bg-[#FDFDFD] bg-[#EAEAEA] my-4"></div>
    </section>
  );
};

export default ProductsSorting;
