import React from "react";
import { useQuery } from "@tanstack/react-query";
import Location from "./icons/Location";
import Email from "./icons/Email";
import { getStoreSetting, StoreSettings } from "../api/store";
import Spinner from "../../icons/Spinner";

const FooterContactInfo = () => {
  const { data: storeData, isLoading, isError } = useQuery<
    StoreSettings["social"]
  >({
    queryKey: ["store-settings", "social"],
    queryFn: () => getStoreSetting("social"),
  });

  const lat = storeData?.location?.lat;
  const lng = storeData?.location?.lng;
  const details = storeData?.details?.trim();

  const hasLocation = !!details && details !== "";

  const mapsHref =
    lat && lng ? `https://www.google.com/maps?q=${lat},${lng}` : "#";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <section className="bg-main mt-[60px] sm:mt-[120px] py-[60px] text-center text-[#FDFDFD]">
        Failed to load contact info.
      </section>
    );
  }

  return (
    <section className="bg-main mt-[60px] sm:mt-[120px]">
      <div className="container flex lg:flex-row flex-col items-center justify-center lg:gap-4 py-[20px]">

        {hasLocation && (
          <>
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 pb-12 lg:pb-0"
            >
              <Location />
              <h1 className="text-[#FDFDFD] lg:text-lg text-base font-semibold leading-[100%] ">
                {details}
              </h1>
            </a>
            <div className="lg:w-px lg:h-[104px] w-full h-px bg-[#FDFDFD]"></div>
          </>
        )}

        {storeData?.phone && (
          <>
            <a
              href={`tel:${storeData.phone}`}
              className="text-[#FDFDFD] lg:text-[40px] text-[32px] font-bold leading-[100%] xl:px-16 py-11 xl:py-0"
              dir="ltr"
            >
              {storeData.phone}
            </a>
            {storeData?.email && (
              <div className="lg:w-px lg:h-[104px] w-full h-px bg-[#FDFDFD]"></div>
            )}
          </>
        )}

        {storeData?.email && (
          <a
            href={`mailto:${storeData.email}`}
            className="flex items-center gap-2 pt-12 lg:pt-0"
          >
            <Email />
            <p className="text-[#FDFDFD] lg:text-2xl text-base font-semibold leading-[100%]">
              {storeData.email}
            </p>
          </a>
        )}
      </div>
    </section>
  );
};

export default FooterContactInfo;
