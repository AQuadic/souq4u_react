import React from "react";
import { Link } from "react-router-dom";
import BackArrow from "@/features/products/icons/BackArrow";
import type { Page, Language } from "../types";

interface StaticPageClientViewProps {
  page: Page | undefined;
  lang?: Language;
}

export const StaticPageClientView: React.FC<StaticPageClientViewProps> = ({
  page,
  lang = "en",
}) => {
  if (!page) {
    return (
      <div className="min-h-screen   ">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Page not found</h1>
            <p className="">
              The page you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              to="/"
              className="text-[var(--color-main)] hover:underline mt-4 inline-block"
            >
              Go back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  ">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="md:hidden flex items-center gap-2 mb-6">
          <BackArrow />
          <span>Back</span>
        </Link>

        <section className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {page.title[lang]}
            </h1>
          </header>

          <article className="prose prose-invert max-w-none">
            <div
              className=" leading-relaxed"
              dangerouslySetInnerHTML={{ __html: page.description[lang] }}
            />
          </article>
        </section>
      </div>
    </div>
  );
};
