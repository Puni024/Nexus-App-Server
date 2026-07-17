import { Request, Response } from "express";
import { User } from "../models";
import { AuthRequest } from "../types/data";

export const users = async (req: AuthRequest, res: Response) => {
    try {
        const usersList = await User.findAll() ;
        return res.status(200).json({
            success: true,
            users: Array.isArray(usersList) ? usersList : [usersList] 
        });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};