import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { DoctorApplicationService } from "./doctorApplication.service.js";

const createApplication = catchAsync(async (req: Request, res: Response) => {
    const result = await DoctorApplicationService.createApplication(req.body);
    sendResponse(res, {
        httpStatus: status.CREATED,
        success: true,
        message: "Application submitted successfully. Our team will review it and get back to you.",
        data: result,
    });
});

const getApplications = catchAsync(async (req: Request, res: Response) => {
    const statusFilter = req.query.status as string | undefined;
    const result = await DoctorApplicationService.getApplications(statusFilter);
    sendResponse(res, {
        httpStatus: status.OK,
        success: true,
        message: "Applications fetched successfully",
        data: result,
    });
});

const approveApplication = catchAsync(async (req: Request, res: Response) => {
    const result = await DoctorApplicationService.approveApplication(
        req.params.id as string,
        req.body?.reviewNote,
    );
    sendResponse(res, {
        httpStatus: status.OK,
        success: true,
        message: "Application approved and doctor account created",
        data: result,
    });
});

const rejectApplication = catchAsync(async (req: Request, res: Response) => {
    const result = await DoctorApplicationService.rejectApplication(
        req.params.id as string,
        req.body?.reviewNote,
    );
    sendResponse(res, {
        httpStatus: status.OK,
        success: true,
        message: "Application rejected",
        data: result,
    });
});

export const DoctorApplicationController = {
    createApplication,
    getApplications,
    approveApplication,
    rejectApplication,
};
