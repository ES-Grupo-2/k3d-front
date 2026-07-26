"use client";

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

import { useEffect } from "react";
import type { ReactNode } from "react";

import { getSessionAction } from "@/actions/auth";
import { useAuthStore } from "@/store/auth/index";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  useEffect(() => {
    async function hydrateAuth() {
      await useAuthStore.persist.rehydrate();

      const session = await getSessionAction();
      const { setHasHydrated, setUser } = useAuthStore.getState();

      if (session.success) {
        setUser(session.data.user);
      } else {
        setUser(null);
      }

      setHasHydrated(true);
    }

    void hydrateAuth();
  }, []);

  return <>{children}</>;
}
