import { axios } from "@/shared/lib/axios";

export interface GetOrdersParams {
  pagination?: "simple" | "normal" | "none";
  per_page?: number;
  page?: number;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_name?: {
    en?: string;
    ar?: string;
  };
  status?: string | null;
  code?: string | null;
  quantity?: number;
  final_price?: number;
  discount_amount?: number;
  subtotal?: number;
  productable?: {
    id?: number;
    tenant_id?: number;
    product_id?: number;
    sku?: string;
    barcode?: string | null;
    price?: number;
    stock?: number;
    is_stock?: number;
    is_active?: number;
    created_at?: string;
    updated_at?: string;
    discount?: number;
    image?: {
      id?: number;
      uuid?: string;
      size?: number;
      url?: string;
      responsive_urls?: string[];
    };
  };
  variant?: {
    id?: number;
    product_id?: number;
    sku?: string;
    barcode?: string | null;
    price?: number;
    discount?: number;
    has_discount?: boolean;
    discount_percentage?: number;
    final_price?: number;
    is_out_of_stock?: boolean;
    group_addons?: any[];
    stock?: number;
    is_stock?: boolean;
    is_active?: boolean;
    images?: Array<{
      id?: number;
      uuid?: string;
      size?: number;
      url?: string;
      responsive_urls?: string[];
    }>;
    attributes?: Array<{
      id?: number;
      attribute?: {
        id?: number;
        name?: {
          ar?: string;
          en?: string;
        };
        type?: string;
      };
      value?: {
        id?: number;
        value?: {
          ar?: string;
          en?: string;
        };
        special_value?: string | null;
      };
    }>;
  };
  custom_data?: any[];
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
    data: OrderItem[];
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
