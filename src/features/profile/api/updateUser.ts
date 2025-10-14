import { axios } from "@/shared/lib/axios";

export interface UpdateUserResponse {
  success: boolean;
  data?: unknown;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * Sends multipart/form-data to update the user profile
 */
export async function updateUser(
  formData: FormData
): Promise<UpdateUserResponse> {
  try {
    const { data } = await axios.post("/user/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return { success: true, data };
  } catch (error: unknown) {
    // The axios wrapper sometimes throws a wrapped Error whose `cause`
    // property contains the original axios error with `response.data`.
    // Try to read the server response from either shape so callers get
    // the server-provided `message` and `errors` when available.
    const axiosError = error as {
      response?: {
        data?: { message?: string; errors?: Record<string, string[]> };
      };
      cause?: {
        response?: {
          data?: { message?: string; errors?: Record<string, string[]> };
        };
      };
      message?: string;
    };

    const serverData =
      axiosError.response?.data ?? axiosError.cause?.response?.data;

    return {
      success: false,
      message: serverData?.message || axiosError?.message || "Request failed",
      errors: serverData?.errors || {},
    };
  }
}
