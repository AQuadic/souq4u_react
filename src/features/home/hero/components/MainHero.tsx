"use client";

import React from "react";
import Slider from "react-slick";
import HeroSlide from "./HeroSlide";
import { useQuery } from "@tanstack/react-query";
import { getSlider } from "../api/getSlider";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../style/hero-slider.css";

const MainHero = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["slider"],
    queryFn: () => getSlider(),
  });

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
    appendDots: (dots: React.ReactNode) => (
      <div style={{ bottom: "-25px" }}>
        <ul className="custom-dots">{dots}</ul>
      </div>
    ),
    customPaging: (i: number) => <div className="dot" />,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] sm:h-[500px]">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (isError || !data?.data?.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px] sm:h-[500px]">
        <p className="text-gray-500">No slides found.</p>
      </div>
    );
  }

  return (
    <main className="container py-6">
      <Slider {...settings}>
        {data.data.map((slide) => (
          <HeroSlide key={slide.id} slide={slide} />
        ))}
      </Slider>
    </main>
  );
};

export default MainHero;
