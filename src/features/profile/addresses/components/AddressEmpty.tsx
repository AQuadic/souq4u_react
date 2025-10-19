import React from "react";

const AddressEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <img
        src="/images/profile/NoAddress.png"
        alt="address empty"
        width={303}
        height={302}
      />
      <h2 className="text-[#FDFDFD] text-2xl font-semibold mt-8">
        No Address Yet
      </h2>
      <p className="text-[#C0C0C0] text-lg font-medium font-poppins mt-4 text-center">
        Please add your addresses for your <br /> better experience
      </p>
    </div>
  );
};

export default AddressEmpty;
