import { useTranslation } from "react-i18next";
import React from "react";

type DeliveredAddressProps = {
  address: string;
  delivery_expect?: string | null;
};

const DeliveredAddress: React.FC<DeliveredAddressProps> = ({ address, delivery_expect }) => {
  const { t, i18n } = useTranslation("Orders");

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    const locale = i18n.language === "ar" ? "ar-EG" : "en-US";

    const weekday = date.toLocaleDateString(locale, { weekday: "short" });
    const formatted = date.toLocaleDateString(locale, {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });

    return `${weekday}, ${formatted}`;
  };

  return (
    <div className="w-full h-[104] bg-[#F7F7F7] mt-10 rounded-[8px] p-6">
      <h2 className="md:text-2xl text-base font-medium leading-[100%]">
        {t("Orders.deliverdAddress")}
      </h2>
      <p className="md:text-base text-sm font-normal leading-[100%] mt-4">
        {address}
      </p>

      <p className="md:text-base text-sm font-normal leading-[100%] mt-4">
        {t("Orders.deliveryExpect")}: {formatDate(delivery_expect || null)}
      </p>
    </div>
  );
};

export default DeliveredAddress;
