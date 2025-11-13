"use client";

import React from "react";
import { useTranslation } from "react-i18next";
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
import FilterIcon from "../../icons/FilterIcon";

interface ProductsSortingProps {
  view: "grid" | "list";
  setView: (view: "grid" | "list") => void;
  setSorting: (
    sortBy: "id" | "price" | "created_at" | "updated_at",
    sortOrder: "asc" | "desc"
  ) => void;
  total?: number;
  displayed?: number;
  onFiltersClick?: () => void;
}

const ProductsSorting: React.FC<ProductsSortingProps> = ({
  view,
  setView,
  setSorting,
  onFiltersClick,
  total,
  displayed,
}) => {
  const { t } = useTranslation();
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

          <button
            className="md:hidden flex items-center"
            onClick={onFiltersClick}
            aria-label="Open filters"
          >
            <FilterIcon />
          </button>

          <Select onValueChange={handleSortChange}>
            <SelectTrigger className="w-full h-12 dark:border-[#FDFDFD] border-[#C0C0C0]">
              <SelectValue placeholder={t("ProductsGrid.defaultSorting")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="default">
                  {t("ProductsGrid.defaultSorting")}
                </SelectItem>
                <SelectItem value="price-asc">
                  {t("ProductsGrid.asc")}
                </SelectItem>
                <SelectItem value="price-desc">
                  {t("ProductsGrid.desc")}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <p className="md:flex hidden text-lg font-medium leading-[100%]">
          {t("Products.showingResults", {
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
