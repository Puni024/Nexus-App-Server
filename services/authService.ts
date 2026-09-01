import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";

import { User } from "../models";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";

interface RegisterUserInput {
  name: string;
  email: string;
  password: string | null;
  signedwith: "email" | "google";
  info?: any;
}

interface UserRecord {
  id: string;
  name: string;
  email: string;
  password?: string | null;
  signedwith: string;
  isAdmin: boolean;
  info?: any;
  isVerified: boolean;
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (googleToken: string) => {
  const ticket = await client.verifyIdToken({
    idToken: googleToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) throw new Error("Invalid Google Token");
  return payload;
};

export const registerUser = async (
  data: RegisterUserInput
): Promise<UserRecord> => {
  const existingUser = await User.findOne({ where: { email: data.email } });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const user = (await User.create({
    id: crypto.randomUUID(),
    name: data.name,
    email: data.email,
    password: data.password,
    signedwith: data.signedwith || "email",
    info: data.info || { picture: "", Theme: "light" },
  })) as unknown as UserRecord;

  return user;
};

// Single place both login paths and refresh go through. No DB write here —
// the refresh token is stateless (signature + expiry only, verified in
// refreshAccessToken below). That's the direct trade-off of not adding
// anything to the User model: there's nothing server-side to revoke, so a
// stolen refresh token stays valid until it naturally expires (7d).
function issueTokenPair(user: UserRecord) {
  const token = generateAccessToken({
    id: user.id,
    name: user.name,
    isAdmin: user.isAdmin,
    isVerified: user.isVerified,
  });

  const refreshToken = generateRefreshToken(user.id);

  return { token, refreshToken };
}

export const loginUser = async (
  email: string,
  password?: string | null
) => {
  const user = (await User.findOne({ where: { email } })) as UserRecord | null;

  if (!user) {
    throw new Error("User not found");
  }

  if (user.signedwith === "email") {
    if (!password || !user.password) {
      throw new Error("Password is required");
    }
    if (password !== user.password) {
      throw new Error("Invalid Credentials");
    }
  }

  return issueTokenPair(user);
};

export const googleLoginOrSignup = async (googleToken: string) => {
  const payload = await verifyGoogleToken(googleToken);

  if (!payload.email) {
    throw new Error("Google account email not found");
  }

  let user = (await User.findOne({ where: { email: payload.email } })) as UserRecord | null;

  if (!user) {
    user = (await registerUser({
      name: payload.name || payload.email.split("@")[0],
      email: payload.email,
      password: null,
      signedwith: "google",
      info: { picture: payload.picture, Theme: "light" },
    })) as UserRecord;
  }

  return issueTokenPair(user);
};

// Called by POST /api/auth/refresh. Purely stateless: verifies the refresh
// token's signature and expiry (utils/jwt.ts), then re-fetches the user so
// the new access token reflects their CURRENT isAdmin/isVerified/name —
// not whatever those were at original login time — and mints a fresh pair.
export const refreshAccessToken = async (refreshToken?: string) => {
  if (!refreshToken) {
    throw new Error("Refresh token required");
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new Error("Invalid or expired refresh token");
  }

  const user = (await User.findByPk(payload.id)) as UserRecord | null;

  if (!user) {
    throw new Error("User not found");
  }

  return issueTokenPair(user);
};