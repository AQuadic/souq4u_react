import { axios } from "@/shared/lib/axios";

export type ReviewSummaryResponse = Record<string, number>;

/**
 * Fetch review summary counts for a given relatable resource (e.g., product).
 * Note: axios baseURL already contains the /api prefix, so the path here
 * should be relative to that (no leading /api).
 */
export const getReviewSummary = async (
  relatable_type: string,
  relatable_id: number
): Promise<ReviewSummaryResponse> => {
  const { data } = await axios.get<ReviewSummaryResponse>(
    "/review/summary/relatable",
    {
      params: { relatable_type, relatable_id },
    }
  );

  return data;
};
