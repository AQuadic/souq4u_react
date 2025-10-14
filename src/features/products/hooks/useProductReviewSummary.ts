import { useQuery } from "@tanstack/react-query";
import {
  getReviewSummary,
  ReviewSummaryResponse,
} from "@/features/products/api/getReviewSummary";

const QUERY_KEY = "productReviewSummary";

export const useProductReviewSummary = (
  reviewable_type: string,
  reviewable_id: number
) => {
  return useQuery<ReviewSummaryResponse, Error>({
    queryKey: [QUERY_KEY, reviewable_type, reviewable_id],
    queryFn: () => getReviewSummary(reviewable_type, reviewable_id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useProductReviewSummary;
