"use client";

import React, { useState, useEffect } from "react";
import { Mail, Phone, Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import {
  PhoneInput,
  PhoneValue,
} from "@/shared/components/compound/PhoneInput";
import { cn } from "@/shared/lib/utils";

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Detects if input string is an email or phone number
 */

// eslint-disable-next-line react-refresh/only-export-components
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

// eslint-disable-next-line react-refresh/only-export-components
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email.trim());
};

/**
 * Validates phone number format
 */

// eslint-disable-next-line react-refresh/only-export-components
export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length >= 7 && cleaned.length <= 15;
};

export interface ContactInputValue {
  contactInfo: string;
  contactType: "email" | "phone";
  phoneValue?: PhoneValue;
}

interface ContactInputProps {
  value: ContactInputValue;
  onChange: (value: ContactInputValue) => void;
  onValidationChange?: (isValid: boolean) => void;
  placeholder?: {
    email?: string;
    phone?: string;
    default?: string;
  };
  error?: string;
  disabled?: boolean;
  language?: "en" | "ar";
  showIcon?: boolean;
  showTypeIndicator?: boolean;
  className?: string;
  inputClassName?: string;
}

/**
 * Parse phone number and extract country code
 */
const parsePhoneNumber = (
  phone: string
): { countryCode: string; number: string } | null => {
  const cleaned = phone.replace(/\D/g, "");

  // Try to match common country codes
  const countryCodeMap: { [key: string]: string } = {
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

  // Try 3-digit codes first (longer codes have priority)
  for (const code of [
    "971",
    "966",
    "965",
    "974",
    "973",
    "968",
    "962",
    "961",
    "212",
    "213",
    "216",
  ]) {
    if (cleaned.startsWith(code)) {
      return {
        countryCode: countryCodeMap[code],
        number: cleaned.substring(code.length),
      };
    }
  }

  // Try 2-digit codes
  for (const code of ["20", "44", "49", "33", "39", "34"]) {
    if (cleaned.startsWith(code)) {
      return {
        countryCode: countryCodeMap[code],
        number: cleaned.substring(code.length),
      };
    }
  }

  // Try 1-digit code (US/Canada)
  if (cleaned.startsWith("1") && cleaned.length >= 11) {
    return {
      countryCode: "US",
      number: cleaned.substring(1),
    };
  }

  // Default to Egypt for numbers without clear country code
  if (cleaned.length >= 10) {
    return {
      countryCode: "EG",
      number: cleaned,
    };
  }

  return null;
};

const ContactInput: React.FC<ContactInputProps> = ({
  value,
  onChange,
  onValidationChange,
  placeholder = {},
  error,
  disabled = false,
  language = "en",
  showIcon = true,
  showTypeIndicator = true,
  className,
  inputClassName,
}) => {
  const [contactInfo, setContactInfo] = useState(value.contactInfo);
  const [phoneValue, setPhoneValue] = useState<PhoneValue>(
    value.phoneValue || {
      code: "EG",
      number: "",
    }
  );

  // Detect contact type for display/validation only
  const detectedType = contactInfo.trim()
    ? detectContactType(contactInfo)
    : "unknown";

  // Validate and notify parent
  useEffect(() => {
    if (onValidationChange) {
      if (contactInfo.trim()) {
        const isValid =
          (detectedType === "email" && isValidEmail(contactInfo)) ||
          (detectedType === "phone" && isValidPhone(contactInfo));
        onValidationChange(isValid);
      } else {
        onValidationChange(false);
      }
    }
  }, [contactInfo, detectedType, onValidationChange]);

  // Handle phone input changes
  const handlePhoneChange = (newPhoneValue: PhoneValue) => {
    setPhoneValue(newPhoneValue);
    setContactInfo(newPhoneValue.number);
    onChange({
      contactInfo: newPhoneValue.number,
      contactType: "phone",
      phoneValue: newPhoneValue,
    });
  };

  const getInputIcon = () => {
    if (detectedType === "email")
      return (
        <Mail size={20} className="text-muted-foreground dark:text-white/60" />
      );
    if (detectedType === "phone")
      return (
        <Phone size={20} className="text-muted-foreground dark:text-white/60" />
      );
    return (
      <Search size={20} className="text-muted-foreground dark:text-white/60" />
    );
  };

  const getInputPlaceholder = () => {
    if (detectedType === "email")
      return (
        placeholder.email ||
        (language === "ar"
          ? "أدخل عنوان بريدك الإلكتروني"
          : "Enter your email address")
      );
    if (detectedType === "phone")
      return (
        placeholder.phone ||
        (language === "ar" ? "أدخل رقم هاتفك" : "Enter your phone number")
      );
    return (
      placeholder.default ||
      (language === "ar"
        ? "أدخل البريد الإلكتروني أو رقم الهاتف"
        : "Enter email or phone number")
    );
  };

  // Use value.contactType to determine which input to show (from parent, not auto-detected)
  const showPhoneInput =
    value.contactType === "phone" && phoneValue.number.length > 0;

  return (
    <div className={cn("space-y-2", className)}>
      {showPhoneInput ? (
        <div>
          <PhoneInput
            value={phoneValue}
            onChange={handlePhoneChange}
            placeholder={
              placeholder.phone ||
              (language === "ar" ? "أدخل رقم الهاتف" : "Enter phone number")
            }
            disabled={disabled}
            language={language}
            className={cn(
              error &&
                "[&>div]:border-destructive [&>div]:focus-within:border-destructive [&>div]:focus-within:ring-destructive/20",
              inputClassName
            )}
          />
          {error && <p className="text-destructive text-sm mt-1">{error}</p>}
        </div>
      ) : (
        <div className="relative">
          {showIcon && (
            <div
              className={cn(
                "absolute top-1/2 transform -translate-y-1/2 z-10",
                language === "ar" ? "right-4" : "left-4"
              )}
            >
              {getInputIcon()}
            </div>
          )}
          <Input
            type={detectedType === "email" ? "email" : "text"}
            value={contactInfo}
            onChange={(e) => {
              const newValue = e.target.value;
              setContactInfo(newValue);
              const type = detectContactType(newValue);

              // If phone is detected, try to parse country code and number
              if (type === "phone") {
                const parsed = parsePhoneNumber(newValue);
                if (parsed) {
                  const newPhoneValue: PhoneValue = {
                    code: parsed.countryCode,
                    number: parsed.number,
                  };
                  setPhoneValue(newPhoneValue);
                  onChange({
                    contactInfo: newValue,
                    contactType: "phone",
                    phoneValue: newPhoneValue,
                  });
                  return;
                }
              }

              onChange({
                contactInfo: newValue,
                contactType: type === "unknown" ? "email" : type,
                phoneValue: type === "phone" ? phoneValue : undefined,
              });
            }}
            placeholder={getInputPlaceholder()}
            className={cn(
              "h-12 border-2 rounded-full",
              "bg-background text-foreground placeholder:text-muted-foreground",
              "border-input hover:border-foreground/50",
              "focus:border-primary focus:ring-2 focus:ring-primary/20",
              "dark:border-white/20 dark:hover:border-white/40 dark:focus:border-white dark:bg-transparent dark:text-white dark:placeholder:text-white/60",
              language === "ar" ? "text-right pr-12" : "pl-12",
              error &&
                "border-destructive focus:border-destructive focus:ring-destructive/20",
              inputClassName
            )}
            disabled={disabled}
          />
          {error && <p className="text-destructive text-sm mt-1">{error}</p>}
        </div>
      )}

      {/* Contact Type Indicator */}
      {showTypeIndicator &&
        detectedType !== "unknown" &&
        contactInfo.trim() && (
          <div
            className={cn(
              "flex",
              language === "ar" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium",
                detectedType === "email"
                  ? "bg-blue-500/20 text-blue-300"
                  : "bg-green-500/20 text-green-300"
              )}
            >
              {detectedType === "email" ? (
                <Mail size={12} />
              ) : (
                <Phone size={12} />
              )}
              {(() => {
                let typeText = "";
                if (detectedType === "email") {
                  typeText = language === "ar" ? "بريد إلكتروني" : "Email";
                } else {
                  typeText = language === "ar" ? "رقم هاتف" : "Phone Number";
                }

                // Show only the detected type label (no prefix)
                return typeText;
              })()}
            </div>
          </div>
        )}
    </div>
  );
};

export default ContactInput;
