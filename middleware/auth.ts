import { Request, Response, NextFunction } from "express";

import { verifyToken } from "../utils/jwt";

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    try {

        const token = req.cookies.token;

        if (!token) {

            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });

        }

        const decoded = verifyToken(token);
        req.user = decoded;

        next();

    } catch (err) {

        return res.status(401).json({
            success: false,
            message: "Invalid Token"
        });

    }
}