import { CalculatorClient } from "@/components/calculator";
import { requireRole } from "@/services/auth/session";

export default async function CalculadoraPage() {
  await requireRole("GERENTE");

  return <CalculatorClient />;
}

