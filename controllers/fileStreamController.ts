// controllers/fileStreamController.ts
import { Response } from "express";
import axios from "axios";
import { AuthRequest } from "../types/data";
import File from "../models/File";

export const streamFile = async (req: AuthRequest, res: Response) => {
    try {
        const { file_id } = req.params;

        // Your DB only has file_url — that's all this needs
        const file = await File.findByPk(file_id);
        if (!file) {
            return res.status(404).json({ success: false, message: "File not found" });
        }

        const fileUrl = file.get("file_url") as string;
        const fileName = file.get("file_name") as string;

        // Server-to-server fetch — Node has no CORS restrictions at all
        const upstream = await axios.get(fileUrl, {
            responseType: "stream",
            validateStatus: () => true,
        });

        if (upstream.status !== 200) {
            return res.status(502).json({ success: false, message: "Couldn't fetch the file from storage" });
        }

        const contentType = Array.isArray(upstream.headers["content-type"])
            ? upstream.headers["content-type"][0]
            : typeof upstream.headers["content-type"] === "string"
                ? upstream.headers["content-type"]
                : "application/octet-stream";

        res.setHeader("Content-Type", contentType);
        res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(fileName)}"`);
        upstream.data.pipe(res); // relay only — nothing written to disk
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};