"use client";

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth";
import Image from "next/image";

// Não redirecionar daqui com base no store: quem decide é o middleware, que lê o
// cookie de sessão. O store vive no localStorage e sobrevive ao fim do cookie, e
// um "autenticado" obsoleto empurrava para "/", que devolvia para cá por falta de
// cookie — a tela piscava nesse ciclo.
export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-dvh flex-col sm:grid sm:grid-cols-12 sm:h-screen sm:overflow-hidden bg-background">

      <div className="flex min-h-dvh sm:min-h-full items-center justify-center px-4 py-6 sm:px-6 lg:px-8 sm:col-span-7">

        <div className="w-full max-w-md flex flex-col items-center gap-8">
          {/* Logo exibida apenas no mobile — no desktop ela fica no painel lateral. */}
          <div className="w-40 sm:hidden">
            <Image
              src="/images/logos/k3d-dark-logo.png"
              alt="K3D Logo"
              width={320}
              height={120}
              className="w-full h-auto object-contain dark:hidden"
              priority
            />
            <Image
              src="/images/logos/k3d-light-logo.png"
              alt="K3D Logo"
              width={320}
              height={120}
              className="w-full h-auto object-contain hidden dark:block"
              priority
            />
          </div>

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