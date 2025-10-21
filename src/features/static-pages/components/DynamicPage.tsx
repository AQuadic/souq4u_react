import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePagesContext } from "@/features/static-pages/providers";
import { findPageBySlug } from "@/features/static-pages/utils";
import {
  StaticPageView,
  PageNotFound,
  PageError,
} from "@/features/static-pages/components";
import type { Language } from "@/features/static-pages/types";

/**
 * Dynamic page component that displays static pages by slug
 * Route: /pages/:slug
 */
const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { i18n, t } = useTranslation();
  const locale = (i18n.language || "en") as Language;

  // Get pages from context with loading and error states
  const { pages, isLoading, error } = usePagesContext();

  // Debug logging
  console.log("🔍 DynamicPage Debug:");
  console.log("  - Slug from URL:", slug);
  console.log("  - Loading:", isLoading);
  console.log("  - Error:", error);
  console.log("  - Total pages:", pages.length);

  // Show loading state
  if (isLoading) {
    return (
      <div className="container py-20">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-main border-t-transparent rounded-full animate-spin" />
            <p className="text-lg text-foreground">{t("Common.loading")}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return <PageError lang={locale} error={error} />;
  }

  // Find the page by slug
  const page = slug ? findPageBySlug(pages, slug) : undefined;

  console.log("  - Found page:", page ? page.title.en : "NOT FOUND");

  if (!page) {
    return <PageNotFound lang={locale} />;
  }

  return <StaticPageView page={page} lang={locale} />;
};

export default DynamicPage;
