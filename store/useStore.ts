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
    }),
    {
      name: "auth-storage",
    },
  ),
);
