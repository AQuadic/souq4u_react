"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { PhoneValue } from "@/shared/components/compound/PhoneInput";
import { cn } from "@/shared/lib/utils";
import ContactInput, {
  ContactInputValue,
} from "@/shared/components/forms/ContactInput";
import { useTranslation } from "react-i18next";

interface TrackingFormProps {
  onSubmit: (data: {
    orderCode: string;
    contactInfo: string;
    contactType: "email" | "phone";
    phoneValue?: PhoneValue;
  }) => void;
  isLoading?: boolean;
  language?: "en" | "ar";
}

const TrackingForm: React.FC<TrackingFormProps> = ({
  onSubmit,
  isLoading = false,
  language,
}) => {
  const { i18n } = useTranslation("Profile");
  const locale = i18n.language;
  const currentLang = language ?? (locale === "ar" ? "ar" : "en");

  const [orderCode, setOrderCode] = useState("");
  const [contactValue, setContactValue] = useState<ContactInputValue>({
    contactInfo: "",
    contactType: "email",
  });
  const [errors, setErrors] = useState<{
    orderCode?: string;
    contactInfo?: string;
  }>({});

  // Clear order code error when user types
  useEffect(() => {
    if (orderCode.trim() && errors.orderCode) {
      setErrors((prev) => ({ ...prev, orderCode: undefined }));
    }
  }, [orderCode, errors.orderCode]);

  const validateForm = () => {
    const newErrors: { orderCode?: string; contactInfo?: string } = {};

    // Validate order code
    if (!orderCode.trim()) {
      newErrors.orderCode =
        currentLang === "ar" ? "رمز الطلب مطلوب" : "Order code is required";
    } else if (orderCode.trim().length < 3) {
      newErrors.orderCode =
        currentLang === "ar"
          ? "يجب أن يتكون رمز الطلب من 3 أحرف على الأقل"
          : "Order code must be at least 3 characters";
    }

    // Validate contact info
    if (!contactValue.contactInfo.trim()) {
      newErrors.contactInfo =
        currentLang === "ar"
          ? "البريد الإلكتروني أو رقم الهاتف مطلوب"
          : "Email or phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit({
      orderCode: orderCode.trim(),
      contactInfo: contactValue.contactInfo,
      contactType: contactValue.contactType,
      phoneValue: contactValue.phoneValue,
    });
  };

  return (
    <div className="container my-8 mx-auto flex flex-col items-center justify-center flex-1 text-center">
      <div className={cn("mb-8", currentLang === "ar" ? "text-right" : " ")}>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
          {currentLang === "ar" ? "تتبع طلبك" : "Track Your Order"}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base text-center">
          {currentLang === "ar"
            ? "أدخل رمز الطلب ومعلومات الاتصال لتتبع طلبك"
            : "Enter your order code and contact information to track your order"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        {/* Order Code Input */}
        <div className="space-y-2">
          <label
            htmlFor="order-code"
            className={cn(
              "text-sm font-medium text-foreground block",
              currentLang === "ar" ? "text-right" : " "
            )}
          >
            {currentLang === "ar" ? "رمز الطلب" : "Order Code"}{" "}
            <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Input
              id="order-code"
              type="text"
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
              placeholder={
                currentLang === "ar" ? "أدخل رمز طلبك" : "Enter your order code"
              }
              className={cn(
                "h-12 border-2 rounded-full",
                "bg-background text-foreground placeholder:text-muted-foreground",
                "border-input hover:border-foreground/50",
                "focus:border-primary focus:ring-2 focus:ring-primary/20",
                "dark:border-white/20 dark:hover:border-white/40 dark:focus:border-white dark:bg-transparent dark:text-white dark:placeholder:text-white/60",
                currentLang === "ar" ? "text-right" : " ",
                errors.orderCode &&
                  "border-destructive focus:border-destructive focus:ring-destructive/20"
              )}
              disabled={isLoading}
            />
            {errors.orderCode && (
              <p className="text-destructive text-sm mt-1">
                {errors.orderCode}
              </p>
            )}
          </div>
        </div>

        {/* Contact Information Input */}
        <div className="space-y-2">
          <label
            htmlFor="contact-info"
            className={cn(
              "text-sm font-medium text-foreground block",
              currentLang === "ar" ? "text-right" : " "
            )}
          >
            {currentLang === "ar"
              ? "البريد الإلكتروني أو رقم الهاتف"
              : "Email or Phone Number"}{" "}
            <span className="text-destructive">*</span>
          </label>

          <ContactInput
            value={contactValue}
            onChange={(newValue: ContactInputValue) => {
              setContactValue(newValue);
              if (errors.contactInfo) {
                setErrors((prev) => ({ ...prev, contactInfo: undefined }));
              }
            }}
            placeholder={{
              email:
                currentLang === "ar"
                  ? "أدخل عنوان بريدك الإلكتروني"
                  : "Enter your email address",
              phone:
                currentLang === "ar"
                  ? "أدخل رقم هاتفك"
                  : "Enter your phone number",
              default:
                currentLang === "ar"
                  ? "أدخل بريدك الإلكتروني أو رقم هاتفك"
                  : "Enter your email or phone number",
            }}
            error={errors.contactInfo}
            disabled={isLoading}
            language={currentLang}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full h-12 sm:h-14 font-medium rounded-full transition-all duration-200 text-sm sm:text-base",
            "bg-main text-primary-foreground",
            "hover:bg-main/90 active:scale-98",
            "dark:bg-white dark:text-black dark:hover:bg-white/90",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:active:scale-100",
            "dark:disabled:hover:bg-white",
            isLoading && "cursor-wait"
          )}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin" />
              {currentLang === "ar"
                ? "جاري تتبع الطلب..."
                : "Tracking Order..."}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Search size={18} />
              {currentLang === "ar" ? "تتبع الطلب" : "Track Order"}
            </div>
          )}
        </button>
      </form>
    </div>
  );
};

export default TrackingForm;
