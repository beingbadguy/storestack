"use client";

import { useState, useEffect } from "react";
import { axiosClient } from "@/config/axiosClient";
import { useAuthStore } from "@/store/useStore";

interface CookieConsentProps {
  settings: any;
}

export default function CookieConsent({ settings }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!settings?.enableCookieConsent) return;
    
    // Check local storage first
    const hasConsentedLocally = localStorage.getItem("cookieConsent") === "true";
    
    if (!hasConsentedLocally) {
      setIsVisible(true);
    }
  }, [settings]);

  const handleAccept = async () => {
    setIsVisible(false);
    localStorage.setItem("cookieConsent", "true");

    if (user?.userId) {
      try {
        await axiosClient.post("/api/user/cookie-consent", {
          userId: user.userId,
          hasAcceptedCookies: true
        });
      } catch (error) {
        console.error("Failed to update user cookie consent", error);
      }
    }
  };

  if (!isVisible) return null;

  const isCenter = settings?.cookiePosition === "center" || settings?.cookiePosition === "middle";

  return (
    <>
      {isCenter && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[99]" />
      )}
      <div 
        className={`fixed z-[100] bg-white font-sans ${
          isCenter 
            ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md rounded-2xl p-6 shadow-2xl border border-gray-100 flex flex-col items-center text-center gap-6" 
            : `${settings?.cookiePosition === "top" ? "top-0 border-b" : "bottom-0 border-t"} left-0 w-full p-4 shadow-lg border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4`
        }`}
      >
        <p className={`text-sm text-gray-600 ${isCenter ? "" : "flex-1 max-w-5xl"}`}>
          {settings?.cookieText || "We use cookies to improve your experience, analyze site traffic, and support personalized advertising. By continuing to browse, you consent to the use of essential, analytics, and marketing cookies in accordance with our Privacy Policy."}
        </p>
        <div className={`flex gap-3 ${isCenter ? "w-full" : ""}`}>
          <button 
            onClick={handleAccept}
            className={`bg-primary hover:bg-primary-hover text-primary-text font-medium py-2.5 px-8 rounded-lg text-sm transition-colors whitespace-nowrap shadow-sm ${isCenter ? "w-full" : ""}`}
          >
            Accept
          </button>
        </div>
      </div>
    </>
  );
}
