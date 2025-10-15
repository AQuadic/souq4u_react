import React from "react";

const OrdersEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <img src="/noOrders.png" alt="orders empty" width={303} height={302} />
      <h2 className=" text-2xl font-semibold mt-8">No Order Yet</h2>
      <p className="text-[#C0C0C0] text-lg font-medium font-poppins mt-4 text-center">
        Please add your order for your <br /> better experience
      </p>
    </div>
  );
};

export default OrdersEmpty;
