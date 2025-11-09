import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { CartState, Cart } from "../types";
import { getTranslatedText } from "../../../shared/utils/translationUtils";
import type { MultilingualText } from "../../../shared/utils/translationUtils";
import { cartApi, getCouponFromSession, clearCouponFromSession } from "../api";

interface CartActions {
  setCart: (cart: Cart) => void;
  removeItem: (itemId: number) => Promise<void>;
  updateItemQuantity: (itemId: number, quantity: number) => Promise<void>;
  applyCoupon: (couponCode: string) => Promise<void>;
  clearCoupon: () => Promise<void>;
  clearCart: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchCart: () => Promise<void>;
  syncCartSilently: () => Promise<void>;
  // Optimistic update helpers
  optimisticUpdateQuantity: (itemId: number, quantity: number) => void;
  optimisticRemoveItem: (itemId: number) => void;
  rollbackOptimisticUpdate: (backup: Cart | null) => void;
}

interface CartStore extends CartState, CartActions {
  appliedCoupon: string | null;
  isCouponLoading: boolean;
}

export const useCartStore = create<CartStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      cart: null,
      isLoading: false,
      error: null,
      appliedCoupon: getCouponFromSession(),
      isCouponLoading: false,

      // Actions
      setCart: (cart) => {
        set({ cart, error: null });
      },

      removeItem: async (itemId) => {
        const { cart, optimisticRemoveItem, rollbackOptimisticUpdate } = get();

        if (!cart) return;

        const item = cart.items.find((item) => item.id === itemId);
        if (!item) {
          console.error("Item not found in cart");
          return;
        }

        // Create backup for rollback
        const cartBackup = { ...cart };
        // Resolve multilingual name to current locale (non-hook helper)
        const locale =
          typeof document !== "undefined"
            ? document.documentElement.lang ||
              (navigator.language || "en").split("-")[0]
            : "en";
        const itemName = getTranslatedText(
          item.name as MultilingualText,
          locale,
          String(item.name || "")
        );

        // Optimistic update - remove item from UI immediately
        optimisticRemoveItem(itemId);

        try {
          // Make API call in background
          await cartApi.removeFromCart(item.itemable_id, {
            itemable_id: item.itemable_id,
            itemable_type: item.itemable_type,
          });

          // Sync with server to get updated totals (silently)
          await get().syncCartSilently();

          // Check if cart is empty after removal and clear coupon if so
          const currentCart = get().cart;
          if (!currentCart || currentCart.items.length === 0) {
            // Clear coupon from session storage
            clearCouponFromSession();
            // Clear coupon from store state
            set({ appliedCoupon: null });
          }
        } catch (error) {
          console.error("Failed to remove item from cart:", error);

          // Rollback optimistic update
          rollbackOptimisticUpdate(cartBackup);

          // Re-throw error for components to handle
          throw new Error(`Failed to remove "${itemName}" from cart`);
        }
      },

      updateItemQuantity: async (itemId, quantity) => {
        const {
          cart,
          optimisticUpdateQuantity,
          rollbackOptimisticUpdate,
          removeItem,
        } = get();

        if (!cart) return;

        const item = cart.items.find((item) => item.id === itemId);
        if (!item) {
          console.error("Item not found in cart");
          return;
        }

        const locale =
          typeof document !== "undefined"
            ? document.documentElement.lang ||
              (navigator.language || "en").split("-")[0]
            : "en";
        const itemName = getTranslatedText(
          item.name as MultilingualText,
          locale,
          String(item.name || "")
        );

        // Handle quantity going to 0 as removal
        if (quantity <= 0) {
          await removeItem(itemId);
          return;
        }

        // Create backup for rollback
        const cartBackup = { ...cart };

        // Optimistic update - update quantity in UI immediately
        optimisticUpdateQuantity(itemId, quantity);

        try {
          // Make API call in background
          await cartApi.addToCart({
            itemable_id: item.itemable_id,
            itemable_type: item.itemable_type,
            quantity: quantity,
            variant_id: item.variant.id,
          });

          // Sync with server to get updated totals (silently)
          await get().syncCartSilently();
        } catch (error) {
          console.error("Failed to update item quantity:", error);

          // Rollback optimistic update
          rollbackOptimisticUpdate(cartBackup);

          // Re-throw error for components to handle
          throw new Error(`Failed to update "${itemName}" quantity`);
        }
      },

      applyCoupon: async (couponCode: string) => {
        set({ isCouponLoading: true, error: null });

        try {
          const response = await cartApi.applyCoupon(couponCode);

          // Update cart with the response data that includes coupon calculations
          set({
            cart: response.data,
            appliedCoupon: couponCode,
            isCouponLoading: false,
          });
        } catch (error) {
          console.error("Failed to apply coupon:", error);
          set({
            error: "Failed to apply coupon code",
            isCouponLoading: false,
          });
          throw error;
        }
      },

      clearCoupon: async () => {
        set({ isCouponLoading: true, error: null });

        try {
          // Clear coupon using the new API method
          const response = await cartApi.clearCoupon();

          // Update cart with the response data without coupon
          set({
            cart: response.data,
            appliedCoupon: null,
            isCouponLoading: false,
          });
        } catch (error) {
          console.error("Failed to clear coupon:", error);
          set({
            error: "Failed to clear coupon",
            isCouponLoading: false,
          });
          throw error;
        }
      },

      clearCart: () => {
        set({
          cart: null,
          error: null,
          appliedCoupon: null,
          isCouponLoading: false,
        });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },

      fetchCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await cartApi.getCart();
          console.log("Fetched cart response:", response);

          // Handle case where response.data might be undefined or the structure is different
          let responseData: Partial<Cart> & Record<string, unknown>;

          if (response?.data) {
            responseData = response.data as Partial<Cart> &
              Record<string, unknown>;
          } else if (
            response &&
            typeof response === "object" &&
            "items" in response
          ) {
            // If response itself contains the cart data
            responseData = response as Partial<Cart> & Record<string, unknown>;
          } else {
            console.warn("Unexpected response structure:", response);
            responseData = {
              items: [],
              calculations: {
                discount: 0,
                subtotal: 0,
                tax: 0,
                delivery_fees: 0,
                total: 0,
              },
            };
          }

          // Structure the cart data correctly from the API response
          const cart: Cart = {
            items: Array.isArray(responseData.items) ? responseData.items : [],
            calculations: responseData.calculations || {
              discount: 0,
              subtotal: 0,
              tax: 0,
              delivery_fees: 0,
              total: 0,
            },
          };
          set({ cart, isLoading: false });
        } catch (error) {
          console.error("Failed to fetch cart:", error);
          set({ error: "Failed to fetch cart", isLoading: false });
        }
      },

      syncCartSilently: async () => {
        try {
          const response = await cartApi.getCart();
          console.log("Synced cart response:", response);

          // Handle case where response.data might be undefined or the structure is different
          let responseData: Partial<Cart> & Record<string, unknown>;

          if (response?.data) {
            responseData = response.data as Partial<Cart> &
              Record<string, unknown>;
          } else if (
            response &&
            typeof response === "object" &&
            "items" in response
          ) {
            // If response itself contains the cart data
            responseData = response as Partial<Cart> & Record<string, unknown>;
          } else {
            console.warn("Unexpected response structure:", response);
            responseData = {
              items: [],
              calculations: {
                discount: 0,
                subtotal: 0,
                tax: 0,
                delivery_fees: 0,
                total: 0,
              },
            };
          }

          // Structure the cart data correctly from the API response
          const cart: Cart = {
            items: Array.isArray(responseData.items) ? responseData.items : [],
            calculations: responseData.calculations || {
              discount: 0,
              subtotal: 0,
              tax: 0,
              delivery_fees: 0,
              total: 0,
            },
          };
          // Update cart without changing loading state
          set({ cart, error: null });
        } catch (error) {
          console.error("Failed to sync cart:", error);
          // Don't set error state for silent sync failures
        }
      },

      // Optimistic update helpers
      optimisticUpdateQuantity: (itemId, quantity) => {
        const { cart } = get();
        if (!cart) return;

        const updatedCart: Cart = {
          ...cart,
          items: cart.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
          // Recalculate totals optimistically (simplified - real calculation would be more complex)
          calculations: {
            ...cart.calculations,
            // This is a simplified update - in real app you'd recalculate based on item prices
            subtotal: cart.calculations.subtotal,
            total: cart.calculations.total,
          },
        };

        set({ cart: updatedCart });
      },

      optimisticRemoveItem: (itemId) => {
        const { cart } = get();
        if (!cart) return;

        const updatedCart: Cart = {
          ...cart,
          items: cart.items.filter((item) => item.id !== itemId),
          // Recalculate totals optimistically (simplified)
          calculations: {
            ...cart.calculations,
            // This is a simplified update - in real app you'd recalculate based on removed item
            subtotal: cart.calculations.subtotal,
            total: cart.calculations.total,
          },
        };

        set({ cart: updatedCart });

        // If cart is now empty, clear the coupon from session storage
        if (updatedCart.items.length === 0) {
          clearCouponFromSession();
          set({ appliedCoupon: null });
        }
      },

      rollbackOptimisticUpdate: (backup) => {
        set({ cart: backup });
      },
    }),
    { name: "cart-store" }
  )
);
