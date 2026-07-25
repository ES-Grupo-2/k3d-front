/**
 * @author lukasnascimento1
 * @author jvs-neves
 */
import { AppShell } from "@/components/navigation";
import { requireAuth } from "@/services/auth/session";

export default async function PrivateGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireAuth();

  return <AppShell user={user}>{children}</AppShell>;
}
