import React from "react";
import { useTranslation } from "react-i18next";

const OrdersEmpty = () => {
  const { t } = useTranslation("Orders");
  return (
    <div className="flex flex-col items-center justify-center">
      <img src="/noOrders.png" alt="orders empty" width={303} height={302} />
      <h2 className=" text-2xl font-semibold mt-8">{t('Orders.noOrders')}</h2>
      <p className="md:w-[300px] text-[#C0C0C0] text-lg font-medium font-poppins mt-4 text-center">
        {t('Orders.addOrder')}
      </p>
    </div>
  );
};

export default OrdersEmpty;
