"use server";

import { cookies } from "next/headers";

import {
  loginSchema,
  registerSchema,
  type ActionResult,
  type AuthSession,
  type AuthUser,
} from "@/schemas/auth";
import {
  loginRequest,
  refreshTokenRequest,
  registerRequest,
} from "@/services/auth";
import {
  AUTH_COOKIE_NAME,
  AUTH_USER_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
} from "@/services/auth/config";
import { getSession, requireRole } from "@/services/auth/session";

const ACCESS_TOKEN_MAX_AGE = 60 * 60;
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

function getActionError(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Nao foi possivel concluir a solicitacao.";
}

async function persistAuthCookies(session: AuthSession) {
  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };

  cookieStore.set(AUTH_COOKIE_NAME, session.accessToken, {
    ...cookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  cookieStore.set(AUTH_USER_COOKIE_NAME, JSON.stringify(session.user), {
    ...cookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  if (session.refreshToken) {
    cookieStore.set(REFRESH_COOKIE_NAME, session.refreshToken, {
      ...cookieOptions,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
  }
}

export async function loginAction(
  input: unknown,
): Promise<ActionResult<{ user: AuthUser }>> {
  const validation = loginSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      error: "Revise email e senha antes de continuar.",
    };
  }

  try {
    const session = await loginRequest(validation.data);
    await persistAuthCookies(session);

    return {
      success: true,
      data: { user: session.user },
    };
  } catch (error) {
    return {
      success: false,
      error: getActionError(error),
    };
  }
}

export async function registerAction(
  input: unknown,
): Promise<ActionResult<{ message: string }>> {
  const validation = registerSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      error: "Revise os dados do cadastro antes de continuar.",
    };
  }

  try {
    const { token } = await requireRole("GERENTE");

    const result = await registerRequest(validation.data, token);

    return {
      success: true,
      data: result,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      error: getActionError(error),
    };
  }
}

export async function refreshTokenAction(): Promise<
  ActionResult<{ accessToken: string; refreshToken?: string }>
> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;

    if (!refreshToken) {
      return {
        success: false,
        error: "Refresh token indisponivel.",
      };
    }

    const tokens = await refreshTokenRequest(refreshToken);

    cookieStore.set(AUTH_COOKIE_NAME, tokens.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    if (tokens.refreshToken) {
      cookieStore.set(REFRESH_COOKIE_NAME, tokens.refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: REFRESH_TOKEN_MAX_AGE,
      });
    }

    return {
      success: true,
      data: tokens,
    };
  } catch (error) {
    return {
      success: false,
      error: getActionError(error),
    };
  }
}

export async function logoutAction(): Promise<ActionResult> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  cookieStore.delete(AUTH_USER_COOKIE_NAME);
  cookieStore.delete(REFRESH_COOKIE_NAME);

  return {
    success: true,
    data: undefined,
  };
}

export async function getSessionAction() {
  const session = await getSession();

  return session
    ? {
        success: true as const,
        data: {
          user: session.user,
        },
      }
    : {
        success: false as const,
        error: "Sessao indisponivel.",
      };
}
