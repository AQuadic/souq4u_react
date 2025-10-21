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
    <section className="container md:py-10 py-4 min-h-[60vh]">
      <h1 className="text-main md:text-[32px] text-2xl font-normal leading-[100%] text-center uppercase font-anton-sc md:flex justify-center hidden">
        {page.title[lang]}
      </h1>

      <Link to="/" className="md:hidden flex items-center gap-2 mb-6">
        <BackArrow />
        <h2 className="text-foreground text-xl font-semibold leading-[100%]">
          {page.title[lang]}
        </h2>
      </Link>

      <article className="md:mt-12 mt-6">
        <h2 className="text-foreground md:text-2xl text-base font-semibold mb-6">
          {page.title[lang]}
        </h2>
        <div
          className="text-foreground md:text-base text-sm font-normal leading-[160%] prose prose-slate max-w-none dark:prose-invert
            prose-headings:text-foreground prose-headings:font-semibold
            prose-p:text-foreground prose-p:my-4
            prose-ul:text-foreground prose-ul:my-4 prose-ul:list-disc prose-ul:list-inside
            prose-ol:text-foreground prose-ol:my-4 prose-ol:list-decimal prose-ol:list-inside
            prose-li:text-foreground prose-li:my-2
            prose-strong:text-foreground prose-strong:font-semibold
            prose-a:text-main prose-a:underline hover:prose-a:text-main-orange"
          dangerouslySetInnerHTML={{ __html: page.description[lang] }}
        />
      </article>
    </section>
  );
};
