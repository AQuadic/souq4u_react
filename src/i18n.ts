// i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

// Get the saved language from localStorage before initialization
const savedLanguage = localStorage.getItem("i18nextLng") || "en";

i18n
  .use(HttpBackend) // Load translations via HTTP
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    fallbackLng: "en",
    lng: savedLanguage, // Set the initial language explicitly
    supportedLngs: ["en", "ar"],
    debug: false,
    interpolation: { escapeValue: false },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json", // Path to translation files
    },
    react: {
      useSuspense: true, // Enable suspense to wait for translations to load
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

// Set initial HTML attributes (already set in index.html script, but keep for runtime changes)
const currentLang = i18n.language || savedLanguage;
document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
document.documentElement.lang = currentLang;

// Update HTML attributes on language change
i18n.on("languageChanged", (lng) => {
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = lng;
  // Update localStorage to persist the language choice
  localStorage.setItem("i18nextLng", lng);
});

export default i18n;
