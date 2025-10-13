import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

const HomeTryApp = () => {
  const t = useTranslations("HomeTryApp");

  return (
    <section className="container flex justify-between items-center max-sm:flex-col gap-6">
      <div>
        <h3 className="text-2xl font-bold sm:text-[40px]">
          {t("title", { brandName: "Eshhaar" })
            .split(" ")
            .map((part, i) =>
              // keep brandName styled
              part === "Eshhaar" ? (
                <span key={i} className="text-main">
                  {part}{" "}
                </span>
              ) : (
                <React.Fragment key={i}>{part} </React.Fragment>
              )
            )}
        </h3>
        <p className="max-w-[545px] text-xl sm:text-2xl my-6 sm:my-10 text-main-gray">
          {t("description")
            .split("\n")
            .map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                {idx < t("description").split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
        </p>
        <div className="flex gap-4 max-sm:justify-center">
          <Image
            src="/try-app/google-play.png"
            alt={t("googlePlayAlt")}
            width={145}
            height={5680}
          />
          <Image
            src="/try-app/app-store.png"
            alt={t("appStoreAlt")}
            width={145}
            height={5680}
          />
        </div>
      </div>
      <Image
        src="/try-app/try-app.png"
        width={520}
        height={435}
        alt={t("featureAlt")}
      />
    </section>
  );
};

export default HomeTryApp;
