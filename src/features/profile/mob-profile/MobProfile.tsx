"use client";

import BackArrow from "@/features/products/icons/BackArrow";
import React from "react";
import { useUser } from "@/features/auth/stores/auth-store";
import Profile from "@/shared/components/layout/header/icons/Profile";
import Language from "@/shared/components/layout/header/icons/Language";
// import ThemeToggle from "@/shared/components/layout/header/ThemeToggle";
import LogoutDialog from "../sidebar/LogoutDialog";
import LanguageSwitcher from "@/shared/components/ui/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import OrdersIcon from "@/shared/components/layout/header/icons/OrdersIcon";
import PrivacyPolicyIcon from "@/shared/components/layout/header/icons/PrivacyPolicyIcon";
import TermsIcon from "@/shared/components/layout/header/icons/TermsIcon";
import LogoutIcon from "@/shared/components/layout/header/icons/LogoutIcon";
import ContactIcon from "@/shared/components/layout/header/icons/ContactIcon";

const MobProfile = () => {
    const {t, i18n} = useTranslation("Profile");
    const user = useUser();
    const locale = i18n.language;
    const isRTL = locale === "ar";
    const getInitials = (name: string | undefined | null) => {
        if (!name) return "";
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return (parts[0][0] + parts[1][0]).toUpperCase();
    };

    return (
        <div className="container">
        <Link
            to="/profile/account"
            className="flex items-center gap-2 md:hidden"
            >
            <div className={`${isRTL ? "rotate-180" : ""} transition-transform`}>
                <BackArrow />
            </div>
            <h1 className="text-xl font-semibold leading-[100%]">
                {t("Profile.title") || "My Account"}
            </h1>
        </Link>

        {/* User section */}
        <div className="w-full h-[72px] bg-[#F7F7F7] rounded-[8px] my-4 flex items-center gap-3 px-4">
            <div className="w-[51.25px] h-[51.25px] rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-lg font-semibold text-white">
                {getInitials(user?.name)}
            </div>

            <div>
            <h2 className="text-base font-medium leading-[100%] text-gray-900 dark:text-white">
                {user?.name}
            </h2>
            <p className="text-xs font-medium leading-[100%] mt-2 text-gray-500 dark:text-gray-300">
                {user?.email || user?.phone}
            </p>
            </div>
        </div>

        {/* Second section */}
        <div className="w-full h-full bg-[#F7F7F7] rounded-[8px] my-4 py-3 px-4">
            <Link
                to="/profile/mobileAccount"
                className="flex items-center gap-2"
                >
                    <Profile />
                    <p className="text-base font-semibold">{t('Profile.account')}</p>
            </Link>

            <Link
                to="/profile/orders"
                className="flex items-center gap-2 mt-5"
                >
                    <OrdersIcon />
                    <p className="text-base font-semibold">{t('Profile.orders')}</p>
            </Link>
        </div>

        {/* Third section */}
        <div className="w-full h-full bg-[#F7F7F7] rounded-[8px] my-4 py-3 px-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Language />
                    <p className="text-sm font-semibold leading-[100%]">{t('Profile.language')}</p>
                </div>
                <LanguageSwitcher 
                    mode="text"
                    isMobile={false}
                    showArrow={true}
                    className="text-main text-sm font-medium"
                />
            </div>

            {/* <div className="flex items-center justify-between mt-5">
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <p className="text-sm font-semibold leading-[100%]">{t('Profile.darkMode')}</p>
                </div>
                
                <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="relative w-11 h-6 bg-[#F7F7F7] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                </label>
            </div> */}
        </div>

        {/* Fourth section */}
        <div className="w-full h-full bg-[#F7F7F7] rounded-[8px] my-4 py-3 px-4">
            <Link to='/pages/privacy-policy' className="flex items-center gap-2">
                <PrivacyPolicyIcon />
                <p className="text-sm font-semibold">{t('Profile.privacy')}</p>
            </Link>

            <Link to='/pages/terms-and-conditions' className="flex items-center gap-2 mt-5">
                <TermsIcon />
                <p className="text-sm font-semibold">{t('Profile.terms')}</p>
            </Link>

            <Link to='/contact' className="flex items-center gap-2 mt-5">
                <ContactIcon />
                <p className="text-sm font-semibold">{t('Profile.contactUs')}</p>
            </Link>
        </div>

        {/* Sign out */}
        <div className="w-full h-full bg-[#F7F7F7] rounded-[8px] my-4 py-3 px-4 flex items-center gap-2">
            <LogoutIcon />
            <LogoutDialog />
        </div>

        </div>
    );
};

export default MobProfile;
