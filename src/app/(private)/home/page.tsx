/**
 * @author lukasnascimento1
 * @author jvs-neves
 */
import { HomeView } from "@/components/home/HomeView";
import { requireAuth } from "@/services/auth/session";

export default async function HomePage() {
  const { user } = await requireAuth();

  return <HomeView user={user} />;
}
