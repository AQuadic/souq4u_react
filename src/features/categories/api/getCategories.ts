import { axios } from "@/shared/lib/axios";

export interface GetCategoriesParams {
  parent_only?: boolean;
  parent_id?: number;
  q?: string;
  type?: string;
  with_children?: boolean;
}

export interface Category {
  id: number;
  name: {
    ar: string;
    en: string;
  };
  parent_id?: number | null;
  type?: string;
  children?: Category[];
  active_products_count?: number;
  children_count?: number;
  image?: {
    file_name: string;
    url?: string;
    uuid?: string;
    mime_type?: string;
    responsive_urls?: string[];
  } | null;
}

export async function getCategories(
  params: GetCategoriesParams = {}
): Promise<Category[]> {
  const response = await axios.get("/category", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    params,
  });

  return response.data.data;
}
