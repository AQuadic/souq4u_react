import { axios } from "@/shared/lib/axios";

export interface GetProductsParams {
  q?: string;
  sort_by?: "id" | "price" | "created_at" | "updated_at";
  sort_order?: "asc" | "desc";
  only_discount?: boolean | number;
  pagination?: boolean;
  category_id?: number;
  min_price?: number;
  max_price?: number;
  is_featured?: boolean | number;
  is_best_seller?: boolean | number;
}

export interface ProductImage {
  id: number;
  uuid: string;
  size: number;
  url: string;
  responsive_urls: string[];
  is_active: number;
  name?: { ar: string; en: string };
  order_column?: number;
}

export interface ProductAttributeValue {
  id: number;
  value: { en: string; ar?: string };
  special_value?: string | null;
}

export interface ProductAttribute {
  id: number;
  attribute: {
    id: number;
    name: { en: string; ar?: string };
    type: string;
  };
  value: ProductAttributeValue;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  sku: string;
  barcode?: string | null;
  price: number;
  final_price: number;
  discount?: number;
  discount_percentage?: number;
  has_discount: boolean;
  is_stock?: boolean;
  is_out_of_stock?: boolean;
  stock?: number;
  images?: ProductImage[];
  attributes?: ProductAttribute[];
}

export interface Category {
  id: number;
  name: { ar: string; en: string };
  slug?: string | null;
  is_active: number;
  image?: string | null;
}

export interface Description {
  ar: string;
  en: string;
}

export interface ShortDescription {
  ar: string;
  en: string;
}

export interface Product {
  id: number;
  brand_id?: number | null;
  category_id?: number;
  category?: Category;
  name: string | { ar: string; en: string };
  short_description?: ShortDescription;
  description?: Description;
  images: ProductImage[];
  variants?: ProductVariant[];
  is_active: number;
  created_at: string;
  updated_at: string;
  order_column?: number;
  slug?: string | null;
  ar?: string;
  en?: string;
  is_featured?: number;
  is_favorite?: boolean;
  is_top_rated?: number;
  rating?: number;
  guide_image?: {
    id: number;
    url: string;
    responsive_urls: string[];
  };
}

export async function getProducts(
  params?: GetProductsParams
): Promise<Product[]> {
  if (params?.sort_by && !params.sort_order) {
    throw new Error("sort_order is required when sort_by is provided");
  }

  // Coerce boolean flags to numeric (1 or 0) to match backend expectations.
  // Accept both boolean and numeric inputs for convenience.
  function coerceFlag(v?: boolean | number) {
    if (v === undefined || v === null) return 0;
    if (typeof v === "number") return v ? 1 : 0;
    return v ? 1 : 0;
  }

  const paramsPayload: Record<string, unknown> = {
    pagination: params?.pagination ?? false,
    category_id: params?.category_id,
    q: params?.q,
    sort_by: params?.sort_by,
    sort_order: params?.sort_order,
    min_price: params?.min_price,
    max_price: params?.max_price,
  };

  if (params?.is_featured !== undefined) {
    paramsPayload.is_featured = coerceFlag(params.is_featured);
  }

  if (params?.is_best_seller !== undefined) {
    paramsPayload.is_best_seller = coerceFlag(params.is_best_seller);
  }

  // `only_discount` can be provided by callers; prefer numeric 1/0.
  if (params?.only_discount !== undefined) {
    paramsPayload.only_discount = coerceFlag(params.only_discount);
  }

  // Note: we intentionally do NOT send `is_discount` anymore.
  // The backend will derive discount filtering from `only_discount` or other params server-side.

  const response = await axios.request<Product[]>({
    url: "/products",
    method: "GET",
    params: paramsPayload,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  return response.data;
}

export async function getProduct(id: string | number): Promise<Product> {
  const response = await axios.request<Product>({
    url: `/products/${id}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  return response.data;
}
