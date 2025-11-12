// import { Button } from "@/shared/components/ui/button";
// import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/components/ui/button";
import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface HeroSlideProps {
  slide: {
    id: number;
    name: string;
    title: string;
    description: string;
    text_button?: string;
    url?: string;
    en_image?: { url: string; responsive_urls?: string[] };
    ar_image?: { url: string; responsive_urls?: string[] };
  };
}

const HeroSlide: React.FC<HeroSlideProps> = ({ slide }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLang = i18n.language || "en";
  const isArabic = currentLang === "ar";

  const imageUrl = isArabic
    ? slide.ar_image?.url || slide.ar_image?.responsive_urls?.[0]
    : slide.en_image?.url || slide.en_image?.responsive_urls?.[0] ||
      slide.ar_image?.url || "/hero/hero-slide-image.png";

  const title = slide.title || slide.name || "";
  const titleParts = title.trim().split(/\s+/);
  const firstWord = titleParts[0] || "";
  const restOfTitle = titleParts.slice(1).join(" ");

  const description = slide.description || "";
  const buttonText = slide.text_button?.trim();
  const hasButton = buttonText && slide.url;
  const clickable = !hasButton && slide.url;

  const startX = useRef(0);
  const startY = useRef(0);
  const isSwiping = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    isSwiping.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const dx = Math.abs(e.touches[0].clientX - startX.current);
    const dy = Math.abs(e.touches[0].clientY - startY.current);
    if (dx > 10 || dy > 10) {
      isSwiping.current = true;
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping.current && clickable && slide.url) {
      redirect(slide.url);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isSwiping.current) return;
    if (clickable && slide.url) redirect(slide.url);
  };

  const redirect = (url: string) => {
    if (/^https?:\/\//i.test(url)) {
      window.open(url, "_self");
    } else {
      navigate(url);
    }
  };

  return (
    <div
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`bg-cover rounded-4xl bg-center bg-no-repeat text-white flex flex-col items-center justify-center w-full h-[202px] sm:h-[500px] px-4 py-12 sm:py-0 ${
        clickable ? "cursor-pointer" : ""
      } ${isArabic ? "rtl" : "ltr"}`}
      style={{ backgroundImage: `url(${imageUrl})` }}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="w-full flex flex-col items-center text-center max-w-[768px]">
        {title && (
          <h1 className="text-3xl sm:text-4xl md:text-[48px] font-bold leading-tight sm:leading-tight mb-4 sm:mb-6">
            <span className="text-main">{firstWord}</span>
            {restOfTitle && <span className="text-white"> {restOfTitle}</span>}
          </h1>
        )}

        {description && (
          <p className="text-sm sm:text-base md:text-lg font-medium sm:font-bold mb-6 sm:mb-10 px-4 sm:px-0 leading-relaxed">
            {description}
          </p>
        )}

        {hasButton && (
          <Link to={slide.url!}>
            <Button className="w-full sm:w-[429px] px-4 py-4 sm:py-6 font-bold text-base sm:text-lg">
              {buttonText}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default HeroSlide;
