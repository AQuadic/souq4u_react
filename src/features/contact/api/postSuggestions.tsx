import { axios } from "@/shared/lib/axios";

export interface SuggestionPayload {
  city?: string;
  name?: string;
  email?: string;
  phone?: string;
  phone_country?: string;
  type?: string;
  title?: string;
  message: string;
}

export interface SuggestionResponse {
  success: boolean;
  data?: unknown;
  errors?: Record<string, string[]>;
  message?: string;
}

export async function postSuggestion(
  payload: SuggestionPayload
): Promise<SuggestionResponse> {
  try {
    const { data } = await axios.post("/suggestions", payload);
    return { success: true, data };
  } catch (error: unknown) {
    const axiosError = error as {
      response?: {
        data?: {
          message?: string;
          errors?: Record<string, string[]>;
        };
      };
      message?: string;
    };

    return {
      success: false,
      message:
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        "Request failed",
      errors: axiosError?.response?.data?.errors || {},
    };
  }
}
