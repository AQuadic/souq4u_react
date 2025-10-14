import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface RecentlyViewedState {
  productIds: number[];
  addProductId: (productId: number) => void;
  clearAll: () => void;
}

const MAX_PRODUCTS = 8;

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      productIds: [],

      addProductId: (productId: number) => {
        set((state) => {
          // Remove the product if it already exists in the list
          const filteredIds = state.productIds.filter((id) => id !== productId);

          // Add the new product at the beginning
          const newProductIds = [productId, ...filteredIds];

          // Keep only the first 8 products
          return {
            productIds: newProductIds.slice(0, MAX_PRODUCTS),
          };
        });
      },

      clearAll: () => {
        set({ productIds: [] });
      },
    }),
    {
      name: "recently-viewed-products",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
