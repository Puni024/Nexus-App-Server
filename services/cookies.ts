export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 1000*60*60*5, // 5 hours
    // maxAge: 1000 * 60 * 60, // 1 hour
};