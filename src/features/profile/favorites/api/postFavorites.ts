import { axios } from "@/shared/lib/axios";

export interface AddFavoriteParams {
  favorable_id: number;
  favorable_type: string;
}

export interface FavoriteResponse {
  id: number;
  favorable_id: number;
  favorable_type: string;
  created_at: string;
}

export const addFavorite = async (
  params: AddFavoriteParams
): Promise<FavoriteResponse> => {
  try {
    const response = await axios.post<FavoriteResponse>(
      "/favorites/toggle",
      params,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding favorite:", error);
    throw error;
  }
};
