"use client";

import React from "react";
import { Link } from "react-router-dom";

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
}

export const Breadcrumbs: React.FC<{ items: BreadcrumbItem[] }> = ({
  items,
}) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm text-gray-500">
        {items.map((it, idx) => {
          const key = typeof it.label === "string" ? it.label : String(idx);
          return (
            <li key={key} className="flex items-center">
              {it.href ? (
                <Link to={it.href} className="hover:text-main">
                  {it.label}
                </Link>
              ) : (
                <span>{it.label}</span>
              )}
              {idx < items.length - 1 && <span className="mx-2">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
