const isProd = process.env.NODE_ENV === "production";


export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" as const : "lax" as const,
  maxAge: 2 * 60 * 60 * 1000,
};


export const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" as const : "lax" as const,
  maxAge: 2 * 24 * 60 * 60 * 1000,
  path: "/api/auth",
};