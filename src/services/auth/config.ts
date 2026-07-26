/**
 * @author lukasnascimento1
 * @author jvs-neves
 */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

export const AUTH_COOKIE_NAME = "k3d_access_token";
export const REFRESH_COOKIE_NAME = "k3d_refresh_token";
export const AUTH_USER_COOKIE_NAME = "k3d_user";
