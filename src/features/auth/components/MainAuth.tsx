"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/shared/components/ui/dialog";
import LoginForm from "@/features/auth/components/LoginForm";
import { VerificationForm } from "@/features/auth/components/VerificationForm";
// removed react-hot-toast; use internal toast store
import Profile from "@/shared/components/layout/header/icons/Profile";
// Removed LogoutDialog import - logout will happen immediately without a confirmation dialog
import { useTranslations } from "next-intl";
import { resendVerification, ResendResponse } from "@/features/auth/api/resend";
import { checkOtp } from "@/features/auth/api/checkOtp";
import { postLogin } from "../api/postLogin";
import { useLogin, useIsAuthenticated } from "@/features/auth/stores";
import { useToast } from "@/shared/components/ui/toast/toast-store";

interface MainAuthProps {
  onProfileClick?: () => void;
}

const MainAuth: React.FC<MainAuthProps> = ({ onProfileClick }) => {
  const [step, setStep] = useState<"login" | "verify">("login");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loginData, setLoginData] = useState<{
    phone: string;
    phone_country?: string;
    token?: string;
  } | null>(null);
  const [verificationData, setVerificationData] =
    useState<ResendResponse | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  // Refs to control polling
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldContinuePollingRef = useRef<boolean>(false);

  // Auth state and actions
  const router = useRouter();
  const loginUser = useLogin();
  const isAuthenticated = useIsAuthenticated();
  const toast = useToast();
  const t = useTranslations("Auth");

  // Handle profile click - either open dialog or navigate to profile
  const handleProfileClick = useCallback(() => {
    // Close any surrounding UI (like mobile sidebar) if caller provided a handler
    onProfileClick?.();
    if (isAuthenticated) {
      // If the user is authenticated, go to their profile page
      router.push("/profile");

      // ensure any dialog is closed
      setIsDialogOpen(false);
    } else {
      // If not authenticated, open the login dialog
      setIsDialogOpen(true);
    }
  }, [isAuthenticated, onProfileClick, router]);

  // Function to stop polling
  const stopPolling = useCallback(() => {
    shouldContinuePollingRef.current = false;
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
      pollingTimeoutRef.current = null;
    }
    setIsPolling(false);
  }, []);

  // Polling function to check OTP status continuously
  const pollOtpStatus = useCallback(
    async (
      phone: string,
      token: string,
      phoneCountry?: string,
      reference?: string
    ) => {
      // Stop any existing polling first
      stopPolling();

      setIsPolling(true);
      shouldContinuePollingRef.current = true;

      const maxAttempts = 60; // Poll for up to 5 minutes (60 attempts * 5 seconds)
      let attempts = 0;

      const poll = async (): Promise<void> => {
        // Check if we should continue polling
        if (!shouldContinuePollingRef.current) {
          console.log("Polling stopped by user action");
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

          // Check if we should still continue (user might have logged in)
          if (!shouldContinuePollingRef.current) {
            console.log("Polling stopped during request");
            setIsPolling(false);
            return;
          }

          // Check if we got a successful response with user data and token
          if (response?.user && response?.token) {
            // Login successful - stop polling immediately
            stopPolling();
            loginUser(response.user, response.token);
            toast.success(t("loginSuccess"), { duration: 8000 });
            setStep("login");
            setIsDialogOpen(false); // Close the dialog
            return;
          }

          // If not successful and haven't reached max attempts, continue polling
          if (attempts < maxAttempts && shouldContinuePollingRef.current) {
            pollingTimeoutRef.current = setTimeout(poll, 5000); // Poll every 5 seconds
          } else {
            stopPolling();
            toast.error(t("verificationTimedOut"));
          }
        } catch (error) {
          // OTP check failures are expected while waiting for user to verify
          // Only log in development, don't show error toast
          if (process.env.NODE_ENV === "development") {
            console.log("OTP check pending (expected):", error);
          }

          // Check if we should still continue
          if (!shouldContinuePollingRef.current) {
            setIsPolling(false);
            return;
          }

          // Continue polling silently - errors are expected until user verifies
          if (attempts < maxAttempts && shouldContinuePollingRef.current) {
            pollingTimeoutRef.current = setTimeout(poll, 5000);
          } else {
            // Only show error after max attempts (timeout scenario)
            stopPolling();
            toast.error(t("verificationTimedOut"));
          }
        }
      };

      // Start polling
      poll();
    },
    [loginUser, stopPolling, t, toast]
  );

  // Cleanup effect to stop polling when component unmounts or dialog closes
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  // Stop polling when dialog closes
  useEffect(() => {
    if (!isDialogOpen) {
      stopPolling();
    }
  }, [isDialogOpen, stopPolling]);

  // Handler for resending verification
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

  const handleLogin = async (payload: {
    phone: string;
    phone_country?: string;
  }) => {
    try {
      // First send login and get token
      const loginResp = await postLogin(payload);
      const token = loginResp?.token;

      // Store login data
      setLoginData({
        phone: payload.phone,
        phone_country: payload.phone_country,
        token,
      });

      // Then call resend/verify with the token and phone_country (if present)
      const verificationResp = await resendVerification(
        payload.phone,
        token,
        payload.phone_country
      );

      // Store verification response data
      setVerificationData(verificationResp);

      toast.success(t("verificationCodeSent"));
      setStep("verify");

      // Start polling for OTP status automatically
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

  return (
    <>
      {/* Profile button that handles authentication state */}
      <button
        onClick={handleProfileClick}
        className="cursor-pointer sm:text-white bg-transparent border-none p-0 text-current"
        aria-label={t("profile")}
      >
        <Profile />
      </button>

      {/* If user is authenticated, render LogoutDialog inside the same Dialog flow so it uses existing dialog state */}
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
        <DialogContent className="w-full max-w-[500px] md:max-w-[600px] lg:max-w-[691px] rounded-[20px] md:rounded-[40px]   border-none py-8 md:py-12 lg:py-20 mx-4 max-h-[90vh] overflow-y-auto scroll-hidden z-[40]">
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
      {/* End Dialog wrapper */}
    </>
  );
};

export default MainAuth;
