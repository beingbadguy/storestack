"use client";

import Image from "next/image";

import { useAuthStore } from "@/store/useStore";

import SearchHeroSection from "./SearchHeroSection";
import AutoSlider from "./AutoSlider";
import VideoHero from "./VideoHero";

const HeroSection = () => {
  const { webSettings: settings } = useAuthStore();
  console.log("Web Settings in HeroSection:", settings);

  // Banner disabled
  if (!settings?.isBannerEnabled) return null;

  const bannerComponents = {
    custom: <SearchHeroSection settings={settings} />,

    video: <VideoHero settings={settings} />,

    slider: <AutoSlider settings={settings} />,

    image: settings?.bannerImage ? (
      <section className="relative h-[300px] w-full overflow-hidden md:h-[500px] lg:h-[650px]">
        {/* Overlay */}
        <div className="absolute inset-0 z-10 bg-black/20" />

        {/* Banner Image */}
        <Image
          src={settings.bannerImage}
          alt="Hero Banner"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Optional Content */}
        {/* <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Discover Amazing Products
          </h1>

          <p className="mt-4 max-w-xl text-sm text-white/90 md:text-lg">
            Shop smarter with premium collections and modern experiences.
          </p>
        </div> */}
      </section>
    ) : null,
  };

  return (
    <>
      {bannerComponents[settings.bannerType as keyof typeof bannerComponents]}
    </>
  );
};

export default HeroSection;
