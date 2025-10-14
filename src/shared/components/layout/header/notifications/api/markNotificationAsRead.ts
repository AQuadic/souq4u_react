import { axios } from "@/shared/lib/axios";
import { AxiosError } from "axios";

export interface MarkNotificationAsReadResponse {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
}

export const markNotificationAsRead = async (
  notificationId: string
): Promise<MarkNotificationAsReadResponse> => {
  try {
    const response = await axios.post(`/notification/read/${notificationId}`, null, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    const message = err.response?.data?.message || "Failed to mark notification as read";
    throw new Error(message);
  }
};