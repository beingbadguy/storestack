"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";

interface AutoSliderProps {
  settings: {
    sliderImages: string[];
  };
}

const AutoSlider = ({ settings }: AutoSliderProps) => {
  const images = settings?.sliderImages || [];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1,
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="relative h-[400px] w-full overflow-hidden md:h-[600px] lg:h-[750px]">
      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-md transition hover:bg-black/60"
      >
        <MdOutlineKeyboardArrowLeft className="text-3xl" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-md transition hover:bg-black/60"
      >
        <MdOutlineKeyboardArrowRight className="text-3xl" />
      </button>

      {/* Images */}
      {images.map((image, index) => (
        <motion.img
          key={index}
          src={image}
          alt={`Slide ${index}`}
          className="absolute left-0 top-0 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{
            opacity: index === currentIndex ? 1 : 0,
            scale: index === currentIndex ? 1 : 1.05,
          }}
          transition={{ duration: 0.8 }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === index ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AutoSlider;
