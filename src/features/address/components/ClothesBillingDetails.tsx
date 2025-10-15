"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { useAddresses } from "../hooks";
import type { AddressFormData } from "../types";
import { SavedAddresses } from "./SavedAddresses";
import { AddressForm } from "./AddressForm";
import BackArrow from "@/features/products/icons/BackArrow";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface BillingDetailsProps {
  onAddressSelected: (addressId: number | null) => void;
  onAddressFormSubmit: (formData: AddressFormData) => void;
  onImmediateCheckout?: (formData: AddressFormData) => void;
  onShippingUpdate?: (cityId: string, areaId: string) => void;
  isCheckout?: boolean;
  onFormDataChange?: (
    formData: AddressFormData,
    phoneData: { code: string; number: string }
  ) => void;
}

export const ClothesBillingDetails: React.FC<BillingDetailsProps> = ({
  onAddressSelected,
  onAddressFormSubmit,
  onImmediateCheckout,
  onShippingUpdate,
  isCheckout = false,
  onFormDataChange,
}) => {
  const { isAuthenticated } = useAuthStore();
  const {
    addresses,
    isLoading,
    fetchAddresses,
    selectedAddressId,
    setSelectedAddress,
  } = useAddresses();

  const [showAddressForm, setShowAddressForm] = useState(false);
  const { t } = useTranslation("BillingDetails");

  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
    }
  }, [isAuthenticated, fetchAddresses]);

  useEffect(() => {
    // If user is authenticated and has addresses, automatically show saved addresses
    // If no addresses, show the form
    if (isAuthenticated && addresses.length === 0 && !isLoading) {
      setShowAddressForm(true);
    } else if (addresses.length > 0) {
      setShowAddressForm(false);
    }
  }, [isAuthenticated, addresses, isLoading]);

  const handleAddressSelect = (addressId: number) => {
    setSelectedAddress(addressId);
    onAddressSelected(addressId);
  };

  const handleAddNewAddress = () => {
    setShowAddressForm(true);
  };

  const handleFormSubmit = (formData: AddressFormData) => {
    onAddressFormSubmit(formData);
    if (isAuthenticated) {
      // After creating address, refresh the list and hide form
      fetchAddresses();
      setShowAddressForm(false);
    }
  };

  if (!isAuthenticated) {
    // For guest users, show the address form directly
    return (
      <div className="rounded-lg px-6">
        <h2 className="text-[32px] font-bold mb-6">{t("deliveryInfo")}</h2>
        <AddressForm
          onSubmit={handleFormSubmit}
          showSaveOption={false}
          onImmediateCheckout={onImmediateCheckout}
          onShippingUpdate={onShippingUpdate}
          isCheckout={isCheckout}
          onFormDataChange={onFormDataChange}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-6">{t("title")}</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg md:p-6">
      <Link to="/cart" className="md:hidden flex items-center gap-2 mb-6">
        <BackArrow />
        <h2 className="text-xl font-semibold text-white">{t("title")}</h2>
      </Link>

      <h2 className="md:flex hidden text-xl font-semibold text-white mb-6">
        {t("title")}
      </h2>
      {!showAddressForm && addresses.length > 0 ? (
        <SavedAddresses
          addresses={addresses}
          selectedAddressId={selectedAddressId}
          onAddressSelect={handleAddressSelect}
          onAddNewAddress={handleAddNewAddress}
          isCheckout={isCheckout}
        />
      ) : (
        <AddressForm
          onSubmit={handleFormSubmit}
          showSaveOption={isAuthenticated}
          onCancel={
            addresses.length > 0 ? () => setShowAddressForm(false) : undefined
          }
          onImmediateCheckout={onImmediateCheckout}
          onShippingUpdate={onShippingUpdate}
          isCheckout={isCheckout}
          onFormDataChange={onFormDataChange}
        />
      )}
    </div>
  );
};
