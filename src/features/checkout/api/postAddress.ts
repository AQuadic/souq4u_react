import { axios } from "@/shared/lib/axios";

export interface CheckoutPayload {
  session_id?: string;
  payment_method?: "cash" | "card" | "both";
  user_name?: string;
  email?: string;
  phone?: string;
  phone_country?: string;
  coupon_code?: string;
  address_id?: number;
  // Address fields for when no address_id is provided
  address_title?: string;
  country_id?: string;
  city_id?: string;
  area_id?: string;
  address_details?: string;
  zipcode?: string;
  location?: string;
}

export interface CheckoutResponse {
  message: string;
  order: {
    id: number;
    code: string;
    tracking_number: string | null;
    status: string;
    client: unknown;
    user_name: string;
    email: string | null;
    client_id: string;
    client_type: string;
    session_id: string | null;
    phone: string;
    phone_country: string;
    phone_normalized: string;
    phone_national: string;
    phone_e164: string;
    address_details: string | null;
    address_lat: number | null;
    address_lng: number | null;
    total: number;
    sub_total: number;
    discount_amount: number;
    tax: number;
    shipping: number;
    orderItems: Array<{
      id: number;
      product_name: {
        ar: string;
        en: string;
      };
      quantity: number;
      final_price: number;
      discount_amount: number;
      subtotal: number;
      created_at: string;
      updated_at: string;
    }>;
    created_at: string;
    updated_at: string;
  };
  payment_url: string;
}

export const checkoutOrder = async (
  payload: CheckoutPayload
): Promise<CheckoutResponse> => {
  try {
    const response = await axios.post<CheckoutResponse>(
      "/orders/checkout",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Checkout error:", error);
    throw error;
  }
};
