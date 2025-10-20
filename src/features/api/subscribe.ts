import { axios } from "@/shared/lib/axios";
import { getErrorMessage } from "@/shared/utils/errorHandler";

export interface SubscribeResponse {
  message?: string;
}

export interface PhoneData {
  phone: string;
  phone_country: string;
}

/**
 * Subscribe an email to the store newsletter.
 */
export const subscribeEmail = async (email: string) => {
  try {
    const res = await axios.request<SubscribeResponse>({
      method: "POST",
      url: "/subscribe",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: { email },
    });
    return res.data;
  } catch (err) {
    // Re-throw with a friendly message where possible
    const msg = getErrorMessage(err) || "Failed to subscribe";
    const e = new Error(msg);
    throw e;
  }
};

/**
 * Subscribe a phone number to the store newsletter.
 */
export const subscribePhone = async (phoneData: PhoneData) => {
  try {
    const res = await axios.request<SubscribeResponse>({
      method: "POST",
      url: "/store/subscribe",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: {
        phone: phoneData.phone,
        phone_country: phoneData.phone_country,
      },
    });
    return res.data;
  } catch (err) {
    // Re-throw with a friendly message where possible
    const msg = getErrorMessage(err) || "Failed to subscribe";
    const e = new Error(msg);
    throw e;
  }
};

/**
 * Subscribe with either email or phone to the store newsletter.
 */
export const subscribe = async (
  contactType: "email" | "phone",
  contactInfo: string,
  phoneCountry?: string
): Promise<SubscribeResponse> => {
  if (contactType === "email") {
    return subscribeEmail(contactInfo);
  } else {
    if (!phoneCountry) {
      throw new Error("Phone country code is required for phone subscription");
    }
    return subscribePhone({
      phone: contactInfo,
      phone_country: phoneCountry,
    });
  }
};
