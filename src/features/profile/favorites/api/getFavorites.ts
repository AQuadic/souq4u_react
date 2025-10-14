import { axios } from "@/shared/lib/axios";

export interface ApiFavoriteItem {
  id: number;
  user_id: number;
  favorable_type: string;
  favorable_id: number;
  favorable: {
    id: number;
    name: { ar: string; en: string };
    short_description: { ar: string; en: string };
    image?: { url: string };
  };
  created_at: string;
  updated_at: string;
}

export const getFavorites = async (): Promise<ApiFavoriteItem[]> => {
    try {
        const response = await axios.get<ApiFavoriteItem[]>("/favorites", {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
