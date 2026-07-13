import { OAuth2Client } from "google-auth-library";
// import {createUser} from "./userController

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);



export const verifyGoogleToken = async (req: any, res: any,) => {

    console.log("aaaaaaaaa",req);
    
    try {
        console.log("sssssss",req);
        
        if (!req.body.token) {
            return res.status(400).json({ error: "Token is required" });
        }

        const ticket = await client.verifyIdToken({
            idToken: req.body.token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        console.log("Google token verified successfully:", payload);

        return res.json({ success: true, payload });

    } catch (error) {
        console.error("❌ Error verifying Google token:", error);
        return res.status(401).json({ error: "Invalid Google token" });
    }
}