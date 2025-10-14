import { axios } from "@/shared/lib/axios";

export interface GetOrdersParams {
  pagination?: "simple" | "normal" | "none";
  per_page?: number;
  page?: number;
}

export interface OrderItem {
  product_name?: {
    en?: string;
    ar?: string;
  };
  images?: Array<{
    responsive_urls?: string[];
  }>;
}

export interface Order {
  id: number;
  order_id: number;

  status?: "pending" | "processing" | "shipping" | "cancelled" | "confirmed";

  product_name?: {
    en?: string;
    ar?: string;
  };

  productable?: {
    image?: {
      responsive_urls?: string[];
    };
  };

  quantity?: number;
  final_price?: number;
  discount_amount?: number;
  subtotal?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PaginationLinks {
  first: string;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  current_page_url: string;
  from: number | null;
  to: number | null;
  path?: string;
  per_page: number;
  total?: number;
}

export interface GetOrdersResponse {
  items: {
    data: Order[];
  };
  links: PaginationLinks;
  meta: PaginationMeta;
}

export const getOrders = async (
  params?: GetOrdersParams
): Promise<GetOrdersResponse> => {
  const response = await axios.get("/orders/items", {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    params,
  });

  return response.data;
};