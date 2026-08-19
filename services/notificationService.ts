import Notification, { NotificationType } from "../models/Notification";
import User from "../models/User";
import { sendToUser, sendToUsers } from "./sseRegistry";

interface CreateNotificationInput {
    userId: string;
    type: NotificationType;
    title: string;
    message?: string;
    entityType?: string;
    entityId?: string;
}

export async function createNotification(input: CreateNotificationInput) {
    const notification = await Notification.create({
        userId: input.userId,
        type: input.type,
        title: input.title,
        message: input.message ?? null,
        entityType: input.entityType ?? null,
        entityId: input.entityId ?? null,
        isRead: false,
    });

    // Push to the user's live SSE connection (if they have one open).
    sendToUser(input.userId, notification.toJSON());

    return notification;
}

interface BulkNotifyInput {
    type: NotificationType;
    title: string;
    message?: string;
    entityType?: string;
    entityId?: string;
    excludeUserId?: string;
}

export async function notifyAllAdmins(input: BulkNotifyInput) {
    const admins = await User.findAll({
        where: { isAdmin: true },
        attributes: ["id"],
    });

    await Promise.all(
        admins
            .filter((admin) => admin.getDataValue("id") !== input.excludeUserId)
            .map((admin) =>
                createNotification({
                    userId: admin.getDataValue("id") as string,
                    type: input.type,
                    title: input.title,
                    message: input.message,
                    entityType: input.entityType,
                    entityId: input.entityId,
                })
            )
    );
}

export async function notifyAllUsers(input: BulkNotifyInput) {
    const users = await User.findAll({
        attributes: ["id"],
    });

    const targetUserIds = users
        .map((u) => u.getDataValue("id") as string)
        .filter((id) => id !== input.excludeUserId);

    if (targetUserIds.length === 0) return;

    const rows = targetUserIds.map((userId) => ({
        userId,
        type: input.type,
        title: input.title,
        message: input.message ?? null,
        entityType: input.entityType ?? null,
        entityId: input.entityId ?? null,
        isRead: false,
    }));

    const created = await Notification.bulkCreate(rows, { returning: true });

    for (const notification of created) {
        const userId = notification.getDataValue("userId") as string;
        sendToUser(userId, notification.toJSON());
    }

    void sendToUsers;
}