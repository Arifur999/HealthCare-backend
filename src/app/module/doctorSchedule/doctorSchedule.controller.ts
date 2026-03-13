import status from "http-status";
import { sendResponse } from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";
import { Request, Response } from "express";
import { DoctorScheduleService } from "./doctorSchedule.service";
import { IqueryParams } from "../../interfaces/query.interface";

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

const getMyDoctorSchedules = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const query = req.query;
    const result = await DoctorScheduleService.getMyDoctorSchedules(user, query as IqueryParams);
    sendResponse(res, {
        success: true,
        httpStatus: status.OK,
        message: 'Doctor schedules retrieved successfully',
        data: result.data,
        meta: {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPage: result.meta.totalPages,
      },
    });
});


export const DoctorScheduleController = {
    createMyDoctorSchedule,
    getMyDoctorSchedules,
}