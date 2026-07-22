import { Router } from "express";
import { Role } from "../../../generated/prisma/enums.js";
import { checkAuth } from "../../middleware/checkAuth.js";
import { NotificationController } from "./notification.controller.js";

const router = Router();

// Any authenticated user sees their own notifications.
const allRoles = [Role.PATIENT, Role.DOCTOR, Role.ADMIN, Role.SUPER_ADMIN] as const;

router.get("/", checkAuth(...allRoles), NotificationController.getMyNotifications);
router.get("/unread-count", checkAuth(...allRoles), NotificationController.getUnreadCount);
router.patch("/mark-all-read", checkAuth(...allRoles), NotificationController.markAllAsRead);
router.patch("/:id/read", checkAuth(...allRoles), NotificationController.markAsRead);

export const NotificationRoutes = router;
