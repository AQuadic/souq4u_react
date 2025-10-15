import React from "react";
import { Link } from "react-router-dom";
import BackArrow from "@/features/products/icons/BackArrow";
import type { Page, Language } from "../types";

interface StaticPageViewProps {
  page: Page;
  lang?: Language;
}

export const StaticPageView: React.FC<StaticPageViewProps> = ({
  page,
  lang = "en",
}) => {
  return (
    <section className="container md:py-10 py-4">
      <h1 className="text-main md:text-[32px] text-2xl font-normal leading-[100%] text-center uppercase font-anton-sc md:flex justify-center hidden">
        {page.title[lang]}
      </h1>

      <Link to="/" className="md:hidden flex items-center gap-2">
        <BackArrow />
        <h2 className="text-foreground text-xl font-semibold leading-[100%]">
          {page.title[lang]}
        </h2>
      </Link>

      <article className="md:mt-12 mt-6">
        <h2 className="text-foreground md:text-2xl text-base font-semibold">
          {page.title[lang]}
        </h2>
        <div
          className="text-foreground md:text-base text-sm font-normal leading-[160%] mt-6 px-6 prose prose-slate max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: page.description[lang] }}
        />
      </article>
    </section>
  );
};
