import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";

const AutoSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1506765515384-028b60a970df?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFubmVyfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1738626068354-bfede24d8c9c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGJhbm5lcnxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJhbm5lcnxlbnwwfHwwfHx8MA%3D%3D",
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1,
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);
  return (
    <div className="w-full h-[750px] relative overflow-hidden">
      <div
        className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 cursor-pointer text-white bg-primary hover:bg-primary/80 transition duration-300 rounded"
        onClick={() =>
          setCurrentIndex(
            currentIndex === images.length - 1 ? 0 : currentIndex + 1,
          )
        }
      >
        <MdOutlineKeyboardArrowRight className="text-4xl" />
      </div>
      <div
        className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 cursor-pointer text-white bg-primary hover:bg-primary/80 transition duration-300 rounded"
        onClick={() =>
          setCurrentIndex(
            currentIndex === 0 ? images.length - 1 : currentIndex - 1,
          )
        }
      >
        <MdOutlineKeyboardArrowLeft className="text-4xl" />
      </div>
      {images.map((image, index) => (
        <motion.img
          key={index}
          src={image}
          alt={`Image ${index}`}
          className="w-full h-[700px] object-cover absolute top-0 left-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: index === currentIndex ? 1 : 0 }}
          transition={{ duration: 1 }}
        />
      ))}
    </div>
  );
};

export default AutoSlider;
