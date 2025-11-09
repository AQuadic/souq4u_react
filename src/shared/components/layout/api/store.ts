import { axios } from "@/shared/lib/axios";

export interface StoreSettings {
  social?: {
    email?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    location?: { lat?: number; lng?: number };
    [key: string]: any;
  };
  slogan?: string;
}

export const getStoreSetting = async (key: string = "social"): Promise<any> => {
  const response = await axios.get(`/store/setting`, { params: { key } });
  return response.data?.[key] ?? {};
};
