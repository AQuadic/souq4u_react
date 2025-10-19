import { axios } from "@/shared/lib/axios";

export interface Testimonial {
  id: number;
  stars: number;
  comment: { ar: string; en: string };
  username: { ar: string; en: string };
  created_at: string;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  per_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

export const fetchTestimonials = async (
  page: number
): Promise<PaginatedResponse<Testimonial>> => {
  const response = await axios.get(`/store/testimonials?page=${page}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  return response.data;
};
