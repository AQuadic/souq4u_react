import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Globe, Check } from "lucide-react";

export interface LanguageSwitcherProps {
  mode?: "icon" | "text" | "full";
  className?: string;
  showArrow?: boolean;
  isMobile?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  mode = "icon",
  className = "",
  showArrow = true,
  isMobile = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingLocale, setPendingLocale] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { i18n, t } = useTranslation();
  const currentLocale = i18n.language || "en";

  const availableLanguages = ["en", "ar"];

  const languageNames: Record<
    string,
    { en: string; ar: string; native: string }
  > = {
    en: { en: "English", ar: "الإنجليزية", native: "English" },
    ar: { en: "Arabic", ar: "العربية", native: "العربية" },
    fr: { en: "French", ar: "الفرنسية", native: "Français" },
    es: { en: "Spanish", ar: "الإسبانية", native: "Español" },
    de: { en: "German", ar: "الألمانية", native: "Deutsch" },
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (locale: string) => {
    setIsOpen(false);
    setPendingLocale(locale);

    // Change language using i18next
    i18n.changeLanguage(locale);

    // Update HTML attributes
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;

    // Store preference in localStorage
    localStorage.setItem("i18nextLng", locale);

    setTimeout(() => setPendingLocale(null), 500);
  };

  const getCurrentLanguageDisplay = () => {
    const effectiveLocale = pendingLocale || currentLocale;
    const langInfo = languageNames[effectiveLocale];
    if (!langInfo) return effectiveLocale.toUpperCase();

    switch (mode) {
      case "text":
      case "full":
        return langInfo.native;
      default:
        return effectiveLocale.toUpperCase();
    }
  };

  if (availableLanguages.length <= 1) return null;

  /**
   * Always light theme, but keep dark support
   */
  const themeClasses = {
    button:
      "text-gray-700 hover:text-main transition-colors duration-300 dark:text-gray-200 dark:hover:text-main",
    dropdown:
      "bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700",
    header:
      "text-gray-500 border-b border-gray-100 px-3 py-2 text-xs font-medium dark:text-gray-400 dark:border-gray-700",
    item: "text-gray-700 hover:bg-gray-50 px-3 py-2 text-sm rounded-md w-full text-left transition-colors duration-200 dark:text-gray-300 dark:hover:bg-gray-700",
    activeItem:
      "bg-main/10 text-main font-medium dark:bg-main/20 dark:text-main",
    itemSubtext: "text-gray-500 text-xs mt-0.5 dark:text-gray-400",
  };

  if (isMobile) {
    return (
      <div className={`${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between w-full px-4 py-3 ${themeClasses.button}`}
          aria-label={t("switchLanguage")}
        >
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5" />
            <span className="text-sm font-medium">
              {getCurrentLanguageDisplay()}
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="px-4 pb-2">
            {availableLanguages.map((locale) => {
              const langInfo = languageNames[locale];
              const isCurrentLocale = locale === currentLocale;
              if (isCurrentLocale) return null;

              return (
                <button
                  key={locale}
                  onClick={() => handleLanguageChange(locale)}
                  className={`${themeClasses.item} mb-1`}
                >
                  <div className="flex items-center gap-2">
                    <span>{langInfo?.native || locale.toUpperCase()}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Desktop version
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 ${themeClasses.button} cursor-pointer`}
        aria-label={t("header.switchLanguage")}
        title={t("header.switchLanguage")}
      >
        {mode === "icon" && <Globe className="w-5 h-5" />}

        {(mode === "text" || mode === "full") && (
          <span className="text-sm font-medium">
            {getCurrentLanguageDisplay()}
          </span>
        )}

        {showArrow && (
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <button
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
            aria-label="Close language menu"
            tabIndex={-1}
          />

          {/* Dropdown */}
          <div
            className={`absolute top-full right-0 mt-2 min-w-[170px] ${themeClasses.dropdown} z-50 overflow-hidden`}
          >
            <div className="py-2">
              <div className={themeClasses.header}>
                {t("header.selectLanguage")}
              </div>

              {availableLanguages.map((locale) => {
                const langInfo = languageNames[locale];
                const isCurrentLocale = locale === currentLocale;

                return (
                  <button
                    key={locale}
                    onClick={() => handleLanguageChange(locale)}
                    className={`w-full px-3 py-2 text-sm text-left ${
                      isCurrentLocale
                        ? themeClasses.activeItem
                        : themeClasses.item
                    }`}
                    disabled={isCurrentLocale}
                  >
                    <div className="flex items-center justify-between">
                      <span>{langInfo?.native || locale.toUpperCase()}</span>
                      {isCurrentLocale && <Check className="w-4 h-4" />}
                    </div>
                    {langInfo && (
                      <div className={themeClasses.itemSubtext}>
                        {currentLocale === "ar" ? langInfo.ar : langInfo.en}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
