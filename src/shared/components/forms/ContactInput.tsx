"use client";

import React, { useState } from "react";
import { Input } from "@/shared/components/ui/input";
import {
  PhoneInput,
  PhoneValue,
} from "@/shared/components/compound/PhoneInput";
import { cn } from "@/shared/lib/utils";

export interface ContactInputValue {
  contactInfo: string;
  contactType: "email" | "phone";
  phoneValue?: PhoneValue;
}

interface ContactInputProps {
  value: ContactInputValue;
  onChange: (value: ContactInputValue) => void;
  emailPlaceholder?: string;
  phonePlaceholder?: string;
  disabled?: boolean;
  className?: string;
  language?: "en" | "ar";
  radius?: "full" | "md";
  error?: string;
}

const ContactInput = React.forwardRef<HTMLInputElement, ContactInputProps>(
  (
    {
      value,
      onChange,
      emailPlaceholder = "Enter your email",
      phonePlaceholder = "Enter phone number",
      disabled = false,
      className,
      language = "en",
      radius = "full",
      error,
    },
    ref
  ) => {
    const [contactType, setContactType] = useState<"email" | "phone">(
      value.contactType || "email"
    );

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({
        contactInfo: e.target.value,
        contactType: "email",
      });
    };

    const handlePhoneChange = (phoneValue: PhoneValue) => {
      onChange({
        contactInfo: phoneValue.number,
        contactType: "phone",
        phoneValue,
      });
    };

    const toggleContactType = () => {
      const newType = contactType === "email" ? "phone" : "email";
      setContactType(newType);
      onChange({
        contactInfo: "",
        contactType: newType,
        phoneValue:
          newType === "phone" ? { code: "EG", number: "" } : undefined,
      });
    };

    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center gap-2 mb-2">
          <button
            type="button"
            onClick={toggleContactType}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              contactType === "email"
                ? "bg-red-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            )}
            disabled={disabled}
          >
            Email
          </button>
          <button
            type="button"
            onClick={toggleContactType}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              contactType === "phone"
                ? "bg-red-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            )}
            disabled={disabled}
          >
            Phone
          </button>
        </div>

        {contactType === "email" ? (
          <Input
            ref={ref}
            type="email"
            value={value.contactType === "email" ? value.contactInfo : ""}
            onChange={handleEmailChange}
            placeholder={emailPlaceholder}
            disabled={disabled}
            className={cn(
              radius === "full" ? "rounded-full" : "rounded-md",
              error && "border-red-500"
            )}
          />
        ) : (
          <PhoneInput
            value={value.phoneValue || { code: "EG", number: "" }}
            onChange={handlePhoneChange}
            placeholder={phonePlaceholder}
            disabled={disabled}
            language={language}
            radius={radius}
          />
        )}

        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

ContactInput.displayName = "ContactInput";

export default ContactInput;
