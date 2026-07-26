/**
 * @author lukasnascimento1
 * @author jvs-neves
 */
import type {
  AuthSession,
  AuthTokens,
  AuthUser,
  LoginFormData,
  RegisterFormData,
  UserRole,
} from "@/schemas/auth";

import { authHttp } from "./http";

type ApiObject = Record<string, unknown>;

function asObject(value: unknown): ApiObject {
  return value && typeof value === "object" ? (value as ApiObject) : {};
}

function readString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function normalizeRole(value: unknown): UserRole {
  return readString(value)?.toUpperCase() === "GERENTE"
    ? "GERENTE"
    : "OPERACIONAL";
}

function normalizeUser(value: unknown): AuthUser {
  const user = asObject(value);

  return {
    id: readString(user.id) || readString(user._id) || "",
    name: readString(user.name) || readString(user.nome) || "",
    email: readString(user.email) || "",
    role: normalizeRole(user.role),
  };
}

function readJwtPayload(token: string) {
  const [, payload] = token.split(".");

  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as ApiObject | null;
  } catch {
    return null;
  }
}

export function decodeUserFromToken(token: string): AuthUser | null {
  const payload = readJwtPayload(token);

  if (!payload) {
    return null;
  }

  const payloadUser = asObject(payload.user);
  const userSource =
    Object.keys(payloadUser).length > 0 ? payloadUser : payload;
  const user = normalizeUser(userSource);

  if (!user.email && !user.id) {
    return null;
  }

  return user;
}

function normalizeSession(payload: unknown): AuthSession {
  const root = asObject(payload);
  const data = asObject(root.data || root);
  const accessToken =
    readString(data.accessToken) ||
    readString(data.token) ||
    readString(data.jwt) ||
    readString(root.accessToken) ||
    readString(root.token);
  const refreshToken =
    readString(data.refreshToken) || readString(root.refreshToken);

  if (!accessToken) {
    throw new Error("Resposta de login sem token JWT.");
  }

  const user = normalizeUser(data.user);
  const tokenUser = decodeUserFromToken(accessToken);

  return {
    user: user.email || user.id ? user : tokenUser || user,
    accessToken,
    refreshToken,
  };
}

function normalizeMessage(payload: unknown, fallback: string) {
  const root = asObject(payload);
  const data = asObject(root.data);

  return readString(root.message) || readString(data.message) || fallback;
}

export async function loginRequest(data: LoginFormData): Promise<AuthSession> {
  const payload = await authHttp<unknown>("/auth/login", {
    method: "POST",
    body: {
      email: data.email,
      password: data.password,
    },
  });

  return normalizeSession(payload);
}

export async function registerRequest(
  data: RegisterFormData,
  token: string,
): Promise<{ message: string }> {
  const payload = await authHttp<unknown>("/auth/register", {
    method: "POST",
    token,
    body: {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    },
  });

  return {
    message: normalizeMessage(payload, "Usuario criado com sucesso."),
  };
}

export async function refreshTokenRequest(
  refreshToken: string,
): Promise<AuthTokens> {
  const payload = await authHttp<unknown>("/auth/refresh", {
    method: "POST",
    body: { refreshToken },
  });
  const data = asObject(asObject(payload).data || payload);
  const accessToken = readString(data.accessToken) || readString(data.token);

  if (!accessToken) {
    throw new Error("Resposta de renovacao sem access token.");
  }

  return {
    accessToken,
    refreshToken: readString(data.refreshToken) || refreshToken,
  };
}
