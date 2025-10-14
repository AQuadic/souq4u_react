import { useTranslations } from "next-intl";
import React from "react";

type DeliveredAddressProps = {
  address: string;
};

const DeliveredAddress: React.FC<DeliveredAddressProps> = ({ address }) => {
    const t = useTranslations("Orders");
    return (
        <div className='w-full h-[104] dark:bg-[#242529] bg-[#FDFDFD] mt-10 rounded-[8px] p-6'>
            <h2 className='dark:text-[#FDFDFD] md:text-2xl text-base font-medium leading-[100%]'>{t('deliverdAddress')}</h2>
            <p className='dark:text-[#C0C0C0] md:text-base text-sm font-normal leading-[100%] mt-4'>{address}</p>
        </div>
    )
}

export default DeliveredAddress
