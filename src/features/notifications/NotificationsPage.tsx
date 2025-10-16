"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getNotifications,
  Notification as NotificationType,
} from "@/shared/components/layout/header/notifications/api/getNotifications";
import { markNotificationAsRead } from "@/shared/components/layout/header/notifications/api/markNotificationAsRead";
import { markNotificationAsUnread } from "@/shared/components/layout/header/notifications/api/markNotificationAsUnread";
import { useTranslation } from "react-i18next";

export default function NotificationsPage() {
  const { t, i18n } = useTranslation("Notifications");
  const locale = i18n.language || "en";
  const isArabic = locale.startsWith("ar");


  const {
    data: notifications = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(),
  });

  const handleNotificationClick = async (n: NotificationType) => {
    try {
      if (!n.read_at) {
        await markNotificationAsRead(n.id.toString());
      } else {
        await markNotificationAsUnread(n.id.toString());
      }
      await refetch();
    } catch (error) {
      console.error("Error toggling notification:", error);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        {t("loading")}...
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center py-20 text-red-500">
        {t("errorLoading")}
      </div>
    );

  const today = new Date().toDateString();
  const todayNotifications = notifications.filter(
    (n) => new Date(n.created_at).toDateString() === today
  );
  const earlierNotifications = notifications.filter(
    (n) => new Date(n.created_at).toDateString() !== today
  );
  const hasNotifications =
    todayNotifications.length > 0 || earlierNotifications.length > 0;

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen text-black p-6 md:p-10"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">{t("Notifications.notifications")}</h1>
      </div>

      {hasNotifications ? (
        <div className="space-y-6">
          {todayNotifications.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-3">{t("Notifications.new")}</h2>
              <div className="space-y-2">
                {todayNotifications.map((n: NotificationType) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition
                      ${
                        n.read_at
                          ? "bg-transparent border-none text-black"
                          : "bg-[#D7D7D7] border-[#D7D7D7] hover:bg-[#cfcfcf] text-black"
                      }`}
                  >
                    <div className="relative px-4">
                      <img
                        src={n.image?.url || "/images/header/logo.png"}
                        alt="User"
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                      {!n.read_at && (
                        <span className="absolute top-5 ltr:left-0 rtl:right-0 h-2 w-2 rounded-full bg-main" />
                      )}
                    </div>

                    <div className="flex-1 flex items-center justify-between gap-2">
                      <p
                        className={`text-sm font-medium leading-[150%] truncate ${
                          n.read_at ? "text-black" : "text-black"
                        }`}
                      >
                        {isArabic ? n.body?.ar : n.body?.en}
                      </p>
                      <span
                        className={`text-xs whitespace-nowrap ${
                          n.read_at ? "text-[#A1A1A1]" : "text-gray-700"
                        }`}
                      >
                        {new Date(n.created_at).toLocaleString(locale, {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {earlierNotifications.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-3">{t("Notifications.earlier")}</h2>
              <div className="space-y-">
                {earlierNotifications.map((n: NotificationType) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`flex items-center gap-3 px-4 py-2 cursor-pointer border-b transition
                      ${
                        n.read_at
                          ? "bg-transparent hover:bg-[#2b2c2f] text-white"
                          : "bg-[#D7D7D7] hover:bg-[#cfcfcf] text-black"
                      }`}
                  >
                    <div className="relative px-2">
                      <img
                        src={n.image?.url || "/images/header/logo.png"}
                        alt="User"
                        width={50}
                        height={50}
                        className={`rounded-full ${
                          n.read_at ? "opacity-70" : ""
                        }`}
                      />
                      {!n.read_at && (
                        <span className="absolute top-5 left-0 h-2 w-2 rounded-full bg-main" />
                      )}
                    </div>

                    <div className="flex-1 flex items-center justify-between gap-2">
                      <p
                        className={`text-sm font-medium leading-[150%] truncate ${
                          n.read_at ? "text-gray-300" : "text-black"
                        }`}
                      >
                        {isArabic ? n.body?.ar : n.body?.en}
                      </p>
                      <span
                        className={`text-xs whitespace-nowrap ${
                          n.read_at ? "text-[#A1A1A1]" : "text-gray-700"
                        }`}
                      >
                        {new Date(n.created_at).toLocaleString(locale, {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-gray-400">{t("noNotifications")}</p>
        </div>
      )}
    </div>
  );
}