"use client";

import React, { useState, useEffect } from "react";
import {
  useCities,
  useAreas,
  useCreateAddress,
  useUpdateAddress,
} from "../hooks";
import type { AddressFormData, City, Area } from "../types";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  PhoneInput,
  PhoneValue,
} from "@/shared/components/compound/PhoneInput";
import {
  getCountryByCode,
  getCountryByIso2,
} from "@/shared/constants/countries";
import { Textarea } from "@/shared/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { useToast } from "@/shared/components/ui/toast";

const isNonEmptyString = (value: string | null | undefined): value is string =>
  typeof value === "string" && value.length > 0;

interface AddressFormProps {
  initialData?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData) => void | Promise<void>;
  onCancel?: () => void;
  showSaveOption?: boolean;
  isEditing?: boolean;
  addressId?: number;
  onImmediateCheckout?: (data: AddressFormData) => void;
  onShippingUpdate?: (cityId: string, areaId: string) => void;
  isCheckout?: boolean;
  onFormDataChange?: (
    data: AddressFormData,
    phoneData: { code: string; number: string }
  ) => void;
  /** If true, form will handle API calls internally. If false, parent handles submission */
  handleApiInternally?: boolean;
  /** Callback when submission is successful */
  onSubmitSuccess?: () => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  showSaveOption = true,
  isEditing = false,
  addressId,
  onImmediateCheckout,
  onShippingUpdate,
  isCheckout = false,
  onFormDataChange,
  handleApiInternally = true,
  onSubmitSuccess,
}) => {
  const [formData, setFormData] = useState<AddressFormData>({
    title: "",
    user_name: "",
    country_id: "1", // Default to Egypt
    phone: "",
    phone_country: "",
    city_id: "",
    area_id: "",
    details: "",
    zipcode: "",
    location: "",
    // lat/lng intentionally set/handled on submit
    // lat and lng are not editable in the UI for now
    email: "",
    saveAddress: showSaveOption,
    ...initialData,
  });

  const { data: cities, isLoading: citiesLoading } = useCities();
  const { data: areas, isLoading: areasLoading } = useAreas(
    formData.city_id || null
  );
  const createAddressMutation = useCreateAddress();
  const updateAddressMutation = useUpdateAddress();
  const [phone, setPhone] = useState<PhoneValue>({ code: "20", number: "" });
  const [phoneError, setPhoneError] = useState<string>("");
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({});
  const { t, i18n } = useTranslation("AddressForm");
  const locale = i18n.language;
  const { t: common } = useTranslation("Common");
  const toast = useToast();
  const displayServerErrors = (
    errors?: Record<string, string[]>,
    fallbackMessage?: string
  ) => {
    const showFallback = () => {
      if (fallbackMessage) {
        toast.error(fallbackMessage, { duration: 5000 });
      } else {
        toast.error("Failed to save address", { duration: 5000 });
      }
    };

    if (!errors) {
      showFallback();
      return;
    }

    const normalisedMessages = Object.values(errors)
      .flatMap((messages) => messages ?? [])
      .map((message) => (typeof message === "string" ? message.trim() : ""))
      .filter(isNonEmptyString);

    if (normalisedMessages.length === 0) {
      showFallback();
      return;
    }

    const uniqueMessages = new Set(normalisedMessages);

    for (const message of uniqueMessages) {
      toast.error(message, { duration: 5000 });
    }
  };
  // derive short locale (en | ar) and helper to pick translated name
  const localeShort = (locale || "en").split("-")[0] as "en" | "ar";
  const getTranslated = (names: { en?: string; ar?: string }) =>
    names?.[localeShort] ?? names?.en ?? "";

  const getPhoneMinLength = (countryCode: string): number => {
    const country = getCountryByCode(countryCode);
    const iso2 = country?.iso2?.toUpperCase() || countryCode.toUpperCase();

    switch (iso2) {
      case "EG": // Egypt
        return 10;
      case "SA": // Saudi Arabia
        return 9;
      case "AE": // UAE
        return 9;
      case "US": // USA
        return 10;
      case "GB": // UK
        return 10;
      case "FR": // France
        return 9;
      default:
        return 8; // Default minimum
    }
  };

  const validatePhone = (phoneNumber: string, countryCode: string): string => {
    if (!phoneNumber?.trim()) {
      return "";
    }

    const minLength = getPhoneMinLength(countryCode);
    const cleanNumber = phoneNumber.replaceAll(/\D/g, "");

    if (cleanNumber.length < minLength) {
      return t("AddressForm.phoneMinLength", { minLength });
    }

    return "";
  };

  const handlePhoneChange = (newPhone: PhoneValue) => {
    setPhone(newPhone);

    // Clear API error for phone when user starts typing
    if (apiErrors.phone) {
      setApiErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }

    // Validate phone when it changes
    const error = validatePhone(newPhone.number, newPhone.code);
    setPhoneError(error);
  };

  // Initialize phone from initialData when editing
  useEffect(() => {
    if (initialData?.phone) {
      // Parse the phone number
      const phoneStr = initialData.phone;

      // If we have phone_country (ISO2 code like "EG"), use it to get the country code
      if (initialData.phone_country) {
        const country = getCountryByIso2(initialData.phone_country);
        if (country?.phone?.[0]) {
          const countryCode = country.phone[0];
          // Remove + if present
          const cleanPhone = phoneStr.startsWith("+")
            ? phoneStr.substring(1)
            : phoneStr;

          // If phone starts with country code, remove it to get just the number
          if (cleanPhone.startsWith(countryCode)) {
            const number = cleanPhone.substring(countryCode.length);
            setPhone({ code: countryCode, number });
            return;
          }
        }
      }

      // Fallback: try to parse from phone string
      if (phoneStr.startsWith("+")) {
        const withoutPlus = phoneStr.substring(1);
        // Try to extract country code (assume 1-3 digits)
        const codeRegex = /^(\d{1,3})/;
        const codeMatch = codeRegex.exec(withoutPlus);
        if (codeMatch) {
          const code = codeMatch[1];
          const number = withoutPlus.substring(code.length);
          setPhone({ code, number });
        }
      } else {
        setPhone({ code: "20", number: phoneStr });
      }
    }
  }, [initialData?.phone, initialData?.phone_country]);

  const handleInputChange = (
    field: keyof AddressFormData,
    value: string | boolean
  ) => {
    // Clear API error for this field when user starts typing
    if (apiErrors[field]) {
      setApiErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Clear area when city changes
      if (field === "city_id") {
        newData.area_id = "";
      }

      return newData;
    });
  };

  // Effect to handle shipping update when both city and area are selected
  useEffect(() => {
    if (formData.city_id && formData.area_id && onShippingUpdate) {
      onShippingUpdate(formData.city_id, formData.area_id);
    }
  }, [formData.city_id, formData.area_id, onShippingUpdate]);

  // Effect to notify parent of form data changes (for checkout flow)
  useEffect(() => {
    if (onFormDataChange) onFormDataChange(formData, phone);
  }, [formData, phone, onFormDataChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone number
    const phoneValidationError = validatePhone(phone.number, phone.code);
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      return;
    }

    // For guest checkout, title is not required
    const isTitleRequired = showSaveOption;

    if (
      (isTitleRequired && !formData.title.trim()) ||
      !formData.city_id ||
      !formData.area_id ||
      !formData.details.trim() ||
      !phone.number.trim()
    ) {
      return;
    }

    // Normalize phone number (remove leading 0 if present)
    let normalizedPhone = phone.number.trim();
    if (normalizedPhone.startsWith("0")) {
      normalizedPhone = normalizedPhone.substring(1);
    }
    // Send phone without + sign: just countryCode + number (e.g., "201028814701")
    const fullPhone = `${phone.code}${normalizedPhone}`;

    // For guest checkout, set a default title if none provided
    const finalTitle = formData.title.trim();

    const payload = {
      ...formData,
      title: finalTitle,
      phone: fullPhone,
      phone_country: getCountryByCode(phone.code)?.iso2 || "EG",
      lat: 0,
      lng: 0,
    };

    // If parent component wants to handle submission, just call onSubmit and return
    if (!handleApiInternally) {
      await onSubmit(payload);
      return;
    }

    // Otherwise, handle API calls internally (legacy behavior for checkout/billing)
    try {
      // Clear previous API errors
      setApiErrors({});

      // Handle editing existing address
      if (isEditing && addressId) {
        await updateAddressMutation.mutateAsync({
          id: addressId,
          data: {
            title: finalTitle,
            city_id: formData.city_id,
            country_id: formData.country_id || "1",
            area_id: formData.area_id,
            details: formData.details,
            zipcode: formData.zipcode,
            location: formData.location,
            lat: 0,
            lng: 0,
            phone: fullPhone,
            phone_country: getCountryByCode(phone.code)?.iso2 || "EG",
            email: formData.email || "",
            user_name: formData.user_name || "",
          },
        });
        onSubmit(payload);
        onSubmitSuccess?.();
      } else if (showSaveOption && formData.saveAddress) {
        await createAddressMutation.mutateAsync({
          title: finalTitle,
          city_id: formData.city_id,
          country_id: formData.country_id || "1", // Default to Egypt for now
          area_id: formData.area_id,
          details: formData.details,
          zipcode: formData.zipcode,
          location: formData.location,
          lat: 0,
          lng: 0,
          phone: fullPhone,
          phone_country: getCountryByCode(phone.code)?.iso2 || "EG",
          email: formData.email,
          user_name: formData.user_name,
        });
        onSubmit(payload);
        onSubmitSuccess?.();
      } else if (onImmediateCheckout && !formData.saveAddress) {
        onImmediateCheckout(payload);
      } else {
        onSubmit(payload);
        onSubmitSuccess?.();
      }
    } catch (error: unknown) {
      console.error("Failed to save address:", error);

      let serverErrors: Record<string, string[]> | undefined;
      let serverMessage: string | undefined;

      // Try to extract API errors from the error object
      if (error && typeof error === "object") {
        // Check if it's a direct axios error with response
        if ("response" in error) {
          const axiosError = error as {
            response?: {
              data?: {
                errors?: Record<string, string[]>;
                message?: string;
              };
            };
          };
          serverErrors = axiosError.response?.data?.errors;
          serverMessage = axiosError.response?.data?.message;
        }
        // Check if the error has a cause (from axios interceptor)
        else if ("cause" in error) {
          const causeError = (error as { cause?: unknown }).cause;
          if (
            causeError &&
            typeof causeError === "object" &&
            "response" in causeError
          ) {
            const axiosError = causeError as {
              response?: {
                data?: {
                  errors?: Record<string, string[]>;
                  message?: string;
                };
              };
            };
            serverErrors = axiosError.response?.data?.errors;
            serverMessage = axiosError.response?.data?.message;
          }
        }
      }

      // Set inline errors for form fields
      if (serverErrors) {
        setApiErrors(serverErrors);

        // If phone error exists, also set it in phoneError state
        if (serverErrors.phone) {
          setPhoneError(serverErrors.phone[0]);
        }
      }

      // Surface backend validation messages as individual toasts
      displayServerErrors(serverErrors, serverMessage);

      // Don't call onSubmit or onSubmitSuccess if there was an error - form stays open
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Address Title - Only show for logged-in users (not guest checkout) */}
      {showSaveOption && (
        <div>
          <label htmlFor="title" className="mb-2 block">
            {t("AddressForm.title")} <span className="text-red-500">*</span>
          </label>
          <Input
            id="title"
            type="text"
            placeholder={t("AddressForm.titlePlaceholder")}
            value={formData.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange("title", e.target.value)
            }
            className="   border border-slate-200  "
            required
          />
          {apiErrors.title && (
            <p className="text-red-500 text-sm mt-1">{apiErrors.title[0]}</p>
          )}
        </div>
      )}

      {/* User Name */}
      <div>
        <label htmlFor="user_name" className="mb-2 block">
          {t("AddressForm.fullName")}
        </label>
        <Input
          id="user_name"
          type="text"
          placeholder={t("AddressForm.fullNamePlaceholder")}
          value={formData.user_name || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleInputChange("user_name", e.target.value)
          }
          className="  :  border border-slate-200  "
        />
        {apiErrors.user_name && (
          <p className="text-red-500 text-sm mt-1">{apiErrors.user_name[0]}</p>
        )}
      </div>

      {/* City Selection */}
      <div>
        <label htmlFor="city" className="mb-2 block">
          {t("AddressForm.city")} <span className="text-red-500">*</span>
        </label>
        <Select
          value={formData.city_id}
          onValueChange={(value) => handleInputChange("city_id", value)}
        >
          <SelectTrigger
            className="w-full   :  border border-slate-200  "
            dir={i18n.language === "ar" ? "rtl" : "ltr"}
          >
            <SelectValue
              placeholder={
                citiesLoading
                  ? t("AddressForm.loadingCities")
                  : t("AddressForm.selectCity")
              }
              dir={i18n.language === "ar" ? "rtl" : "ltr"}
            />
          </SelectTrigger>
          <SelectContent dir={i18n.language === "ar" ? "rtl" : "ltr"}>
            {cities?.map((city: City) => (
              <SelectItem key={city.id} value={city.id.toString()}>
                {getTranslated(city.name)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {apiErrors.city_id && (
          <p className="text-red-500 text-sm mt-1">{apiErrors.city_id[0]}</p>
        )}
      </div>
      {/* Area Selection (placed right under City) */}
      {formData.city_id && (
        <div className="mt-3">
          <label htmlFor="area" className="mb-2 block">
            {t("AddressForm.area")} <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.area_id || ""}
            onValueChange={(value) => handleInputChange("area_id", value)}
          >
            <SelectTrigger
              className="w-full   :  border border-slate-200  "
              dir={i18n.language === "ar" ? "rtl" : "ltr"}
            >
              <SelectValue
                placeholder={
                  areasLoading
                    ? t("AddressForm.loadingAreas")
                    : t("AddressForm.selectArea")
                }
                dir={i18n.language === "ar" ? "rtl" : "ltr"}
              />
            </SelectTrigger>
            <SelectContent dir={i18n.language === "ar" ? "rtl" : "ltr"}>
              {areas?.map((area: Area) => (
                <SelectItem key={area.id} value={area.id.toString()}>
                  {getTranslated(area.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {apiErrors.area_id && (
            <p className="text-red-500 text-sm mt-1">{apiErrors.area_id[0]}</p>
          )}
        </div>
      )}

      <div className="mt-6 md:mt-8 lg:mt-10 flex flex-col gap-2">
        <label
          htmlFor="phone"
          className="text-sm md:text-base font-semibold leading-[100%]"
        >
          {t("AddressForm.phone")} <span className="text-red-500">*</span>
        </label>
        <PhoneInput
          value={phone}
          onChange={handlePhoneChange}
          placeholder={t("AddressForm.phonePlaceholder")}
          language={locale as "en" | "ar"}
          radius="md"
        />
        {phoneError && (
          <p className="text-red-500 text-sm mt-1">{phoneError}</p>
        )}
      </div>

      {/* Address Details */}
      <div>
        <label htmlFor="details" className="mb-2 block">
          {t("AddressForm.details")} <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="details"
          placeholder={t("AddressForm.detailsPlaceholder")}
          value={formData.details}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            handleInputChange("details", e.target.value)
          }
          className="w-full min-h-[100px] px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-red-500   :  border-slate-200  "
          required
        />
        {apiErrors.details && (
          <p className="text-red-500 text-sm mt-1">{apiErrors.details[0]}</p>
        )}
      </div>

      {/* Zipcode */}
      <div>
        <label htmlFor="zipcode" className="mb-2 block">
          {t("AddressForm.zipcode")}
        </label>
        <Input
          id="zipcode"
          type="text"
          placeholder={common("Common.inputPlaceholderWriteHere")}
          value={formData.zipcode || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleInputChange("zipcode", e.target.value)
          }
          className="  :  border border-slate-200  "
        />
        {apiErrors.zipcode && (
          <p className="text-red-500 text-sm mt-1">{apiErrors.zipcode[0]}</p>
        )}
      </div>

      {/* Location is hidden for now; lat/lng will be sent as zeros */}

      {/* Email (optional) */}
      <div>
        <label htmlFor="email" className="mb-2 block">
          {t("AddressForm.email")}
        </label>
        <Input
          id="email"
          type="email"
          placeholder={common("Common.inputPlaceholderWriteHere")}
          value={formData.email || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleInputChange("email", e.target.value)
          }
          className="  :  border border-slate-200  "
        />
        {apiErrors.email && (
          <p className="text-red-500 text-sm mt-1">{apiErrors.email[0]}</p>
        )}
      </div>

      {/* Save Address Option */}
      {showSaveOption && !isEditing && (
        <div className="flex items-center space-x-2">
          <input
            id="saveAddress"
            type="checkbox"
            checked={formData.saveAddress}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange("saveAddress", e.target.checked)
            }
            className="rounded border-slate-300 :border-slate-600 text-red-600 focus:ring-red-500"
          />
          <label htmlFor="saveAddress" className="text-sm">
            {t("AddressForm.saveAddress")}
          </label>
        </div>
      )}

      {/* Action Buttons - Hide for guest users in checkout */}
      {!(isCheckout && !showSaveOption) && (
        <div className="flex gap-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-transparent border border-slate-300   rounded-md hover:bg-slate-100 :hover:bg-slate-700 transition-colors"
            >
              {common("Common.cancel")}
            </button>
          )}
          <button
            type="submit"
            disabled={
              (showSaveOption &&
                formData.saveAddress &&
                createAddressMutation.isPending) ||
              (isEditing && updateAddressMutation.isPending) ||
              (showSaveOption && !formData.title?.trim()) ||
              !formData.city_id ||
              !formData.area_id ||
              !formData.details.trim() ||
              !phone.number.trim() ||
              !!phoneError
            }
            className="flex-1 px-4 py-2 text-white bg-main hover:bg-main rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {(() => {
              if (isEditing && updateAddressMutation.isPending)
                return t("AddressForm.saving");
              if (
                showSaveOption &&
                formData.saveAddress &&
                createAddressMutation.isPending
              )
                return t("AddressForm.saving");
              if (isEditing) return t("AddressForm.updateAddress");
              // If in checkout mode and not saving address, show "Checkout"
              if (isCheckout && !formData.saveAddress)
                return common("Cart.checkout");
              // When not editing, show a translated 'Add Address' action
              return t("AddressForm.addAddress");
            })()}
          </button>
        </div>
      )}
    </form>
  );
};
