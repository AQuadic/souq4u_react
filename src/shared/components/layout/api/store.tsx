import { axios } from "@/shared/lib/axios";

export interface StoreSetting {
  key: string;
  value: string;
}

export const getStoreSetting = async (key: string): Promise<StoreSetting> => {
  const response = await axios.get(`/store/setting`, {
    params: { key },
  });
  return response.data;
};
