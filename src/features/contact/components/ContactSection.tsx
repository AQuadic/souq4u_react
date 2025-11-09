"use client";

// import { Link } from "@/i18n/navigation";
import React from "react";
// import { useTranslations } from "next-intl";
import MainContactForm from "./MainContactForm";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import MapWithSkeleton from "@/shared/components/ui/MapWithSkeleton";
import { getStoreSetting } from "@/shared/components/layout/api/store";

const ContactSection = () => {
  // const config = useConfig();
  // const latRaw = config?.address?.location?.lat ?? null;
  // const lngRaw = config?.address?.location?.lng ?? null;
  // const lat = latRaw ? Number(latRaw) : null;
  // const lng = lngRaw ? Number(lngRaw) : null;
  const { t } = useTranslation();

  const { data: socialData, isLoading } = useQuery({
    queryKey: ["store-setting", "social"],
    queryFn: () => getStoreSetting("social"),
  });

  const lat = socialData?.location?.lat ?? null;
  const lng = socialData?.location?.lng ?? null;

  return (
    <section className="container md:py-12">
      <h2 className="md:flex items-center justify-center hidden text-main text-[32px] font-normal font-anton-sc leading-[100%] text-center">
        {t("Contact.title")}
      </h2>
      <Link to="/" className="md:hidden flex items-center gap-2">
        {/* <BackArrow /> */}
        <h2 className="text-[#FDFDFD] text-xl font-semibold leading-[100%]">
          {t("Contact.title")}
        </h2>
      </Link>
      <div className="md:mt-12 flex lg:flex-row flex-col-reverse items-center justify-between gap-4">
        <div className="flex flex-col md:w-[592px] w-full">
          <div className="md:h-[562px] h-[530px] rounded-2xl overflow-hidden shadow-lg">
            {isLoading ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                {t("Common.loadingMap")}
              </div>
            ) : (
              <MapWithSkeleton lat={lat} lng={lng} className="w-full h-full" />
            )}
          </div>
        </div>

        <MainContactForm />
      </div>
    </section>
  );
};

export default ContactSection;
