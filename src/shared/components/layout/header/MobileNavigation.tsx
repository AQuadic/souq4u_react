"use client";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import NavigationFav from "./icons/NavigationFav";
import NavigationCart from "./icons/NavigationCart";
import NavigationProfile from "./icons/NavigationProfile";
import NavigationMainHome from "./icons/NavigationMainHome";
import { useAuthStore } from "@/features/auth";
import { useToast } from "@/shared/components/ui/toast";

const MobileNavigation = () => {
  const { t } = useTranslation("Common");
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const pathname = location.pathname;

  // ✅ Remove locale prefix (e.g. /en, /ar)
  const cleanPathname = pathname.replace(/^\/(en|ar)(\/|$)/, "/");
  const isAuth = useAuthStore((state) => state.isAuthenticated);

  const navItems = [
    { href: "/", label: t('Navigation.home'), icon: NavigationMainHome },
    { href: "/profile/favorites", label: t('Navigation.favorites'), icon: NavigationFav, protected: true,},
    { href: "/cart", label: t('Navigation.cart'), icon: NavigationCart },
    { href: "/profile/myAccount", label: t('Navigation.profile'), icon: NavigationProfile, protected: true, },
  ];

  const handleClick = (item: any) => {
    if (item.protected && !isAuth) {
      toast.error(t("Navigation.mustLoggin"));
      return;
    }
    navigate(item.href);
  };

  return (
    <div className="md:hidden fixed bottom-0 w-full h-[88px] bg-[#FDFDFD] rounded-tl-[20px] rounded-tr-[20px] flex items-center justify-around px-4 z-50">
      {navItems.map((item) => {
        const isActive =
          (cleanPathname === item.href ||
            (item.href !== "/" && cleanPathname.startsWith(item.href + "/"))) &&
          !(
            item.href === "/profile" &&
            cleanPathname.startsWith("/profile/favorites")
          );

        const Icon = item.icon;

        return (
          <button
            key={item.href}
            onClick={() => handleClick(item)}
            className={`flex flex-row items-center justify-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 ${
              isActive
                ? "bg-main/20 shadow-lg scale-105"
                : "bg-transparent hover:bg-white/5"
            }`}
          >
            <Icon
              className="w-6 h-6 transition-all duration-300"
              isActive={isActive}
            />
            {isActive && (
              <span className="text-xs font-semibold text-main whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                {item.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default MobileNavigation;
