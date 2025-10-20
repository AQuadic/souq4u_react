"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  addressTitle?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm?: () => void;
  lang?: "en" | "ar";
}

export default function DeleteAddressDialog(props: Readonly<Props>) {
  const { addressTitle, open, onOpenChange, onConfirm, lang } = props;

  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation("Address.deleteDialog");

  // Use language from props or from i18next
  const locale = lang ?? (i18n.language as "en" | "ar");
  const isRTL = locale === "ar";

  const dialogOpen = open ?? isOpen;
  const setDialogOpen = onOpenChange ?? setIsOpen;

  const handleConfirm = async () => {
    try {
      onConfirm?.();
      setDialogOpen(false);
    } catch (err) {
      console.error("Delete address error:", err);
    }
  };

  return (
    <div className={`${isRTL ? "rtl" : "ltr"}`}>
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button
            aria-label={t("no")}
            onClick={() => setDialogOpen(false)}
            className="fixed inset-0 bg-black/50"
          />

          <div className="relative z-10 w-full max-w-[500px] mx-4">
            <div className="rounded-3xl border-none bg-white dark:bg-[#121216] shadow-xl">
              <div className="px-6 pt-6">
                <h2 className="text-center leading-[150%] text-gray-900 dark:text-gray-100 text-2xl font-medium">
                  {t("Address.deleteDialog.title")}
                </h2>
              </div>

              <div className="px-6 mt-4 text-center">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {t("Address.deleteDialog.description", { title: addressTitle || "" })}
                </p>
              </div>

              <div className="flex justify-center gap-4 px-6 py-6">
                <button
                  onClick={handleConfirm}
                  aria-label={t("yes")}
                  className="w-[140px] h-12 rounded-[8px] bg-main hover:bg-main text-white text-base font-medium cursor-pointer transition-colors"
                >
                  {t("Address.deleteDialog.yes")}
                </button>
                <button
                  onClick={() => setDialogOpen(false)}
                  aria-label={t("no")}
                  className="w-[140px] h-12 rounded-[8px] border border-gray-300 dark:border-gray-700 text-base font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  {t("Address.deleteDialog.no")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
