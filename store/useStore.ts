import { create } from "zustand";
import { persist } from "zustand/middleware";



export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  [key: string]: unknown;
};

export type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  setSellerDomain: (domain: string | null) => void;
  sellerDomain: string | null;
  webSettings: any | null;
  setWebSettings: (webSettings: any | null) => void;
  closeNewsletter: boolean;
  setCloseNewsletter: (closeNewsletter: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user: User | null) => set({ user, isAuthenticated: !!user }),
      setToken: (token: string | null) => set({ token }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      setSellerDomain: (domain: string | null) => set({ sellerDomain: domain }),
      sellerDomain: null,
      setWebSettings: (webSettings: any | null) => set({ webSettings }),
      webSettings: null,
      closeNewsletter: false,
      setCloseNewsletter: (closeNewsletter: boolean) => set({ closeNewsletter }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
