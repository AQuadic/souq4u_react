"use client";

import React from "react";
import { Link, useLocation } from "react-router-dom";
import LogoutDialog from "./LogoutDialog";
import { useTranslation } from "react-i18next";

// keep keys here so messages can be provided via i18next files
const links = [
  { href: "/profile/account", key: "Profile.account" },
  { href: "/profile/favorites", key: "Profile.favorites" },
  { href: "/profile/orders", key: "Profile.orders" },
  { href: "/profile/addresses", key: "Profile.addresses" },
  { href: "/signout", key: "Auth.logoutDialog.triggerLabel", isLogout: true },
];

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  return (
    <aside className="lg:block hidden min-w-[276px] h-[544px] bg-[#F7F7F7] py-10 px-6 rounded-lg">
      <nav className="flex flex-col gap-10">
        {links.map((link) => {
          const isActive = currentPath.includes(link.href);
          const label = t(link.key ?? "");

          if (link.isLogout) {
            return (
              <LogoutDialog
                key={link.href}
                isActive={isActive}
                label={label}
                lang={locale as "en" | "ar"}
              />
            );
          }

          return (
            <Link
              key={link.href}
              to={link.href} // ✅ 'to' instead of 'href'
              className={`transition-colors text-base hover:text-main ${
                isActive ? "text-black font-bold" : ""
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}