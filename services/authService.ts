import User from "../models/User";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import { generateToken } from "../utils/jwt";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export async function createUser(data: any) {

    return await User.create({
        id: crypto.randomUUID(),
        name: data.name,
        email: data.email,
        password: data.password ?? null,
        signedwith: data.signedwith,
        isActive: true,
        info: data.info ?? null
    });

}


export async function googleLoginOrSignup(payload: any) {

    let user = await User.findOne({
        where: {
            email: payload.email
        }
    });

    if (!user) {

        user = await createUser({
            name: payload.name,
            email: payload.email,
            password: null,
            signedwith: "google",
            isVerified: payload.email_verified,
            info: {
                picture: payload.picture,
                googleId: payload.sub
            }
        });

    }

    return user;
}


export const verifyGoogleToken = async (req:any, res:any) => {

    try {

        const ticket = await client.verifyIdToken({
            idToken: req.body.token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const user = await googleLoginOrSignup(payload);

        payload?.email_verified
        // Generate YOUR JWT
        const token = generateToken({
            userId: user.id | null,
            email: user.email
        });

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false
        });

        return res.json({
            success: true,
            user
        });

    } catch (err) {

        return res.status(401).json({
            message: "Invalid Google Token"
        });

    }

};