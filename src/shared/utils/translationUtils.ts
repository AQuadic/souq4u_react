import { useTranslation } from "react-i18next";

// Type definitions for multilingual data
export interface MultilingualText {
  en?: string;
  ar?: string;
  [key: string]: string | undefined;
}

export interface TranslatableProduct {
  name?: MultilingualText | string;
  description?: MultilingualText | string;
  short_description?: MultilingualText | string;
  category?: {
    name?: MultilingualText | string;
  };
}

export interface TranslatableCategory {
  name?: MultilingualText | string;
}

export interface TranslatableAttribute {
  name?: MultilingualText | string;
}

export interface TranslatableAttributeValue {
  value?: MultilingualText | string;
}

export interface TranslatableCity {
  name?: MultilingualText | string;
}

export interface TranslatableConfig {
  name?: MultilingualText | string;
  description?: MultilingualText | string;
  slogan?: MultilingualText | string;
}

export interface TranslatableHeroData {
  [key: string]: MultilingualText | string | undefined;
}

/**
 * Utility function to get translated text from API data
 * @param data - The data object with language keys (en, ar, etc.)
 * @param fallback - Fallback text if no translation is found
 * @returns The translated text or fallback
 */
export function useTranslatedText(
  data: MultilingualText | string | null | undefined,
  fallback: string = ""
): string {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  if (!data) return fallback;

  // If data is already a string, return it
  if (typeof data === "string") return data;

  // If data is an object with language keys, return the appropriate one
  if (typeof data === "object" && data !== null) {
    return data[locale] || data["en"] || data["ar"] || fallback;
  }

  return fallback;
}

/**
 * Non-hook version for use outside React components
 * @param data - The data object with language keys (en, ar, etc.)
 * @param locale - The current locale
 * @param fallback - Fallback text if no translation is found
 * @returns The translated text or fallback
 */
export function getTranslatedText(
  data: MultilingualText | string | null | undefined,
  locale: string,
  fallback: string = ""
): string {
  if (!data) return fallback;

  // If data is already a string, return it
  if (typeof data === "string") return data;

  // If data is an object with language keys, return the appropriate one
  if (typeof data === "object" && data !== null) {
    return data[locale] || data["en"] || data["ar"] || fallback;
  }

  return fallback;
}

/**
 * Hook to get translated product name
 * @param product - Product object
 * @returns Translated product name
 */
export function useTranslatedProductName(
  product: TranslatableProduct | null | undefined
): string {
  return useTranslatedText(product?.name, "Product Name");
}

/**
 * Hook to get translated product description
 * @param product - Product object
 * @returns Translated product description
 */
export function useTranslatedProductDescription(
  product: TranslatableProduct | null | undefined
): string {
  return useTranslatedText(product?.description, "");
}

/**
 * Hook to get translated product short description
 * @param product - Product object
 * @returns Translated product short description
 */
export function useTranslatedProductShortDescription(
  product: TranslatableProduct | null | undefined
): string {
  return useTranslatedText(product?.short_description, "");
}

/**
 * Hook to get translated category name
 * @param category - Category object
 * @returns Translated category name
 */
export function useTranslatedCategoryName(
  category: TranslatableCategory | null | undefined
): string {
  return useTranslatedText(category?.name, "Category");
}

/**
 * Hook to get translated attribute name
 * @param attribute - Attribute object
 * @returns Translated attribute name
 */
export function useTranslatedAttributeName(
  attribute: TranslatableAttribute | null | undefined
): string {
  return useTranslatedText(attribute?.name, "Attribute");
}

/**
 * Hook to get translated attribute value
 * @param value - Attribute value object
 * @returns Translated attribute value
 */
export function useTranslatedAttributeValue(
  value: TranslatableAttributeValue | null | undefined
): string {
  return useTranslatedText(value?.value, "Value");
}

/**
 * Hook to get translated city name
 * @param city - City object
 * @returns Translated city name
 */
export function useTranslatedCityName(
  city: TranslatableCity | null | undefined
): string {
  return useTranslatedText(city?.name, "City");
}

/**
 * Hook to get translated config name
 * @param config - Config object
 * @returns Translated config name
 */
export function useTranslatedConfigName(
  config: TranslatableConfig | null | undefined
): string {
  return useTranslatedText(config?.name, "Store Name");
}

/**
 * Hook to get translated config description
 * @param config - Config object
 * @returns Translated config description
 */
export function useTranslatedConfigDescription(
  config: TranslatableConfig | null | undefined
): string {
  return useTranslatedText(config?.description, "");
}

/**
 * Hook to get translated config slogan
 * @param config - Config object
 * @returns Translated config slogan
 */
export function useTranslatedConfigSlogan(
  config: TranslatableConfig | null | undefined
): string {
  return useTranslatedText(config?.slogan, "");
}

/**
 * Hook to get translated hero data
 * @param heroData - Hero data object
 * @param field - The field to translate
 * @returns Translated hero field
 */
export function useTranslatedHeroField(
  heroData: TranslatableHeroData | null | undefined,
  field: string
): string {
  return useTranslatedText(heroData?.[field], "");
}
