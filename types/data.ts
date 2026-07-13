type signedwith_type = "google" | "email";

export interface User {
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