import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getStoreSetting } from "../api/store";

const HeaderBanner = () => {
  const { t, i18n } = useTranslation();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["storeSetting"],
    queryFn: () => getStoreSetting(),
  });

  if (isLoading)
    return (
      <section className="text-center py-2 bg-main text-white max-sm:text-sm">
        {t('Common.loading')}
      </section>
    );

  if (isError || !data || !data.quick_slider) return null;

  return (
    <section className="text-center py-2 bg-main text-white max-sm:text-sm">
      <b>{data.quick_slider[i18n.language] || data.quick_slider["en"]}</b>
    </section>
  );
};

export default HeaderBanner;
