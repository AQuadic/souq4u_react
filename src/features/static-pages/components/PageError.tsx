import React from "react";
import { Link } from "react-router-dom";

interface PageErrorProps {
  lang?: "en" | "ar";
  error?: Error;
}

export const PageError: React.FC<PageErrorProps> = ({ lang = "en", error }) => {
  const messages = {
    en: {
      title: "Error",
      description: "Failed to load page.",
      backLink: "Go back to home",
    },
    ar: {
      title: "خطأ",
      description: "فشل في تحميل الصفحة.",
      backLink: "العودة إلى الرئيسية",
    },
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-foreground">
            {messages[lang].title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {messages[lang].description}
          </p>
          {error && (
            <p className="text-red-600 dark:text-red-400 mt-2 text-sm">
              {error.message}
            </p>
          )}
          <Link to="/" className="text-main hover:underline mt-4 inline-block">
            {messages[lang].backLink}
          </Link>
        </div>
      </div>
    </div>
  );
};
