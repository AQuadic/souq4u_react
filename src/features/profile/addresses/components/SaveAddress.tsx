"use client";
import React, { useEffect, useState } from "react";
import { useConfig } from "@/features/config";
import Location from "../icons/Location";
import Delete from "../icons/Delete";
import Edit from "../icons/Edit";
import { useAddressStore } from "@/features/address/stores";
import DeleteAddressDialog from "@/features/address/components/DeleteAddressDialog";
import BackArrow from "@/features/products/icons/BackArrow";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import AddressEmpty from "./AddressEmpty";
import Phone from "../icons/Phone";

const SaveAddress: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { addresses, isLoading, error, fetchAddresses, removeAddress } =
    useAddressStore();

  const config = useConfig();
  const isClothesDesign = config?.store_type === "Clothes";

  useEffect(() => {
    // fetch addresses on mount
    fetchAddresses();
  }, [fetchAddresses]);

  const {t} = useTranslation("Profile");

  const handleSelect = (id: number) => {
    setSelectedId(id);
  };

  // compute classes for address card based on config and selection
  const getCardClasses = (id: number) => {
    // do not include background utilities in base to avoid conflicts with selected state
    const base = `w-full h-[120px] px-4 py-6 flex items-end-safe justify-between mb-6 text-left cursor-pointer min-w-0`;
    const radius = isClothesDesign ? "rounded-[24px]" : "rounded-[8px]";

    let stateClasses = "";
    if (selectedId === id) {
      // use project's main color with 10% background and ensure dark mode variant also applies
      stateClasses =
        "bg-main/10 dark:bg-main/10 border border-main transition-colors duration-150";
    } else {
      // default (not selected): include background so card looks normal
      stateClasses = isClothesDesign
        ? "border-transparent bg-white dark:bg-transparent"
        : "border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-transparent";
    }

    return `${base} ${radius} ${stateClasses}`;
  };

  const handleDelete = async (id: number) => {
    // This function will be invoked after user confirms in dialog
    try {
      await removeAddress(id);
      if (selectedId === id) setSelectedId(null);
    } catch (err) {
      console.error("Failed to delete address", err);
    }
  };
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <section>
      <h2 className="text-neutral-900 dark:text-white text-[32px] font-bold leading-[100%] mb-8 md:flex hidden">
        {t("Profile.AddAddress.header")|| "Save Address"}
      </h2>

      <Link
        to="/profile/addresses"
        className="flex items-center gap-2 mb-8 md:hidden"
      >
        <BackArrow />
        <h2 className="text-neutral-900 dark:text-white text-[32px] font-bold leading-[100%]">
        {t("Profile.AddAddress.header")|| "Save Address"}
        </h2>
      </Link>

      {isLoading && (
        <p className="text-neutral-600 dark:text-neutral-400">
          {t('Profile.loadingAddressess')}
        </p>
      )}
      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && addresses.length === 0 && (
        <div className="">
          <AddressEmpty />
        </div>
      )}

      {addresses.map((addr) => (
        <button
          key={addr.id}
          type="button"
          onClick={() => handleSelect(addr.id)}
          className={getCardClasses(addr.id)}
        >
          <div className="min-w-0">
            <div className="flex items-start gap-2">
              <Location />
              <div className="min-w-0">
                <p className="text-neutral-900 dark:text-white text-lg font-semibold leading-[120%] truncate">
                  {addr.title}
                </p>
                {addr.details && (
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium leading-[140%] truncate mt-1">
                    {addr.details}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2 mt-3">
              <Phone />
              <div className="min-w-0">
                <p className="text-[#5D5D5D] dark:text-white text-lg font-semibold leading-[120%] truncate" dir="ltr">
                  {addr.phone}
                </p>
              </div>
            </div>
            {/* {addr.zipcode && (
              <div className="flex gap-2 mt-[12px]">
                <p
                  className="text-neutral-600 dark:text-neutral-400 text-lg font-medium leading-[140%] truncate"
                  dir="ltr"
                >
                  {addr.zipcode}
                </p>
              </div>
            )} */}
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setAddressToDelete(addr.id);
                setIsDeleteDialogOpen(true);
              }}
              aria-label="delete"
            >
              <Delete />
            </button>
            <Link
              to={`/profile/addresses/edit/${addr.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Edit />
            </Link>
          </div>
        </button>
      ))}

      {selectedId && (
        <div className="flex md:flex-row flex-col items-center justify-center gap-4 mt-4">
          <Link
            to={`/profile/addresses/edit/${selectedId}`}
            className={`md:w-1/2 w-full h-14 border border-main text-main text-lg font-bold flex items-center justify-center ${
              isClothesDesign ? "rounded-[24px]" : "rounded-[8px]"
            }`}
          >
            {t("AddressForm.editAddress") || "Edit Address"}
          </Link>
          <Link
            to="/profile/addresses/add"
            className={`md:w-1/2 w-full h-14 bg-main text-white dark:text-white text-lg font-bold flex items-center justify-center ${
              isClothesDesign ? "rounded-[24px]" : "rounded-[8px]"
            }`}
          >
            {t("AddressForm.addAddress") || "Add Address"}
          </Link>
        </div>
      )}

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
    </section>
  );
};

export default SaveAddress;
