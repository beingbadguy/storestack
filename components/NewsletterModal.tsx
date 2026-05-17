"use client";

export type NewsletterTheme =
    | "teal-white"
    | "black-white"
    | "yellow-white"
    | "indigo-slate"
    | "rose-stone"
    | "emerald-gray";

export const newsletterThemes = {
    "teal-white": {
        gradient:
            "from-teal-400 via-teal-300 to-teal-100",

        button:
            "bg-teal-500 hover:bg-teal-600",

        focus:
            "focus:border-teal-400",
    },

    "black-white": {
        gradient:
            "from-zinc-700 via-zinc-600 to-zinc-300",

        button:
            "bg-black hover:bg-zinc-800",

        focus:
            "focus:border-black",
    },

    "yellow-white": {
        gradient:
            "from-yellow-400 via-yellow-300 to-yellow-100",

        button:
            "bg-yellow-500 hover:bg-yellow-600",

        focus:
            "focus:border-yellow-400",
    },

    "indigo-slate": {
        gradient:
            "from-indigo-500 via-indigo-400 to-slate-200",

        button:
            "bg-indigo-600 hover:bg-indigo-700",

        focus:
            "focus:border-indigo-500",
    },

    "rose-stone": {
        gradient:
            "from-rose-400 via-rose-300 to-stone-100",

        button:
            "bg-rose-500 hover:bg-rose-600",

        focus:
            "focus:border-rose-400",
    },

    "emerald-gray": {
        gradient:
            "from-emerald-400 via-emerald-300 to-gray-100",

        button:
            "bg-emerald-500 hover:bg-emerald-600",

        focus:
            "focus:border-emerald-400",
    },
} as const;


import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useStore";
// components/newsletter/NewsletterPreview.tsx



import { BiX } from "react-icons/bi";



interface NewsletterPreviewProps {
    theme: NewsletterTheme;

    title?: string;

    text?: string;
}

export default function NewsletterPreview({
    theme,
    title,
    text,
}: NewsletterPreviewProps) {
    const [mounted, setMounted] = useState(false);
    const { closeNewsletter, setCloseNewsletter } = useAuthStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    const currentTheme = newsletterThemes[theme];

    if (!mounted || closeNewsletter) {
        return null;
    }

    return (
        <div className=" absolute  inset-0  bg-black/50 z-100  flex items-center justify-center p-4">

            <div className="relative w-full max-w-lg overflow-hidden rounded-[32px] bg-white shadow-2xl">

                {/* Close Button */}
                <button
                    className="absolute right-5 top-5 z-20 rounded-full bg-white/90 p-2 text-gray-500 transition hover:bg-gray-100 cursor-pointer"
                    onClick={() => setCloseNewsletter(true)}
                >
                    <BiX size={20}  />
                </button>

                {/* Top Background */}
                <div
                    className={`relative h-[280px] overflow-hidden bg-gradient-to-b ${currentTheme.gradient}`}
                >

                    {/* Curved Lines */}
                    <div className="absolute inset-0 opacity-30">

                        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full border border-white/60"></div>

                        <div className="absolute left-1/2 top-8 h-[450px] w-[450px] -translate-x-1/2 rounded-full border border-white/50"></div>

                        <div className="absolute left-1/2 top-16 h-[400px] w-[400px] -translate-x-1/2 rounded-full border border-white/40"></div>

                    </div>

                    {/* Envelope */}
                    <div className="absolute bottom-[-30px] left-1/2 flex -translate-x-1/2 justify-center">

                        <div className="relative h-[180px] w-[240px]">

                            {/* Letter */}
                            <div className="absolute left-1/2 top-0 h-[110px] w-[170px] -translate-x-1/2 rounded-md bg-gray-100 shadow-md">

                                <div className="mt-5 space-y-2 px-4">

                                    <div className="h-2 rounded bg-gray-300"></div>

                                    <div className="h-2 rounded bg-gray-200"></div>

                                    <div className="h-2 w-3/4 rounded bg-gray-200"></div>

                                </div>

                            </div>

                            {/* Envelope Body */}
                            <div className="absolute bottom-0 h-[140px] w-full rounded-b-2xl bg-white shadow-xl"></div>

                            {/* Left Fold */}
                            <div className="absolute bottom-0 left-0 h-0 w-0 border-b-[70px] border-l-[120px] border-b-gray-100 border-l-transparent"></div>

                            {/* Right Fold */}
                            <div className="absolute bottom-0 right-0 h-0 w-0 border-b-[70px] border-r-[120px] border-b-gray-100 border-r-transparent"></div>

                            {/* Top Fold */}
                            <div className="absolute top-[40px] h-0 w-0 border-l-[120px] border-r-[120px] border-t-[80px] border-l-transparent border-r-transparent border-t-white"></div>

                        </div>

                    </div>

                </div>

                {/* Content */}
                <div className="px-8 pb-10 pt-20 text-center">

                    <h2 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                        {title ||
                            "Sign Up For Our Newsletter"}
                    </h2>

                    <p className="mt-5 text-lg leading-relaxed text-gray-500">
                        {text ||
                            "Receive new articles delivered straight to your inbox."}
                    </p>

                    {/* Input */}
                    <div className="mt-8">

                        <input
                            type="email"
                            placeholder="Your Email"
                            className={`h-14 w-full rounded-2xl border border-gray-200 px-5 text-base outline-none transition ${currentTheme.focus}`}
                        />

                    </div>

                    {/* Button */}
                    <button
                        className={`mt-5 h-14 w-full rounded-2xl text-lg font-medium text-white shadow-lg transition ${currentTheme.button}`}
                    >
                        Sign up
                    </button>

                    {/* Footer */}
                    <p className="mt-6 text-sm text-gray-400">
                        Don’t worry, we won’t send you spam
                        or sell your data.
                    </p>

                </div>

            </div>

        </div>
    );
}