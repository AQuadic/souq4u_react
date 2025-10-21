import React from "react";
import { Link } from "react-router-dom";

interface PageNotFoundProps {
  lang?: "en" | "ar";
}

export const PageNotFound: React.FC<PageNotFoundProps> = ({ lang = "en" }) => {
  const messages = {
    en: {
      title: "Page not found",
      description: "The page you're looking for doesn't exist.",
      backLink: "Go back to home",
    },
    ar: {
      title: "الصفحة غير موجودة",
      description: "الصفحة التي تبحث عنها غير موجودة.",
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
          <Link to="/" className="text-main hover:underline mt-4 inline-block">
            {messages[lang].backLink}
          </Link>
        </div>
      </div>
    </div>
  );
};
