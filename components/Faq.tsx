"use client";

import { useAuthStore } from "@/store/useStore";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { projectThemes } from "@/theme/theme";
import { STORE_SURFACE_BG } from "@/config/storefront";

export default function Faq() {
  const { webSettings } = useAuthStore();

  const [faqs, setFaqs] = useState<any[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  

  const currentStyle =
    projectThemes[webSettings?.theme as keyof typeof projectThemes];

  useEffect(() => {
    if (webSettings?.faqs) {
      setFaqs(webSettings.faqs);
    }
  }, [webSettings]);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    faqs &&
    faqs.length > 0 && (
      <section className={`w-full ${STORE_SURFACE_BG} py-20 px-4`}>
        <div className="max-w-4xl mx-auto">
          {/* Top Section */}
          <div className="text-center mb-14">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-[0.2em] mb-3">
              FAQs
            </p>

            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 tracking-tight">
              Frequently asked questions
            </h2>

            <p className="text-gray-500 mt-5 text-sm md:text-base">
              Have questions? We’re here to help.
            </p>
          </div>

          {/* FAQ Container */}
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
            {faqs?.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <motion.div
                  key={index}
                  layout
                  transition={{
                    layout: {
                      duration: 0.35,
                      ease: [0.04, 0.62, 0.23, 0.98],
                    },
                  }}
                  className="border-b border-gray-100 last:border-none"
                >
                  {/* Question */}
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between gap-4 px-6 md:px-8 py-6 text-left hover:bg-gray-50/70 transition-colors"
                  >
                    <div>
                      <h3 className="text-[15px] md:text-base font-semibold text-gray-900">
                        {faq.question}
                      </h3>
                    </div>

                    {/* Animated Icon */}
                    <motion.div
                      animate={{
                        rotate: isOpen ? 45 : 0,
                      }}
                      transition={{
                        duration: 0.25,
                      }}
                      className="flex-shrink-0 w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer"
                    >
                      <FiPlus className="text-gray-700 text-sm" />
                    </motion.div>
                  </button>

                  {/* Animated Answer */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.35,
                          ease: [0.04, 0.62, 0.23, 0.98],
                        }}
                        className="overflow-hidden"
                      >
                        <motion.div
                          initial={{ y: -8 }}
                          animate={{ y: 0 }}
                          exit={{ y: -8 }}
                          transition={{
                            duration: 0.25,
                          }}
                          className="px-6 md:px-8 pb-6"
                        >
                          <p className="text-sm md:text-[15px] leading-7 text-gray-500 max-w-3xl">
                            {faq.answer}
                          </p>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 bg-white border border-gray-200 rounded-3xl p-10 text-center shadow-sm">
            {/* Avatars */}
            <div className="flex items-center justify-center -space-x-3 mb-5">
              <img
                src="https://i.pravatar.cc/100?img=12"
                alt="avatar"
                className="w-12 h-12 rounded-full border-2 border-white object-cover"
              />

              <img
                src="https://i.pravatar.cc/100?img=32"
                alt="avatar"
                className="w-12 h-12 rounded-full border-2 border-white object-cover"
              />

              <img
                src="https://i.pravatar.cc/100?img=45"
                alt="avatar"
                className="w-12 h-12 rounded-full border-2 border-white object-cover"
              />
            </div>

            <h3 className="text-lg font-semibold text-gray-900">
              Still have questions?
            </h3>

            <p className="text-gray-500 text-sm mt-2">
              Can’t find the answer you’re looking for? Please chat to our
              friendly team.
            </p>

            <button
              className={`mt-6 px-6 py-3 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors ${currentStyle.button}`}
            >
              Contact Support
            </button>
          </div>
        </div>
      </section>
    )
  );
}
