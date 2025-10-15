import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Facebook from "./icons/Facebook";
import X from "./icons/X";
import LinkedIn from "./icons/LinkedIn";
import Instagram from "./icons/Instagram";
import Youtube from "./icons/Youtube";
import Tiktok from "./icons/Tiktok";
import Snapchat from "./icons/Snapchat";
import FooterContactInfo from "./FooterContactInfo";
import {
  usePagesContextSafe,
  useFooterNavigation,
} from "@/features/static-pages";

const socialIcons = [
  { Icon: Facebook, href: "https://facebook.com" },
  { Icon: X, href: "https://twitter.com" },
  { Icon: LinkedIn, href: "https://linkedin.com" },
  { Icon: Instagram, href: "https://instagram.com" },
  { Icon: Youtube, href: "https://youtube.com" },
  { Icon: Tiktok, href: "https://tiktok.com" },
  { Icon: Snapchat, href: "https://snapchat.com" },
];

const Footer = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "en";

  // Get pages from context and build footer navigation links
  const pages = usePagesContextSafe();
  const dynamicLinks = useFooterNavigation(pages);

  return (
    <div>
      <FooterContactInfo />
      <footer className="container lg:py-20 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {/* Section 1 - Brand */}
          <div className="lg:col-span-1 md:col-span-2">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <img
                src="/logo.png"
                alt="Logo"
                width={64}
                height={64}
                className="object-contain py-2"
              />
              <h1 className="text-2xl lg:text-[40px] font-semibold text-main font-anton-sc">
                Souq<span className="text-main-orange">4</span>U
              </h1>
            </div>

            <p className="text-base lg:text-lg font-normal leading-[150%] max-w-[340px] mx-auto lg:mx-0 mb-6">
              &quot;High-quality products that make your life better.&quot;
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-3">
              {socialIcons.map(({ Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity duration-200"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Section 2 - Explore */}
          <div>
            <h2 className="text-xl lg:text-[32px] font-semibold leading-[100%] mb-6">
              {t("Footer.explore")}
            </h2>
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-base lg:text-xl font-normal leading-[100%] hover:text-main transition-colors duration-200"
              >
                {t("Navigation.home")}
              </Link>
              <Link
                to="/products"
                className="text-base lg:text-xl font-normal leading-[100%] hover:text-main transition-colors duration-200"
              >
                {t("Navigation.products")}
              </Link>
              <Link
                to="/contact"
                className="text-base lg:text-xl font-normal leading-[100%] hover:text-main transition-colors duration-200"
              >
                {t("Contact.title")}
              </Link>
            </div>
          </div>

          {/* Section 3 - Dynamic Pages (from API) */}
          <div>
            <h2 className="text-xl lg:text-[32px] font-semibold leading-[100%] mb-6">
              {t("Footer.help")}
            </h2>
            <div className="flex flex-col gap-4">
              <Link
                to="/profile/account"
                className="text-base lg:text-xl font-normal leading-[100%] hover:text-main transition-colors duration-200"
              >
                {t("Footer.myAccount")}
              </Link>
              {dynamicLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-base lg:text-xl font-normal leading-[100%] hover:text-main transition-colors duration-200"
                >
                  {locale === "ar" ? link.titleAr : link.titleEn}
                </Link>
              ))}
            </div>
          </div>

          {/* Section 4 - Newsletter */}
          <div>
            <h2 className="text-xl lg:text-[32px] font-semibold leading-[100%] mb-6">
              {t("Footer.subscribe")}
            </h2>
            <div className="flex flex-col gap-4 max-w-[323px] mx-auto lg:mx-0">
              <p className="text-sm text-gray-500">Coming soon...</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
