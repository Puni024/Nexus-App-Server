import { Request, Response } from "express";
import { User } from "../models";
import { AuthRequest } from "../types/data";

export const users = async (req: AuthRequest, res: Response) => {
    try {
        // Fetch users from your database or service
        // const usersList = await User.findAll();
        const usersList = await User.findOne({ where: { id: req.user?.id } });
        return res.status(200).json({
            success: true,
            users: [usersList],
        });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};