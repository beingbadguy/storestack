import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BiSearch } from "react-icons/bi";

const SearchHeroSection = ({ settings }: { settings: any }) => {
  const [title, setTitle] = useState<string>(
    "Discover Products That Match Your Lifestyle",
  );
  const [description, setDescription] = useState<string>(
    "Shop premium fashion, electronics, and essentials curated for modern living.",
  );

  useEffect(() => {
    if (settings?.isBannerEnabled) {
      setTitle(settings?.bannerTitle || title);
      setDescription(settings?.bannerDescription || description);
    }
  }, [settings]);

  return (
    <div className="w-full h-[500px] md:h-[700px] bg-gray-100 flex flex-col items-center justify-center text-center px-4">
      <div className="flex flex-wrap justify-center gap-1 md:gap-2">
        {title.split(" ").map((word, index) => (
          <motion.span
            key={index}
            className={`mx-1 text-2xl md:text-4xl font-bold tracking-tight text-gray-800 ${
              index === title.split(" ").length - 1
                ? " bg-primary px-3 py-1 text-primary-text"
                : ""
            }`}
            initial={{
              opacity: 0,
              filter: "blur(12px)",
            }}
            animate={{
              opacity: 1,
              filter: "blur(0px)",
            }}
            transition={{
              duration: 0.8,
              delay: index * 0.15,
              ease: "easeOut",
            }}
          >
            {word}
          </motion.span>
        ))}
      </div>
      <p className="mt-4 text-gray-400">{description}</p>
      <div className="flex items-center justify-center mt-6 w-full border border-primary rounded-2xl  px-4 bg-white max-w-md">
        <BiSearch className="size-6 text-primary" />
        <input
          className="w-full ml-2 outline-none text-gray-700 py-3 md:py-4"
          placeholder="Search Anything..."
        />
      </div>
    </div>
  );
};

export default SearchHeroSection;
