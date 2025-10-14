import { axios } from "@/shared/lib/axios";

export const markNotificationAsUnread = async (notificationId: string) => {
  try {
    const response = await axios.post(
      `/notification/unread/${notificationId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error marking notification as unread:", error);
    throw error;
  }
};