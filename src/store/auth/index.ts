"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  AuthStatus,
  ClientAuthSession,
  AuthUser,
  UserRole,
} from "@/schemas/auth";

interface AuthStore {
  user: AuthUser | null;
  status: AuthStatus;
  isLoading: boolean;
  hasHydrated: boolean;
  error: string | null;

  login: (session: ClientAuthSession) => void;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  setError: (error: string | null) => void;
  isAuthenticated: () => boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  isManager: () => boolean;
  reset: () => void;
}

const initialState = {
  user: null,
  status: "unauthenticated" as AuthStatus,
  isLoading: false,
  hasHydrated: false,
  error: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      login: (session) =>
        set({
          user: session.user,
          status: "authenticated",
          error: null,
        }),

      logout: () =>
        set((state) => ({
          ...initialState,
          hasHydrated: state.hasHydrated,
        })),

      setUser: (user) =>
        set({
          user,
          status: user ? "authenticated" : "unauthenticated",
        }),

      setLoading: (isLoading) => set({ isLoading }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setError: (error) => set({ error }),

      isAuthenticated: () => get().status === "authenticated" && !!get().user,

      hasRole: (roles) => {
        const allowedRoles = Array.isArray(roles) ? roles : [roles];
        const role = get().user?.role;

        return !!role && allowedRoles.includes(role);
      },

      isManager: () => get().hasRole("GERENTE"),

      reset: () =>
        set((state) => ({
          ...initialState,
          hasHydrated: state.hasHydrated,
        })),
    }),
    {
      name: "k3d-auth",
      skipHydration: true,
      partialize: (state) => ({
        user: state.user,
        status: state.status,
      }),
    },
  ),
);
