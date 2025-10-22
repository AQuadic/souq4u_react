/**
 * Phone Validation Helper
 * Centralized phone number validation logic for consistent validation across the app
 */

/**
 * Phone length requirements by country ISO2 code
 * Maps country codes to their expected phone number lengths
 */
const PHONE_LENGTH_BY_COUNTRY: Record<string, number> = {
  // Middle East
  EG: 10, // Egypt - Egyptian phone numbers are 10 digits
  SA: 9, // Saudi Arabia
  AE: 9, // United Arab Emirates
  KW: 8, // Kuwait
  QA: 8, // Qatar
  BH: 8, // Bahrain
  OM: 8, // Oman
  JO: 9, // Jordan
  LB: 8, // Lebanon
  IQ: 10, // Iraq
  SY: 9, // Syria
  PS: 9, // Palestine
  YE: 9, // Yemen

  // North America
  US: 10, // United States
  CA: 10, // Canada

  // Europe
  GB: 10, // United Kingdom
  FR: 9, // France
  DE: 11, // Germany
  IT: 10, // Italy
  ES: 9, // Spain
  NL: 9, // Netherlands
  BE: 9, // Belgium
  CH: 9, // Switzerland
  AT: 11, // Austria
  SE: 10, // Sweden
  NO: 8, // Norway
  DK: 8, // Denmark
  FI: 10, // Finland
  PL: 9, // Poland
  GR: 10, // Greece
  PT: 9, // Portugal
  IE: 9, // Ireland

  // Asia
  CN: 11, // China
  IN: 10, // India
  JP: 10, // Japan
  KR: 10, // South Korea
  TH: 9, // Thailand
  VN: 10, // Vietnam
  PH: 10, // Philippines
  MY: 10, // Malaysia
  SG: 8, // Singapore
  ID: 11, // Indonesia
  PK: 10, // Pakistan
  BD: 10, // Bangladesh

  // Africa
  NG: 10, // Nigeria
  ZA: 9, // South Africa
  KE: 10, // Kenya
  MA: 9, // Morocco
  DZ: 9, // Algeria
  TN: 8, // Tunisia

  // Oceania
  AU: 9, // Australia
  NZ: 9, // New Zealand
};

/**
 * Default phone length for countries not specified
 */
const DEFAULT_PHONE_LENGTH = 15;

/**
 * Get the expected phone number length for a given country
 * @param countryIso2 - The ISO2 country code (e.g., "EG", "US", "SA")
 * @returns The expected phone number length for the country
 */
export const getPhoneLength = (countryIso2: string): number => {
  if (!countryIso2) {
    console.warn(
      "getPhoneLength: No country code provided, using default length"
    );
    return DEFAULT_PHONE_LENGTH;
  }

  const upperCode = countryIso2.trim().toUpperCase();
  const length = PHONE_LENGTH_BY_COUNTRY[upperCode];

  if (!length) {
    console.warn(
      `getPhoneLength: No specific length for country "${upperCode}", using default length of ${DEFAULT_PHONE_LENGTH}. Available countries:`,
      Object.keys(PHONE_LENGTH_BY_COUNTRY)
    );
    return DEFAULT_PHONE_LENGTH;
  }

  console.log(`✅ Found length for ${upperCode}: ${length} digits`);
  return length;
};

/**
 * Validate a phone number for a specific country
 * @param phoneNumber - The phone number (digits only)
 * @param countryIso2 - The ISO2 country code
 * @returns Object with isValid boolean and error message if invalid
 */
export const validatePhoneNumber = (
  phoneNumber: string,
  countryIso2: string
): { isValid: boolean; error: string | null; expectedLength: number } => {
  const expectedLength = getPhoneLength(countryIso2);

  if (!phoneNumber || phoneNumber.trim() === "") {
    return {
      isValid: false,
      error: "Phone number is required",
      expectedLength,
    };
  }

  // Remove any non-digit characters
  const cleanNumber = phoneNumber.replaceAll(/\D/g, "");

  if (cleanNumber.length !== expectedLength) {
    return {
      isValid: false,
      error: `Phone number must be exactly ${expectedLength} digits`,
      expectedLength,
    };
  }

  return {
    isValid: true,
    error: null,
    expectedLength,
  };
};

/**
 * Get localized validation error message
 * @param phoneNumber - The phone number
 * @param countryIso2 - The ISO2 country code
 * @param locale - The locale ("en" or "ar")
 * @returns Localized error message or null if valid
 */
export const getPhoneValidationError = (
  phoneNumber: string,
  countryIso2: string,
  locale: "en" | "ar" = "en"
): string | null => {
  const validation = validatePhoneNumber(phoneNumber, countryIso2);

  if (validation.isValid) {
    return null;
  }

  if (!phoneNumber || phoneNumber.trim() === "") {
    return locale === "ar" ? "رقم الهاتف مطلوب" : "Phone number is required";
  }

  const length = validation.expectedLength;
  return locale === "ar"
    ? `رقم الهاتف يجب أن يكون ${length} أرقام`
    : `Phone number must be exactly ${length} digits`;
};

/**
 * Check if a phone number is valid for a given country
 * @param phoneNumber - The phone number (digits only)
 * @param countryIso2 - The ISO2 country code
 * @returns true if valid, false otherwise
 */
export const isValidPhoneNumber = (
  phoneNumber: string,
  countryIso2: string
): boolean => {
  return validatePhoneNumber(phoneNumber, countryIso2).isValid;
};
