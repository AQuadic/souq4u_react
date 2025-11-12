import { Button } from "@/shared/components/ui/button";
import React, { useRef } from "react";
import { Link } from "react-router-dom";
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
  const currentLang = i18n.language || "en";
  const isArabic = currentLang === "ar";

  const imageUrl = isArabic
    ? slide.ar_image?.url || slide.ar_image?.responsive_urls?.[0]
    : slide.en_image?.url ||
      slide.en_image?.responsive_urls?.[0] ||
      slide.ar_image?.url ||
      "/hero/hero-slide-image.png";

  const title = slide.title || slide.name || "";
  const titleParts = title.trim().split(/\s+/);
  const firstWord = titleParts[0] || "";
  const restOfTitle = titleParts.slice(1).join(" ");

  const description = slide.description || "";
  const buttonText = slide.text_button?.trim();
  const hasButton = buttonText && slide.url;
  const clickable = !hasButton && slide.url;

  const pointerActive = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const shouldIgnoreClick = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerActive.current = true;
    shouldIgnoreClick.current = false;
    startX.current = e.clientX;
    startY.current = e.clientY;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointerActive.current) return;
    const dx = Math.abs(e.clientX - startX.current);
    const dy = Math.abs(e.clientY - startY.current);
    if (dx > 10 || dy > 10) {
      shouldIgnoreClick.current = true;
    }
  };

  const handlePointerUp = () => {
    pointerActive.current = false;
  };

  const handlePointerCancel = () => {
    pointerActive.current = false;
    shouldIgnoreClick.current = true;
  };

  const handleClick = (e: React.MouseEvent) => {
    if (shouldIgnoreClick.current) {
      e.preventDefault();
      e.stopPropagation();
      shouldIgnoreClick.current = false;
    }
  };

  const baseClassName = `relative overflow-hidden bg-cover rounded-4xl bg-center bg-no-repeat text-white flex flex-col items-center justify-center w-full h-[202px] sm:h-[500px] px-4 py-12 sm:py-0 ${
    clickable ? "cursor-pointer" : ""
  } ${isArabic ? "rtl" : "ltr"}`;

  const slideContent = (
    <>
      {hasButton && (
        <div
          className="absolute inset-0 bg-black/60 pointer-events-none"
          aria-hidden="true"
        />
      )}
      <div className="relative z-10 w-full flex flex-col items-center text-center max-w-[768px]">
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
    </>
  );

  if (clickable && slide.url) {
    return (
      <a
        href={slide.url}
        target="_blank"
        rel="noopener noreferrer"
        draggable={false}
        onDragStart={(e: React.DragEvent) => e.preventDefault()}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className={`${baseClassName} select-none`}
        style={{ backgroundImage: `url(${imageUrl})`, userSelect: "none" }}
        dir={isArabic ? "rtl" : "ltr"}
      >
        {slideContent}
      </a>
    );
  }

  return (
    <div
      onDragStart={(e: React.DragEvent) => e.preventDefault()}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      className={`${baseClassName} select-none`}
      draggable={false}
      style={{ backgroundImage: `url(${imageUrl})`, userSelect: "none" }}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {slideContent}
    </div>
  );
};

export default HeroSlide;
