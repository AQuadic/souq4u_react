import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Facebook from "./icons/Facebook";
import X from "./icons/X";
import LinkedIn from "./icons/LinkedIn";
import Instagram from "./icons/Instagram";
import Youtube from "./icons/Youtube";
import Tiktok from "./icons/Tiktok";
import Snapchat from "./icons/Snapchat";
import SubscribeInput, {
  SubscribeInputValue,
} from "../../forms/SubscribeInput";
import FooterContactInfo from "./FooterContactInfo";
import {
  usePagesContextSafe,
  useFooterNavigation,
} from "@/features/static-pages";
import { useToast } from "../../ui/toast";
import { useConfig } from "@/features/config";
import { subscribe } from "@/features/api/subscribe";
import {
  checkOtp,
  postLogin,
  ResendResponse,
  resendVerification,
  useAuthStore,
  useLogin,
  VerificationForm,
} from "@/features/auth";
import LoginForm from "@/features/auth/components/LoginForm";
import { Dialog, DialogContent, DialogHeader } from "../../ui/dialog";
import { getPhoneValidationError } from "@/shared/utils/phoneValidationHelper";
import { getStoreSetting } from "../api/store";
import { useQuery } from "@tanstack/react-query";

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
  const locale = i18n.language || "en";

  // Get pages from context and build footer navigation links
  const pages = usePagesContextSafe();
  const dynamicLinks = useFooterNavigation(pages);
  const navigate = useNavigate();
  const [subscribeValue, setSubscribeValue] = useState<SubscribeInputValue>({
    value: "",
  });
  const [subscribeError, setSubscribeError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldContinuePollingRef = useRef<boolean>(false);
  const [isPolling, setIsPolling] = useState(false);
  const isAuth = useAuthStore((state) => state.isAuthenticated);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [step, setStep] = useState<"login" | "verify">("login");
  const [loginData, setLoginData] = useState<{
    phone: string;
    phone_country?: string;
    token?: string;
  } | null>(null);
  const [verificationData, setVerificationData] =
    useState<ResendResponse | null>(null);
  const loginUser = useLogin();

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
    } catch (error_) {
      console.error("Failed to parse API error:", error_);
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

  const handleAccountClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuth) {
      navigate("/profile/account");
    } else if (config?.store_type === "Clothes") {
      navigate("/auth/login");
    } else {
      setIsDialogOpen(true);
    }
  };

  const pollOtpStatus = useCallback(
    async (
      phone: string,
      token: string,
      phoneCountry?: string,
      reference?: string
    ) => {
      stopPolling();

      setIsPolling(true);
      shouldContinuePollingRef.current = true;

      const maxAttempts = 60;
      let attempts = 0;

      const poll = async (): Promise<void> => {
        if (!shouldContinuePollingRef.current) {
          setIsPolling(false);
          return;
        }

        try {
          attempts++;
          const response = await checkOtp(
            phone,
            token,
            phoneCountry,
            reference
          );

          if (!shouldContinuePollingRef.current) {
            console.log("Polling stopped during request");
            setIsPolling(false);
            return;
          }

          if (response?.user && response?.token) {
            stopPolling();
            loginUser(response.user, response.token);
            toast.success(t("loginSuccess"));
            setStep("login");
            setIsDialogOpen(false);
            return;
          }

          if (attempts < maxAttempts && shouldContinuePollingRef.current) {
            pollingTimeoutRef.current = setTimeout(poll, 5000); // Poll every 5 seconds
          } else {
            stopPolling();
            toast.error(t("verificationTimedOut"));
          }
        } catch (error) {
          console.error("OTP check failed:", error);
          if (!shouldContinuePollingRef.current) {
            setIsPolling(false);
            return;
          }

          if (attempts < maxAttempts && shouldContinuePollingRef.current) {
            pollingTimeoutRef.current = setTimeout(poll, 5000);
          } else {
            stopPolling();
            toast.error(t("verificationFailed"));
          }
        }
      };

      poll();
    },
    [loginUser, stopPolling, t, toast]
  );

  const handleLogin = async (payload: {
    phone: string;
    phone_country?: string;
  }) => {
    try {
      const loginResp = await postLogin(payload);
      const token = loginResp?.token;

      setLoginData({
        phone: payload.phone,
        phone_country: payload.phone_country,
        token,
      });

      const verificationResp = await resendVerification(
        payload.phone,
        token,
        payload.phone_country
      );

      setVerificationData(verificationResp);

      toast.success(t("verificationCodeSent"));
      setStep("verify");

      await pollOtpStatus(
        payload.phone,
        token,
        payload.phone_country,
        verificationResp.otp_callback?.reference
      );
    } catch (error: unknown) {
      let errorMessage = "Resend failed";
      if (error && typeof error === "object") {
        const err = error as {
          message?: string;
          errors?: { phone?: string[] };
        };
        errorMessage =
          err?.message || err?.errors?.phone?.[0] || t("resendFailed");
      }
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleResendVerification = useCallback(async () => {
    if (loginData?.phone && loginData?.token) {
      try {
        const verificationResp = await resendVerification(
          loginData.phone,
          loginData.token,
          loginData.phone_country
        );
        setVerificationData(verificationResp);
        toast.success(t("newVerificationCodeSent"));
      } catch (error) {
        console.error("Resend verification failed:", error);
        toast.error(t("failedToSendCode"));
      }
    }
  }, [loginData, t, toast]);

  // Handler for subscribe button click extracted for clarity
  const handleSubscribeClick = async () => {
    if (loading) return;

    // Validate input
    const trimmed = subscribeValue.value.trim();
    if (!trimmed) {
      setSubscribeError(t("Toasts.validationError"));
      return;
    }

    // Validate based on type
    if (subscribeType === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) {
        setSubscribeError(t("Footer.invalidEmail"));
        return;
      }
    } else if (subscribeType === "phone") {
      const phoneNumber = subscribeValue.phoneValue?.number || "";
      const countryCode = subscribeValue.phoneValue?.code || "EG";

      console.log("🔍 Footer - Validating phone:", {
        phoneNumber,
        countryCode,
        phoneValueRaw: subscribeValue.phoneValue,
      });

      if (!phoneNumber) {
        setSubscribeError(
          locale === "ar" ? "رقم الهاتف مطلوب" : "Phone number is required"
        );
        return;
      }

      // Use centralized validation helper
      const phoneError = getPhoneValidationError(
        phoneNumber,
        countryCode,
        locale as "en" | "ar"
      );

      if (phoneError) {
        console.log("❌ Phone validation failed:", phoneError);
        setSubscribeError(phoneError);
        return;
      }

      console.log("✅ Phone validation passed");
    }

    setLoading(true);
    try {
      await subscribe(subscribeType, trimmed, subscribeValue.phoneValue?.code);
      toast.success(t("Footer.subscribeSuccess"));
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

  const { data: storeData, isLoading, error } = useQuery({
    queryKey: ["storeData"],
    queryFn: () => getStoreSetting(),
  });

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
                width={92}
                height={48}
                className="object-contain py-2"
              />
            </div>

            <p className="text-base lg:text-lg font-normal leading-[150%] max-w-[340px] mx-auto lg:mx-0 mb-6">
              {isLoading
                ? (locale === "ar" ? "جارِ التحميل..." : "Loading...")
                : error
                  ? (locale === "ar"
                      ? "حدث خطأ أثناء تحميل التفاصيل."
                      : "Failed to load details.")
                  : storeData?.details || ""}
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
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-base lg:text-xl font-normal leading-[100%] hover:text-main transition-colors duration-200"
              >
                {t("Navigation.home")}
              </Link>
              <Link
                to="/products"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-base lg:text-xl font-normal leading-[100%] hover:text-main transition-colors duration-200"
              >
                {t("Navigation.products")}
              </Link>
              <Link
                to="/contact"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-base lg:text-xl font-normal leading-[100%] hover:text-main transition-colors duration-200"
              >
                {t("Contact.title")}
              </Link>
            </div>
          </div>

          {/* Section 3 - Dynamic Pages (from API) */}
          <div>
            <h2 className="text-xl lg:text-[32px] font-semibold leading-[100%] mb-6">
              {t("Footer.help")}
            </h2>
            <div className="flex flex-col gap-4">
              <Link
                to="/track-order"
                className=" text-base lg:text-xl font-normal leading-[100%] hover:text-main transition-colors duration-200"
              >
                {t("Footer.trackOrder")}
              </Link>
              <Link
                to="/profile/account"
                onClick={handleAccountClick}
                className=" text-base lg:text-xl font-normal leading-[100%] hover:text-main transition-colors duration-200 cursor-pointer"
              >
                {t("Footer.myAccount")}
              </Link>
              {dynamicLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-base lg:text-xl font-normal leading-[100%] hover:text-main transition-colors duration-200"
                >
                  {locale === "ar" ? link.titleAr : link.titleEn}
                </Link>
              ))}
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

          {/* <div>
            <h2 className="text-xl lg:text-[32px] font-semibold leading-[100%] mb-6">
              {t("Footer.subscribe")}
            </h2>
            <div className="flex flex-col gap-4 max-w-[323px] mx-auto lg:mx-0">
              <p className="text-sm text-gray-500">Coming soon...</p>
            </div>
          </div> */}

          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                stopPolling();
                setStep("login");
              }
            }}
          >
            <DialogContent className="w-full md:max-w-[600px] lg:max-w-[691px] rounded-[20px] md:rounded-[40px]   border-none py-8 md:py-12 lg:py-20 max-h-[90vh] overflow-y-auto scroll-hidden z-[40] mx-auto">
              <DialogHeader>
                {step === "login" ? (
                  <LoginForm onSubmit={handleLogin} />
                ) : (
                  <VerificationForm
                    onBack={() => {
                      stopPolling();
                      setStep("login");
                    }}
                    loginData={loginData}
                    verificationData={verificationData}
                    onResendVerification={handleResendVerification}
                    isPolling={isPolling}
                  />
                )}
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
