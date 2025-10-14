import { axios } from "@/shared/lib/axios";

export type ReviewSummaryResponse = Record<string, number>;

/**
 * Fetch review summary counts for a given reviewable resource.
 * Note: axios baseURL already contains the /api prefix, so the path here
 * should be relative to that (no leading /api).
 */
export const getReviewSummary = async (
  reviewable_type: string,
  reviewable_id: number
): Promise<ReviewSummaryResponse> => {
  const { data } = await axios.get<ReviewSummaryResponse>("/review/summary", {
    params: { reviewable_type, reviewable_id },
  });

  return data;
};
