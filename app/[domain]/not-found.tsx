"use client";

import { useAuthStore } from "@/store/useStore";
import { projectThemes } from "@/theme/theme";
import { useEffect } from "react";
import { FiAlertTriangle } from "react-icons/fi";

export default function NotFound() {
  const { webSettings } = useAuthStore();

  const theme =
    (webSettings?.theme as keyof typeof projectThemes) ?? "teal-white";

  const currentTheme = projectThemes[theme];

  useEffect(() => {
    console.log(webSettings);
  }, []);
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4 py-12">
      <div className="w-full max-w-2xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden bg-white border border-gray-100">
        {/* Header Section */}
        <div
          className={` ${currentTheme.background} p-8 flex flex-col items-center justify-center text-white`}
        >
          <div className="bg-white p-3.5 rounded-2xl mb-4 shadow-sm">
            <FiAlertTriangle className="text-orange-500 text-3xl" />
          </div>
          <h1 className="text-lg font-medium mb-1">Page Not Found</h1>
          <p className="text-orange-50 text-sm text-center">
            The page you're looking for doesn't exist
          </p>
        </div>

        {/* Body Section */}
        <div className="p-10 md:px-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">404</h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            We couldn't find the page you were looking for. This could happen
            for a few reasons:
          </p>

          {/* Bulleted List */}
          <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-6 mb-8">
            <ul className="space-y-3.5">
              {[
                "The page URL may have been typed incorrectly",
                "The page has been moved or deleted",
                "You don't have permission to access this page",
                "The page is no longer available",
              ].map((item, i) => (
                <li key={i} className="flex items-start text-slate-600 text-sm">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Section */}
          <h3 className="text-slate-800 font-semibold text-base mb-4">
            What can you do?
          </h3>
          <div className="space-y-3">
            <p className="text-slate-600 text-sm leading-relaxed">
              Return to the homepage or use the navigation above to explore our
              site. If you believe this is a mistake, please contact us for
              assistance.
            </p>
            <a
              href="/"
              className={`inline-block mt-4 px-6 py-3  text-white font-medium rounded-lg transition-colors ${currentTheme.button} `}
            >
              Go to Homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
