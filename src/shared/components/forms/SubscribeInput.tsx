"use client";

import React from "react";
import { Input } from "@/shared/components/ui/input";
import {
  PhoneInput,
  PhoneValue,
} from "@/shared/components/compound/PhoneInput";
import { cn } from "@/shared/lib/utils";

export interface SubscribeInputValue {
  value: string;
  phoneValue?: PhoneValue;
}

interface SubscribeInputProps {
  type: "email" | "phone";
  value: SubscribeInputValue;
  onChange: (value: SubscribeInputValue) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  language?: "en" | "ar";
  /** Minimum length for phone or email value (applies to phone input number length or email minLength) */
  minLength?: number;
  className?: string;
}

const SubscribeInput: React.FC<SubscribeInputProps> = ({
  type,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  language = "en",
  minLength,
  className,
}) => {
  if (type === "phone") {
    return (
      <div className={className}>
        <PhoneInput
          value={value.phoneValue || { code: "20", number: "" }}
          onChange={(newPhoneValue) => {
            onChange({
              value: newPhoneValue.number,
              phoneValue: newPhoneValue,
            });
          }}
          placeholder={
            placeholder ||
            (language === "ar" ? "أدخل رقم الهاتف" : "Enter phone number")
          }
          disabled={disabled}
          // pass minLength down to the native input (PhoneInput spreads extra props)
          minLength={minLength}
          language={language}
          // Target only the first child div (the input row) so the dropdown menu
          // (which is also a direct child) isn't forced to a fixed height or border styles.
          className={cn(
            "[&>div:first-child]:dark:bg-[#242529] [&>div:first-child]:border-[#3A3A3A] [&>div:first-child]:rounded-[8px] [&>div:first-child]:h-12",
            error &&
              "[&>div:first-child]:border-red-400 [&>div:first-child]:focus-within:border-red-400 [&>div:first-child]:focus-within:ring-red-400/20"
          )}
        />
        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      </div>
    );
  }

  // Email input
  return (
    <div className={className}>
      <Input
        type="email"
        // value={value.value}
        minLength={minLength}
        onChange={(e) => {
          onChange({
            value: e.target.value,
          });
        }}
        placeholder={
          placeholder ||
          (language === "ar"
            ? "أدخل عنوان بريدك الإلكتروني"
            : "Enter your email address")
        }
        disabled={disabled}
        className={cn(
          "w-full h-12  rounded-[8px] px-4 placeholder:text-[#9CA3AF] placeholder:text-base placeholder:font-medium focus:outline-none focus:border-main transition-colors duration-200 bg-[#F1F1F1] border-none",
          error && "border-red-400 focus:border-red-400"
        )}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default SubscribeInput;
