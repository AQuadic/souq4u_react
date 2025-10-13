import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/shared/components/ui/LanguageSwitcher";
// import Cart from "@/features/cart/components/icons/Cart";
// import MainAuth from "@/features/auth/components/MainAuth";
// import { CartSlider } from "@/features/cart/components/CartSlider";
// import { useCartSlider } from "@/features/cart/hooks/useCartSlider";
// import { useCartStore } from "@/features/cart/stores";
// import { useAuth } from "@/features/auth/hooks/useAuth";

import HeaderSearch from "./HeaderSearch";
import { NavLinks } from "./NavLinks";

const HeaderDesktop = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "en";

  return (
    <header
      className=" md:flex hidden"
      style={{ boxShadow: "0px 0px 6px 0px #0000001F" }}
    >
      <div className="container py-5">
        <div className="flex items-center justify-between ">
          <div className="sm:w-[212px]">
            <Link to="/">
              <img src="/logo.png" width={80} height={40} alt="souq4u" />
            </Link>
          </div>

          <div className="flex items-center gap-[30px]">
            {NavLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-lg font-medium ${
                  location.pathname === link.href
                    ? "text-main font-semibold"
                    : "text-foreground"
                }`}
              >
                {t(link.translationKey) ||
                  link.name[locale as keyof typeof link.name]}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher mode="icon" />
            <HeaderSearch />
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderDesktop;
