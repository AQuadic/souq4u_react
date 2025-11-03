import { axios } from "@/shared/lib/axios";

export interface SliderImage {
  file_name: string;
  mime_type: string;
  url: string;
  responsive_urls?: string[];
}

export interface Slider {
  id: number;
  name: string;
  title: string;
  description: string;
  text_button: string;
  url: string;
  en_image?: SliderImage;
  ar_image?: SliderImage;
}

export interface GetSliderResponse {
  data: Slider[];
  links?: {
    first?: string;
    last?: string | null;
    prev?: string | null;
    next?: string | null;
  };
  meta?: {
    current_page?: number;
    total?: number;
    per_page?: number;
  };
}

export interface GetSliderParams {
  perPage?: number;
  search?: string;
  pagination?: string;
}

export const getSlider = async (
  params?: GetSliderParams
): Promise<GetSliderResponse> => {
  const response = await axios.get<GetSliderResponse>("/slider", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    params,
  });

  return response.data;
};
