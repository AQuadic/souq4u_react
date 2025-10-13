"use client";

import { useAddToCartCore } from "@/features/cart/hooks";
import { ProductForCart } from "@/features/cart/types";

interface UseProductAddToCartParams {
  product: ProductForCart;
}

interface AddToCartProductParams {
  quantity: number;
  variantInfo?: string;
  customData?: string;
}

export const useProductAddToCart = ({ product }: UseProductAddToCartParams) => {
  const { addToCart, isLoading, error } = useAddToCartCore();

  const addProductToCart = async (params: AddToCartProductParams) => {
    return addToCart({
      product,
      ...params,
    });
  };

  return {
    addToCart: addProductToCart,
    isLoading,
    error,
  };
};
