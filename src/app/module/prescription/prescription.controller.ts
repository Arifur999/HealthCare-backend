import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { PrescriptionService } from "./prescription.service";
import { Request, Response } from 'express';
import httpStatus from 'http-status';


const givePrescription = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const user = req.user;
    const result = await PrescriptionService.givePrescription(user, payload);
    sendResponse(res, {
        httpStatus: httpStatus.OK,
        success: true,
        message: 'Prescription created successfully',
        data: result,
    });
});


const myPrescriptions = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const result = await PrescriptionService.myPrescriptions(user);
    sendResponse(res, {
        httpStatus: httpStatus.OK,
        success: true,
        message: 'Prescription fetched successfully',
        data: result
    });
});

const getAllPrescriptions = catchAsync(async (req: Request, res: Response) => {
    const result = await PrescriptionService.getAllPrescriptions();
    sendResponse(res, {
        httpStatus: httpStatus.OK,
        success: true,
        message: 'Prescriptions retrieval successfully',
        data: result
    });
});

export const PrescriptionController = {
    givePrescription,
  myPrescriptions,
  getAllPrescriptions,
};