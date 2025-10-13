"use client";

import React from "react";
import Slider from "react-slick";
import HeroSlide from "./HeroSlide";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../style/hero-slider.css";
const MainHero = () => {
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
        <ul className="custom-dots"> {dots} </ul>
      </div>
    ),
    customPaging: (i: number) => <div className="dot" />,
  };

  return (
    <main className="container py-6">
      <Slider {...settings}>
        <HeroSlide />
        <HeroSlide />
        <HeroSlide />
        <HeroSlide />
      </Slider>
    </main>
  );
};

export default MainHero;
