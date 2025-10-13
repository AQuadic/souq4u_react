"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

import { useAuthActions } from "@/features/auth/stores/auth-store";
import { useCartStore } from "@/features/cart/stores";
import { useAddressStore } from "@/features/address/stores";
import { useToast } from "@/shared/components/ui/toast/toast-store";

interface Props {
  label?: string;
  readonly isActive?: boolean;
  onTriggerClick?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  lang?: "en" | "ar";
}

export default function LogoutDialog(props: Readonly<Props>) {
  const {
    label,
    isActive = false,
    onTriggerClick,
    open,
    onOpenChange,
    lang,
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  const t = useTranslations("Auth.logoutDialog");
  const locale = useLocale() as "en" | "ar" | undefined;

  const router = useRouter();
  const queryClient = useQueryClient();

  // actions from stores
  const { clearAuth, logout } = useAuthActions();
  const clearCart = useCartStore((s) => s.clearCart);
  const clearAddresses = useAddressStore((s) => s.clearAddresses);
  const toast = useToast();

  const resolvedLabel = label ?? t("triggerLabel");

  const handleLogout = async () => {
    try {
      // Clear client-side state: auth, cart, addresses, toasts, react-query cache
      console.log("Logging out: clearing client state and redirecting to home");

      // Clear cookies that may store tokens or session ids
      try {
        Cookies.remove("o-branchy-token", { path: "/" });
        Cookies.remove("o-branchy-token");
        // common cart/session cookie names (best-effort)
        Cookies.remove("o-branchy-cart-session", { path: "/" });
        Cookies.remove("o-branchy-cart-session");
      } catch (e) {
        console.warn("Failed to remove some cookies during logout", e);
      }

      // Clear zustand stores - prefer explicit clearAuth, fallback to logout
      if (typeof clearAuth === "function") {
        try {
          clearAuth();
        } catch (err) {
          console.warn("clearAuth failed during logout:", err);
        }
      } else if (typeof logout === "function") {
        try {
          logout();
        } catch (err) {
          console.warn("logout failed during logout:", err);
        }
      }

      try {
        clearCart();
      } catch (e) {
        console.warn("Failed to clear cart", e);
      }

      try {
        clearAddresses();
      } catch (e) {
        console.warn("Failed to clear addresses", e);
      }

      // clear react query cache and cancel running queries
      try {
        queryClient.cancelQueries();
        queryClient.clear();
      } catch (e) {
        console.warn("Failed to clear react-query client", e);
      }

      // clear toasts
      try {
        toast.clear();
      } catch (e) {
        console.warn("Failed to clear toasts", e);
      }

      // close dialog
      setIsOpen(false);
      onOpenChange?.(false);

      // navigate to home (replace so user can't go back to protected pages)
      router.replace("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const dialogOpen = open ?? isOpen;
  const setDialogOpen = onOpenChange ?? setIsOpen;
  const isRTL = (lang ?? locale) === "ar";

  return (
    // Do not force a local 'dark' class here — rely on global theme (html/body) so dialog follows app theme
    <div className={`${isRTL ? "rtl" : "ltr"}`}>
      {/* Dialog Trigger */}
      {typeof open === "undefined" && (
        <button
          onClick={() => {
            onTriggerClick?.();
            setIsOpen(true);
          }}
          className={`transition-colors text-base text-left rtl:text-right cursor-pointer ${
            isActive && "text-main font-bold"
          }`}
        >
          {resolvedLabel}
        </button>
      )}

      {/* Dialog Overlay */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button
            aria-label={t("no")}
            onClick={() => setDialogOpen(false)}
            className="fixed inset-0 bg-black/50"
          />

          {/* Dialog Content */}
          <div className="relative z-10 w-full max-w-[500px] mx-4">
            <div className="rounded-3xl border-none bg-white dark:bg-[#121216] shadow-xl">
              {/* Header */}
              <div className="px-6 pt-6">
                <h2 className="text-center leading-[150%] text-gray-900 dark:text-gray-100 text-2xl font-medium">
                  {t("title")}
                </h2>
              </div>

              {/* Content */}
              <div className="px-6 mt-4 text-center">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {t("description")}
                </p>
              </div>

              {/* Footer */}
              <div className="flex justify-center gap-4 px-6 py-6">
                <button
                  onClick={handleLogout}
                  aria-label={t("yes")}
                  className="w-[140px] h-12 rounded-[8px] bg-red-600 hover:bg-main text-white text-base font-medium cursor-pointer transition-colors"
                >
                  {t("yes")}
                </button>
                <button
                  onClick={() => setDialogOpen(false)}
                  aria-label={t("no")}
                  className="w-[140px] h-12 rounded-[8px] border border-gray-300 dark:border-gray-700 text-base font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  {t("no")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
