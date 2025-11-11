import React from "react";
import { useNavigate } from "react-router-dom";
import { AddressForm } from "@/features/address/components/AddressForm";
import { useTranslation } from "react-i18next";
import { useCreateAddress } from "@/features/address/hooks";
import type { AddressFormData } from "@/features/address/types";
import { getCountryByCode } from "@/shared/constants/countries";
import { useToast } from "@/shared/components/ui/toast";

const AddAddressPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("Profile.AddAddress");
  const createAddressMutation = useCreateAddress();
  const toast = useToast();

  const isRtl = i18n.language.startsWith("ar");

  const handleSubmit = async (formData: AddressFormData) => {
    try {
      // Extract phone data from the full phone string
      const phoneRegex = /^(\d{1,3})(.+)$/;
      const phoneMatch = phoneRegex.exec(formData.phone);
      const phoneCode = phoneMatch?.[1] || "20";

      // Create the address via API
      await createAddressMutation.mutateAsync({
        title: formData.title || "Address",
        city_id: formData.city_id,
        country_id: formData.country_id || "1",
        area_id: formData.area_id,
        details: formData.details,
        zipcode: formData.zipcode || "",
        location: formData.location || "",
        lat: 0,
        lng: 0,
        phone: formData.phone,
        phone_country:
          formData.phone_country || getCountryByCode(phoneCode)?.iso2 || "EG",
        email: formData.email || "",
        user_name: formData.user_name || "",
      });

      // Show success message
      toast.success(t('Profile.addressAdded'));

      // Navigate back to addresses list after successful creation
      navigate("/profile/addresses");
    } catch (error) {
      console.error("Failed to create address:", error);
      // Error is already handled by the mutation hook and toast
      // Don't navigate - let the user fix the error
    }
  };

  return (
    <div className="px-4 py-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          aria-label={t("back")}
          className={`p-2 rounded-md hover:bg-slate-100 transition-colors ${
            isRtl ? "ml-2" : "mr-2"
          }`}
        >
          <span style={{ transform: isRtl ? "scaleX(-1)" : "none" }}>‹</span>
        </button>
        <h1 className="text-xl font-bold">{t("Profile.AddAddress.header")}</h1>
      </div>

      <AddressForm
        onSubmit={handleSubmit}
        showSaveOption={false}
        handleApiInternally={false}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
};

export default AddAddressPage;
