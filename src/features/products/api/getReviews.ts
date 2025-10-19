import { axios } from "@/shared/lib/axios";

/**
 * Fetch reviews for a given relatable resource (e.g., product).
 * axios baseURL already contains the /api prefix, so the path here
 * should be relative to that (no leading /api).
 */
export const getReviews = async (
  relatable_type: string,
  relatable_id: string | number
): Promise<unknown> => {
  const params: Record<string, unknown> = { relatable_type, relatable_id };

  const { data } = await axios.get<unknown>("/review/relatable", {
    params,
  });

  return data;
};
