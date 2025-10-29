import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useConfig } from "@/features/config";
import { subscribe } from "@/features/api/subscribe";
import SubscribeInput, {
  SubscribeInputValue,
} from "@/shared/components/forms/SubscribeInput";
import { useToast } from "@/shared/components/ui/toast";
import { getPhoneValidationError } from "@/shared/utils/phoneValidationHelper";

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({ isOpen, onClose }) => {
  const config = useConfig();
  const { i18n, t } = useTranslation("Navigation");
  const locale = i18n.language || "en";
  const { t: toastT } = useTranslation("Toasts");
  const toast = useToast();

  const [subscribeValue, setSubscribeValue] = useState<SubscribeInputValue>({
    value: "",
  });
  const [subscribeError, setSubscribeError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Debug logging
  console.log("[SubscribeModal] Rendered with isOpen:", isOpen);

  // Get subscribe type from config, default to email
  const rawSubscribeType = config?.subscribe_config?.type;
  const subscribeType = rawSubscribeType === "phone" ? "phone" : "email";

  // Minimum length for phone numbers (from config)
  const subscribeMin = Number(config?.subscribe_config?.min || 0) || 0;

  // Get placeholder based on subscribe type
  const getSubscribePlaceholder = () => {
    if (subscribeType === "email") {
      return t("Footer.enterEmailPlaceholder");
    }
    return locale === "ar" ? "أدخل رقم الهاتف" : "Enter phone number";
  };

  // Extract server message from error objects/strings
  const getServerErrorMessage = (err: unknown): string | null => {
    try {
      const apiErr = err as {
        response?: {
          data?: { message?: string; errors?: Record<string, string[]> };
        };
        message?: string;
      };

      const respData = apiErr.response?.data;

      // First check for specific field errors (email or phone)
      if (respData?.errors && typeof respData.errors === "object") {
        // Check for email errors
        if (Array.isArray(respData.errors.email) && respData.errors.email[0]) {
          return respData.errors.email[0];
        }
        // Check for phone errors
        if (Array.isArray(respData.errors.phone) && respData.errors.phone[0]) {
          return respData.errors.phone[0];
        }
        // Check for phone_country errors
        if (
          Array.isArray(respData.errors.phone_country) &&
          respData.errors.phone_country[0]
        ) {
          return respData.errors.phone_country[0];
        }
        // Get first error from any field
        const firstError = Object.values(respData.errors)[0];
        if (Array.isArray(firstError) && firstError[0]) {
          return firstError[0];
        }
      }

      // Then check for general message
      if (respData?.message) return respData.message;

      // Check error message string
      if (typeof apiErr.message === "string" && apiErr.message) {
        const m = apiErr.message;
        // Try to parse JSON from error message
        const exec = /({\s*"message"[\s\S]*})$/.exec(m);
        if (exec?.[1]) {
          try {
            const parsed = JSON.parse(exec[1]);
            if (parsed?.message) return parsed.message;
          } catch {
            return m;
          }
        }
        return m;
      }

      if (typeof err === "string") return err;
    } catch (error_) {
      console.error("Failed to parse API error:", error_);
    }
    return null;
  };

  // Validate email format
  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? null : t("Footer.invalidEmail");
  };

  // Validate phone format
  const validatePhone = (): string | null => {
    const phoneNumber = subscribeValue.phoneValue?.number || "";
    const countryCode = subscribeValue.phoneValue?.code || "EG";

    console.log("🔍 SubscribeModal - Validating phone:", {
      phoneNumber,
      countryCode,
      phoneValueRaw: subscribeValue.phoneValue,
    });

    if (!phoneNumber) {
      return locale === "ar" ? "رقم الهاتف مطلوب" : "Phone number is required";
    }

    // Use centralized validation helper
    const error = getPhoneValidationError(
      phoneNumber,
      countryCode,
      locale as "en" | "ar"
    );

    if (error) {
      console.log("❌ Phone validation failed:", error);
      return error;
    }

    console.log("✅ Phone validation passed");
    return null;
  };

  // Validate input based on type
  const validateInput = (): string | null => {
    const trimmed = subscribeValue.value.trim();
    if (!trimmed) {
      return toastT("validationError");
    }

    if (subscribeType === "email") {
      return validateEmail(trimmed);
    }

    return validatePhone();
  };

  const handleSubscribeClick = async () => {
    if (loading) return;

    // Validate input
    const validationError = validateInput();
    if (validationError) {
      setSubscribeError(validationError);
      return;
    }

    setLoading(true);
    try {
      const trimmed = subscribeValue.value.trim();
      await subscribe(subscribeType, trimmed, subscribeValue.phoneValue?.code);
      toast.success(t("Footer.subscribeSuccess"));
      // Reset form and close modal
      setSubscribeValue({ value: "" });
      setSubscribeError("");
      onClose();
    } catch (err) {
      console.error("Subscribe failed:", err);
      const serverMsg =
        getServerErrorMessage(err) || t("Footer.subscribeFailed");
      toast.error(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        duration: 0.5,
        bounce: 0.3,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Only render on client-side to avoid hydration issues with portals
  if (globalThis.window === undefined) {
    return null;
  }

  if (isOpen) {
    console.log("[SubscribeModal] Modal is OPEN, rendering portal content");
  }

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          onClick={(e) => {
            // Prevent clicks on the wrapper from bubbling to other dialogs (e.g. Radix Dialog)
            e.stopPropagation();
          }}
          onMouseDown={(e) => {
            // Also prevent mousedown from bubbling (Radix uses this for outside clicks)
            e.stopPropagation();
          }}
          onPointerDown={(e) => {
            // Prevent pointer events from bubbling to Radix Dialog
            e.stopPropagation();
          }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[99990]"
            onClick={(e) => {
              // Prevent this click from reaching other overlays/dialogs
              e.stopPropagation();
              onClose();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md bg-white dark:bg-[#1A1A1D] rounded-2xl shadow-2xl overflow-hidden z-[100000] pointer-events-auto"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label={t("Footer.subscribeModalClose")}
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Decorative gradient background */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-main/20 via-main/10 to-transparent" />

            {/* Content */}
            <div className="relative p-8 pt-12">
              {/* Icon/Logo area */}
              <motion.div
                className="flex justify-center mb-6"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  delay: 0.2,
                  duration: 0.6,
                }}
              >
                <div className="w-16 h-16 bg-main/10 dark:bg-main/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-main"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </motion.div>

              {/* Title */}
              <motion.h2
                className="text-2xl lg:text-3xl font-bold text-center mb-3 text-gray-900 dark:text-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {t("Footer.subscribeModalTitle")}
              </motion.h2>

              {/* Description */}
              <motion.p
                className="text-center text-gray-600 dark:text-gray-400 mb-8 text-sm lg:text-base"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {t("Footer.subscribeModalDescription")}
              </motion.p>

              {/* Subscribe Input */}
              <motion.div
                className="mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <SubscribeInput
                  type={subscribeType}
                  value={subscribeValue}
                  onChange={(newValue) => {
                    setSubscribeValue(newValue);
                    if (subscribeError) {
                      setSubscribeError("");
                    }
                  }}
                  placeholder={getSubscribePlaceholder()}
                  error={subscribeError}
                  disabled={loading}
                  language={locale as "en" | "ar"}
                  minLength={
                    subscribeType === "phone" ? undefined : subscribeMin
                  }
                />
              </motion.div>

              {/* Subscribe Button */}
              <motion.button
                onClick={handleSubscribeClick}
                disabled={loading}
                className="w-full h-12 bg-main hover:bg-main/90 rounded-lg text-white text-base lg:text-lg font-bold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? t("Footer.subscribing") : t("Footer.subscribe")}
              </motion.button>

              {/* No Thanks Button */}
              <motion.button
                onClick={onClose}
                className="w-full mt-3 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {t("Footer.subscribeModalNoThanks")}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render to document.body to ensure it's outside any Radix Dialog portals
  return createPortal(modalContent, document.body);
};

export default SubscribeModal;
