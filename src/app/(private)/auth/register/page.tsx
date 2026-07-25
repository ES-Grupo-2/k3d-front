/**
 * @author lukasnascimento1
 * @author jvs-neves
 */
import { RegisterPageClient } from "@/components/auth/RegisterPageClient";
import { requireRole } from "@/services/auth/session";
import Image from "next/image";

export default async function RegisterPage() {
  await requireRole("GERENTE");

  return (
    <div className="flex min-h-screen flex-col sm:grid sm:grid-cols-12 sm:h-screen sm:overflow-hidden bg-background">
      <div className="flex min-h-screen sm:min-h-full items-center justify-center px-4 sm:px-6 lg:px-8 sm:col-span-7">
        <div className="w-full max-w-2xl"> 
          <RegisterPageClient />
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