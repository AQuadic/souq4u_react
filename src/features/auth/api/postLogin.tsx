import { axios } from "@/shared/lib/axios";

export interface LoginPayload {
  email?: string;
  phone?: string;
  phone_country?: string;
  name?: string;
  password?: string;
  password_confirmation?: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    phone_country?: string;
  };
}

export async function postLogin(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const response = await axios.post<LoginResponse>(`/user/login`, payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { data?: unknown } };
      throw axiosError.response?.data || error;
    }
    throw error;
  }
}
