import { DashboardClient } from "@/components/auth/DashboardClient";
import { requireAuth } from "@/services/auth/session";

export default async function DashboardPage() {
  const { user } = await requireAuth();

  return <DashboardClient user={user} />;
}
