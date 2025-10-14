"use client";
import {
  PhoneInput,
  PhoneValue,
} from "@/shared/components/compound/PhoneInput";
import React, { useState } from "react";

import { Link } from "@/i18n/navigation";
import { useToast } from "@/shared/components/ui/toast/toast-store";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";

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
}

const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const [phone, setPhone] = useState<PhoneValue>({ code: "20", number: "" });
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Auth");
  const locale = useLocale();
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

      const extractApiMessage = (err: unknown): string => {
        const fallback = t("resendFailed");
        if (!err) return fallback;

        // Try to obtain a parsed ApiError from different shapes
        let parsed: ApiError | null = null;
        if (typeof err === "string") parsed = parseJsonFromString(err);
        else if (err instanceof Error)
          parsed = parseJsonFromString(err.message || "");
        else if (typeof err === "object" && err !== null)
          parsed = err as ApiError;

        if (parsed?.errors?.phone?.[0]) return parsed.errors.phone[0];
        if (parsed?.message) return parsed.message;

        if (typeof err === "string") return err;
        if (err instanceof Error) return err.message || fallback;

        return fallback;
      };

      const apiErrorMessage = extractApiMessage(error);

      // Show only the clean message in the toast
      try {
        toast.error(apiErrorMessage || t("resendFailed"));
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
      <p className="text-lg md:text-xl lg:text-[32px] font-medium leading-[120%] mt-6 md:mt-8 text-center">
        {t("welcome", { brandName: "Souq4U" })}
      </p>
      <h2 className="text-xl md:text-2xl lg:text-[32px] font-bold leading-[120%] mt-4 md:mt-6 text-center">
        {t("signIn")}
      </h2>
      <div className="mt-6 md:mt-8 lg:mt-10 flex flex-col gap-2">
        <label
          htmlFor="phone"
          className="text-sm md:text-base font-semibold leading-[100%] text-left rtl:text-right mb-2"
        >
          {t("phone")}
        </label>
        <PhoneInput
          value={phone}
          onChange={setPhone}
          placeholder={t("enterPhone")}
          language={locale as "en" | "ar"}
        />
      </div>
      <button
        type="submit"
        disabled={loading || phone.number.length === 0}
        className="w-full h-12 md:h-14 bg-main text-white rounded-full md:rounded-[112px] mt-4 md:mt-5 text-base md:text-lg font-bold cursor-pointer disabled:opacity-50 transition-opacity"
      >
        {loading ? t("signingIn") : t("signIn")}
      </button>

      <Link
        href="/"
        className="w-full h-12 md:h-14  border-main mt-6 md:mt-8 rounded-full md:rounded-[112px] flex items-center justify-center text-main text-base md:text-lg  leading-[100%] transition-colors hover:bg-main/10"
      >
        {t("continueAsGuest")}
      </Link>
    </form>
  );
};

export default LoginForm;
