import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Facebook from "./icons/Facebook";
import X from "./icons/X";
import LinkedIn from "./icons/LinkedIn";
import Instagram from "./icons/Instagram";
import Youtube from "./icons/Youtube";
import Tiktok from "./icons/Tiktok";
import Snapchat from "./icons/Snapchat";
// import SubscribeInput, {
//   SubscribeInputValue,
// } from "../../forms/SubscribeInput";
import FooterContactInfo from "./FooterContactInfo";
import SubscribeInput, { SubscribeInputValue } from "../../forms/SubscribeInput";
import { useToast } from "../../ui/toast";
import { useConfig } from "@/features/config";
import { subscribe } from "@/features/api/subscribe";

const socialIcons = [
  { Icon: Facebook, href: "https://facebook.com" },
  { Icon: X, href: "https://twitter.com" },
  { Icon: LinkedIn, href: "https://linkedin.com" },
  { Icon: Instagram, href: "https://instagram.com" },
  { Icon: Youtube, href: "https://youtube.com" },
  { Icon: Tiktok, href: "https://tiktok.com" },
  { Icon: Snapchat, href: "https://snapchat.com" },
];

const Footer = () => {
  const config = useConfig();
  const { t, i18n } = useTranslation("Navigation");
  const locale = i18n.language;
  const toastT = useTranslation("Toasts");
  const [subscribeValue, setSubscribeValue] = useState<SubscribeInputValue>({
    value: "",
  });
  const [subscribeError, setSubscribeError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const [isDialogOpen, ] = useState(false);
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldContinuePollingRef = useRef<boolean>(false);
  const [isPolling, setIsPolling] = useState(false);

  // Get subscribe type from config, default to email
  // Normalize subscribe type to either 'phone' or 'email'
  const rawSubscribeType = config?.subscribe_config?.type;
  const subscribeType = rawSubscribeType === "phone" ? "phone" : "email";

  // Minimum length for phone numbers (from config) - coerce to number and fallback to 0
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
      if (respData?.message) return respData.message;
      if (Array.isArray(respData?.errors?.email) && respData.errors.email[0])
        return respData.errors.email[0];

      if (typeof apiErr.message === "string" && apiErr.message) {
        const m = apiErr.message;
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
    } catch (parseErr) {
      console.error("Failed to parse API error:", parseErr);
    }
    return null;
  };


  const stopPolling = useCallback(() => {
    shouldContinuePollingRef.current = false;
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
      pollingTimeoutRef.current = null;
    }
    setIsPolling(false);
  }, []);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  useEffect(() => {
    if (!isDialogOpen) {
      stopPolling();
    }
  }, [isDialogOpen, stopPolling]);

  // Handler for subscribe button click extracted for clarity
  const handleSubscribeClick = async () => {
    if (loading) return;

    // Validate input
    const trimmed = subscribeValue.value.trim();
    if (!trimmed) {
      setSubscribeError(toastT("validationError"));
      return;
    }

    // Validate based on type
    if (subscribeType === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) {
        setSubscribeError(t("invalidEmail"));
        return;
      }
    } else if (subscribeType === "phone") {
      const phoneNumber = subscribeValue.phoneValue?.number || "";
      if (!phoneNumber) {
        setSubscribeError(
          locale === "ar" ? "رقم الهاتف مطلوب" : "Phone number is required"
        );
        return;
      }

      if (subscribeMin > 0 && phoneNumber.length < subscribeMin) {
        setSubscribeError(
          locale === "ar"
            ? `الحد الأدنى لطول رقم الهاتف هو ${subscribeMin}`
            : `Phone number must be at least ${subscribeMin} digits`
        );
        return;
      }
    }

    setLoading(true);
    try {
      const res = await subscribe(
        subscribeType,
        trimmed,
        subscribeValue.phoneValue?.code
      );
      toast.success(t("subscribeSuccess"));
      // Reset form
      setSubscribeValue({
        value: "",
      });
      setSubscribeError("");
    } catch (err) {
      console.error("Subscribe failed:", err);
      const serverMsg = getServerErrorMessage(err) || t("subscribeFailed");
      toast.error(serverMsg);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <FooterContactInfo />
      <footer className="container lg:py-20 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {/* Section 1 - Brand */}
          <div className="lg:col-span-1 md:col-span-2">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <img
                src="/logo.png"
                alt="Logo"
                width={64}
                height={64}
                className="object-contain py-2"
              />
              <h1 className="text-2xl lg:text-[40px] font-semibold text-main font-anton-sc">
                Souq<span className="text-main-orange">4</span>U
              </h1>
            </div>

            <p className="text-base lg:text-lg font-normal leading-[150%] max-w-[340px] mx-auto lg:mx-0 mb-6">
              &quot;High-quality products that make your life better.&quot;
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-3">
              {socialIcons.map(({ Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity duration-200"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Section 2 - Explore */}
          <div>
            <h2 className="text-xl lg:text-[32px] font-semibold leading-[100%] mb-6">
              {t("Footer.explore")}
            </h2>
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-base lg:text-xl font-normal leading-[100%] hover:text-main transition-colors duration-200"
              >
                {t("Navigation.home")}
              </Link>
              <Link
                to="/products"
                className="text-base lg:text-xl font-normal leading-[100%] hover:text-main transition-colors duration-200"
              >
                {t("Navigation.products")}
              </Link>
              <Link
                to="/contact"
                className="text-base lg:text-xl font-normal leading-[100%] hover:text-main transition-colors duration-200"
              >
                {t("Contact.title")}
              </Link>
            </div>
          </div>

          {/* Section 3 - Help */}
          <div>
            <h2 className="text-xl lg:text-[32px] font-semibold leading-[100%] mb-6">
              {t("Footer.help")}
            </h2>
            <div className="flex flex-col gap-4">
              {/* <Link
                to="/track-order"
                className="text-base lg:text-xl font-normal leading-[100%] hover:text-main transition-colors duration-200"
              >
                {t("Footer.trackOrder")}
              </Link> */}
              <Link
                to="/profile/account"
                className="text-base lg:text-xl font-normal leading-[100%] hover:text-main transition-colors duration-200"
              >
                {t("Footer.myAccount")}
              </Link>
              {/* <Link
                to="/faq"
                className="text-base lg:text-xl font-normal leading-[100%] hover:text-main transition-colors duration-200"
              >
                {t("Footer.faq")}
              </Link>
              <Link
                to="/privacy"
                className="text-base lg:text-xl font-normal leading-[100%] hover:text-main transition-colors duration-200"
              >
                {t("Footer.privacyPolicy")}
              </Link> */}
            </div>
          </div>

          {/* Section 4 - Newsletter */}
          <div className="  lg: ">
          <h2 className=" text-xl lg:text-[32px] font-semibold leading-[100%] mb-6">
            {t("Navigation.subscribeUs")}
          </h2>
          <div className="flex flex-col gap-4 max-w-[323px] mx-auto lg:mx-0">
            <SubscribeInput
              type={subscribeType}
              value={subscribeValue}
              onChange={(newValue) => {
                setSubscribeValue(newValue);
                // Clear error when user changes input
                if (subscribeError) {
                  setSubscribeError("");
                }
              }}
              placeholder={getSubscribePlaceholder()}
              error={subscribeError}
              disabled={loading}
              language={locale as "en" | "ar"}
              // Only pass a minLength when the subscribe type is not phone
              minLength={subscribeType === "phone" ? undefined : subscribeMin}
            />
            <button
              onClick={handleSubscribeClick}
              disabled={loading}
              className="w-full h-12 bg-main hover:bg-main/90 rounded-[8px] text-[#FDFDFD] text-base lg:text-lg font-bold leading-[100%] transition-colors duration-200 disabled:opacity-60 cursor-pointer"
            >
              {loading ? t("Footer.subscribing") : t("Footer.subscribe")}
            </button>
          </div>
        </div>

        </div>
      </footer>
    </div>
  );
};

export default Footer;
