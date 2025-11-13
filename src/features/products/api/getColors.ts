import { axios } from "@/shared/lib/axios";

export interface Color {
  id: number;
  name?:
    | {
        ar?: string;
        en?: string;
      }
    | string;
  // Hex code returned in some payloads
  hex_code?: string;
  // Use `special_value` when available (some APIs return the color hex here)
  special_value?: string;
}

export async function getColors(): Promise<Color[]> {
  const { data } = await axios.get<Color[]>("/product/colors");
  return data;
}
