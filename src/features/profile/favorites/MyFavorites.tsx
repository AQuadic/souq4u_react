"use client";

import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ProductCard from "@/features/products/components/ProductCard";
import { getFavorites } from "../favorites/api/getFavorites";
import { Product } from "@/features/products/api/getProduct";
import { getProduct } from "@/features/products/api/getProduct"; // Make sure you have this API
import FavEmptyState from "./FavEmptyState";
import BackArrow from "@/features/products/icons/BackArrow";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
  const [products, setProducts] = useState<Product[]>([]);
  const queryClient = useQueryClient();
  const { t } = useTranslation("Profile");

  const { data: favData = [], isLoading, isError } = useQuery<ApiFavoriteItem[]>({
    queryKey: ["favorites"],
    queryFn: getFavorites,
  });

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      if (!favData || favData.length === 0) {
        setProducts([]);
        return;
      }

      try {
        const productsData = await Promise.all(
          favData.map(async (favItem) => {
            const productDetails: Product = await getProduct(favItem.favorable_id);

            return {
              ...productDetails,
              is_favorite: true,
            };
          })
        );

        setProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch product details", error);
      }
    };

    fetchFavoriteProducts();
  }, [favData]);

  const handleToggleFavorite = (productId: number) => {
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== productId);
      queryClient.setQueryData<ApiFavoriteItem[] | undefined>(
        ["favorites"],
        favData.filter((item) => item.favorable.id !== productId)
      );
      return next;
    });
  };

  if (isLoading)
    return (
      <p className="text-neutral-600">
        {t("Profile.loadingFav")}
      </p>
    );
        
  if (isError) return <div>Error loading favorites.</div>;

  if (!products || products.length === 0) {
    return (
      <div>
        <h2 className="text-[32px] font-bold mb-6">{t("Profile.favorites")}</h2>
        <FavEmptyState />
      </div>
    );
  }

  return (
    <section>
      <h2 className="text-[32px] font-bold mb-6 md:flex hidden">{t("Profile.favorites")}</h2>

      <Link to='/profile/account' className="mb-6 md:hidden flex items-center gap-2">
        <div className="transform ltr:scale-x-100 rtl:scale-x-[-1]">
          <BackArrow />
        </div>
        <h2 className="text-[32px] font-bold">{t("Profile.favorites")}</h2>
      </Link>

      <div className="grid lg:grid-cols-3 grid-cols-2 gap-4">
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
