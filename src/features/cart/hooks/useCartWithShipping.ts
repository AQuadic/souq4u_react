import { useQuery } from "@tanstack/react-query";
import { cartApi } from "../api";

interface UseCartWithShippingParams {
  city_id?: string;
  area_id?: string;
  enabled?: boolean;
}

export const useCartWithShipping = ({
  city_id,
  area_id,
  enabled = true,
}: UseCartWithShippingParams) => {
  return useQuery({
    queryKey: ["cart-with-shipping", city_id, area_id],
    queryFn: () => cartApi.getCart({ city_id, area_id }),
    enabled: enabled && !!city_id && !!area_id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
