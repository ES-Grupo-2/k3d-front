"use client";

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
    <div className="grid min-h-screen grid-cols-2">
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
      <div className="bg-secondary flex items-center justify-center">
        <Image
          src="/images/logos/k3d-dark-logo.png"
          alt="K3D Logo"
          width={320}
          height={120}
          priority
        />
      </div>
    </div>
  );
}
