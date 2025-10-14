import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

const FavEmptyState = () => {
  const t = useTranslations("Profile");
  const desc = t("FavoritesEmpty.desc");
  const descLines = desc ? desc.split("\n") : [];

  return (
    <div className="flex flex-col items-center justify-center">
      <img
        src="/noFav.png"
        alt={t("FavoritesEmpty.alt") ?? "fav empty"}
        width={254}
        height={254}
      />
      <h2 className=" text-2xl font-semibold mt-8">
        {t("FavoritesEmpty.title")}
      </h2>
      <p className="text-[#C0C0C0] text-lg font-medium font-poppins mt-4 text-center">
        {descLines.length > 0
          ? descLines.map((line) => (
              <React.Fragment key={`fav-desc-${line}`}>
                {line}
                {/* preserve line breaks */}
                {line !== descLines[descLines.length - 1] && <br />}
              </React.Fragment>
            ))
          : null}
      </p>
    </div>
  );
};

export default FavEmptyState;
