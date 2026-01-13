import { axios } from "@/shared/lib/axios";
import { User } from "../stores";

export type SocialLoginRequest = {
  provider: "google" | "apple";
  access_token: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};

/**
 * Social Login
 */
export const socialLogin = async (
  payload: SocialLoginRequest
): Promise<AuthResponse> => {
  const response = await axios.post("/user/social", payload);
  const raw = response.data as unknown;
  const parsed = raw as {
    user?: User;
    token?: string;
    data?: { user?: User; token?: string };
  };
  const user = parsed.user ?? parsed.data?.user;
  const token = parsed.token ?? parsed.data?.token;

  if (!user || !token) {
    throw new Error("Invalid response from server");
  }

  return { user, token };
};
