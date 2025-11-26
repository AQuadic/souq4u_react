import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getStoreSetting } from "../api/store";
import FreeDelivery from "./icons/FreeDelivery";

const HeaderBanner = () => {
  const { i18n } = useTranslation();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["storeSetting"],
    queryFn: () => getStoreSetting(),
  });

  if (isLoading)
    return (
      <section className="flex items-center justify-center py-3 bg-main">
        <div className="w-4 h-4 border-4 border-white rounded-full animate-spin"></div>
      </section>
    );

  if (isError || !data || !data.quick_slider) return null;

  return (
    <section className="text-center py-2 bg-main text-white max-sm:text-sm flex items-center justify-center gap-2">
      <FreeDelivery />
      <b>{data.quick_slider[i18n.language] || data.quick_slider["en"]}</b>
    </section>
  );
};

export default HeaderBanner;
