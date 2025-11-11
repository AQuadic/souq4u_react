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
  cursor?: string;
}

export interface NotificationsResponse {
  data: Notification[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    path: string;
    per_page: number;
    next_cursor: string | null;
    prev_cursor: string | null;
  };
}

export const getNotifications = async (
  params?: GetNotificationsParams
): Promise<NotificationsResponse> => {
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

    if (response.data) {
      return response.data;
    }

    return {
      data: [],
      links: {
        first: null,
        last: null,
        prev: null,
        next: null,
      },
      meta: {
        path: "",
        per_page: 15,
        next_cursor: null,
        prev_cursor: null,
      },
    };
  } catch (error: unknown) {
    console.error("Failed to fetch notifications:", error);
    throw new Error(
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || "Failed to fetch notifications"
    );
  }
};
