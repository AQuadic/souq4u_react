import { axios } from "@/shared/lib/axios";
import { User } from "@/features/auth/stores";

export interface CheckOtpResponse {
  user?: User;
  token?: string;
  reset_token?: string | null;
  status?: number;
  message?: string;
  [key: string]: unknown;
}

/**
 * Check OTP status request
 * Endpoint: POST /api/user/otp/check
 */
export async function checkOtp(
  phone: string,
  token?: string,
  phone_country?: string,
  reference?: string
): Promise<CheckOtpResponse> {
  try {
    const body: Record<string, string> = {
      phone,
    };

    if (phone_country) {
      body["phone_country"] = phone_country;
    }
    if (reference) {
      body["reference"] = reference;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios.post<CheckOtpResponse>(
      `/user/otp/check`,
      body,
      {
        headers,
      }
    );

    return response.data;
  } catch (error: unknown) {
    // Handle 422 responses (not verified yet) - don't throw, return empty response
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: {
          status?: number;
          data?: unknown;
        };
      };

      // 422 means "not verified yet" - this is expected, return empty response
      if (axiosError.response?.status === 422) {
        return {}; // Return empty response so polling continues
      }

      throw axiosError.response?.data ?? error;
    }
    throw error;
  }
}
