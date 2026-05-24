import { RegisterPageClient } from "@/components/auth/RegisterPageClient";
import { requireRole } from "@/services/auth/session";
import Image from "next/image";

export default async function RegisterPage() {
  await requireRole("GERENTE");

  return (
    <div className="grid min-h-screen grid-cols-2">
      <RegisterPageClient />
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
