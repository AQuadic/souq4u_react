import { useQuery } from "@tanstack/react-query";
import {
  getReviewSummary,
  ReviewSummaryResponse,
} from "@/features/products/api/getReviewSummary";

const QUERY_KEY = "productReviewSummary";

export const useProductReviewSummary = (
  relatable_type: string,
  relatable_id: number
) => {
  return useQuery<ReviewSummaryResponse, Error>({
    queryKey: [QUERY_KEY, relatable_type, relatable_id],
    queryFn: () => getReviewSummary(relatable_type, relatable_id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useProductReviewSummary;
