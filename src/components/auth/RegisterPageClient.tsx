"use client";

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

import { useRouter } from "next/navigation";

import { RegisterForm } from "@/components/auth/RegisterForm";

export function RegisterPageClient() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <RegisterForm onSuccess={() => router.push("/home")} />
    </div>
  );
}
