"use client";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { AddressForm } from "@/features/address/components/AddressForm";
import { Breadcrumbs } from "@/shared/components/BreadCrumbs/BreadCrumbs";
import type { AddressFormData } from "@/features/address/types";
import { getAddress } from "@/features/address/api";
import BackArrow from "@/features/products/icons/BackArrow";
import { useTranslation } from "react-i18next";

const EditAddress = () => {
  const { t } = useTranslation("Profile.Breadcrumbs");
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Detect if came from checkout via query param
  const searchParams = new URLSearchParams(location.search);
  const fromCheckout = searchParams.get("from") === "checkout";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialData, setInitialData] = useState<Partial<AddressFormData> | undefined>(undefined);

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      setError("Invalid address id");
      setLoading(false);
      return;
    }

    const loadAddress = async () => {
      setLoading(true);
      setError(null);
      try {
        const addr = await getAddress(Number(id));
        setInitialData({
          title: addr.title,
          country_id: addr.country_id?.toString?.() ?? addr.country_id,
          city_id: addr.city_id?.toString?.() ?? String(addr.city_id),
          area_id: addr.area_id?.toString?.() ?? addr.area_id,
          details: addr.details,
          zipcode: addr.zipcode,
          location: addr.location,
          phone: addr.phone || "",
          phone_country: addr.phone_country || "",
          email: addr.email || "",
          user_name: addr.user_name || "",
        });
      } catch (err) {
        console.error("Failed to fetch address:", err);
        setError(err?.message || "Failed to fetch address");
      } finally {
        setLoading(false);
      }
    };

    loadAddress();
  }, [id]);

  const handleSubmit = async () => {
    if (!id || isNaN(Number(id))) return;

    // Navigate after successful update
    if (fromCheckout) {
      navigate("/checkout");
    } else {
      navigate("/profile/addresses");
    }
  };

  if (loading) return <p className="text-[#C0C0C0]">{t("Profile.loadingAddressess")}</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="pb-20">
      <div className="my-6">
        <Breadcrumbs
          items={[
            { label: t("Profile.account"), href: "/" },
            { label: t("Profile.addresses"), href: "/profile/addresses" },
            { label: t("AddressForm.editAddress") },
          ]}
        />
      </div>

      <h2 className="text-[32px] font-bold leading-[100%] mb-8 md:flex hidden">
        {t("AddressForm.editAddress")}
      </h2>

      <Link to="/profile/addresses" className="md:hidden flex items-center mb-8">
        <BackArrow />
        <h2 className="text-[32px] font-bold leading-[100%]">
          {t("AddressForm.editAddress")}
        </h2>
      </Link>

      {initialData ? (
        <AddressForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isEditing
          addressId={Number(id)}
          showSaveOption={true}
        />
      ) : (
        <p className="text-[#C0C0C0]">Address not found</p>
      )}
    </div>
  );
};

export default EditAddress;
