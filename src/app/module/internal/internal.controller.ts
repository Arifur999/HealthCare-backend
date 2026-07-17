import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { AppointmentService } from "../appointment/appointment.service.js";
import { env } from "../../../config/env.js";
import AppError from "../../errorHelpers/AppError.js";

// Triggered by an external scheduler (e.g. Vercel Cron or a free cron-ping service)
// in deployments where the process doesn't stay alive for node-cron to fire on its own.
const cancelUnpaidAppointments = catchAsync(async (req: Request, res: Response) => {
    const providedSecret = req.headers["x-cron-secret"];

    if (!env.CRON_SECRET || providedSecret !== env.CRON_SECRET) {
        throw new AppError(status.UNAUTHORIZED, "Invalid cron secret");
    }

    await AppointmentService.cancelUnpaidAppointments();

    sendResponse(res, {
        httpStatus: status.OK,
        success: true,
        message: "Unpaid appointments cleanup completed",
        data: null,
    });
});

export const InternalController = {
    cancelUnpaidAppointments,
};
