import { HomeView } from "@/components/home/HomeView";
import { requireAuth } from "@/services/auth/session";

export default async function InicioPage() {
  const { user } = await requireAuth();

  return <HomeView user={user} />;
}
