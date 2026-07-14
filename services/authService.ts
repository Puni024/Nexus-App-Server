import crypto from "crypto";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";

import { User } from "../models";
import { generateToken } from "../utils/jwt";

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
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (googleToken: string) => {
  const ticket = await client.verifyIdToken({
    idToken: googleToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new Error("Invalid Google Token");
  }

  return payload;
};

export const registerUser = async (
  data: RegisterUserInput
): Promise<UserRecord> => {
  const existingUser = await User.findOne({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  let hashedPassword: string | null = null;

  if (data.password) {
    hashedPassword = await bcrypt.hash(data.password, 10);
  }

  const user = (await User.create({
    id: crypto.randomUUID(),
    name: data.name,
    email: data.email,
    password: hashedPassword,
    signedwith: data.signedwith,
    info: data.info ?? {},
  })) as unknown as UserRecord;

  return user;
};

export const loginUser = async (
  email: string,
  password?: string | null
) => {
  const user = (await User.findOne({
    where: {
      email,
    },
  })) as UserRecord | null;

  if (!user) {
    throw new Error("User not found");
  }

  if (user.signedwith === "email") {
    if (!password) {
      throw new Error("Password is required");
    }

    if (!user.password) {
      throw new Error("Invalid account");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
  }

  const token = generateToken({
    id: user.id,
    name: user.name,
    isAdmin: user.isAdmin,
  });

  return {
    token,
  };
};

export const googleLoginOrSignup = async (
  googleToken: string
) => {
  const payload = await verifyGoogleToken(googleToken);

  if (!payload.email) {
    throw new Error("Google account email not found");
  }

  let user = (await User.findOne({
    where: {
      email: payload.email,
    },
  })) as UserRecord | null;

  if (!user) {
    user = await registerUser({
      name: payload.name || payload.email.split("@")[0],
      email: payload.email,
      password: null,
      signedwith: "google",
      info: {
        picture: payload.picture,
      },
    }) as UserRecord;
  }

  const token = generateToken({
    id: user.id,
    name: user.name,
    isAdmin: user.isAdmin,
  });

  return {
    token,
  };
};

export const getCurrentUser = async (
  userId: string
) => {
  const user = await User.findByPk(userId, {
    attributes: {
      exclude: ["password"],
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};