"use client";

// import { Link } from "@/i18n/navigation";
import React from "react";
// import { useTranslations } from "next-intl";
import MainContactForm from "./MainContactForm";
import { Link } from "react-router-dom";
import MapWithSkeleton from "@/shared/components/ui/MapWithSkeleton";

const ContactSection = () => {
  // const config = useConfig();
  // const latRaw = config?.address?.location?.lat ?? null;
  // const lngRaw = config?.address?.location?.lng ?? null;
  // const lat = latRaw ? Number(latRaw) : null;
  // const lng = lngRaw ? Number(lngRaw) : null;
  // const t = useTranslations("Contact");

  // const storeType = config?.store_type;

  return (
    <section className="container md:py-12">
      <h2 className="md:flex items-center justify-center hidden text-main text-[32px] font-normal font-anton-sc leading-[100%] text-center">
        {("Contact us")}
      </h2>
      <Link to="/" className="md:hidden flex items-center gap-2">
        {/* <BackArrow /> */}
        <h2 className="text-[#FDFDFD] text-xl font-semibold leading-[100%]">
          {("title")}
        </h2>
      </Link>
      <div className="md:mt-12 flex lg:flex-row flex-col-reverse items-center justify-between gap-4">
        <div className="flex flex-col md:w-[592px] w-full">
          <div className="md:h-[562px] h-[530px] rounded-2xl overflow-hidden shadow-lg">
            <MapWithSkeleton className="w-full h-full" />
          </div>
        </div>

        <MainContactForm />
      </div>
    </section>
  );
};

export default ContactSection;
