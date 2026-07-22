import { Router } from "express";
import { InternalController } from "./internal.controller.js";

const router = Router();

// POST for external cron services; GET too so Vercel Cron (GET-only) can call them.
router.post("/cancel-unpaid-appointments", InternalController.cancelUnpaidAppointments);
router.get("/cancel-unpaid-appointments", InternalController.cancelUnpaidAppointments);

router.post("/send-appointment-reminders", InternalController.sendAppointmentReminders);
router.get("/send-appointment-reminders", InternalController.sendAppointmentReminders);

export const InternalRoutes = router;
