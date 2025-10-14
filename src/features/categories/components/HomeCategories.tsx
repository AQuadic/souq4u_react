"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/getCategories";
import { useTranslation } from "react-i18next";

const HomeCategories = () => {
  const { t, i18n } = useTranslation("Home");
  const locale = i18n.language || "en";
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await getCategories(),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h3 className="font-bold text-2xl sm:text-3xl mb-6">{t("categories")}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 place-items-center">
        {categories?.map((category) => (
          <button
            key={category.id}
            // onClick={() => router.push(`/products?category_id=${category.id}`)}
            className="flex flex-col items-center group"
          >
            <div className="w-[122px] h-[122px] rounded-full overflow-hidden bg-gray-100 shadow-md transition-transform duration-300 group-hover:scale-105">
              <img
                src={"/categories/category-placeholder.jpg"}
                alt={category.name[locale as "en" | "ar"] || category.name.en}
                width={122}
                height={122}
                className="object-cover w-full h-full"
              />
            </div>
            <p className="mt-3 text-center text-sm sm:text-base font-medium text-gray-800">
              {category.name[locale as "en" | "ar"] || category.name.en}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomeCategories;
