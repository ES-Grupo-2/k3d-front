import { redirect } from "next/navigation";

import { getSession } from "@/services/auth/session";

export default async function Home() {
  const session = await getSession();

  redirect(session ? "/home" : "/auth/login");
}
