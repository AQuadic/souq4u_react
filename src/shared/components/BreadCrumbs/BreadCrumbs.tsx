"use client";

import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
}

export const Breadcrumbs: React.FC<{ items: BreadcrumbItem[] }> = ({
  items,
}) => {
  const { i18n } = useTranslation();
  // Determine if current language direction is RTL. Fall back to testing common RTL language codes.
  const isRTL =
    typeof i18n?.dir === "function"
      ? i18n.dir(i18n.language) === "rtl"
      : /^(ar|he|fa|ur)/.test(i18n?.language || "");
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm text-gray-500">
        {items.map((it, idx) => {
          const key = typeof it.label === "string" ? it.label : String(idx);
          return (
            <li key={key} className="flex items-center">
              {it.href ? (
                <Link to={it.href} className="text-main">
                  {it.label}
                </Link>
              ) : (
                <span>{it.label}</span>
              )}
              {idx < items.length - 1 && (
                <ChevronRight
                  className={`mx-2 h-4 w-4 text-main transform ${
                    isRTL ? "rotate-180" : ""
                  }`}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
