import { Request, Response } from "express";
import { AuthRequest } from "../types/data";
import { loginUser, registerUser } from "../services/authService";
import { COOKIE_OPTIONS } from "../services/cookies";

export const register = async (req: Request, res: Response) => {
    try {
        await registerUser(req.body);

        return res.status(201).json({
            success: true,
            message: "Registered successfully",
        });
    } catch (err: any) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { token } = await loginUser(
            req.body.email,
            req.body.password
        );


        res.cookie("token", token, COOKIE_OPTIONS);

        return res.status(200).json({
            success: true,
            message: "Login successful",
        });
    } catch (err: any) {
        return res.status(401).json({
            success: false,
            message: err.message,
        });
    }
};

export const logout = async (req: Request, res: Response) => {
    res.clearCookie("token");

    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};

export const verify = async (req: AuthRequest, res: Response) => {
    if (req.user) {
        return res.status(200).json({
            verification: true,
        });
    }
    else {
        return res.status(401).json({
            success: false,
            message: "User not authenticated",
        });
    }
}