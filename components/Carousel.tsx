// components/Carousel.js
import { motion } from 'framer-motion';
import React from 'react';
import Slider from 'react-slick';

const Carousel = () => {

  const IMAGES = [
    "/images/Instalaciones2.jpeg",
    "/images/Instalaciones1.jpeg",
    "/images/Toners_entrada.jpeg",
  ];
  
  const settings = {
    dots: true,
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
        <motion.div       whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          <img 
            src={image} 
            alt={`Image ${index + 1}`} 
            className="w-full h-[200px] object-cover"
          />
        </motion.div>
      ))}
    </Slider>
  );
};

export default Carousel;
