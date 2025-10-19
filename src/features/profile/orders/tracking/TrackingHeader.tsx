import { Breadcrumbs } from "@/shared/components/BreadCrumbs/BreadCrumbs";
import React from "react";
import { useTranslation } from "react-i18next";

const TrackingHeader = () => {
  const { t } = useTranslation("Profile.Breadcrumbs");

  const items = [
    { label: t("Profile.Breadcrumbs.account"), href: "/" },
    { label: t("Profile.Breadcrumbs.orders"), href: "/profile/orders" },
    { label: t("Profile.Breadcrumbs.tracking") },
  ];

  return (
    <div className="pt-7 md:flex hidden">
      <Breadcrumbs items={items} />
    </div>
  );
};

export default TrackingHeader;
