import { useTranslation } from "react-i18next";
import React from "react";

type DeliveredAddressProps = {
  address: string;
  delivery_expect?: string | null;
};

const DeliveredAddress: React.FC<DeliveredAddressProps> = ({ address, delivery_expect }) => {
  const { t, i18n } = useTranslation("Orders");

  const monthsAr: Record<string, number> = {
    "يناير": 0,
    "فبراير": 1,
    "مارس": 2,
    "أبريل": 3,
    "مايو": 4,
    "يونيو": 5,
    "يوليو": 6,
    "أغسطس": 7,
    "سبتمبر": 8,
    "أكتوبر": 9,
    "نوفمبر": 10,
    "ديسمبر": 11,
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "";

    let date: Date;

    const isoDate = new Date(dateString);
    if (!isNaN(isoDate.getTime())) {
      date = isoDate;
    } else {
      const parts = dateString.split(" ");
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = monthsAr[parts[1]];
        const year = parseInt(parts[2], 10);
        if (!isNaN(day) && month !== undefined && !isNaN(year)) {
          date = new Date(year, month, day);
        } else {
          return dateString;
        }
      } else {
        return dateString;
      }
    }

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
    <div className="w-full h-full bg-[#F7F7F7] mt-10 rounded-[8px] p-6">
      <h2 className="md:text-2xl text-base font-medium leading-[100%]">
        {t("Orders.deliverdAddress")}
      </h2>
      <p className="md:text-base text-sm font-normal leading-[100%] mt-4">
        {address}
      </p>
      {delivery_expect && (
        <p className="md:text-base text-sm font-normal leading-[100%] mt-4">
          {t("Orders.deliveryExpect")}: {formatDate(delivery_expect)}
        </p>
      )}
    </div>
  );
};

export default DeliveredAddress;
