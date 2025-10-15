"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getFavorites,
  ApiFavoriteItem,
} from "@/features/profile/favorites/api/getFavorites";
import ProductCard from "@/features/products/components/ProductCard";
import { Product } from "@/features/products/api/getProduct";
import { useTranslation } from "react-i18next";

const SavedForLater = () => {
  const { t } = useTranslation("Cart");

  const { data, isLoading, isError } = useQuery<ApiFavoriteItem[]>({
    queryKey: ["favorites"],
    queryFn: getFavorites,
  });

  if (isLoading)
    return (
      <div className="text-center py-10">{t("loading") || "Loading..."}</div>
    );

  if (isError)
    return (
      <div className="text-center text-red-500">
        {t("error") || "Failed to load favorites"}
      </div>
    );

  const favorites: ApiFavoriteItem[] = data || [];

  if (favorites.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">{t("savedForLater")}</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map((fav: ApiFavoriteItem) => {
          const f = fav.favorable;

          // Build a minimal Product object from the favorite response.
          const normalizedProduct: Product = {
            id: f.id,
            name: f.name,
            short_description: f.short_description,
            images: f.image?.url
              ? [
                  {
                    id: fav.id,
                    uuid: "",
                    size: 0,
                    url: f.image.url,
                    responsive_urls: [f.image.url],
                    is_active: 1,
                  },
                ]
              : [],
            is_active: 1,
            created_at: "",
            updated_at: "",
            is_favorite: true,
            variants: [
              {
                id: f.id,
                product_id: f.id,
                sku: "",
                price: 0,
                final_price: 0,
                has_discount: false,
                is_stock: true,
                stock: 0,
                attributes: [],
              },
            ],
          };

          return <ProductCard key={fav.id} product={normalizedProduct} />;
        })}
      </div>
    </div>
  );
};

export default SavedForLater;
