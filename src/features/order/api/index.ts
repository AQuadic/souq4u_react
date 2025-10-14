import { axios } from "@/shared/lib/axios";
import { OrderTrackingResponse, PhoneData } from "../types";

export const orderTrackingApi = {
  // Track order by email
  trackByEmail: async (
    orderCode: string,
    email: string
  ): Promise<OrderTrackingResponse> => {
    const response = await axios.get(`/orders/code/${orderCode}`, {
      params: { email },
    });
    return response.data;
  },

  // Track order by phone
  trackByPhone: async (
    orderCode: string,
    phoneData: PhoneData
  ): Promise<OrderTrackingResponse> => {
    const response = await axios.get(`/orders/code/${orderCode}`, {
      params: {
        phone: phoneData.phone,
        phone_country: phoneData.phone_country,
      },
    });
    return response.data;
  },
};
