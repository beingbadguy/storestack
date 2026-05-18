"use client";

import { useAuthStore } from "@/store/useStore";
import Image from "next/image";
import { useEffect } from "react";

const HeroSection = () => {
  const { webSettings: settings } = useAuthStore();

  useEffect(() => {}, [settings]);

  return (
    <div>
      {/* <div className="flex-grow">
        <div className="flex flex-col items-center justify-center py-32 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {settings?.websiteTitle || "Experience Exceptional Shopping"}
          </h1>
          <p className="text-gray-500 max-w-2xl text-lg">
            {settings?.siteDescription ||
              "Browse premium products and make confident shopping decisions."}
          </p>
        </div>
      </div> */}

      {settings?.bannerType === "image" && settings.bannerImage && (
        <div className="relative w-full h-[400px]">
          <Image
            src={settings.bannerImage}
            alt="Banner"
            width={400}
            height={600}
            className="w-full h-[600px] object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default HeroSection;
