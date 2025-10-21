/**
 * Normalizes a string to create a URL-friendly slug
 * @param str - The string to normalize
 * @returns A normalized slug string
 */
export const normalize = (str: string): string => {
  const result = str
    .toLowerCase()
    .replace(/^titnx\s+/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-") // Replace multiple dashes with single dash
    .trim();

  console.log(`📝 normalize("${str}") => "${result}"`);
  return result;
};

import type { Page } from "../types";

/**
 * Finds a page by its slug
 * @param pages - Array of pages to search through
 * @param slug - The slug to match against
 * @returns The matching page or undefined
 */
export const findPageBySlug = (
  pages: Page[],
  slug: string
): Page | undefined => {
  console.log(`🔎 Finding page with slug: "${slug}"`);

  // Always match using English title for URL consistency
  const found = pages.find((p) => {
    const normalized = normalize(p.title.en);
    const matches = normalized === slug;
    console.log(
      `   - "${p.title.en}" => "${normalized}" ${matches ? "✅ MATCH!" : "❌"}`
    );
    return matches;
  });

  return found;
};
