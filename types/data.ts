import { Request } from "express";


type signedwith_type = "google" | "email";

export interface JwtPayload {
  id: string;
  name: string;
  isAdmin: boolean;
  isVerified :boolean ;
}

export interface UpdateProfileBody {
    name?: string;
    Theme?: string;
    picture?: string;
    newPassword?: string;
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
    last_visited?: string,
}
export interface AuthRequest extends Request {
  user?: JwtPayload;
}
