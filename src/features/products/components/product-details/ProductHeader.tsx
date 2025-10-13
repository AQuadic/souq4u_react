import React from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import BackArrow from "../../icons/BackArrow";
import { Breadcrumbs } from "@/shared/components/BreadCrumbs/BreadCrumbs";

interface ProductHeaderProps {
  showMobileBreadcrumb?: boolean;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  showMobileBreadcrumb = true,
}) => {
  const tNav = useTranslations("Navigation");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const items = [
    { label: tNav("home"), href: "/" },
    { label: tNav("products"), href: "/products" },
    { label: tNav("productDetails") },
  ];

  return (
    <>
      {/* Desktop Breadcrumb */}
      <div className="md:flex hidden">
        <Breadcrumbs items={items} />
      </div>

      {/* Mobile Back Button */}
      {showMobileBreadcrumb && (
        <Link href="/" className="md:hidden flex items-center gap-2">
          <BackArrow flip={isRtl} />
          <p className="text-[#FDFDFD] text-xl font-semibold leading-[100%]">
            {tNav("productDetails")}
          </p>
        </Link>
      )}
    </>
  );
};
