import { useQuery } from "@tanstack/react-query";
import { cartApi } from "../api";

interface UseCartWithShippingParams {
  address_id?: number | string | null;
  enabled?: boolean;
  requestId?: number;
}

export const useCartWithShipping = ({
  address_id,
  enabled = true,
  requestId,
}: UseCartWithShippingParams) => {
  const normalizedAddressId = address_id ?? undefined;
  const shouldEnable = normalizedAddressId !== undefined;

  return useQuery({
    queryKey: ["cart-with-shipping", normalizedAddressId, requestId],
    queryFn: () =>
      cartApi.getCart(
        normalizedAddressId === undefined
          ? undefined
          : { address_id: normalizedAddressId }
      ),
    enabled: enabled && shouldEnable,
    staleTime: 0, // Always fetch fresh data when shipping address changes
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes but allow refetching
  });
};
