import { Breadcrumbs } from "@/shared/components/BreadCrumbs/BreadCrumbs";
import React from "react";
// import { useTranslations } from "next-intl";

const TrackingHeader = () => {
  // const t = useTranslations("Profile.Breadcrumbs");

  const items = [
    { label: ("account"), href: "/" },
    { label: ("orders"), href: "/profile/orders" },
    { label: ("tracking") },
  ];

  return (
    <div className="pt-7 md:flex hidden">
      <Breadcrumbs items={items} />
    </div>
  );
};

export default TrackingHeader;
