import { useQuery } from "@tanstack/react-query";
import { orderTrackingApi } from "../api";
import { OrderTrackingResponse, PhoneData } from "../types";

export const useTrackOrderByEmail = (
  orderCode: string,
  email: string,
  enabled: boolean = true
) => {
  return useQuery<OrderTrackingResponse, Error>({
    queryKey: ["order-tracking", "email", orderCode, email],
    queryFn: () => orderTrackingApi.trackByEmail(orderCode, email),
    enabled: enabled && !!orderCode && !!email,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTrackOrderByPhone = (
  orderCode: string,
  phoneData: PhoneData,
  enabled: boolean = true
) => {
  return useQuery<OrderTrackingResponse, Error>({
    queryKey: [
      "order-tracking",
      "phone",
      orderCode,
      phoneData.phone,
      phoneData.phone_country,
    ],
    queryFn: () => orderTrackingApi.trackByPhone(orderCode, phoneData),
    enabled:
      enabled && !!orderCode && !!phoneData.phone && !!phoneData.phone_country,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
