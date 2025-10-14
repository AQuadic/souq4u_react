"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "../stores";
import { cartApi } from "../api";
import { ProductForCart } from "../types";
import { handleApiError, getErrorMessage } from "@/shared/utils/errorHandler";

interface AddToCartParams {
  product: ProductForCart;
  quantity: number;
  variantInfo?: string;
  customData?: string;
}

interface RemoveFromCartParams {
  productId: number;
  itemableType?: string;
  variantId?: number;
}

export const useAddToCartCore = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setError, setLoading } = useCartStore();
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: async ({ product, quantity, customData }: AddToCartParams) => {
      return cartApi.addToCart({
        itemable_id: product.id,
        itemable_type: product.type || "product",
        variant_id: product.variant_id,
        quantity,
        custom_data: customData,
      });
    },
    onSuccess: () => {
      // Update cart with server response
      const { fetchCart } = useCartStore.getState();
      fetchCart(); // Refresh cart from server

      // Invalidate cart queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      setError(null);
    },
    onError: (error) => {
      console.error("Failed to add to cart:", error);
      // Use the improved error handler for better user experience
      handleApiError(error, "Failed to add to cart");
      setError(getErrorMessage(error));
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async ({ productId, itemableType }: RemoveFromCartParams) => {
      return cartApi.removeFromCart(productId, {
        itemable_id: productId,
        itemable_type: itemableType || "product",
      });
    },
    onSuccess: () => {
      // Invalidate cart queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      setError(null);
    },
    onError: (error) => {
      console.error("Failed to remove from cart:", error);
      // Use the improved error handler for better user experience
      handleApiError(error, "Failed to remove from cart");
      setError(getErrorMessage(error));
    },
  });

  const addToCart = async (params: AddToCartParams) => {
    try {
      setIsLoading(true);
      setLoading(true);
      await addToCartMutation.mutateAsync(params);
      return { success: true };
    } catch (error) {
      console.error("Add to cart error:", error);
      // Handle the error with user-friendly messages
      handleApiError(error, "Failed to add to cart");
      return {
        success: false,
        error: getErrorMessage(error),
      };
    }
  };

  const removeFromCart = async (params: RemoveFromCartParams) => {
    try {
      await removeFromCartMutation.mutateAsync(params);
      return { success: true };
    } catch (error) {
      console.error("Remove from cart error:", error);
      // Handle the error with user-friendly messages
      handleApiError(error, "Failed to remove from cart");
      return {
        success: false,
        error: getErrorMessage(error),
      };
    }
  };

  return {
    addToCart,
    removeFromCart,
    isLoading:
      isLoading ||
      addToCartMutation.isPending ||
      removeFromCartMutation.isPending,
    error: addToCartMutation.error || removeFromCartMutation.error,
  };
};
