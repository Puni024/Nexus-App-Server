import { Request, Response } from "express";
import { User } from "../models";
import { AuthRequest } from "../types/data";

export const users = async (req: AuthRequest, res: Response) => {
    try {
        const { fields } = req.query;
        
        const FORBIDDEN_FIELDS = ["password"];
        const ALLOWED_FIELDS = ["id", "name", "email", "profile", "isAdmin", "info", "signed_with", "isVerified", "last_visited"];

        let attributes: any = { exclude: FORBIDDEN_FIELDS };

        if (typeof fields === "string" && fields.trim().length > 0) {
            const requested = fields
                .split(",")
                .map((f) => f.trim())
                .filter((f) => ALLOWED_FIELDS.includes(f) && !FORBIDDEN_FIELDS.includes(f));

            if (requested.length > 0) {
                attributes = requested;
            }
        }

        const usersList = req.user?.isAdmin
            ? await User.findAll({ attributes })
            : await User.findOne({ where: { id: req.user?.id }, attributes });

        return res.status(200).json({
            success: true,
            users: Array.isArray(usersList) ? usersList : [usersList],
        });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};


export const verify = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id as string;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        await user.update({ isVerified: true });

        return res.status(200).json({
            success: true,
            message: "User verified successfully",
            user,
        });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


export const profile = async (req: AuthRequest, res: Response) => {
  const user = await User.findByPk(req.user?.id, {
  attributes: ["info"],
});

res.status(200).json({
  info: user?.get("info") ?? {},
});
};