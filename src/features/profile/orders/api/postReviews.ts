import { axios } from "@/shared/lib/axios";

export interface ReviewRequest {
  reviewable_type: string;
  reviewable_id: string;
  relatable_id?: number;
  relatable_type?: string;
  rating: number;
  comment?: string;
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export const sendReview = async (
  payload: ReviewRequest
): Promise<ReviewResponse> => {
  const res = await axios.post("/review", payload, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  return res.data;
};
