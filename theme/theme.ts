export type ProjectTheme =
  | "teal-white"
  | "black-white"
  | "yellow-white"
  | "indigo-slate"
  | "rose-stone"
  | "emerald-gray";

export const projectThemes = {
  "teal-white": {
    gradient: "bg-gradient-to-b from-teal-900 via-teal-700 to-teal-600",

    background: "bg-teal-600",

    foreground: "text-white",

    mutedForeground: "text-teal-100",

    border: "border-teal-500",

    card: "bg-teal-500 border border-teal-400",

    button: "bg-teal-500 hover:bg-teal-600 text-white",

    secondaryButton: "bg-teal-700 hover:bg-teal-800 text-white",

    input: " focus:border-white focus:ring-2 focus:ring-teal-200",

    badge: "bg-black text-white",

    icon: "text-white",

    shadow: "shadow-black/30",

    navbar: "bg-teal-800 border-b border-teal-600",

    footer: "bg-teal-900 border-t border-teal-700",
  },

  "black-white": {
    gradient: "bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-700",

    background: "bg-zinc-800",

    foreground: "text-white",

    mutedForeground: "text-zinc-200",

    border: "border-zinc-600",

    card: "bg-zinc-700 border border-zinc-600",

    button: "bg-zinc-700 hover:bg-zinc-800 text-white",

    secondaryButton: "bg-zinc-800 hover:bg-zinc-900 text-white",

    input: "focus:border-white focus:ring-2 focus:ring-zinc-300",

    badge: "bg-white text-black",

    icon: "text-white",

    shadow: "shadow-black/40",

    navbar: "bg-zinc-900 border-b border-zinc-700",

    footer: "bg-zinc-950 border-t border-zinc-800",
  },

  "yellow-white": {
    gradient: "bg-gradient-to-b from-yellow-700 via-yellow-600 to-yellow-500",

    background: "bg-yellow-500",

    foreground: "text-black",

    mutedForeground: "text-yellow-100",

    border: "border-yellow-400",

    card: "bg-yellow-400 border border-yellow-300",

    button: "bg-yellow-500 hover:bg-yellow-600 text-white",

    secondaryButton: "bg-yellow-700 hover:bg-yellow-800 text-white",

    input: " focus:border-black focus:ring-2 focus:ring-yellow-100",

    badge: "bg-black text-white",

    icon: "text-black",

    shadow: "shadow-yellow-900/30",

    navbar: "bg-yellow-600 border-b border-yellow-500",

    footer: "bg-yellow-700 border-t border-yellow-600",
  },

  "indigo-slate": {
    gradient: "bg-gradient-to-b from-indigo-950 via-indigo-800 to-indigo-700",

    background: "bg-indigo-700",

    foreground: "text-white",

    mutedForeground: "text-indigo-100",

    border: "border-indigo-500",

    card: "bg-indigo-600 border border-indigo-500",

    button: "bg-indigo-600 hover:bg-indigo-700 text-white",

    secondaryButton: "bg-indigo-800 hover:bg-indigo-900 text-white",

    input: " focus:border-white focus:ring-2 focus:ring-indigo-200",

    badge: "bg-black text-white",

    icon: "text-white",

    shadow: "shadow-black/30",

    navbar: "bg-indigo-900 border-b border-indigo-700",

    footer: "bg-indigo-950 border-t border-indigo-800",
  },

  "rose-stone": {
    gradient: "bg-gradient-to-b from-rose-900 via-rose-700 to-rose-600",

    background: "bg-rose-600",

    foreground: "text-white",

    mutedForeground: "text-rose-100",

    border: "border-rose-500",

    card: "bg-rose-500 border border-rose-400",

    button: "bg-rose-500 hover:bg-rose-600 text-white",

    secondaryButton: "bg-rose-700 hover:bg-rose-800 text-white",

    input: "focus:border-white focus:ring-2 focus:ring-rose-200",

    badge: "bg-black text-white",

    icon: "text-white",

    shadow: "shadow-black/30",

    navbar: "bg-rose-800 border-b border-rose-600",

    footer: "bg-rose-900 border-t border-rose-700",
  },

  "emerald-gray": {
    gradient:
      "bg-gradient-to-b from-emerald-900 via-emerald-700 to-emerald-600",

    background: "bg-emerald-600",

    foreground: "text-white",

    mutedForeground: "text-emerald-100",

    border: "border-emerald-500",

    card: "bg-emerald-500 border border-emerald-400",

    button: "bg-emerald-500 hover:bg-emerald-600 text-white",

    secondaryButton: "bg-emerald-700 hover:bg-emerald-800 text-white",

    input: " focus:border-white focus:ring-2 focus:ring-emerald-200",

    badge: "bg-black text-white",

    icon: "text-white",

    shadow: "shadow-black/30",

    navbar: "bg-emerald-800 border-b border-emerald-600",

    footer: "bg-emerald-900 border-t border-emerald-700",
  },
} as const;
