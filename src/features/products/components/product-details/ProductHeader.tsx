import React from "react";
import { useTranslation } from "react-i18next";
import BackArrow from "../../icons/BackArrow";
import { Breadcrumbs } from "@/shared/components/BreadCrumbs/BreadCrumbs";
import { Link } from "react-router-dom";

interface ProductHeaderProps {
  showMobileBreadcrumb?: boolean;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  showMobileBreadcrumb = true,
}) => {
  const { t } = useTranslation();

  const items = [
    { label: t("Navigation.home"), href: "/" },
    { label: t("Products.title"), href: "/products" },
    { label: t("Products.productDetails") },
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
          <BackArrow />
          <p className="text-[#FDFDFD] text-xl font-semibold leading-[100%]">
            {t("Products.productDetails")}
          </p>
        </Link>
      )}
    </>
  );
};
