import { useTranslation } from "react-i18next";
import React from "react";

type DeliveredAddressProps = {
  address: string;
};

const DeliveredAddress: React.FC<DeliveredAddressProps> = ({ address }) => {
  const { t } = useTranslation("Orders");
  return (
    <div className="w-full h-[104] bg-[#F7F7F7] mt-10 rounded-[8px] p-6">
      <h2 className="md:text-2xl text-base font-medium leading-[100%]">
        {t("Orders.deliverdAddress")}
      </h2>
      <p className="md:text-base text-sm font-normal leading-[100%] mt-4">
        {address}
      </p>
    </div>
  );
};

export default DeliveredAddress;
