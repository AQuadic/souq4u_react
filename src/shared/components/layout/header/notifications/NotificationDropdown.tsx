"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "../../../ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import {
  getNotifications,
  Notification as NotificationType,
} from "./api/getNotifications";
import { markNotificationAsRead } from "./api/markNotificationAsRead";
import { markNotificationAsUnread } from "./api/markNotificationAsUnread";
import { Link, useNavigate } from "react-router-dom";
import Notifications from "../icons/Notifications";
import { useTranslation } from "react-i18next";

export default function NotificationDropdown() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const isArabic = locale === "ar";
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

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

      setOpen(false);

      if (n.order_id) {
        navigate(`/profile/orders/tracking/${n.order_id}`);
      } else {
        navigate("/notifications");
      }

      await refetch();
    } catch (error) {
      console.error("Error toggling notification:", error);
    }
  };

  if (isLoading)
    return (
      <button className="relative">
        <Notifications />
        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-main animate-pulse" />
      </button>
    );

  if (isError)
    return (
      <button className="relative">
        <Notifications />
        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
      </button>
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
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="relative">
          <Notifications />
          {notifications.some((n) => !n.read_at) && (
            <span className="absolute -top-2 -left-2 min-w-[18px] h-[18px] rounded-full bg-main text-white text-[10px] font-bold flex items-center justify-center px-[5px]">
              {notifications.filter((n) => !n.read_at).length}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={isArabic ? "start" : "end"}
        className="md:w-[436px] bg-[#FDFDFD] text-white rounded-3xl border-none"
      >
        <div dir={isArabic ? "rtl" : "ltr"}>
          {hasNotifications ? (
            <>
              <div className="flex items-center justify-between p-4">
                <DropdownMenuLabel className="text-black text-2xl font-semibold">
                  {t("Notifications.notifications")}
                </DropdownMenuLabel>
                <Link
                  to="/notifications"
                  onClick={() => setOpen(false)}
                  className="text-main text-lg font-medium cursor-pointer"
                >
                  {t("Notifications.seeAll")}
                </Link>
              </div>

              {todayNotifications.length > 0 && (
                <div>
                  <h4 className="text-black px-5 pb-2 text-base font-semibold uppercase tracking-wide">
                    {t("Notifications.new")}
                  </h4>
                  {todayNotifications.map((n: NotificationType) => (
                    <DropdownMenuItem
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      onSelect={(e) => e.preventDefault()}
                      className="flex items-center gap-3 py-3 px-8 border-b border-[#E5E5E5] cursor-pointer hover:bg-[#f9f9f9]"
                    >
                      <div className="relative w-[40px] h-[40px]">
                        <img
                          src={"/logo.png"}
                          alt="Notification"
                          className={`w-full h-full object-cover rounded-full ${
                            n.read_at ? "opacity-70" : ""
                          }`}
                        />
                        {!n.read_at && (
                          <span className="absolute top-5 -right-3 h-2 w-2 rounded-full bg-main" />
                        )}
                      </div>

                      <div className="flex-1 flex flex-col justify-between gap-1 overflow-hidden">
                        <p
                          className={`text-sm font-medium leading-[150%] break-words ${
                            n.read_at ? "text-gray-500" : "text-black"
                          }`}
                        >
                          {isArabic ? n.body?.ar : n.body?.en}
                        </p>
                        <span className="text-[10px] font-medium text-[#A1A1A1] self-end">
                          {new Date(n.created_at).toLocaleString(locale, {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}

              {earlierNotifications.length > 0 && (
                <div>
                  <h4 className="px-5 pt-3 pb-2 text-base font-semibold text-black">
                    {t("Notifications.earlier")}
                  </h4>
                  {earlierNotifications.map((n: NotificationType) => (
                    <DropdownMenuItem
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      onSelect={(e) => e.preventDefault()}
                      className="flex items-center gap-3 py-3 px-8 border-b border-[#E5E5E5] cursor-pointer hover:bg-[#f9f9f9]"
                    >
                      <div className="relative w-[40px] h-[40px]">
                        <img
                          src={"/logo.png"}
                          alt="Notification"
                          className={`w-full h-full object-cover rounded-full ${
                            n.read_at ? "opacity-70" : ""
                          }`}
                        />
                        {!n.read_at && (
                          <span className="absolute top-5 -right-3 h-2 w-2 rounded-full bg-main" />
                        )}
                      </div>

                      <div className="flex-1 flex flex-col justify-between gap-1 overflow-hidden">
                        <p
                          className={`text-sm font-medium leading-[150%] break-words ${
                            n.read_at ? "text-gray-500" : "text-black"
                          }`}
                        >
                          {isArabic ? n.body?.ar : n.body?.en}
                        </p>
                        <span className="text-[10px] font-medium text-[#A1A1A1] self-end">
                          {new Date(n.created_at).toLocaleString(locale, {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-sm text-gray-400">{t("noNotifications")}</p>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
