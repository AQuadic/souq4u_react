import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePagesContextSafe } from "@/features/static-pages/providers";
import { findPageBySlug } from "@/features/static-pages/utils";
import {
  StaticPageView,
  PageNotFound,
} from "@/features/static-pages/components";
import type { Language } from "@/features/static-pages/types";

/**
 * Dynamic page component that displays static pages by slug
 * Route: /pages/:slug
 */
const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();
  const locale = (i18n.language || "en") as Language;

  // Get pages from context
  const pages = usePagesContextSafe();

  // Debug logging
  console.log("🔍 DynamicPage Debug:");
  console.log("  - Slug from URL:", slug);
  console.log("  - Total pages:", pages.length);
  pages.forEach((p) => {
    console.log(`  - Page: "${p.title.en}" / "${p.title.ar}"`);
  });

  // Find the page by slug
  const page = slug ? findPageBySlug(pages, slug) : undefined;

  console.log("  - Found page:", page ? page.title.en : "NOT FOUND");

  if (!page) {
    return <PageNotFound lang={locale} />;
  }

  return <StaticPageView page={page} lang={locale} />;
};

export default DynamicPage;
