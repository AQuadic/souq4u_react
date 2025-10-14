import { axios } from "@/shared/lib/axios";

export interface CancelOrderPayload {
  order_id: number;
}

export interface CancelOrderResponse {
  success: boolean;
  message: string;
}

export async function cancelOrder(
  payload: CancelOrderPayload
): Promise<CancelOrderResponse> {
  const res = await axios.post("/orders/cancel", payload, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return res.data;
}
