"use client";

import { useAuthStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user } = useAuthStore();

  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/home");
    } else {
      router.replace("/login");
    }
  }, [user, router]);

  return null;
}
