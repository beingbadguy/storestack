"use client";

import { useAuthStore } from "@/store/useStore";
import Image from "next/image";
import { useEffect } from "react";
import { useState } from "react";
import SearchHeroSection from "./SearchHeroSection";
import AutoSlider from "./AutoSlider";
import VideoHero from "./VideoHero";

const HeroSection = () => {
  const { webSettings: settings } = useAuthStore();

  useEffect(() => {}, [settings]);

  return (
    <div>
      {/* {settings?.bannerType === "image" && settings.bannerImage && (
        <div className="relative w-full h-full">
          <Image
            src={settings.bannerImage}
            alt="Banner"
            width={400}
            height={600}
            className="w-full h-full object-cover"
          />
        </div>
      )} */}

      <SearchHeroSection settings={settings} />
      {/* <AutoSlider /> */}
      {/* <VideoHero /> */}
    </div>
  );
};

export default HeroSection;
