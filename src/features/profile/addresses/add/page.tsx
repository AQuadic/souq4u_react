import React from "react";
import { useNavigate } from "react-router-dom";
import { AddressForm } from "@/features/address/components/AddressForm";
import { useTranslation } from "react-i18next";

const AddAddressPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("Profile.AddAddress");

  const isRtl = i18n.language.startsWith("ar");

  const handleSubmit = () => {
    // After adding, go back to addresses list
    navigate("/profile/addresses");
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
        <h1 className="text-xl font-bold">{t("header")}</h1>
      </div>

      <AddressForm onSubmit={handleSubmit} showSaveOption={false} />
    </div>
  );
};

export default AddAddressPage;