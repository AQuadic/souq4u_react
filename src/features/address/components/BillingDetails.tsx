"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { useAddresses } from "../hooks";
import type { Address, AddressFormData } from "../types";
import { SavedAddresses } from "./SavedAddresses";
import { AddressForm } from "./AddressForm";
import { useTranslation } from "react-i18next";

interface BillingDetailsProps {
  onAddressSelected: (addressId: number | null) => void;
  onAddressFormSubmit: (formData: AddressFormData) => void;
  onImmediateCheckout?: (formData: AddressFormData) => void;
  isCheckout?: boolean;
  onFormDataChange?: (
    formData: AddressFormData,
    phoneData: { code: string; number: string }
  ) => void;
}

export const BillingDetails: React.FC<BillingDetailsProps> = ({
  onAddressSelected,
  onAddressFormSubmit,
  onImmediateCheckout,
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
  const shouldScrollOnCloseRef = useRef(false);
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

  useEffect(() => {
    if (!showAddressForm && isAuthenticated && addresses.length > 0) {
      // Only scroll if it was a successful form submission
      if (shouldScrollOnCloseRef.current) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        shouldScrollOnCloseRef.current = false;
      }

      // Auto-select first address if none is selected and trigger shipping update
      if (!selectedAddressId && addresses[0]) {
        const firstAddress = addresses[0];
        setSelectedAddress(firstAddress.id);
        onAddressSelected(firstAddress.id);
        onAddressSelected(firstAddress.id);
      }
    }
  }, [
    showAddressForm,
    isAuthenticated,
    addresses.length,
    selectedAddressId,
    addresses,
    setSelectedAddress,
    onAddressSelected,
  ]);

  const handleAddressSelect = (addressId: number) => {
    setSelectedAddress(addressId);
    onAddressSelected(addressId);
  };

  const handleAddressCreated = useCallback(
    (newAddress: Address) => {
      setSelectedAddress(newAddress.id);
      onAddressSelected(newAddress.id);
    },
    [onAddressSelected, setSelectedAddress]
  );

  const handleAddNewAddress = () => {
    manuallyOpenedFormRef.current = true;
    setShowAddressForm(true);
    onAddressSelected(null);
  };

  const handleFormSubmit = (formData: AddressFormData) => {
    onAddressFormSubmit(formData);
    // Don't close the form here - let onSubmitSuccess handle it
  };

  const handleFormSubmitSuccess = () => {
    if (isAuthenticated) {
      // Mark that we should scroll on close
      shouldScrollOnCloseRef.current = true;
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
      <div className="rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">{t("title")}</h2>
        <AddressForm
          onSubmit={handleFormSubmit}
          showSaveOption={false}
          onImmediateCheckout={onImmediateCheckout}
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
        <h2 className="text-xl font-semibold text-black mb-6">
          {t("Checkout.title")}
        </h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg md:p-6">
      <h2 className="md:flex hidden text-xl font-semibold text-black mb-6">
        {t("Checkout.title")}
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
          isCheckout={isCheckout}
          onFormDataChange={onFormDataChange}
          onSubmitSuccess={handleFormSubmitSuccess}
          onAddressCreated={handleAddressCreated}
        />
      )}
    </div>
  );
};
