import React from "react";
import { useTranslation } from "react-i18next";

const HomeTryApp = () => {
  const { t } = useTranslation();
  const description = t("HomeTryApp.description");
  const googlePlayAlt = t("HomeTryApp.googlePlayAlt");
  const appStoreAlt = t("HomeTryApp.appStoreAlt");
  const featureAlt = t("HomeTryApp.featureAlt");
  // Use a unique marker for the brand so translations can place the brand around it
  const rawTitle = t("HomeTryApp.title", { brand: "___BRAND___" });
  const titleParts = rawTitle.split("___BRAND___");
  const titleBefore = titleParts[0] ?? "";
  const titleAfter = titleParts.slice(1).join("___BRAND___") ?? "";

  return (
    <section className="container flex justify-between items-center max-sm:flex-col gap-6">
      <div>
        <h1 className="text-lg lg:text-[40px] font-bold font-anton-sc flex items-center gap-2">
          {titleBefore && <>{titleBefore} </>}
          <p className="text-main">Souq<span className="text-main-orange">4</span>U</p>
          {titleAfter && <> {titleAfter}</>}
        </h1>
        <p className="max-w-[545px] text-sm sm:text-2xl my-3 sm:my-10 text-main-gray">
          {description.split("\n").map((line, idx) => (
            <React.Fragment key={`desc-line-${line.substring(0, 10)}-${idx}`}>
              {line}
              {idx < description.split("\n").length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
        <div className="flex gap-4 max-sm:justify-center">
          <img
            src="/try-app/google-play.png"
            alt={googlePlayAlt}
            width={145}
            height={56}
          />
          <img
            src="/try-app/app-store.png"
            alt={appStoreAlt}
            width={145}
            height={56}
          />
        </div>
      </div>
      <img
        src="/try-app/try-app.png"
        width={520}
        height={435}
        alt={featureAlt}
      />
    </section>
  );
};

export default HomeTryApp;
