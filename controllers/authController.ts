import { Request, Response } from "express";
import { AuthRequest, UserType, JwtPayload, UpdateProfileBody } from "../types/data";
import { loginUser, registerUser } from "../services/authService";
import { COOKIE_OPTIONS } from "../services/cookies";
import { User } from "../models";

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

        // Cast via unknown to satisfy TypeScript when using the ORM model return type
        const user = await User.findOne({ where: { email: req.body.email } }) as unknown as UserType | null;

        if (user?.signedwith === "google") {
            throw new Error("Invalid Credentials");
        }

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

    const { maxAge, ...clearCookieOptions } = COOKIE_OPTIONS;

    res.clearCookie("token", clearCookieOptions);

    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};

export const verifyController = async (req: AuthRequest, res: Response) => {
    try {
        const dbUser = await User.findByPk(req.user!.id, {
            attributes: ["name", "email", "isAdmin", "info", "isVerified"],
        });

        if (!dbUser) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        const plain = dbUser.get({ plain: true }) as {
            name: string;
            email: string;
            isAdmin: boolean;
            info: any;
            isVerified: boolean;
        };

        return res.status(200).json({
            success: true,
            user: {
                name: plain.name,
                email: plain.email,
                role: plain.isAdmin ? "admin" : "user",
                info: plain.info,
                isVerified: plain.isVerified,
            },
        });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { name, Theme, picture, newPassword } = req.body as UpdateProfileBody;

        // nothing sent at all
        if (
            name === undefined &&
            Theme === undefined &&
            picture === undefined &&
            newPassword === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "No fields provided to update.",
            });
        }

        if (Theme !== undefined && Theme !== "light" && Theme !== "dark") {
            return res.status(400).json({
                success: false,
                message: "Invalid Theme value. Must be 'light' or 'dark'.",
            });
        }

        if (name !== undefined && !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Name cannot be empty.",
            });
        }

        if (newPassword !== undefined && newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 8 characters.",
            });
        }


        const user = await User.findByPk(req.user!.id);

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        if (newPassword !== undefined && user.get("password") === newPassword) {
            return res.status(400).json({
                success: false,
                message: "Password cannot be same.",
            });
        }

        // block password change for Google-signed-up accounts (no local password to replace)
        if (newPassword !== undefined && user.get("signedwith") === "google") {
            return res.status(400).json({
                success: false,
                message: "Password cannot be changed for accounts signed in with Google.",
            });
        }

        // JSONB - Sequelize gives us a plain object directly, no parsing needed
        const currentInfo = (user.get("info") as Record<string, any>) ?? {};

        const updatedInfo = {
            ...currentInfo,
            ...(Theme !== undefined ? { Theme } : {}),
            ...(picture !== undefined ? { picture } : {}),
        };

        const updatePayload: Record<string, any> = {
            info: updatedInfo,
        };

        if (name !== undefined) {
            updatePayload.name = name.trim();
        }

        if (newPassword !== undefined) {
            updatePayload.password = newPassword ;
        }

        await user.update(updatePayload);

        return res.status(200).json({
            success: true,
            message: { name: user.get("name") + " password changed successfully"},
        });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const last_visit = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await User.update(
            { last_visited: new Date() },
            { where: { id: userId } }
        );
console.log(`updated time ${req.user?.name}`, new Date());

        return res.sendStatus(200);

    } catch (error) {
        console.error("Heartbeat update failed:", error);
        return res.sendStatus(500);
    }
};