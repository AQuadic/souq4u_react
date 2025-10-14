"use client";

import React, { useState } from "react";
import { postSuggestion, SuggestionPayload } from "../api/postSuggestions";
import {
  PhoneInput,
  PhoneValue,
} from "@/shared/components/compound/PhoneInput";
import { getCountryByIso2 } from "@/shared/constants/countries";
import { useToast } from "@/shared/components/ui/toast";

const GymContact1 = () => {
  const toast = useToast();
  // const t = useTranslations("Contact");
  // const locale = useLocale();

  const [phoneValue, setPhoneValue] = useState<PhoneValue>({
    code: "EG",
    number: "",
  });

  const [form, setForm] = useState<{
    name: string;
    email: string;
    city: string;
    type: string;
    title: string;
    message: string;
  }>({
    name: "",
    email: "",
    city: "",
    type: "",
    title: "",
    message: "",
  });

  const [errors, setErrors] = useState<{
    name?: string;
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

    if (!form.name.trim()) newErrors.name = ("errorNameRequired");
    if (!phoneValue.number.trim()) newErrors.phone = ("errorPhoneRequired");
    if (!form.message.trim()) newErrors.message = ("errorMessageRequired");

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
      toast.success(("success"));
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
      const firstError =
        Object.values(response.errors || {})[0]?.[0] || ("errorGeneric");
      toast.error(firstError);
    }
  };

  return (
      <form
        onSubmit={handleSubmit}
        className="md:w-[576px] w-full h-full md:bg-white md:dark:bg-[#242529] rounded-3xl p-4"
      >
        <div>
          <label
            htmlFor="name"
            className="text-gray-900 dark:text-[#FDFDFD] text-base font-semibold leading-[100%]"
          >
            {("name")}
          </label>
          <input
            type="text"
            name="name"
            placeholder={("namePlaceholder")}
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

        <div className="mt-2.5">
          <label
            htmlFor="email"
            className="flex items-center gap-2 text-gray-900 dark:text-[#FDFDFD] text-base font-semibold leading-[100%]"
          >
            <span>{("email")}</span>
            <span className="text-sm text-muted-foreground">{("optional")}</span>
          </label>

          <input
            type="email"
            name="email"
            placeholder={("emailPlaceholder")}
            value={form.email}
            onChange={handleChange}
            className="w-full h-14 border rounded-[8px] mt-1 px-4 text-gray-700 dark:text-[#C0C0C0] border-gray-300 dark:border-[#C0C0C0] bg-white dark:bg-transparent"
          />
        </div>

        <div className="mt-2.5">
          <label
            htmlFor="phone"
            className="text-gray-900 dark:text-[#FDFDFD] text-base font-semibold leading-[100%]"
          >
            {("phone")}
          </label>
          <div className="mt-1">
            <PhoneInput
              value={phoneValue}
              onChange={(v) => {
                setPhoneValue(v);
                setErrors({ ...errors, phone: undefined });
              }}
              placeholder={String(("phonePlaceholder"))}
              radius="md"
              // language={locale as "en" | "ar"}
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div className="mt-2.5">
          <label
            htmlFor="message"
            className="text-gray-900 dark:text-[#FDFDFD] text-base font-semibold leading-[100%]"
          >
            {("message")}
          </label>
          <textarea
            name="message"
            placeholder={("messagePlaceholder")}
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

        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 !bg-main rounded-[8px] text-[#FDFDFD] disabled:opacity-50 mt-4"
        >
          {loading ? ("sending") : ("submit")}
        </button>
      </form>
  );
};

export default GymContact1;
