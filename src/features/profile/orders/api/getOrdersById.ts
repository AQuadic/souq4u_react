import { axios } from "@/shared/lib/axios";

export type OrderItem = {
  id: number;
  final_price: number;
  quantity: number;
  product_name: {
    ar: string;
    en: string;
  };
  variant?: {
    product_id?: number;
    images?: { url: string }[];
  };
  productable?: {
    product_id?: number;
  };
};

export interface Order {
  id: number;
  code: string;
  status: string;
  client_id: string;
  client_type: string;
  address_details: string;
  phone: string;
  phone_country: string;
  phone_e164: string;
  phone_national: string;
  phone_normalized: string;
  user_name: string;
  created_at: string;
  updated_at: string;

  sub_total: number;
  shipping: number;
  tax: number;
  discount_amount: number;
  total: number;

  orderItems: OrderItem[];
}

export async function getOrderById(
  type:"id" | "item" | "code" | "tracking_number",
  id: string
): Promise<Order> {
  const res = await axios.get(`/orders/${type}/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return res.data.order;
}
