"use client";

import { useEffect } from "react";
import { useCartStore } from "@/features/cart/stores";

/**
 * Component that initializes cart state on app startup
 * Should be placed high in the component tree (e.g., in layout)
 */
export const CartInitializer = () => {
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    // Initialize cart state when the app loads
    fetchCart();
  }, [fetchCart]);

  // This component doesn't render anything
  return null;
};
