import React from "react";
import { useTranslation } from "react-i18next";

const ProductListing = () => {
  const {t} = useTranslation("Products");
  return (
    <section className="container md:py-14 py-8">
      <h2 className="text-[#FDFDFD] md:text-[32px] text-lg font-bold leading-[100%]">
        {t("recommendedForYou")}
      </h2>
    </section>
  );
};

export default ProductListing;
