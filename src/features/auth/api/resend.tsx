import { axios } from "@/shared/lib/axios";

export interface ResendResponse {
  message?: string;
  otp_callback?: {
    reference: string;
    message: string;
    phone: string;
    scheme: string;
    url: string;
  };
}

/**
 * Resend verification request for a phone number.
 * If `token` is provided it will be sent as `Authorization: Bearer <token>`.
 */
export async function resendVerification(
  phone: string,
  token?: string,
  phone_country?: string
): Promise<ResendResponse> {
  try {
    const body: Record<string, string> = {
      phone,
      type: "verify",
      verify_type: "whatsapp_send",
    };

    if (phone_country) {
      body["phone_country"] = phone_country;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios.post<ResendResponse>(`/user/resend`, body, {
      headers,
    });

    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { data?: unknown } };
      throw axiosError.response?.data ?? error;
    }
    throw error;
  }
}
