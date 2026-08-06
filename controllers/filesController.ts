import { Request, Response } from "express";
import { File } from "../models";
import { AuthRequest } from "../types/data";

export const Files = async (req: AuthRequest, res: Response) => {
    try {
        const filesList = await File.findAll() ;        
        return res.status(200).json(filesList);
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
