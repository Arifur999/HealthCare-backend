import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import { IRequestUser } from "../../interfaces/requestUser.interface.js";
import { PatientService } from "./patient.service.js";
import { sendResponse } from "../../shared/sendResponse.js";
import status from "http-status";

const updateMyProfile = catchAsync(async (req : Request, res : Response) =>{

    const user = req.user as IRequestUser;
    const payload = req.body;
 

    const result = await PatientService.updateMyProfile(user, payload);

    sendResponse(res, {
        success: true,
        httpStatus : status.OK,
        message : "Profile updated successfully",
        data : result
    });
})

const getAllPatients = catchAsync(async (req: Request, res: Response) => {
    const result = await PatientService.getAllPatients();

    sendResponse(res, {
        success: true,
        httpStatus: status.OK,
        message: "Patients retrieved successfully",
        data: result
    });
})

export const PatientController = {
    updateMyProfile,
    getAllPatients,
}