"use client";

import React, { useState } from "react";
import type { Address } from "../types";
import { useDeleteAddress } from "../hooks";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { Link } from "react-router-dom";
import DeleteAddressDialog from "./DeleteAddressDialog";
import { useAddressStore } from "../stores";
import { useTranslation } from "react-i18next";
import Delete from "@/features/profile/addresses/icons/Delete";
import Edit from "@/features/profile/addresses/icons/Edit";
import Phone from "@/features/profile/addresses/icons/Phone";

interface SavedAddressesProps {
  addresses: Address[];
  selectedAddressId: number | null;
  onAddressSelect: (addressId: number) => void;
  onAddNewAddress: () => void;
  isCheckout?: boolean;
}

interface AddressCardProps {
  address: Address;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isCheckout?: boolean;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  isCheckout = false,
}) => {
  const [showActions, setShowActions] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);
  const { addresses, isLoading, error, fetchAddresses, removeAddress } =
    useAddressStore();

  const handleDelete = async (id: number) => {
    // This function will be invoked after user confirms in dialog
    try {
      await removeAddress(id);
      if (selectedId === id) setSelectedId(null);
    } catch (err) {
      console.error("Failed to delete address", err);
    }
  };

  // Build the edit link with optional checkout redirect parameter
  const editHref = isCheckout
    ? `/profile/addresses/edit/${address.id}?from=checkout`
    : `/profile/addresses/edit/${address.id}`;

  return (
    <div
      className={`
        relative border rounded-lg p-4 cursor-pointer transition-all
        ${isSelected ? "border-main bg-[var(--color-main)]/10" : "border"}
      `}
      onClick={onSelect}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Selection indicator */}
      <div className="flex items-end justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`
                w-4 h-4 rounded-full border-2 flex items-center justify-center
                ${isSelected ? "border-main bg-main" : "border-[#4A4A4A]"}
              `}
            >
              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-white"></div>
              )}
            </div>
            <h3 className="dark:text-white font-medium">{address.title}</h3>
          </div>

          <div className="flex items-center gap-2">
            <Phone />
            <p className="dark:text-gray-300 text-sm leading-relaxed">
              {address.phone}
            </p>
          </div>

          {address.zipcode && (
            <p className="dark:text-gray-400 text-xs mt-1">
              Zipcode: {address.zipcode}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setAddressToDelete(address.id);
              setIsDeleteDialogOpen(true);
            }}
            aria-label="delete"
          >
            <Delete />
          </button>
          <Link to={editHref} onClick={(e) => e.stopPropagation()}>
            <Edit />
          </Link>
        </div>
      </div>

      <DeleteAddressDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => setIsDeleteDialogOpen(open)}
        addressTitle={
          addresses.find((a) => a.id === addressToDelete)?.title ?? ""
        }
        onConfirm={async () => {
          if (addressToDelete != null) {
            await handleDelete(addressToDelete);
            setAddressToDelete(null);
          }
        }}
      />
    </div>
  );
};

export const SavedAddresses: React.FC<SavedAddressesProps> = ({
  addresses,
  selectedAddressId,
  onAddressSelect,
  onAddNewAddress,
  isCheckout = false,
}) => {
  const deleteAddressMutation = useDeleteAddress();
  const { isAuthenticated } = useAuthStore();

  const handleEdit = (address: Address) => {
    // TODO: Implement edit functionality - for now, just show the form
    console.log("Edit address:", address);
  };

  const handleDelete = async (address: Address) => {
    if (window.confirm(`Are you sure you want to delete "${address.title}"?`)) {
      try {
        await deleteAddressMutation.mutateAsync(address.id);
      } catch (error) {
        console.error("Failed to delete address:", error);
      }
    }
  };
  const { t } = useTranslation("saveAddress");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium dark:text-white">
          {t("saveAddress.selectAddress")}
        </h3>
      </div>

      <div className="space-y-3">
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            isSelected={selectedAddressId === address.id}
            onSelect={() => onAddressSelect(address.id)}
            onEdit={() => handleEdit(address)}
            onDelete={() => handleDelete(address)}
            isCheckout={isCheckout}
          />
        ))}
      </div>

      {(!isCheckout || isAuthenticated) && (
        <button
          onClick={onAddNewAddress}
          className="w-[249px] h-14 rounded-[8px] bg-main text-white text-sm font-medium transition-colors capitalize"
        >
          {t("saveAddress.addNewAddress")}
        </button>
      )}

      {addresses.length === 0 && (!isCheckout || isAuthenticated) && (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">No saved addresses found</p>
          <button
            onClick={onAddNewAddress}
            className="px-6 py-2 bg-red-600 hover:bg-main text-white rounded-md transition-colors"
          >
            Add Your First Address
          </button>
        </div>
      )}
    </div>
  );
};
