import React, { useState } from "react";
import { X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/shared/components/ui/LanguageSwitcher";
// import Cart from "@/features/cart/components/icons/Cart";
import Menu from "./icons/Menu";
// import { CartSlider } from "@/features/cart/components/CartSlider";
// import { useCartSlider } from "@/features/cart/hooks/useCartSlider";
// import { useCartStore } from "@/features/cart/stores";

// import MainAuth from "@/features/auth/components/MainAuth";
import HeaderSearch from "./HeaderSearch";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "../../ui/accordion";
// import { useAuth } from "@/features/auth/hooks/useAuth";
import { NavLinks } from "./NavLinks";

const MobileHeader = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const locale = i18n.language || "en";
  const location = useLocation();

  // Helper function to check if the current path matches the link
  const isActivePath = (href: string) => {
    return (
      location.pathname === href || location.pathname.startsWith(`${href}/`)
    );
  };

  return (
    <header className="p-4 md:hidden flex items-center justify-between overflow-scroll">
      <Link to="/">
        <img src="/logo.png" width={80} height={40} alt="souq4u" />
      </Link>
      <div className="flex items-center gap-5 relative">
        <HeaderSearch />
        <button onClick={() => setIsOpen(true)} className="">
          <Menu />
        </button>
      </div>
      {isOpen && (
        <button
          className="fixed inset-0 bg-black/80 z-40"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-72 z-50 transform transition-transform duration-300 
          bg-white text-gray-900
          overflow-y-auto overflow-x-hidden shadow-2xl
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6">
          <button
            onClick={() => setIsOpen(false)}
            className="mb-8 hover:opacity-70 transition-opacity"
          >
            <X size={24} className="text-gray-700" />
          </button>

          <nav className="flex flex-col gap-6 mb-8">
            {NavLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-base font-normal transition-colors ${
                  isActivePath(link.href)
                    ? "text-main font-semibold"
                    : "text-gray-700 hover:text-main"
                }`}
              >
                {t(link.translationKey) ||
                  link.name[locale as keyof typeof link.name]}
              </Link>
            ))}
          </nav>

          {/* Language switcher */}
          <div className="space-y-4 mt-auto pt-6 border-t border-gray-200">
            <LanguageSwitcher mode="full" isMobile={true} className="" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
