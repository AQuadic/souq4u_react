import { axios } from "@/shared/lib/axios";
import { User } from "@/features/auth/stores";

export interface GetUserResponse {
  user: User;
  [key: string]: unknown;
}

/**
 * Fetch current authenticated user data
 * Endpoint: POST /user/user
 */
export async function getCurrentUser(): Promise<GetUserResponse> {
  try {
    const response = await axios.post<User>("/user/user");

    // The API returns user data directly, not wrapped in a "user" property
    // So we need to wrap it ourselves to match our expected interface
    return { user: response.data };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { data?: unknown; status?: number };
      };

      // If it's a 401 (unauthorized), the token might be expired
      if (axiosError.response?.status === 401) {
        throw new Error("UNAUTHORIZED");
      }

      throw axiosError.response?.data ?? error;
    }
    throw error;
  }
}
