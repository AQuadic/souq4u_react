import { Breadcrumbs } from "@/shared/components/BreadCrumbs/BreadCrumbs";
import React from "react";
import { useTranslation } from "react-i18next";

const TrackingHeader = () => {
  const { t } = useTranslation("Profile.Breadcrumbs");

  const items = [
    { label: t("account"), href: "/" },
    { label: t("orders"), href: "/profile/orders" },
    { label: t("tracking") },
  ];

  return (
    <div className="pt-7 md:flex hidden">
      <Breadcrumbs items={items} />
    </div>
  );
};

export default TrackingHeader;
