import { axios } from "@/shared/lib/axios";

export interface StoreSocialSettings {
  email?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  location?: {
    lat?: number;
    lng?: number;
  };
  [key: string]: any;
}

export const getStoreSetting = async (): Promise<StoreSocialSettings> => {
  const response = await axios.get(`/store/setting`, {
    params: { key: "social" },
  });

  // response.data.social contains the actual info
  const social = response.data?.social ?? {};

  return social;
};
