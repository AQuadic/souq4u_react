"use client";

import React, { useState } from "react";
import TrackingResult from "./TrackingResult";
import TrackingForm from "./TrackingForm";
import { useTrackOrderByEmail, useTrackOrderByPhone } from "../hooks";
import { useToast } from "@/shared/components/ui/toast/toast-store";
import { formatPhoneForApi } from "../utils";
import { PhoneValue } from "@/shared/components/compound/PhoneInput";
import { Order } from "../types";
import { useTranslation } from "react-i18next";

const MainTracking = () => {
  const { i18n } = useTranslation("Profile");
  const locale = i18n.language;
  const language = locale === "ar" ? "ar" : "en";

  const [step, setStep] = useState<"form" | "result">("form");
  const [trackingData, setTrackingData] = useState<{
    orderCode: string;
    contactInfo: string;
    contactType: "email" | "phone";
    phoneValue?: PhoneValue;
  } | null>(null);
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);
  const [hasShownErrorToast, setHasShownErrorToast] = useState(false);
  const toast = useToast();

  // Email tracking query
  const emailQuery = useTrackOrderByEmail(
    trackingData?.orderCode || "",
    trackingData?.contactInfo || "",
    trackingData?.contactType === "email" && !!trackingData
  );

  // Phone tracking query
  const phoneQuery = useTrackOrderByPhone(
    trackingData?.orderCode || "",
    trackingData?.phoneValue
      ? formatPhoneForApi(trackingData.phoneValue)
      : { phone: "", phone_country: "" },
    trackingData?.contactType === "phone" &&
      !!trackingData &&
      !!trackingData.phoneValue
  );

  // Get the active query based on contact type
  const activeQuery =
    trackingData?.contactType === "email" ? emailQuery : phoneQuery;
  const isLoading = activeQuery?.isLoading || false;

  // Handle query state changes
  React.useEffect(() => {
    if (activeQuery?.isSuccess && activeQuery.data && !hasShownSuccessToast) {
      setOrderData(activeQuery.data.order);
      setStep("result");
      setHasShownSuccessToast(true);
      toast.success(
        language === "ar"
          ? `تم العثور على الطلب! - تم تتبع الطلب رقم ${activeQuery.data.order.code} بنجاح.`
          : `Order Found! - Order #${activeQuery.data.order.code} has been successfully tracked.`,
        { duration: 4000 }
      );
    }
  }, [
    activeQuery?.isSuccess,
    activeQuery?.data,
    hasShownSuccessToast,
    toast,
    language,
  ]);

  React.useEffect(() => {
    if (activeQuery?.isError && !hasShownErrorToast) {
      const normalizeError = (val: unknown): string | undefined => {
        if (!val) return undefined;
        if (typeof val === "string") return val;
        if (typeof val === "object")
          return (val as { message?: string }).message;
        return undefined;
      };

      const rawErr = normalizeError(activeQuery.error);
      let errorMessage =
        language === "ar"
          ? "فشل في تتبع الطلب. يرجى التحقق من رمز الطلب ومعلومات الاتصال."
          : "Failed to track order. Please check your order code and contact information.";

      if (rawErr) {
        if (rawErr.includes("404")) {
          errorMessage =
            language === "ar"
              ? "الطلب غير موجود. يرجى التحقق من رمز الطلب ومعلومات الاتصال."
              : "Order not found. Please verify your order code and contact information.";
        } else if (rawErr.includes("Network Error")) {
          errorMessage =
            language === "ar"
              ? "خطأ في الشبكة. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى."
              : "Network error. Please check your internet connection and try again.";
        } else if (rawErr.includes("UNAUTHORIZED")) {
          errorMessage =
            language === "ar"
              ? "تم رفض الوصول. يرجى التحقق من المعلومات الخاصة بك."
              : "Access denied. Please verify your information.";
        }
      }

      setHasShownErrorToast(true);
      toast.error(errorMessage, { duration: 6000 });

      // Reset tracking data to allow retry
      setTrackingData(null);
    }
  }, [
    activeQuery?.isError,
    activeQuery?.error,
    hasShownErrorToast,
    toast,
    language,
  ]);

  const handleFormSubmit = (data: {
    orderCode: string;
    contactInfo: string;
    contactType: "email" | "phone";
    phoneValue?: PhoneValue;
  }) => {
    setTrackingData(data);
  };

  const handleBackToForm = () => {
    setStep("form");
    setTrackingData(null);
    setOrderData(null);
    setHasShownSuccessToast(false);
    setHasShownErrorToast(false);
  };

  if (step === "result" && orderData) {
    return (
      <div className="p-4 rounded-lg min-h-[400px]">
        <TrackingResult
          order={orderData}
          onBack={handleBackToForm}
          language={language}
        />
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg min-h-[400px]">
      <TrackingForm
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
        language={language}
      />
    </div>
  );
};

export default MainTracking;
