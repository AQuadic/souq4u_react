"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories, Category } from "../api/getCategories";
import { useTranslation } from "react-i18next";
import { getTranslatedText } from "@/shared/utils/translationUtils";
import { useNavigate } from "react-router-dom";

const HomeCategories = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "en";
  const navigate = useNavigate();
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories", { parent_only: true, with_children: false }],
    queryFn: () =>
      getCategories({ parent_only: true, with_children: false }),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h3 className="font-bold text-2xl sm:text-3xl mb-6">
        {t("Home.categories")}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 place-items-center">
        {categories?.map((category) => (
          <button
            key={category.id}
            onClick={() => navigate(`/products?category_id=${category.id}`)}
            className="flex flex-col items-center group"
          >
            <div className="w-[122px] h-[122px] rounded-full overflow-hidden bg-gray-100 shadow-md transition-transform duration-300 group-hover:scale-105">
              <img
                src={
                  category.image?.url || "/categories/category-placeholder.jpg"
                }
                alt={getTranslatedText(category.name, locale, "category")}
                width={122}
                height={122}
                className="object-cover w-full h-full"
              />
            </div>
            <p className="mt-3 text-center text-sm sm:text-base font-medium text-gray-800">
              {getTranslatedText(category.name, locale, "")}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomeCategories;
