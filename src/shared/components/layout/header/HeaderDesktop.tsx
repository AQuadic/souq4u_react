import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/shared/components/ui/LanguageSwitcher";
import Cart from "@/features/cart/components/icons/Cart";
import MainAuth from "@/features/auth/components/MainAuth";
import { CartSlider } from "@/features/cart/components/CartSlider";
import { useCartSlider } from "@/features/cart/hooks/useCartSlider";
import { useCartStore } from "@/features/cart/stores";
import { useAuth } from "@/features/auth/hooks/useAuth";
import HeaderSearch from "./HeaderSearch";
import NotificationDropdown from "./notifications/NotificationDropdown";
import {
  usePagesContextSafe,
  useHeaderNavigation,
} from "@/features/static-pages";

const HeaderDesktop = () => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const locale = i18n.language;

  const { isOpen: isCartOpen, openCart, closeCart } = useCartSlider();
  const { user } = useAuth();

  // Get pages from context and build navigation links
  const pages = usePagesContextSafe();
  const navLinks = useHeaderNavigation(pages);

  const cart = useCartStore((s) => s.cart);
  const cartItemsCount =
    cart?.items && Array.isArray(cart.items)
      ? cart.items.reduce((sum, it) => sum + (it?.quantity || 0), 0)
      : 0;

  return (
    <header
      className="md:flex hidden"
      style={{ boxShadow: "0px 0px 6px 0px #0000001F" }}
    >
      <div className="container py-5">
        <div className="flex items-center justify-between">
          <div className="sm:w-[212px]">
            <Link to="/">
              <img src="/logo.png" width={80} height={40} alt="souq4u" />
            </Link>
          </div>

          <div className="flex items-center gap-[30px]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-lg font-medium ${
                  location.pathname === link.href
                    ? "text-main font-semibold"
                    : "text-foreground"
                }`}
              >
                {locale === "ar" ? link.titleAr : link.titleEn}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher mode="icon" />

            {user && (
              <>
                <NotificationDropdown />
                <button className="cursor-pointer relative" onClick={openCart}>
                  <Cart />
                  {cartItemsCount > 0 && (
                    <span className="absolute top-0 left-0 h-3 w-3 rounded-full bg-main z-40 pointer-events-none" />
                  )}
                </button>
              </>
            )}
            <HeaderSearch />
            <MainAuth />
          </div>
        </div>

        <CartSlider isOpen={isCartOpen} onClose={closeCart} />
      </div>
    </header>
  );
};

export default HeaderDesktop;
