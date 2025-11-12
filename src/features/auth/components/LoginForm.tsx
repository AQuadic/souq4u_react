"use client";
import {
  PhoneInput,
  PhoneValue,
} from "@/shared/components/compound/PhoneInput";
import React, { useState } from "react";

import { useToast } from "@/shared/components/ui/toast/toast-store";
import { DialogClose } from "@/shared/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// Define proper error types
interface ApiError {
  message?: string;
  errors?: {
    phone?: string[];
  };
}

// Define config type
// interface Config {
//   icon?: {
//     url: string;
//   };
//   name?: {
//     ar?: string;
//     en?: string;
//   };
// }

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

      {isInDialog ? (
        <DialogClose asChild>
          <Link
            to="/"
            className="w-full h-12 md:h-14 mt-4 rounded-full md:rounded-[112px] flex items-center justify-center text-main text-base md:text-lg font-medium leading-[100%] transition-colors hover:bg-main/10"
          >
            {t("Auth.continueAsGuest")}
          </Link>
        </DialogClose>
      ) : (
        <Link
          to="/"
          className="w-full h-12 md:h-14 border border-main mt-6 md:mt-8 rounded-full md:rounded-[112px] flex items-center justify-center text-main text-base md:text-lg font-bold leading-[100%] transition-colors hover:bg-main/10"
        >
          {t("Auth.continueAsGuest")}
        </Link>
      )}
    </form>
  );
};

export default LoginForm;
