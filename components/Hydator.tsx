"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useStore";

export default function Hydrator({settings}:{
   settings:any
}) {

    const { setWebSettings } = useAuthStore();

   useEffect(() => {
      setWebSettings(settings);
   }, []);

   return null;
}