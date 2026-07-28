import { Request, Response } from "express";
import { User } from "../models";
import { AuthRequest } from "../types/data";

export const users = async (req: AuthRequest, res: Response) => {
    try {
        const usersList = req.user?.isAdmin ? await User.findAll({attributes: {exclude: ["password"],}}) : await User.findOne({where :{id : req.user?.id},attributes: {exclude: ["password"],}}) ;
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