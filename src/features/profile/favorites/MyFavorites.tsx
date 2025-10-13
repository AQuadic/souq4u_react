"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ProductCard from "@/features/products/components/ProductCard";
import { getFavorites } from "../favorites/api/getFavorites";
import { Product } from "@/features/products/api/getProduct";
import FavEmptyState from "./FavEmptyState";
import Link from "next/link";
import BackArrow from "@/features/products/icons/BackArrow";

export interface ApiFavoriteItem {
  id: number;
  user_id: number;
  favorable_type: string;
  favorable_id: number;
  favorable: {
    id: number;
    name: { ar: string; en: string };
    short_description: { ar: string; en: string };
    image?: { url: string };
  };
  created_at: string;
  updated_at: string;
}

const MyFavorites = () => {
  const [localFavData, setLocalFavData] = useState<ApiFavoriteItem[] | null>(
    null
  );
  const queryClient = useQueryClient();

  const {
    data: favData = [],
    isLoading,
    isError,
  } = useQuery<ApiFavoriteItem[]>({
    queryKey: ["favorites"],
    queryFn: getFavorites,
  });

  const t = useTranslations("Profile");

  // Keep a local copy of favorites so we can remove items from the UI immediately
  useEffect(() => {
    if (favData) setLocalFavData(favData);
  }, [favData]);

  const handleToggleFavorite = (productId: number) => {
    // Remove the item locally (favorites page should remove unfavourited items)
    setLocalFavData((prev) => {
      if (!prev) return prev;
      const next = prev.filter((item) => item.favorable.id !== productId);
      // Keep react-query cache in sync
      queryClient.setQueryData<ApiFavoriteItem[] | undefined>(
        ["favorites"],
        next
      );
      return next;
    });
  };

  if (isLoading) return <FavEmptyState />;
  if (isError) return <div>Error loading favorites.</div>;

  const sourceFavs = localFavData ?? favData;

  if (!sourceFavs || sourceFavs.length === 0) {
    return (
      <div>
        <h2 className="text-[32px] font-bold mb-6">{t("favorites")}</h2>
        <FavEmptyState />
      </div>
    );
  }

  const products: Product[] = sourceFavs.map((item) => {
    const fav = item.favorable;
    return {
      id: fav.id,
      name: fav.name,
      short_description: fav.short_description,
      images: fav.image
        ? [
            {
              id: fav.id,
              uuid: "dummy-uuid",
              url: fav.image.url,
              size: 0,
              responsive_urls: [],
              is_active: 1,
            },
          ]
        : [],
      variants: [
        {
          id: fav.id,
          product_id: fav.id,
          sku: `SKU-${fav.id}`,
          final_price: 100,
          price: 120,
          has_discount: true,
          discount_percentage: 20,
          // Mark a favorite-derived variant as in-stock so product cards don't
          // treat the product as out-of-stock (the UI treats missing/false
          // `is_stock` or undefined `stock` as unavailable).
          is_stock: true,
          stock: 1,
        },
      ],
      is_active: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_favorite: true,
    };
  });

  return (
    <section>
      <h2 className="text-[32px] font-bold mb-6 md:flex hidden">{t("favorites")}</h2>

      <Link href='/profile/account' className="mb-6 md:hidden flex items-center gap-2">
        <BackArrow />
        <h2 className="text-[32px] font-bold">{t("favorites")}</h2>
      </Link>

      <div className="flex flex-wrap gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showTopRated={true}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </section>
  );
};

export default MyFavorites;
