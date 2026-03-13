import status from "http-status";
import { sendResponse } from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";
import { Request, Response } from "express";
import { DoctorScheduleService } from "./doctorSchedule.service";

const createMyDoctorSchedule = catchAsync( async (req : Request, res : Response) => {
    const payload = req.body;
    const user = req.user;
    const doctorSchedule = await DoctorScheduleService.createMyDoctorSchedule(user, payload);
    sendResponse(res, {
        success: true,
        httpStatus: status.CREATED,
        message: 'Doctor schedule created successfully',
        data: doctorSchedule
    });
});



export const DoctorScheduleController = {
    createMyDoctorSchedule,
    
}