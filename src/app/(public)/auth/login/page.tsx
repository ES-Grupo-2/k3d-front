"use client";

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoginForm } from "@/components/auth";
import { useAuthStore } from "@/store/auth/index";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const { hasHydrated, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (isAuthenticated()) {
      router.push("/");
    }
  }, [hasHydrated, isAuthenticated, router]);

  const handleLoginSuccess = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col sm:grid sm:grid-cols-12 sm:h-screen sm:overflow-hidden bg-background">

      <div className="flex min-h-screen sm:min-h-full items-center justify-center px-4 py-8 sm:px-6 lg:px-8 sm:col-span-7">
       
        <div className="w-full max-w-2xl flex flex-col items-center">
          <LoginForm onSuccess={handleLoginSuccess} />
        </div>
      </div>

      <div className="bg-secondary hidden sm:flex items-center justify-center p-8 sm:col-span-5">
        <div className="w-full max-w-[240px] sm:max-w-[320px]">
          <Image
            src="/images/logos/k3d-dark-logo.png"
            alt="K3D Logo"
            width={320}
            height={120}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>

    </div>
  );
}