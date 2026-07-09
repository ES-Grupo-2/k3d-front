import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/services/auth/config";

const PUBLIC_ROUTES = ["/auth/login", "/auth/forgot-password"];

const PROTECTED_ROUTES = [
  "/auth/register",
  "/inicio",
  "/dashboard",
  "/kanban",
  "/pedidos",
  "/relatorios",
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (isPublicRoute) {
    if (request.cookies.has(AUTH_COOKIE_NAME)) {
      return NextResponse.redirect(new URL("/inicio", request.url));
    }

    return NextResponse.next();
  }

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute) {
    if (!request.cookies.has(AUTH_COOKIE_NAME)) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
