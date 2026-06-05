import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { AuthUser, UserRole } from "@/schemas/auth";
import {
  AUTH_COOKIE_NAME,
  AUTH_USER_COOKIE_NAME,
} from "@/services/auth/config";
import { decodeUserFromToken } from "@/services/auth";

export interface ServerAuthSession {
  token: string;
  user: AuthUser;
}

function readUserSnapshot(
  value?: string,
): Pick<AuthUser, "id" | "name"> | null {
  if (!value) return null;

  try {
    const user = JSON.parse(value) as Partial<AuthUser>;
    if (!user.id && !user.name) return null;
    return { id: user.id || "", name: user.name || "" };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<ServerAuthSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) return null;

  const tokenUser = decodeUserFromToken(token);

  if (!tokenUser) return null;

  const snapshot = readUserSnapshot(
    cookieStore.get(AUTH_USER_COOKIE_NAME)?.value,
  );

  return {
    token,
    user: {
      ...tokenUser,
      id: tokenUser.id || snapshot?.id || "",
      name: tokenUser.name || snapshot?.name || "",
    },
  };
}

export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return session;
}

export async function requireRole(role: UserRole) {
  const session = await requireAuth();

  if (session.user.role !== role) {
    redirect("/inicio");
  }

  return session;
}
