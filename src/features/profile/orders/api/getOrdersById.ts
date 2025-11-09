import { axios } from "@/shared/lib/axios";

export type OrderItem = {
  id: number;
  order_id?: number;
  code?: string;
  final_price: number;
  price: number;
  discount_amount?: number;
  subtotal?: number;
  total?: number;
  quantity: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
  is_reviewed?: boolean,
  product_name: {
    ar: string;
    en: string;
  };

  variant?: {
    id?: number;
    product_id?: number;
    sku?: string;
    barcode?: string | null;
    price?: number;
    discount?: number;
    has_discount?: boolean;
    images?: { url: string; responsive_urls?: string[] }[];
  };

  productable?: {
    id?: number;
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

  is_reviewed: boolean;
  delivery_expect?: string | null;
}

export async function getOrderById(
  type: "id" | "item" | "code" | "tracking_number",
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
