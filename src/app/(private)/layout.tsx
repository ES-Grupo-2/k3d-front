import { requireAuth } from "@/services/auth/session";

export default async function PrivateGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return children;
}
