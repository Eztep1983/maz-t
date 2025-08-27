// components/Carousel.js
import { motion } from 'framer-motion';
import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const Carousel = () => {

  const IMAGES = [
    "/images/Toners_consecutivo.png",
    "/images/Toners1.jpeg",
    "/images/Toners2.jpeg",
    "/images/Toners3.jpeg",
    "/images/Toners4.jpeg"

  ];
  
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2800,
    arrows: true,
  };
  return (
    <Slider {...settings}>
    {IMAGES.map((image, index) => (
      <div key={`carousel-image-${index}`} className="focus-visible:outline-none">
        <div className="relative h-[230px] w-full">
          <Image 
            src={image} 
            alt={`Instalaciones de Tmaz Quality Toner ${index + 1}`} 
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>
      </div>
    ))}
  </Slider>
  );
};

export default Carousel;