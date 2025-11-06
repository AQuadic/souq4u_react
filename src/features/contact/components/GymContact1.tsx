"use client";

import React, { useState } from "react";
import { postSuggestion, SuggestionPayload } from "../api/postSuggestions";
import {
  PhoneInput,
  PhoneValue,
} from "@/shared/components/compound/PhoneInput";
import { getCountryByIso2 } from "@/shared/constants/countries";
import { useToast } from "@/shared/components/ui/toast";
import { useTranslation } from "react-i18next";

const GymContact1 = () => {
  const toast = useToast();
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const [phoneValue, setPhoneValue] = useState<PhoneValue>({
    code: "EG",
    number: "",
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    city: "",
    type: "",
    title: "",
    message: "",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  }>({});

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const validate = () => {
    const newErrors: typeof errors = {};

    // ✅ Name Validation
    if (!form.name.trim()) {
      newErrors.name = t("Contact.errorNameRequired");
    } else if (!/^[\p{L}\s]+$/u.test(form.name.trim())) {
      newErrors.name = t("Contact.errorNameLettersOnly");
    } else if (form.name.trim().length < 2) {
      newErrors.name = t("Contact.errorNameTooShort");
    } else if (form.name.trim().length > 100) {
      newErrors.name = t("Contact.errorNameTooLong");
    }

    // ✅ Email Validation (optional)
    if (form.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email.trim())) {
        newErrors.email = t("Contact.errorEmailInvalid");
      }
    }

    // ✅ Phone Validation (Egypt format)
    const phoneDigits = phoneValue.number.replace(/\D/g, "");
    if (!phoneDigits) {
      newErrors.phone = t("Contact.errorPhoneRequired");
    } else if (!/^0?(10|11|12|15)[0-9]{8}$/.test(phoneDigits)) {
      newErrors.phone = t("Contact.errorPhoneInvalid");
    }

    // ✅ Message Validation
    if (!form.message.trim()) {
      newErrors.message = t("Contact.errorMessageRequired");
    } else if (form.message.trim().length < 10) {
      newErrors.message = t("Contact.errorMessageTooShort");
    } else if (form.message.trim().length > 1000) {
      newErrors.message = t("Contact.errorMessageTooLong");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const payload: SuggestionPayload = {
      ...form,
      phone: phoneValue.number || undefined,
      phone_country: phoneValue.code || getCountryByIso2("EG")?.iso2 || "EG",
    };

    if (!payload.email) delete payload.email;

    const response = await postSuggestion(payload);
    setLoading(false);

    if (response.success) {
      toast.success(t("Contact.success"));
      setForm({
        name: "",
        email: "",
        city: "",
        type: "",
        title: "",
        message: "",
      });
      setPhoneValue({ code: "EG", number: "" });
      setErrors({});
    } else {
      const errorMessage =
        response.message ||
        Object.values(response.errors || {})[0]?.[0] ||
        t("Contact.errorGeneric");
      toast.error(errorMessage);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="md:w-[576px] w-full h-full md:bg-white md:dark:bg-[#242529] rounded-3xl p-4"
    >
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="text-gray-900 dark:text-[#FDFDFD] text-base font-semibold leading-[100%]"
        >
          {t("Contact.name")}
        </label>
        <input
          type="text"
          name="name"
          placeholder={t("Contact.namePlaceholder")}
          value={form.name}
          onChange={handleChange}
          className={`w-full h-14 border rounded-[8px] mt-1 px-4 text-gray-700 dark:text-[#C0C0C0] border-gray-300 dark:border-[#C0C0C0] bg-white dark:bg-transparent ${
            errors.name ? "border-red-500" : ""
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div className="mt-2.5">
        <label
          htmlFor="email"
          className="flex items-center gap-2 text-gray-900 dark:text-[#FDFDFD] text-base font-semibold leading-[100%]"
        >
          <span>{t("Contact.email")}</span>
          <span className="text-sm text-muted-foreground">
            {t("Contact.optional")}
          </span>
        </label>
        <input
          type="email"
          name="email"
          placeholder={t("Contact.emailPlaceholder")}
          value={form.email}
          onChange={handleChange}
          className={`w-full h-14 border rounded-[8px] mt-1 px-4 text-gray-700 dark:text-[#C0C0C0] border-gray-300 dark:border-[#C0C0C0] bg-white dark:bg-transparent ${
            errors.email ? "border-red-500" : ""
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div className="mt-2.5">
        <label
          htmlFor="phone"
          className="text-gray-900 dark:text-[#FDFDFD] text-base font-semibold leading-[100%]"
        >
          {t("Contact.phone")}
        </label>
        <div className="mt-1">
          <PhoneInput
            value={phoneValue}
            onChange={(v) => {
              setPhoneValue(v);
              setErrors({ ...errors, phone: undefined });
            }}
            placeholder={t("Contact.phonePlaceholder")}
            radius="md"
            language={locale as "en" | "ar"}
          />
        </div>
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
      </div>

      {/* Message */}
      <div className="mt-2.5">
        <label
          htmlFor="message"
          className="text-gray-900 dark:text-[#FDFDFD] text-base font-semibold leading-[100%]"
        >
          {t("Contact.message")}
        </label>
        <textarea
          name="message"
          placeholder={t("Contact.messagePlaceholder")}
          value={form.message}
          onChange={handleChange}
          className={`w-full h-[138px] border rounded-[8px] mt-1 px-4 py-6 text-gray-700 dark:text-[#C0C0C0] border-gray-300 dark:border-[#C0C0C0] bg-white dark:bg-transparent ${
            errors.message ? "border-red-500" : ""
          }`}
        />
        {errors.message && (
          <p className="text-red-500 text-sm mt-1">{errors.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-14 !bg-main rounded-[8px] text-[#FDFDFD] disabled:opacity-50 mt-4"
      >
        {loading ? t("Contact.sending") : t("Contact.submit")}
      </button>
    </form>
  );
};

export default GymContact1;