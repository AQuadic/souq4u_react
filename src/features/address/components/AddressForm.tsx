"use client";

import React, { useState, useEffect } from "react";
import { useCities, useAreas, useCreateAddress } from "../hooks";
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
import { getCountryByCode } from "@/shared/constants/countries";
import { Textarea } from "@/shared/components/ui/textarea";
import { useTranslation } from "react-i18next";

interface AddressFormProps {
  initialData?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData) => void;
  onCancel?: () => void;
  showSaveOption?: boolean;
  isEditing?: boolean;
  onImmediateCheckout?: (data: AddressFormData) => void;
  onShippingUpdate?: (cityId: string, areaId: string) => void;
  isCheckout?: boolean;
  onFormDataChange?: (
    data: AddressFormData,
    phoneData: { code: string; number: string }
  ) => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  showSaveOption = true,
  isEditing = false,
  onImmediateCheckout,
  onShippingUpdate,
  isCheckout = false,
  onFormDataChange,
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
  const [phone, setPhone] = useState<PhoneValue>({ code: "20", number: "" });
  const {t, i18n} = useTranslation("AddressForm");
  const locale = i18n.language;
  const { t: common } = useTranslation("Common");
  // derive short locale (en | ar) and helper to pick translated name
  const localeShort = (locale || "en").split("-")[0] as "en" | "ar";
  const getTranslated = (names: { en?: string; ar?: string }) =>
    names?.[localeShort] ?? names?.en ?? "";

  // Initialize phone from initialData when editing
  useEffect(() => {
    if (initialData?.phone) {
      // Parse the phone number (format: +20123456789)
      const phoneStr = initialData.phone;
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
      }
    }
  }, [initialData?.phone]);

  const handleInputChange = (
    field: keyof AddressFormData,
    value: string | boolean
  ) => {
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
    if (onFormDataChange) {
      onFormDataChange(formData, phone);
    }
  }, [formData, phone, onFormDataChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.city_id ||
      !formData.area_id ||
      !formData.details.trim() ||
      !phone.number.trim()
    ) {
      return;
    }

    let normalizedPhone = phone.number.trim();
    if (normalizedPhone.startsWith("0")) {
      normalizedPhone = normalizedPhone.substring(1);
    }
    const fullPhone = `+${phone.code}${normalizedPhone}`;

    const payload = {
      ...formData,
      phone: fullPhone,
      phone_country: getCountryByCode(phone.code)?.iso2 || "EG", // ✅ ISO2 not dial code
      lat: 0,
      lng: 0,
    };

    try {
      if (showSaveOption && formData.saveAddress) {
        await createAddressMutation.mutateAsync({
          title: formData.title,
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
      } else if (onImmediateCheckout && !formData.saveAddress) {
        onImmediateCheckout(payload);
      } else {
        onSubmit(payload);
      }
    } catch (error) {
      console.error("Failed to save address:", error);
      onSubmit(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Address Title */}
      <div>
        <label htmlFor="title" className="mb-2 block">
          {t("title")} <span className="text-red-500">*</span>
        </label>
        <Input
          id="title"
          type="text"
          placeholder={t("titlePlaceholder")}
          value={formData.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleInputChange("title", e.target.value)
          }
          className="   border border-slate-200  "
          required
        />
      </div>

      {/* User Name */}
      <div>
        <label htmlFor="user_name" className="mb-2 block">
          {t("fullName")}
        </label>
        <Input
          id="user_name"
          type="text"
          placeholder={t("fullNamePlaceholder")}
          value={formData.user_name || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleInputChange("user_name", e.target.value)
          }
          className="  :  border border-slate-200  "
        />
      </div>

      {/* City Selection */}
      <div>
        <label htmlFor="city" className="mb-2 block">
          {t("city")} <span className="text-red-500">*</span>
        </label>
        <Select
          value={formData.city_id}
          onValueChange={(value) => handleInputChange("city_id", value)}
        >
          <SelectTrigger className="w-full   :  border border-slate-200  ">
            <SelectValue
              placeholder={citiesLoading ? t("loadingCities") : t("selectCity")}
            />
          </SelectTrigger>
          <SelectContent>
            {cities?.map((city: City) => (
              <SelectItem key={city.id} value={city.id.toString()}>
                {getTranslated(city.name)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Area Selection (placed right under City) */}
      {formData.city_id && (
        <div className="mt-3">
          <label htmlFor="area" className="mb-2 block">
            {t("area")} <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.area_id || ""}
            onValueChange={(value) => handleInputChange("area_id", value)}
          >
            <SelectTrigger className="w-full   :  border border-slate-200  ">
              <SelectValue
                placeholder={areasLoading ? t("loadingAreas") : t("selectArea")}
              />
            </SelectTrigger>
            <SelectContent>
              {areas?.map((area: Area) => (
                <SelectItem key={area.id} value={area.id.toString()}>
                  {getTranslated(area.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="mt-6 md:mt-8 lg:mt-10 flex flex-col gap-2">
        <label
          htmlFor="phone"
          className="text-sm md:text-base font-semibold leading-[100%]"
        >
          {t("phone")} <span className="text-red-500">*</span>
        </label>
        <PhoneInput
          value={phone}
          onChange={setPhone}
          placeholder={t("phonePlaceholder")}
          language={locale as "en" | "ar"}
          radius="md"
        />
      </div>

      {/* Address Details */}
      <div>
        <label htmlFor="details" className="mb-2 block">
          {t("details")} <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="details"
          placeholder={t("detailsPlaceholder")}
          value={formData.details}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            handleInputChange("details", e.target.value)
          }
          className="w-full min-h-[100px] px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-red-500   :  border-slate-200  "
          required
        />
      </div>

      {/* Zipcode */}
      <div>
        <label htmlFor="zipcode" className="mb-2 block">
          {t("zipcode")}
        </label>
        <Input
          id="zipcode"
          type="text"
          placeholder={common("inputPlaceholderWriteHere")}
          value={formData.zipcode || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleInputChange("zipcode", e.target.value)
          }
          className="  :  border border-slate-200  "
        />
      </div>

      {/* Location is hidden for now; lat/lng will be sent as zeros */}

      {/* Email (optional) */}
      <div>
        <label htmlFor="email" className="mb-2 block">
          {t("email")}
        </label>
        <Input
          id="email"
          type="email"
          placeholder={common("inputPlaceholderWriteHere")}
          value={formData.email || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleInputChange("email", e.target.value)
          }
          className="  :  border border-slate-200  "
        />
      </div>

      {/* Save Address Option */}
      {showSaveOption && (
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
            {t("saveAddress")}
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
              {common("cancel")}
            </button>
          )}
          <button
            type="submit"
            disabled={
              (showSaveOption &&
                formData.saveAddress &&
                createAddressMutation.isPending) ||
              !formData.title?.trim() ||
              !formData.city_id ||
              !formData.area_id ||
              !formData.details.trim()
            }
            className="flex-1 px-4 py-2 bg-main hover:bg-main rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {(() => {
              if (
                showSaveOption &&
                formData.saveAddress &&
                createAddressMutation.isPending
              )
                return t("saving");
              if (isEditing) return t("updateAddress");
              // If in checkout mode and not saving address, show "Checkout"
              if (isCheckout && !formData.saveAddress)
                return common("checkout");
              // When not editing, show a translated 'Add Address' action
              return t("addAddress");
            })()}
          </button>
        </div>
      )}
    </form>
  );
};
