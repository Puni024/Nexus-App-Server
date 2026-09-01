import { JwtPayload } from "../types/data";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!; // add to .env — different random value from JWT_SECRET

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

export interface RefreshPayload {
    id: string;
    tokenType: "refresh";
}

export function generateAccessToken(payload: JwtPayload) {
    return jwt.sign({ ...payload, tokenType: "access" }, ACCESS_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
    });
}

export function generateRefreshToken(id: string) {
    const payload: RefreshPayload = { id, tokenType: "refresh" };
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

export function verifyAccessToken(token: string): JwtPayload {
    const decoded = jwt.verify(token, ACCESS_SECRET) as JwtPayload & { tokenType?: string };
    if (decoded.tokenType !== "access") {
        throw new Error("Not an access token");
    }
    return decoded;
}

export function verifyRefreshToken(token: string): RefreshPayload {
    const decoded = jwt.verify(token, REFRESH_SECRET) as RefreshPayload;
    if (decoded.tokenType !== "refresh") {
        throw new Error("Not a refresh token");
    }
    return decoded;
}

// Aliases kept so any existing imports elsewhere don't break.
export const generateToken = generateAccessToken;
export const verifyToken = verifyAccessToken;