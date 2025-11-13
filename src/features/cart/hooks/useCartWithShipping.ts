import { useQuery } from "@tanstack/react-query";
import { cartApi } from "../api";

interface UseCartWithShippingParams {
  city_id?: string;
  area_id?: string;
  enabled?: boolean;
  requestId?: number;
}

export const useCartWithShipping = ({
  city_id,
  area_id,
  enabled = true,
  requestId,
}: UseCartWithShippingParams) => {
  return useQuery({
    queryKey: ["cart-with-shipping", city_id, area_id, requestId],
    queryFn: () => cartApi.getCart({ city_id, area_id }),
    enabled: enabled && !!city_id && !!area_id,
    staleTime: 0, // Always fetch fresh data when shipping address changes
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes but allow refetching
  });
};
