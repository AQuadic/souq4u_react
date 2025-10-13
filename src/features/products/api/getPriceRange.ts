import { axios } from "@/shared/lib/axios";

export interface PriceRangeResponse {
  min_price: number;
  max_price: number;
}

/**
 * Fetch products price range used by the UI slider.
 * axios baseURL already contains the /api prefix, so the path here
 * should be relative to that (no leading /api).
 */
export const getPriceRange = async (): Promise<PriceRangeResponse> => {
  const { data } = await axios.get<PriceRangeResponse>("/products/price_range");

  return data;
};
