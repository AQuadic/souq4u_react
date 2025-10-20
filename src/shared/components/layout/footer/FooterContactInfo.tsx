import React from "react";
import Location from "./icons/Location";
import Email from "./icons/Email";

const FooterContactInfo = () => {
  const lat = null;
  const lng = null;
  const mapsHref =
    lat && lng ? `https://www.google.com/maps?q=${lat},${lng}` : "/";

  return (
    <section className="bg-main mt-[60px] sm:mt-[120px]">
      <div className="container flex lg:flex-row flex-col items-center justify-center lg:gap-4 py-[60px]">
        <a
          href={mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 pb-12 lg:pb-0"
        >
          <Location />
          <h1 className="text-[#FDFDFD] lg:text-lg text-base font-semibold leading-[100%] ">
            6391 Elgin St. Celina, Delaware 10299
          </h1>
        </a>
        <div className="lg:w-px lg:h-[104px] w-full h-px text-[#FDFDFD] bg-[#FDFDFD]"></div>

        <a
          href={`tel:+12075550119`}
          className="text-[#FDFDFD] lg:text-[40px] text-[32px] font-bold leading-[100%] xl:px-16 py-11 xl:py-0"
          dir="ltr"
        >
          (207) 555-0119
        </a>

        <div className="lg:w-px lg:h-[104px] w-full h-px text-[#FDFDFD] bg-[#FDFDFD]"></div>

        <a
          href={`mailto:eg.example@gmail.com`}
          className="flex items-center gap-2 pt-12 lg:pt-0"
        >
          <Email />
          <p className="text-[#FDFDFD] lg:text-2xl text-base font-semibold leading-[100%]">
            eg.example@gmail.com
          </p>
        </a>
      </div>
    </section>
  );
};

export default FooterContactInfo;
