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
    phone_country: getCountryCodeFromPhone(phoneValue.code),
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
  currency: string = "ج.م"
): string => {
  return `${amount.toLocaleString()} ${currency}`;
};

/**
 * Formats order status for display
 */
export const formatOrderStatus = (
  status: string
): { label: string; color: string } => {
  const statusMap: { [key: string]: { label: string; color: string } } = {
    pending: { label: "Pending", color: "text-yellow-500" },
    confirmed: { label: "Confirmed", color: "text-blue-500" },
    processing: { label: "Processing", color: "text-orange-500" },
    shipped: { label: "Shipped", color: "text-purple-500" },
    delivered: { label: "Delivered", color: "text-green-500" },
    cancelled: { label: "Cancelled", color: "text-red-500" },
    returned: { label: "Returned", color: "text-gray-500" },
  };

  return (
    statusMap[status.toLowerCase()] || { label: status, color: "text-gray-500" }
  );
};
