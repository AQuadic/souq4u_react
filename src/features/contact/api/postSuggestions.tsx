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
        status?: number;
      };
      message?: string;
    };

    const errorData = axiosError?.response?.data;
        if (errorData && (errorData.message || errorData.errors)) {
      return {
        success: false,
        message: errorData.message,
        errors: errorData.errors || {},
      };
    }
    const errorMessage = axiosError?.message || "Request failed";
    
    if (errorMessage.includes('{"message"')) {
      try {
        const jsonMatch = errorMessage.match(/\{.*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            success: false,
            message: parsed.message,
            errors: parsed.errors || {},
          };
        }
      } catch {
        // If parsing fails, continue with original message
      }
    }

    return {
      success: false,
      message: errorMessage,
      errors: {},
    };
  }
}
