import React from "react";
// import MasterCard from "../icons/MasterCard";
// import Wallet from "../icons/Wallet";
import { Order } from "../api/getOrdersById";
import { useTranslation } from "react-i18next";

type OrderSummaryProps = {
  order: Order;
};

const OrderSummary: React.FC<OrderSummaryProps> = ({ order }) => {
  const { t } = useTranslation("Orders");
  return (
    <section className="w-full h-full dark:bg-[#242529] bg-[#FDFDFD] my-6 rounded-[8px] p-6">
      <h2 className="dark:text-[#FDFDFD] md:text-2xl text-base font-semibold leading-[100%]">
        {t("Orders.orderSummary")}
      </h2>
      <div className="mt-4 dark:text-[#FDFDFD] font-normal leading-[100%] flex items-center justify-between">
        <p className="text-sm">
          {t("Orders.totalItems")} ({order.orderItems.length} {t("Orders.item")}):
        </p>
        <p className="text-xs">
          {order.sub_total} <span className="text-[8px]">{t("Orders.egp")}</span>
        </p>
      </div>

      <div className="mt-4 dark:text-[#FDFDFD] font-normal leading-[100%] flex items-center justify-between">
        <p className="text-sm">{t("Orders.shippingCost")}</p>
        <p className="text-xs">
          {order.shipping} <span className="text-[8px]">{t("Orders.egp")}</span>
        </p>
      </div>

      <div className="mt-4 dark:text-[#FDFDFD] font-normal leading-[100%] flex items-center justify-between">
        <p className="text-sm">{t("Orders.taxes")}</p>
        <p className="text-xs">
          {order.tax} <span className="text-[8px]">{t("Orders.egp")}</span>
        </p>
      </div>

      {order.discount_amount > 0 && (
        <div className="mt-4 dark:text-[#FDFDFD] font-normal leading-[100%] flex items-center justify-between">
          <p className="text-sm">Discount:</p>
          <p className="text-xs">
            {order.discount_amount}{" "}
            <span className="text-[8px]">{t("Orders.egp")}</span>
          </p>
        </div>
      )}

      <div className="w-full h-px bg-[#CCCCCC] my-4"></div>

      <div className="mt-4 dark:text-[#FDFDFD] md:text-2xl text-base font-normal leading-[100%] flex items-center justify-between">
        <p>{t("Orders.total")}</p>
        <p className="text-main font-bold">
          {order.total} <span className="text-xs">{t("Orders.egp")}</span>
        </p>
      </div>

      {/* <div className='mt-10'>
                <h2 className='dark:text-[#FDFDFD] text-2xl font-semibold leading-[100%]'>Payment Details</h2>
                <div className='mt-6 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <MasterCard />
                        <p className='dark:text-[#FDFDFD] text-sm font-normal leading-[100%]'>Mastercard ****1234</p>
                    </div>
                    <p className='text-xs'>2000 <span className='text-[8px]'>EGP</span></p>
                </div>

                <div className='mt-6 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <Wallet />
                        <p className='dark:text-[#FDFDFD] text-sm font-normal leading-[100%]'>Wallet ****5678</p>
                    </div>
                    <p className='text-xs'>90 <span className='text-[8px]'>EGP</span></p>
                </div>
            </div> */}
    </section>
  );
};

export default OrderSummary;
