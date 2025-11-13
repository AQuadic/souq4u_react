"use client";

import React, { useState, useEffect } from "react";
import {
  PhoneInput,
  PhoneValue,
} from "@/shared/components/compound/PhoneInput";
import { formatPhoneForApi } from "@/features/order/utils";
import { updateUser } from "@/features/profile/api/updateUser";
import { useToast } from "@/shared/components/ui/toast";
import { handleApiError } from "@/shared/utils/errorHandler";
import { useInitializeAuth, useUser } from "@/features/auth/stores/auth-store";
import BackArrow from "@/features/products/icons/BackArrow";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ChevronDownIcon } from "lucide-react"
import { Label } from "@radix-ui/react-dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
// import { Calendar } from "@/components/ui/calendar"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"

const MyAccount: React.FC = () => {
  const { i18n, t } = useTranslation("Profile");
  const locale = i18n.language;
  // const {tCommon} = useTranslation("Common");
  // const {tAuth} = useTranslation("Auth");

  // Get user data from auth store
  const user = useUser();
  const [open, setOpen] = React.useState(false)
  // const [date, setDate] = React.useState<Date | undefined>(undefined)

  // Form state - initialize with user data immediately
  const [name, setName] = useState<string>(user?.name || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [birthday, setBirthday] = useState<string>(user?.email || "");
  const [gender, setGender] = useState<string>(user?.email || "");

  const [phone, setPhone] = useState<PhoneValue>(() => {
    if (user?.phone_country && user?.phone_national) {
      return {
        code: user.phone_country,
        number: user.phone_national,
      };
    } else if (user?.phone) {
      return {
        code: user.phone_country || "EG",
        number: user.phone,
      };
    }
    return { code: "EG", number: "" };
  });
  // removed cityId and imageFile per request
  const [isSubmitting, setIsSubmitting] = useState(false);

  // removed unused file input ref

  const initializeAuth = useInitializeAuth();
  const toast = useToast();

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setBirthday(user.birthday || "");
      setGender(user.gender || "");

      // Parse phone data
      if (user.phone_country && user.phone_national) {
        setPhone({
          code: user.phone_country,
          number: user.phone_national,
        });
      } else if (user.phone) {
        // Fallback if phone_national is not available
        setPhone({
          code: user.phone_country || "EG",
          number: user.phone,
        });
      }
    }
  }, [user]);

  // Helper to show server-returned keys — supports auth.* keys
  const showServerMessage = (value: unknown) => {
    if (typeof value !== "string") return;

    // If the server returns a namespaced translation key like "auth.updated"
    // map it to the corresponding translator; otherwise show raw message.
    if (value.includes(".")) {
      const [ns, ...rest] = value.split(".");
      const key = rest.join(".");
      if (ns === "auth") {
        const translated = t(key);
        if (translated) {
          toast.success(translated);
          return;
        }
      }
    }

    // Raw fallback
    toast.success(value);
  };

  const showErrorMessage = (msg?: unknown) => {
    if (typeof msg === "string" && msg) {
      toast.error(msg);
      return;
    }

    toast.error(
      t("updateFailed") || t("error") || "Failed to update profile"
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      if (name) formData.append("name", name);
      if (email) formData.append("email", email);
      if (birthday) formData.append("birthday", birthday);
      if (gender) formData.append("gender", gender);
      // phone data
      const phoneData = formatPhoneForApi(phone);
      if (phoneData.phone) formData.append("phone", phoneData.phone);
      if (phoneData.phone_country)
        formData.append("phone_country", phoneData.phone_country);

      // language
      formData.append("language", locale || "en");

      const resp = await updateUser(formData);

      if (resp.success) {
        const respData = resp.data as Record<string, unknown> | undefined;

        // Primary success toast
        toast.success(t("updateSuccess") || "Updated successfully");

        if (respData) {
          showServerMessage(respData.profile);
          showServerMessage(respData.email);
          showServerMessage(respData.phone);
        }

        // Refresh current user data in store
        try {
          await initializeAuth();
        } catch (err) {
          // ignore initialize errors but log
          console.warn("Failed to refresh user after update", err);
        }
      } else if (resp.errors && Object.keys(resp.errors).length > 0) {
        // If the API returned field errors, construct an axios-like error
        // object and pass it to the shared error handler so it renders
        // field-level messages in the toast. Also show a generic error toast.
        const axiosLikeError = {
          response: { data: { message: resp.message, errors: resp.errors } },
        } as unknown;

        showErrorMessage(resp.message);
        handleApiError(axiosLikeError, t("updateFailed"));
      } else {
        showErrorMessage(resp.message);
        handleApiError(new Error(resp.message || ""), t("updateFailed"));
      }
    } catch (error: unknown) {
      // Safely extract a message from an unknown error
      const errMsg =
        error && typeof error === "object" && "message" in error
          ? (error as { message?: unknown }).message
          : error;

      showErrorMessage(errMsg);
      handleApiError(error, t("updateFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <h1 className=" text-[32px] font-bold leading-[100%] md:flex hidden">
        {t("Profile.account") || "Profile.My Account"}
      </h1>

      <Link to='/profile/mobileAccount' className="flex gap-2 md:hidden">
      <div className="transform ltr:scale-x-100 rtl:scale-x-[-1]">
        <BackArrow />
      </div>
        <h1 className=" text-[32px] font-bold leading-[100%]">
        {t("Profile.title") || "Profile.My Account"}
      </h1>
      </Link>
      <form onSubmit={onSubmit}>
        <div className="mt-10">
          <label
            htmlFor="name"
            className=" text-base font-normal leading-[100%]"
          >
            {t("Profile.fullName") || "Full Name"}
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            className="w-full h-[46px] border border-[#C0C0C0] rounded-[8px] mt-4 px-4 "
            placeholder={t("Profile.inputPlaceholder") || "Write here"}
          />
        </div>

        <div className="mt-8">
          <label
            htmlFor="email"
            className=" text-base font-normal leading-[100%]"
          >
            {t("Profile.email")}
          </label>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="w-full h-[46px] border border-[#C0C0C0] rounded-[8px] mt-4 px-4 "
            placeholder={t("Profile.inputPlaceholder") || "Write here"}
          />
        </div>

        <div className="mt-8">
          <label
            htmlFor="phone"
            className=" text-base font-normal leading-[100%]"
          >
            {t("Profile.phone") || "Phone"}
          </label>
          <div className="mt-4">
            <PhoneInput
              value={phone}
              onChange={setPhone}
              placeholder={t("Profile.inputPlaceholder")}
              language={locale as "en" | "ar"}
              radius="md"
              disabled
            />
          </div>
        </div>

        <div className="mt-8">
          <div className="flex flex-col gap-3">
            <Label className="px-1">
              {t("Profile.birthday")}
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild className="!w-full h-[46px]">
                <Button
                  variant="outline"
                  id="date"
                  className="w-48 justify-between font-normal"
                >
                  {birthday ? new Date(birthday).toLocaleDateString() : t('Profile.selectDate')}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={birthday ? new Date(birthday) : undefined}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    if (date) {
                      setBirthday(date.toISOString().split("T")[0]);
                    }
                    setOpen(false)
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="mt-8">
          <label
            htmlFor="gender"
            className=" text-base font-normal leading-[100%]"
          >
            {t("Profile.gender")}
          </label>

          <div className="flex items-center justify-between gap-4 mt-4">
              <div className="w-full border rounded-[8px] dark:border-gray-600">
                  <div className="flex items-center ps-3">
                    <input
                      id="male"
                      type="radio"
                      value="male"
                      name="gender"
                      checked={gender === "male"}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                    />
                    <label htmlFor="male" className="w-full py-3 ms-2 text-sm font-medium text-gray-900">
                      {t("Profile.male")}
                    </label>
                  </div>
                </div>
                <div className="w-full border rounded-[8px] dark:border-gray-600">
                  <div className="flex items-center ps-3">
                    <input
                      id="female"
                      type="radio"
                      value="female"
                      name="gender"
                      checked={gender === "female"}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                    />
                    <label htmlFor="female" className="w-full py-3 ms-2 text-sm font-medium text-gray-900">
                      {t("Profile.female")}
                    </label>
                  </div>
              </div>
          </div>

        </div>

        {/* city id and profile image removed */}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 text-white bg-main rounded-[8px]  text-base font-bold my-12 disabled:opacity-60"
        >
          {isSubmitting
            ? t("Profile.saving") || "Saving..."
            : t("Profile.updateButton") || "Save"}
        </button>
      </form>
    </section>
  );
};

export default MyAccount;
