import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { NotificationService } from "./notification.service.js";

const getMyNotifications = catchAsync(async (req: Request, res: Response) => {
    const result = await NotificationService.getMyNotifications(req.user);
    sendResponse(res, {
        httpStatus: status.OK,
        success: true,
        message: "Notifications fetched successfully",
        data: result,
    });
});

const getUnreadCount = catchAsync(async (req: Request, res: Response) => {
    const result = await NotificationService.getUnreadCount(req.user);
    sendResponse(res, {
        httpStatus: status.OK,
        success: true,
        message: "Unread count fetched successfully",
        data: result,
    });
});

const markAsRead = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await NotificationService.markAsRead(req.user, id as string);
    sendResponse(res, {
        httpStatus: status.OK,
        success: true,
        message: "Notification marked as read",
        data: null,
    });
});

const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
    await NotificationService.markAllAsRead(req.user);
    sendResponse(res, {
        httpStatus: status.OK,
        success: true,
        message: "All notifications marked as read",
        data: null,
    });
});

export const NotificationController = {
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
};
