import { axios } from "@/shared/lib/axios";

export interface Notification {
  id: string;
  title: { ar: string; en: string };
  body: { ar: string; en: string };
  image?: { url: string | null };
  order_id?: string;
  created_at: string;
  read_at?: string | null;
  type?: string | null;
  [key: string]: unknown;
}

export interface GetNotificationsParams {
  type?: string;
}

export const getNotifications = async (
  params?: GetNotificationsParams
): Promise<Notification[]> => {
  try {
    const response = await axios.get("/notification", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Tenant-Id": 2,
      },
      params,
    });

    console.log("Notifications response:", response.data);

    if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    return [];
  } catch (error: any) {
    console.error("Failed to fetch notifications:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch notifications"
    );
  }
};
