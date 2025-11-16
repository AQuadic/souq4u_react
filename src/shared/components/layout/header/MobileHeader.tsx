import React, { useState } from "react";
import { X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/shared/components/ui/LanguageSwitcher";
import Cart from "@/features/cart/components/icons/Cart";
import Menu from "./icons/Menu";
import { CartSlider } from "@/features/cart/components/CartSlider";
import { useCartSlider } from "@/features/cart/hooks/useCartSlider";
import { useCartStore } from "@/features/cart/stores";
// import MainAuth from "@/features/auth/components/MainAuth";
import HeaderSearch from "./HeaderSearch";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  usePagesContextSafe,
  useHeaderNavigation,
} from "@/features/static-pages";
import LogoutDialog from "@/features/profile/sidebar/LogoutDialog";
import NotificationDropdown from "./notifications/NotificationDropdown";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "../../ui/accordion";

const MobileHeader = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const locale = i18n.language || "en";
  const location = useLocation();
  const { isOpen: isCartOpen, openCart, closeCart } = useCartSlider();
  const { user } = useAuth();

  // Get pages from context and build navigation links
  const pages = usePagesContextSafe();
  const navLinks = useHeaderNavigation(pages);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const cart = useCartStore((s) => s.cart);
  const cartItemsCount =
    cart?.items && Array.isArray(cart.items)
      ? cart.items.reduce((sum, it) => sum + (it?.quantity || 0), 0)
      : 0;

  // Helper function to check if the current path matches the link
  const isActivePath = (href: string) => {
    return (
      location.pathname === href || location.pathname.startsWith(`${href}/`)
    );
  };

  return (
    <header className="p-4 md:hidden flex items-center justify-between overflow-scroll">
      <Link to="/" className="w-full">
        <img src="/logo.png" width={80} height={40} alt="souq4u" />
      </Link>
      <div className="flex items-center gap-5 relative">
        {/* <button onClick={openCart} className="relative">
          <Cart />
          Badge: show when there are items in cart
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -left-2 min-w-[18px] h-[18px] rounded-full bg-main text-white text-[10px] font-bold flex items-center justify-center px-[5px] z-40 pointer-events-none">
              {cartItemsCount}
            </span>
          )}
        </button> */}
        {user && <NotificationDropdown />}
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
        className={`fixed top-0 right-0 h-full w-72 z-50 transform transition-transform duration-300 p-4
          bg-white text-gray-900
          overflow-y-auto overflow-x-hidden shadow-2xl
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="mb-8 hover:opacity-70 transition-opacity"
        >
          <X size={24} className="text-gray-700" />
        </button>

        <nav className="flex flex-col gap-6 mb-8">
          {navLinks.map((link) => (
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
              {locale === "ar" ? link.titleAr : link.titleEn}
            </Link>
          ))}
        </nav>

        {/* {user && (
          <Accordion type="single" collapsible className="w-full mt-4">
            <AccordionItem value="profile">
              <AccordionTrigger className="p-0 hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <h1 className="text-base font-medium hover:text-main transition-colors">
                    {t("Common.profile")}
                  </h1>
                </div>
              </AccordionTrigger>

              <AccordionContent className="mt-4 flex flex-col gap-4 text-lg hover:text-main transition-colors">
                <Link to="/profile/account">{t("Common.account")}</Link>
                <Link to="/notifications">Notification</Link> 
                <Link to="/change-password">Change Password</Link> 
                <Link to="/profile/favorites">{t("Common.favorite")}</Link>
                <Link to="/profile/orders">{t("Common.orders")}</Link>
                <Link to="/profile/addresses">{t("Common.saveAddress")}</Link>
                <button
                  onClick={() => setIsLogoutOpen(true)}
                  className="text-left text-red-600 hover:text-main transition-colors rtl:text-right"
                >
                  {t("Common.logout")}
                </button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )} */}

        <div className="mt-6 space-y-4">
          <div className="border-t border-gray-600 pt-4 flex items-center justify-between">
            <LanguageSwitcher mode="full" isMobile={true} className="" />
          </div>
          {/* <div className="border-t border-gray-600 pt-4">
            <MainAuth onProfileClick={() => setIsOpen(false)} />
          </div> */}
        </div>
      </div>

      <LogoutDialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen} />

      {/* Cart Slider */}
      <CartSlider isOpen={isCartOpen} onClose={closeCart} />
    </header>
  );
};

export default MobileHeader;
