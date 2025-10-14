import React from "react";
// import { Link } from "react-router-dom";
// import { useTranslations, useLocale } from "next-intl";
import BackArrow from "../../icons/BackArrow";
import { Breadcrumbs } from "@/shared/components/BreadCrumbs/BreadCrumbs";
import { Link } from "react-router-dom";

interface ProductHeaderProps {
  showMobileBreadcrumb?: boolean;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  showMobileBreadcrumb = true,
}) => {
  // const tNav = useTranslations("Navigation");
  // const locale = useLocale();
  // const isRtl = locale === "ar";

  const items = [
    { label: ("home"), href: "/" },
    { label: ("products"), href: "/products" },
    { label: ("productDetails") },
  ];

  return (
    <>
      {/* Desktop Breadcrumb */}
      <div className="md:flex hidden">
        <Breadcrumbs items={items} />
      </div>

      {/* Mobile Back Button */}
      {showMobileBreadcrumb && (
        <Link to="/" className="md:hidden flex items-center gap-2">
          <BackArrow  />
          <p className="text-[#FDFDFD] text-xl font-semibold leading-[100%]">
            {("productDetails")}
          </p>
        </Link>
      )}
    </>
  );
};
