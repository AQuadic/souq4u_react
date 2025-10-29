import React from "react";
import { useTranslation } from "react-i18next";

const HomeTryApp = () => {
  const { t } = useTranslation();
  const title = t("HomeTryApp.title");
  const description = t("HomeTryApp.description");
  const googlePlayAlt = t("HomeTryApp.googlePlayAlt");
  const appStoreAlt = t("HomeTryApp.appStoreAlt");
  const featureAlt = t("HomeTryApp.featureAlt");

  return (
    <section className="container flex justify-between items-center max-sm:flex-col gap-6">
      <div>
        <h3 className="text-2xl font-bold sm:text-[40px]">
          {title.split(" ").map((part, i) => (
            <React.Fragment key={`text-${i}`}>{part} </React.Fragment>
          ))}
        </h3>
        <p className="max-w-[545px] text-xl sm:text-2xl my-6 sm:my-10 text-main-gray">
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
