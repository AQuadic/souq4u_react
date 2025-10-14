// import { Button } from "@/shared/components/ui/button";
// import { Link } from "@/i18n/navigation";
import React from "react";

interface HeroSlideProps {
  slide: {
    id: number;
    name: string;
    url: string;
    en_image?: { url: string; responsive_urls?: string[] };
    ar_image?: { url: string; responsive_urls?: string[] };
  };
}

const HeroSlide: React.FC<HeroSlideProps> = ({ slide }) => {
  const imageUrl =
    slide.en_image?.url ||
    slide.ar_image?.url ||
    slide.en_image?.responsive_urls?.[0] ||
    "/hero/hero-slide-image.png";

  return (
    <div
      className="bg-cover rounded-2xl bg-center bg-no-repeat text-white flex flex-col items-center justify-center w-full min-h-[400px] sm:h-[500px] px-4 py-12 sm:py-0"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="w-full flex flex-col items-center text-center max-w-[768px]">
        <h1 className="text-3xl sm:text-4xl md:text-[48px] font-bold leading-tight sm:leading-tight mb-4 sm:mb-6">
          <span className="text-main">{slide.name}</span>
        </h1>

        {/* <p className="text-sm sm:text-base md:text-lg font-medium sm:font-bold mb-6 sm:mb-10 px-4 sm:px-0 leading-relaxed">
          Shop easily and quickly with a wide range of high-quality products,
          delivered straight to your doorstep with just one click.
        </p>

        <Link href="/products">
          <Button className="w-full sm:w-[429px] px-4 py-4 sm:py-6  font-bold text-base sm:text-lg">
            Buy Now
          </Button>
        </Link> */}
      </div>
    </div>
  );
};

export default HeroSlide;
