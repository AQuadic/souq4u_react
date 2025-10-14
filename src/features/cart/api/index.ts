import { axios } from "@/shared/lib/axios";
import { Cart } from "../types";

// Types for cart API
export interface CartItemRequest {
  itemable_id: number;
  itemable_type: string;
  quantity: number;
  custom_data?: string;
}

export interface CartRequest {
  lat?: number;
  lng?: number;
  city_id?: string;
  area_id?: string;
  items?: CartItemRequest[];
}

export interface AddToCartRequest {
  itemable_id: number;
  itemable_type: string;
  quantity: number;
  variant_id?: number;
  custom_data?: string;
  coupon_code?: string;
}

export interface RemoveFromCartRequest {
  itemable_id: number;
  itemable_type: string;
}

export interface CartResponse {
  data: Cart;
  message?: string;
}

// Session storage functions for coupon
const getStoredCoupon = (): string | null => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("applied_coupon");
};

const storeCoupon = (couponCode: string): void => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("applied_coupon", couponCode);
};

const clearStoredCoupon = (): void => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("applied_coupon");
};

// Export coupon session storage functions
export const getCouponFromSession = getStoredCoupon;
export const saveCouponToSession = storeCoupon;
export const clearCouponFromSession = clearStoredCoupon;

export const cartApi = {
  // Get cart contents
  getCart: async (
    params?: Omit<CartRequest, "items"> & { coupon_code?: string }
  ): Promise<CartResponse> => {
    try {
      const requestParams: Omit<CartRequest, "items"> & {
        coupon_code?: string;
      } = { ...(params || {}) };

      const storedCoupon = getStoredCoupon();
      if (storedCoupon && !requestParams.coupon_code) {
        requestParams.coupon_code = storedCoupon;
      }

      console.log("GetCart request params:", requestParams);

      const response = await axios.get<CartResponse>("/cart", {
        params: requestParams,
      });

      return response.data;
    } catch (error) {
      console.error("Failed to get cart:", error);
      throw error;
    }
  },

  // Add item to cart
  addToCart: async (data: AddToCartRequest): Promise<CartResponse> => {
    try {
      const requestData: AddToCartRequest = { ...data };
      const storedCoupon = getStoredCoupon();
      if (storedCoupon && !requestData.coupon_code) {
        requestData.coupon_code = storedCoupon;
      }

      console.log("AddToCart request data:", requestData);

      const response = await axios.post<CartResponse>("/cart", requestData);
      return response.data;
    } catch (error) {
      console.error("Failed to add to cart:", error);
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (
    id: number,
    data?: Partial<RemoveFromCartRequest> & { coupon_code?: string }
  ): Promise<CartResponse> => {
    try {
      const requestParams = { ...(data || {}) };

      const storedCoupon = getStoredCoupon();
      if (storedCoupon && !requestParams.coupon_code) {
        requestParams.coupon_code = storedCoupon;
      }

      console.log("RemoveFromCart request params:", requestParams);

      const response = await axios.delete<CartResponse>(`/cart/${id}`, {
        params: requestParams,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      throw error;
    }
  },

  // Apply coupon to cart by making a GET request with coupon_code as query parameter
  applyCoupon: async (couponCode: string): Promise<CartResponse> => {
    try {
      const requestParams: { coupon_code?: string } = {};

      if (couponCode.trim()) {
        requestParams.coupon_code = couponCode.trim();
      }

      console.log("ApplyCoupon request params:", requestParams);

      const response = await axios.get<CartResponse>("/cart", {
        params: requestParams,
      });

      // Store coupon in session if request was successful
      if (response.data && couponCode.trim()) {
        storeCoupon(couponCode.trim());
      }

      return response.data;
    } catch (error) {
      console.error("Failed to apply coupon:", error);
      throw error;
    }
  },

  // Clear coupon from session and cart
  clearCoupon: async (): Promise<CartResponse> => {
    try {
      // Clear from session storage first
      clearStoredCoupon();

      console.log("ClearCoupon request");

      const response = await axios.get<CartResponse>("/cart", {
        params: {},
      });

      return response.data;
    } catch (error) {
      console.error("Failed to clear coupon:", error);
      throw error;
    }
  },
};
