import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BiSearch, BiX } from "react-icons/bi";

const SearchHeroSection = ({ settings }: { settings: any }) => {
  const [title, setTitle] = useState<string>(
    "Discover Products That Match Your Lifestyle",
  );
  const [description, setDescription] = useState<string>(
    "Shop premium fashion, electronics, and essentials curated for modern living.",
  );
  const [search, setSearch] = useState<string>("");

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
      <div className="w-full max-w-xl mx-auto mt-8">
        <div className="group relative flex items-center overflow-hidden rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-xl shadow-sm transition-all duration-300 focus-within:border-primary focus-within:shadow-[0_0_25px_rgba(59,130,246,0.15)] hover:border-gray-300">
          {/* Left Icon */}
          <div className="pl-5">
            <BiSearch className="size-5 text-gray-400 transition-colors duration-300 group-focus-within:text-primary" />
          </div>

          {/* Input */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, categories, brands..."
            className="w-full bg-transparent px-4 py-4 text-sm md:text-base text-gray-700 placeholder:text-gray-400 outline-none"
          />

          {/* close button  */}

          {search && search.length > 0 && (
            <div
              className="flex items-center pr-4 cursor-pointer"
              onClick={() => setSearch("")}
            >
              <div className="text-2xl text-gray-400 transition-colors duration-300 group-focus-within:text-primary">
                <BiX />
              </div>
            </div>
          )}

          {/* Glow Effect */}
          <div className="absolute inset-0 -z-10 opacity-0 blur-2xl transition-opacity duration-300 group-focus-within:opacity-100 bg-primary/10" />
        </div>
      </div>
    </div>
  );
};

export default SearchHeroSection;
