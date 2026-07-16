import { Request } from "express";


type signedwith_type = "google" | "email";

export interface JwtPayload {
  id: string;
  name: string;
  isAdmin: boolean;
}

export interface UserType {
    id?: string;
    name: string;
    email: string;
    password?: string,
    isAdmin: boolean,
    info?: JSON,
    signedwith: signedwith_type,
    isVerified?: boolean,
    isActive?: boolean,
}
export interface AuthRequest extends Request {
  user?: JwtPayload;
}
