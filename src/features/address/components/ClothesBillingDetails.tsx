"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { useAddresses } from "../hooks";
import type { Address, AddressFormData } from "../types";
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
  const manuallyOpenedFormRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
    }
  }, [isAuthenticated, fetchAddresses]);

  useEffect(() => {
    // If user is authenticated and has addresses, automatically show saved addresses
    // If no addresses, show the form
    // But don't auto-close the form if it was manually opened
    if (isAuthenticated && addresses.length === 0 && !isLoading) {
      setShowAddressForm(true);
      manuallyOpenedFormRef.current = false;
    } else if (addresses.length > 0 && !manuallyOpenedFormRef.current) {
      // Only auto-close if the form wasn't manually opened
      setShowAddressForm(false);
    }
    // Note: isLoading is intentionally NOT in dependencies to prevent form from flickering
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, addresses.length]);

  const handleAddressSelect = (addressId: number) => {
    setSelectedAddress(addressId);
    onAddressSelected(addressId);
  };

  const handleAddNewAddress = () => {
    manuallyOpenedFormRef.current = true;
    setShowAddressForm(true);
  };

  const handleFormSubmit = (formData: AddressFormData) => {
    onAddressFormSubmit(formData);
    // Don't close the form here - let onSubmitSuccess handle it
  };

  const handleAddressCreated = useCallback(
    (newAddress: Address) => {
      setSelectedAddress(newAddress.id);
      onAddressSelected(newAddress.id);

      if (newAddress.city_id && newAddress.area_id && onShippingUpdate) {
        onShippingUpdate(newAddress.city_id, newAddress.area_id);
      }
    },
    [onAddressSelected, onShippingUpdate, setSelectedAddress]
  );

  const handleFormSubmitSuccess = () => {
    if (isAuthenticated) {
      // Reset the manually opened flag
      manuallyOpenedFormRef.current = false;
      // After creating address successfully, refresh the list and hide form
      fetchAddresses();
      setShowAddressForm(false);
    }
  };

  const handleCancelForm = () => {
    manuallyOpenedFormRef.current = false;
    setShowAddressForm(false);
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
          onSubmitSuccess={handleFormSubmitSuccess}
          onAddressCreated={handleAddressCreated}
        />
      </div>
    );
  }

  // Don't unmount the entire component when loading - let the form handle its own loading state
  // This prevents losing form data when API calls fail
  const showLoadingSpinner =
    isLoading && addresses.length === 0 && !showAddressForm;

  if (showLoadingSpinner) {
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
          onCancel={addresses.length > 0 ? handleCancelForm : undefined}
          onImmediateCheckout={onImmediateCheckout}
          onShippingUpdate={onShippingUpdate}
          isCheckout={isCheckout}
          onFormDataChange={onFormDataChange}
          onSubmitSuccess={handleFormSubmitSuccess}
          onAddressCreated={handleAddressCreated}
        />
      )}
    </div>
  );
};
