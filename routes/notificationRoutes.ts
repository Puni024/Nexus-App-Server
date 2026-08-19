import { Router } from "express";
import {
    getUnreadCount,
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    streamNotifications,
} from "../controllers/notificationController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/stream", authMiddleware, streamNotifications); // persistent SSE connection

router.get("/unread-count", authMiddleware, getUnreadCount);

router.get("/", authMiddleware, getNotifications);


router.patch("/read-all", authMiddleware, markAllNotificationsAsRead);

router.patch("/:id/read", authMiddleware, markNotificationAsRead);

export default router;