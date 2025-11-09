import { PhoneValue } from "@/shared/components/compound/PhoneInput";
import { PhoneData } from "../types";

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex (basic - checks for digits and common phone formats)
const PHONE_REGEX = /^\+?[1-9]\d{3,14}$/;

/**
 * Detects if input string is an email or phone number
 */
export const detectContactType = (
  input: string
): "email" | "phone" | "unknown" => {
  if (!input || input.trim() === "") return "unknown";

  const trimmedInput = input.trim();

  // Check for email pattern first
  if (EMAIL_REGEX.test(trimmedInput)) {
    return "email";
  }

  // Remove all non-digit characters to check if it's a phone number
  const digitsOnly = trimmedInput.replace(/\D/g, "");

  // Check if it looks like a phone number (7-15 digits)
  if (digitsOnly.length >= 7 && digitsOnly.length <= 15) {
    return "phone";
  }

  return "unknown";
};

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email.trim());
};

/**
 * Validates phone number format
 */
export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length >= 7 && cleaned.length <= 15;
};

/**
 * Formats phone data for API request
 */
export const formatPhoneForApi = (phoneValue: PhoneValue): PhoneData => {
  return {
    phone: phoneValue.number,
    phone_country: phoneValue.code.toUpperCase(),
  };
};

/**
 * Extracts country code from phone code (removes the + sign)
 */
export const getCountryCodeFromPhone = (phoneCode: string): string => {
  // For now, we'll map common phone codes to country codes
  // You might want to extend this or use a proper library
  const phoneToCountryMap: { [key: string]: string } = {
    "20": "EG", // Egypt
    "1": "US", // USA/Canada
    "44": "GB", // UK
    "49": "DE", // Germany
    "33": "FR", // France
    "39": "IT", // Italy
    "34": "ES", // Spain
    "971": "AE", // UAE
    "966": "SA", // Saudi Arabia
    "965": "KW", // Kuwait
    "974": "QA", // Qatar
    "973": "BH", // Bahrain
    "968": "OM", // Oman
    "962": "JO", // Jordan
    "961": "LB", // Lebanon
    "212": "MA", // Morocco
    "213": "DZ", // Algeria
    "216": "TN", // Tunisia
  };

  const code = phoneCode.replace("+", "");
  return phoneToCountryMap[code] || "EG"; // Default to Egypt
};

/**
 * Formats currency amount
 */
export const formatCurrency = (
  amount: number,
  language: "en" | "ar" = "en"
): string => {
  if (isNaN(amount)) return "";

  const currencySymbol = language === "ar" ? "ج.م" : "EGP";
  const formattedAmount =
    language === "ar"
      ? amount.toLocaleString("ar-EG")
      : amount.toLocaleString("en-EG");

  return `${formattedAmount} ${currencySymbol}`;
};

/**
 * Formats order status for display
 */
type StatusStyle = {
  labelKey: string;
  label: string;
  color: string;
  bgLight: string;
  bgDark: string;
};

const normalizeStatus = (status: string): string => {
  const map: Record<string, string> = {
    "معلق": "pending",
    "مؤكد": "confirmed",
    "قيد المعالجة": "processing",
    "قيد الشحن": "shipped",
    "في الشحن": "in_shipping",
    "جاهز للشحن": "ready_for_shipping",
    "تم التوصيل": "delivered",
    "مكتمل": "completed",
    "ملغي": "cancelled",
    "مُرجع": "returned",
  };

  return map[status.trim()] || status.toLowerCase();
};

export const formatOrderStatus = (status: string): StatusStyle => {
  const normalized = normalizeStatus(status);

  const statusMap: Record<string, Omit<StatusStyle, "label">> = {
    pending: {
      labelKey: "pending",
      color: "text-yellow-500",
      bgLight: "bg-yellow-50",
      bgDark: "dark:bg-yellow-900/10",
    },
    confirmed: {
      labelKey: "confirmed",
      color: "text-green-500",
      bgLight: "bg-green-50",
      bgDark: "dark:bg-blue-900/10",
    },
    processing: {
      labelKey: "processing",
      color: "text-orange-500",
      bgLight: "bg-orange-50",
      bgDark: "dark:bg-orange-900/10",
    },
    shipped: {
      labelKey: "shipping",
      color: "text-purple-500",
      bgLight: "bg-purple-50",
      bgDark: "dark:bg-purple-900/10",
    },
    in_shipping: {
      labelKey: "in_shipping",
      color: "text-indigo-500",
      bgLight: "bg-indigo-50",
      bgDark: "dark:bg-indigo-900/10",
    },
    ready_for_shipping: {
      labelKey: "ready_for_shipping",
      color: "text-blue-500",
      bgLight: "bg-blue-50",
      bgDark: "dark:bg-blue-900/10",
    },
    delivered: {
      labelKey: "delivered",
      color: "text-green-500",
      bgLight: "bg-green-50",
      bgDark: "dark:bg-green-900/10",
    },
    completed: {
      labelKey: "completed",
      color: "text-green-500",
      bgLight: "bg-green-50",
      bgDark: "dark:bg-green-900/10",
    },
    cancelled: {
      labelKey: "cancelled",
      color: "text-red-500",
      bgLight: "bg-red-50",
      bgDark: "dark:bg-red-900/10",
    },
    returned: {
      labelKey: "returned",
      color: "text-gray-500",
      bgLight: "bg-gray-50",
      bgDark: "dark:bg-gray-900/10",
    },

  };

  const result = statusMap[normalized] || {
    labelKey: normalized,
    color: "text-gray-500",
    bgLight: "bg-gray-50",
    bgDark: "dark:bg-gray-900/10",
  };

  return { ...result, label: result.labelKey };
};
