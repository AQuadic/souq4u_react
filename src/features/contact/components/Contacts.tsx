"use client";
import React from "react";
import Phone from "../icons/Phone";
import Location from "../icons/Location";
import Email from "../icons/Email";
// import { useTranslations } from "next-intl";
// import { Skeleton } from "@/shared/components/ui/skeleton";

const Contacts = () => {
  // const t = useTranslations("Contact");

  return (
    <section className="container flex flex-wrap items-center justify-around mt-10 md:mb-32 mb-10 md:gap-0 gap-14">
      <div className="flex flex-col items-center">
        <Phone />
        <h2 className=" md:text-[28px] text-base font-semibold leading-[100%] mt-6">
          {("phone")}
        </h2>
        {/* {isConfigLoading || !firstPhone ? (
          <Skeleton className="h-5 w-32 mt-4 rounded-md bg-gray-300/50 dark:bg-gray-700/50" />
        ) : (
          <a
            href={`tel:${firstPhone}`}
            className="text-[#C0C0C0] text-lg font-medium leading-[160%] mt-4 dark:hover:text-white transition"
            dir="ltr"
          >
            {firstPhone}
          </a>
        )} */}
      </div>

      <div className="flex flex-col items-center">
        <Location />
        <h2 className=" md:text-[28px] text-base font-semibold leading-[100%] mt-6">
          {("location")}
        </h2>
        {/* {isConfigLoading || !address ? (
          <Skeleton className="h-5 w-48 mt-4 rounded-md bg-gray-300/50 dark:bg-gray-700/50" />
        ) : (
          <a
            href={
              config?.address?.location?.lat && config?.address?.location?.lng
                ? `https://www.google.com/maps?q=${config.address.location.lat},${config.address.location.lng}`
                : "#"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#C0C0C0] text-lg font-medium leading-[160%] mt-4 dark:hover:text-white transition"
          >
            {address}
          </a>
        )} */}
      </div>

      <div className="flex flex-col items-center">
        <Email />
        <h2 className=" md:text-[28px] text-base font-semibold leading-[100%] mt-6">
          {("email")}
        </h2>
        {/* {isConfigLoading || !firstEmail ? (
          <Skeleton className="h-5 w-40 mt-4 rounded-md bg-gray-300/50 dark:bg-gray-700/50" />
        ) : (
          <a
            href={`mailto:${firstEmail}`}
            className="text-[#C0C0C0] text-lg font-medium leading-[160%] mt-4 dark:hover:text-white transition"
          >
            {firstEmail}
          </a>
        )} */}
      </div>
    </section>
  );
};

export default Contacts;
