import { Response } from "express";
import { sequelize } from "../config/db";

import { AuthRequest } from "../types/data";

import { uploadFile } from "../services/cloudinary/cloudinary.service";

import { File, User } from "../models";
import Newsletter from "../models/Newsletter";

export const nl_contribution = async (
    req: AuthRequest,
    res: Response
) => {
    const transaction = await sequelize.transaction();

    try {
        const { title } = req.body;

        if (!title) {
            await transaction.rollback();

            return res.status(400).json({
                success: false,
                message: "Title is required",
            });
        }

        if (!req.file) {
            await transaction.rollback();

            return res.status(400).json({
                success: false,
                message: "Please upload a file",
            });
        }

        if (!req.user) {
            await transaction.rollback();

            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        /**
         * Upload file to Cloudinary
         */
        const uploadedFile = await uploadFile(req.file);

        /**
         * Save file details
         */
        const createdFile = await File.create(
            {
                file_name: req.file.originalname,
                file_url: uploadedFile.secure_url,
            },
            {
                transaction,
            }
        );

        /**
         * Save newsletter
         */
        const newsletter = await Newsletter.create(
            {
                title,
                file_id: createdFile.getDataValue("file_id"),
                submitted_by: req.user.id,
            },
            {
                transaction,
            }
        );

        await transaction.commit();

        return res.status(201).json({
            success: true,
            message: "Contribution submitted successfully.",
            data: {
                ...newsletter.toJSON(),
                file: createdFile,
            },
        });
    } catch (error) {
        await transaction.rollback();

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const nl_contribution_details = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const newsletters = await Newsletter.findAll({
            where: {
                submitted_by: req.user!.id,
            },
            include: [
                {
                    model: File,
                    attributes: [
                        "file_id",
                        "file_name",
                        "file_url",
                    ],
                },
            ],
            order: [["uploaded_at", "DESC"]],
        });

        return res.status(200).json({
            success: true,
            data: newsletters,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const getNewsletters = async (req: AuthRequest, res: Response) => {
    try {
        const { status } = req.query;

        const where: any = {};
        if (status && ["PENDING", "APPROVED", "REJECTED"].includes(String(status))) {
            where.status = status;
        }

        const newsletters = await Newsletter.findAll({
            where,
            order: [["uploaded_at", "DESC"]],
            include: [
                {
                    model: File,
                    attributes: ["file_id", "file_name", "file_url"],
                },
                {
                    model: User,
                    as: "SubmittedBy",
                    attributes: ["id", "name", "email", "info"],
                },
                {
                    model: User,
                    as: "ApprovedBy",
                    attributes: ["id", "name", "email"],
                },
            ],
        });

        return res.status(200).json({
            success: true,
            data: newsletters,
        });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// PATCH /admin/newsletter/:id/approve
export const approveNewsletter = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const newsletter = await Newsletter.findByPk(id);
        if (!newsletter) {
            return res.status(404).json({ success: false, message: "Submission not found" });
        }

        await newsletter.update({
            status: "APPROVED",
            approved_by: req.user?.id,
        });

        return res.status(200).json({ success: true, message: "Submission approved" });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// PATCH /admin/newsletter/:id/reject
export const rejectNewsletter = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const newsletter = await Newsletter.findByPk(id);
        if (!newsletter) {
            return res.status(404).json({ success: false, message: "Submission not found" });
        }

        await newsletter.update({
            status: "REJECTED",
            approved_by: req.user?.id,
            is_published: false, // a rejected submission can't stay published
        });

        return res.status(200).json({ success: true, message: "Submission rejected" });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// PATCH /admin/newsletter/:id/publish
export const togglePublish = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const newsletter = await Newsletter.findByPk(id);
        if (!newsletter) {
            return res.status(404).json({ success: false, message: "Submission not found" });
        }

        if (newsletter.get("status") !== "APPROVED") {
            return res.status(400).json({
                success: false,
                message: "Only approved submissions can be published",
            });
        }

        const nextValue = !newsletter.get("is_published");
        await newsletter.update({ is_published: nextValue });

        return res.status(200).json({
            success: true,
            message: nextValue ? "Submission published" : "Submission unpublished",
            is_published: nextValue,
        });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

export const published_nl = async (req: AuthRequest, res: Response) => {
    try {
        const newsletters = await Newsletter.findAll({
            where: { is_published: true },
            order: [["uploaded_at", "DESC"]],
            include: [
                {
                    model: File,
                    as: "File",
                    attributes: ["file_id", "file_name", "file_url"],
                },
                {
                    model: User,
                    as: "SubmittedBy",
                    attributes: ["id", "name", "email", "info"],
                },
                {
                    model: User,
                    as: "ApprovedBy",
                    attributes: ["id", "name", "email"],
                },
            ],
        });

        return res.status(200).json({ success: true, data: newsletters });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};