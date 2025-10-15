import { axios } from "@/shared/lib/axios";

export interface LocalizedField {
  en: string;
  ar: string;
}

export interface Page {
  id: number;
  title: LocalizedField;
  description: LocalizedField;
  is_active: number;
  order_column: number;
  created_at: string;
  updated_at: string;
}

export interface GetPagesResponse {
  pages: Page[];
}

/**
 * Fetches all static pages from the API
 * This is the main API call for fetching pages in a React app
 */
export const getPages = async (): Promise<Page[]> => {
  try {
    const response = await axios.get<Page[] | GetPagesResponse>("/pages");

    // Handle both response formats:
    // 1. Direct array: [{id: 1, title: {...}}]
    // 2. Wrapped object: {pages: [{id: 1, title: {...}}]}
    const data = response.data;

    if (Array.isArray(data)) {
      console.log(
        "✅ Pages API returned array directly:",
        data.length,
        "pages"
      );
      return data;
    } else if (data && typeof data === "object" && "pages" in data) {
      console.log(
        "✅ Pages API returned wrapped object:",
        data.pages?.length || 0,
        "pages"
      );
      return data.pages || [];
    }

    console.warn("⚠️ Unexpected pages API response format:", data);
    return [];
  } catch (error) {
    console.error("❌ Failed to fetch pages:", error);
    return [];
  }
};
