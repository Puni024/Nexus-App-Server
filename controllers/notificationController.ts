import { Response } from "express";
import Notification from "../models/Notification";
import { AuthRequest } from "../types/data";
import { addClient, removeClient } from "../services/sseRegistry";
import { User } from "../models";


export async function touchLastVisited(userId: string) {
    try {
        await User.update({ last_visited: new Date() }, { where: { id: userId } });
    } catch (err) {
        console.error("Failed to update last_visited:", err);
    }
}

// Lightweight — safe to poll frequently (kept as a fallback / initial baseline)
export async function getUnreadCount(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const count = await Notification.count({
            where: { userId, isRead: false },
        });
        res.json({ count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch unread count" });
    }
}

export async function getNotifications(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);

        const notifications = await Notification.findAll({
            where: { userId },
            order: [["createdAt", "DESC"]],
            limit,
        });

        res.json({ notifications });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch notifications" });
    }
}

export async function markNotificationAsRead(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const [updatedCount] = await Notification.update(
            { isRead: true },
            { where: { id: req.params.id, userId } }
        );
        res.json({ success: updatedCount > 0 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to mark notification as read" });
    }
}

export async function markAllNotificationsAsRead(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        await Notification.update(
            { isRead: true },
            { where: { userId, isRead: false } }
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to mark all as read" });
    }
}



export async function streamNotifications(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) return res.status(401).end();

    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no", 
    });
    res.flushHeaders();

    addClient(userId, res);
    await touchLastVisited(userId); 
    

    const HEARTBEAT_MS = 60000;
    const interval = setInterval(() => {
        res.write(":ping\n\n"); 
        touchLastVisited(userId);
    }, HEARTBEAT_MS);

    req.on("close", () => {
        clearInterval(interval);
        removeClient(userId, res);
    });
}