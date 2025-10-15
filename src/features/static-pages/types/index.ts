// Re-export from local pages API
export type { LocalizedField, Page, GetPagesResponse } from "../api";

export interface NavLink {
  titleAr: string;
  titleEn: string;
  href: string;
}

export type Language = "en" | "ar";
