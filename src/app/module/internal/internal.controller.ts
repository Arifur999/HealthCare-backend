import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { AppointmentService } from "../appointment/appointment.service.js";
import { env } from "../../../config/env.js";
import AppError from "../../errorHelpers/AppError.js";

// Accepts the shared secret either as an `x-cron-secret` header (external cron
// services like cron-job.org) or as an `Authorization: Bearer <secret>` header
// (Vercel Cron sends the CRON_SECRET this way), so a single endpoint works with
// whichever scheduler the deployment uses.
const assertCronAuthorized = (req: Request) => {
    if (!env.CRON_SECRET) {
        throw new AppError(status.UNAUTHORIZED, "Cron secret not configured");
    }

    const headerSecret = req.headers["x-cron-secret"];
    const authHeader = req.headers["authorization"];
    const bearerSecret =
        typeof authHeader === "string" && authHeader.startsWith("Bearer ")
            ? authHeader.slice("Bearer ".length)
            : undefined;

    if (headerSecret !== env.CRON_SECRET && bearerSecret !== env.CRON_SECRET) {
        throw new AppError(status.UNAUTHORIZED, "Invalid cron secret");
    }
};

// Triggered by an external scheduler (e.g. Vercel Cron or a free cron-ping service)
// in deployments where the process doesn't stay alive for node-cron to fire on its own.
const cancelUnpaidAppointments = catchAsync(async (req: Request, res: Response) => {
    assertCronAuthorized(req);

    await AppointmentService.cancelUnpaidAppointments();

    sendResponse(res, {
        httpStatus: status.OK,
        success: true,
        message: "Unpaid appointments cleanup completed",
        data: null,
    });
});

const sendAppointmentReminders = catchAsync(async (req: Request, res: Response) => {
    assertCronAuthorized(req);

    const result = await AppointmentService.sendAppointmentReminders();

    sendResponse(res, {
        httpStatus: status.OK,
        success: true,
        message: "Appointment reminders processed",
        data: result,
    });
});

export const InternalController = {
    cancelUnpaidAppointments,
    sendAppointmentReminders,
};
