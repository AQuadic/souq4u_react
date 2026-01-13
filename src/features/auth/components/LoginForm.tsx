import {
  PhoneInput,
  PhoneValue,
} from "@/shared/components/compound/PhoneInput";
import React, { useState } from "react";
import { useToast } from "@/shared/components/ui/toast/toast-store";
import { DialogClose } from "@/shared/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Google from "./icons/Google";
import Apple from "./icons/Apple";
import { auth, googleProvider } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { socialLogin } from "../api/socialLogin";
import { useAuthStore } from "../stores/auth-store";
import { getErrorMessage } from "@/shared/utils/errorHandler";

// Apple Sign In types
declare global {
  interface Window {
    AppleID?: {
      auth: {
        init: (config: any) => void;
        signIn: () => Promise<any>;
      };
    };
  }
}

// Define proper error types
interface ApiError {
  message?: string;
  errors?: {
    phone?: string[];
  };
}

interface LoginFormProps {
  onSubmit: (payload: {
    phone: string;
    phone_country: string;
  }) => Promise<void>;
  isInDialog?: boolean;
}

const LoginForm = ({ onSubmit, isInDialog = true }: LoginFormProps) => {
  const [phone, setPhone] = useState<PhoneValue>({ code: "20", number: "" });
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("Auth");
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const [isSocialLoading, setIsLoading] = useState(false);

  // Initialize Apple Sign In when component mounts
  React.useEffect(() => {
    if (window.AppleID) {
      try {
        window.AppleID.auth.init({
          clientId: "com.souq4u.apple",
          scope: "email name",
          redirectURI: "https://souq4u.com/auth/apple/callback",
          usePopup: true,
        });
      } catch (error) {
        console.error("Failed to initialize Apple Sign In:", error);
      }
    }
  }, []);

  const handleAppleLogin = async () => {
    setIsLoading(true);
    try {
      if (!window.AppleID) {
        throw new Error("Apple Sign In SDK not loaded");
      }

      // Add event listener for Apple Sign In response
      const handleAppleResponse = async (event: any) => {
        try {
          const response = event.detail;
          const { id_token } = response.authorization;

          if (!id_token) {
            throw new Error("No id_token returned from Apple");
          }

          const responseData = await socialLogin({
            provider: "apple",
            access_token: id_token,
          });

          const authedUser = responseData.user;

          if (authedUser) {
            login(authedUser, responseData.token);
            const from =
              (location.state as { from?: Location } | null)?.from?.pathname ||
              "/";
            navigate(from, { replace: true });
          }
        } catch (error) {
          console.error(error);
          toast.error(getErrorMessage(error));
        } finally {
          setIsLoading(false);
          document.removeEventListener(
            "AppleIDSignInOnSuccess",
            handleAppleResponse
          );
        }
      };

      const handleAppleError = (event: any) => {
        console.error("Apple Sign In error:", event.detail);
        toast.error("Apple Sign In failed. Please try again.");
        setIsLoading(false);
        document.removeEventListener(
          "AppleIDSignInOnFailure",
          handleAppleError
        );
      };

      document.addEventListener("AppleIDSignInOnSuccess", handleAppleResponse);
      document.addEventListener("AppleIDSignInOnFailure", handleAppleError);

      await window.AppleID.auth.signIn();
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error));
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      if (!token) {
        throw new Error("No access token returned from Google");
      }

      const response = await socialLogin({
        provider: "google",
        access_token: token,
      });

      const authedUser = response.user;

      if (authedUser) {
        login(authedUser, response.token);
        const from =
          (location.state as { from?: Location } | null)?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    // prevent default form submission when triggered by Enter
    if (e) e.preventDefault();
    if (!phone.number) {
      toast.error(t("phoneRequired"));
      return;
    }

    setLoading(true);

    let normalizedPhone = phone.number;
    if (normalizedPhone.startsWith("0")) {
      normalizedPhone = normalizedPhone.substring(1);
    }
    normalizedPhone = `${phone.code}${normalizedPhone}`;

    try {
      await onSubmit({
        phone: normalizedPhone,
        phone_country: phone.code === "20" ? "EG" : phone.code,
      });
    } catch (error: unknown) {
      // Small helper: try to parse JSON at the end of a string (handles "...: {json}")
      const parseJsonFromString = (s: string): ApiError | null => {
        const re = /({[\s\S]*})$/;
        const m = re.exec(s);
        if (m?.[1]) {
          try {
            return JSON.parse(m[1]) as ApiError;
          } catch {
            /* ignore */
          }
        }

        try {
          return JSON.parse(s) as ApiError;
        } catch {
          return null;
        }
      };

      const extractApiMessage = (err: unknown): void => {
        if (!err) {
          toast.error(t("resendFailed"));
          return;
        }

        // Try to obtain a parsed ApiError from different shapes
        let parsed: ApiError | null = null;
        if (typeof err === "string") parsed = parseJsonFromString(err);
        else if (err instanceof Error)
          parsed = parseJsonFromString(err.message || "");
        else if (typeof err === "object" && err !== null)
          parsed = err as ApiError;

        // Show individual toasts for all errors
        if (parsed?.errors && typeof parsed.errors === "object") {
          for (const messages of Object.values(parsed.errors)) {
            if (Array.isArray(messages)) {
              for (const msg of messages) {
                toast.error(msg);
              }
            } else if (messages) {
              toast.error(messages);
            }
          }
        } else if (parsed?.message) {
          toast.error(parsed.message);
        } else if (typeof err === "string") {
          toast.error(err);
        } else if (err instanceof Error) {
          toast.error(err.message || t("resendFailed"));
        } else {
          toast.error(t("resendFailed"));
        }
      };

      // Show only the clean message(s) in the toast(s)
      try {
        extractApiMessage(error);
      } catch {
        console.warn("Toast error");
      }

      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mx-auto w-full max-w-md" onSubmit={handleSubmit}>
      <div className="flex items-center justify-center gap-2 !rounded-[40px]">
        <img
          src={"/logo.png"}
          alt="logo"
          width={64}
          height={33}
          className=" object-cover"
        />
        <h1 className="text-2xl lg:text-[40px] font-semibold text-main font-anton-sc">
          Souq<span className="text-main-orange">4</span>U
        </h1>
      </div>
      <p className="text-[#5D5D5D] text-lg md:text-xl lg:text-[32px] font-medium leading-[120%] mt-6 md:mt-8 text-center capitalize">
        {t("Auth.welcome")}
      </p>
      <h2 className="text-xl md:text-2xl lg:text-[32px] font-bold leading-[120%] mt-4 md:mt-6 text-center">
        {t("Auth.signIn")}
      </h2>
      <div className="mt-6 md:mt-8 lg:mt-10 flex flex-col gap-2">
        <label
          htmlFor="phone"
          className="text-sm md:text-base font-semibold leading-[100%] text-left rtl:text-right mb-2"
        >
          {t("Auth.phone")}
        </label>
        <PhoneInput
          value={phone}
          onChange={setPhone}
          placeholder={t("Auth.enterPhone")}
          language={locale as "en" | "ar"}
        />
      </div>
      <button
        type="submit"
        disabled={loading || phone.number.length === 0}
        className="w-full h-12 md:h-14 bg-main text-white rounded-full md:rounded-[112px] mt-4 md:mt-5 text-base md:text-lg font-bold cursor-pointer disabled:opacity-50 transition-opacity"
      >
        {loading ? t("Auth.signingIn") : t("Auth.signIn")}
      </button>

      <div className="flex items-center gap-4 mt-8">
        <div className="flex-1 h-[1px] bg-[#E0E0E0]"></div>
        <span className="text-[#5D5D5D] text-sm md:text-base font-medium whitespace-nowrap">
          {t("Auth.orSignInWith")}
        </span>
        <div className="flex-1 h-[1px] bg-[#E0E0E0]"></div>
      </div>

      <div className="flex justify-center gap-6 mt-6">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isSocialLoading}
          className="hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          <Google />
        </button>
        <button
          type="button"
          onClick={handleAppleLogin}
          disabled={isSocialLoading}
          className="hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          <Apple />
        </button>
      </div>

      {isInDialog ? (
        <DialogClose asChild>
          <Link
            to="/"
            className="w-full mt-6 flex items-center justify-center text-main text-base md:text-lg font-medium transition-colors hover:underline"
          >
            {t("Auth.continueAsGuest")}
          </Link>
        </DialogClose>
      ) : (
        <Link
          to="/"
          className="w-full mt-6 flex items-center justify-center text-main text-base md:text-lg font-medium transition-colors hover:underline"
        >
          {t("Auth.continueAsGuest")}
        </Link>
      )}
    </form>
  );
};

export default LoginForm;
