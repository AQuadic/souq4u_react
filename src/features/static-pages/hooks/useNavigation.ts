import { useMemo } from "react";
import type { Page, NavLink } from "../types";
import { normalize } from "../utils";

/**
 * Hook to generate navigation links from static pages
 */
export const useStaticPagesNavigation = (pages: Page[] = []) => {
  const staticPageLinks = useMemo(() => {
    return pages
      .filter((page) => page.is_active === 1)
      .sort((a, b) => a.order_column - b.order_column)
      .map(
        (page): NavLink => ({
          titleAr: page.title.ar,
          titleEn: page.title.en,
          // Always use English title for URL slug to maintain consistency
          href: `/pages/${normalize(page.title.en)}`,
        })
      );
  }, [pages]);

  return staticPageLinks;
};

/**
 * Hook to get navigation links for the header (only About Us page)
 */
export const useHeaderNavigation = (pages: Page[] = []) => {
  const staticLinks = useStaticPagesNavigation(pages);

  const baseLinks: NavLink[] = [
    {
      titleAr: "الرئيسية",
      titleEn: "Home",
      href: "/",
    },
    {
      titleAr: "المنتجات",
      titleEn: "Products",
      href: "/products",
    },
    {
      titleAr: "تواصل معنا",
      titleEn: "Contact Us",
      href: "/contact",
    },
  ];

  // Find "About Us" page from static pages
  const aboutUsPage = staticLinks.find(
    (link) =>
      link.titleEn.toLowerCase().includes("about") ||
      link.titleAr.toLowerCase().includes("عن") ||
      link.titleAr.toLowerCase().includes("عنا") ||
      link.titleEn.toLowerCase().includes("نبذة") ||
      link.titleAr.toLowerCase().includes("نبذة")
  );

  // Always show About Us, either from API or fallback
  const aboutUsLink: NavLink = aboutUsPage || {
    titleAr: "عنا",
    titleEn: "About Us",
    href: "/pages/about-us",
  };

  // Insert About Us after Home
  return [
    baseLinks[0], // Home
    aboutUsLink, // About Us (from API or fallback)
    ...baseLinks.slice(1), // Products, Contact Us
  ];
};

/**
 * Hook to get navigation links for the footer (all pages)
 * Returns ONLY API pages - static links are handled in Footer component
 */
export const useFooterNavigation = (pages: Page[] = []) => {
  const staticLinks = useStaticPagesNavigation(pages);

  // Return only API pages - no base links
  return staticLinks;
};
