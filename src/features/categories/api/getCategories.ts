import { axios } from "@/shared/lib/axios";

export interface GetCategoriesParams {
  parent_only?: boolean;
  parent_id?: number;
  q?: string;
  type?: string;
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
  } | null;
}

export async function getCategories(
  params: GetCategoriesParams = {}
): Promise<Category[]> {
  const response = await axios.get("/category", {
    params,
  });

  return response.data.data;
}
