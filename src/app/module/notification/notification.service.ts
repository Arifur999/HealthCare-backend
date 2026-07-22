import { prisma } from "../../lib/prisma.js";
import { IRequestUser } from "../../interfaces/requestUser.interface.js";
import { NotificationType } from "../../../generated/prisma/enums.js";

interface CreateNotificationInput {
    userId: string;
    title: string;
    message: string;
    type?: NotificationType;
    link?: string;
}

// Internal helper used by event triggers (booking, prescription, payment, etc.).
// Deliberately never throws into the caller's flow — a failed notification must
// not roll back or break the primary action (e.g. an appointment booking).
const createNotification = async (input: CreateNotificationInput) => {
    try {
        return await prisma.notification.create({
            data: {
                userId: input.userId,
                title: input.title,
                message: input.message,
                type: input.type ?? NotificationType.SYSTEM,
                link: input.link,
            },
        });
    } catch (error) {
        console.error("Failed to create notification:", error);
        return null;
    }
};

const getMyNotifications = async (user: IRequestUser) => {
    return await prisma.notification.findMany({
        where: { userId: user.userId },
        orderBy: { createdAt: "desc" },
        take: 30,
    });
};

const getUnreadCount = async (user: IRequestUser) => {
    const count = await prisma.notification.count({
        where: { userId: user.userId, isRead: false },
    });
    return { count };
};

const markAsRead = async (user: IRequestUser, id: string) => {
    return await prisma.notification.updateMany({
        where: { id, userId: user.userId },
        data: { isRead: true },
    });
};

const markAllAsRead = async (user: IRequestUser) => {
    return await prisma.notification.updateMany({
        where: { userId: user.userId, isRead: false },
        data: { isRead: true },
    });
};

export const NotificationService = {
    createNotification,
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
};
