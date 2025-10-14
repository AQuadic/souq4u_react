import { axios } from "@/shared/lib/axios";

/**
 * Fetch reviews for a given reviewable resource.
 * axios baseURL already contains the /api prefix, so the path here
 * should be relative to that (no leading /api).
 */
export const getReviews = async (
  reviewable_type: string,
  reviewable_id: string | number
): Promise<unknown> => {
  const { data } = await axios.get<unknown>("/review/reviewable", {
    params: { reviewable_type, reviewable_id },
  });

  return data;
};
