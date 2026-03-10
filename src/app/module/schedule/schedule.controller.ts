import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { ScheduleService } from "./schedule.service";
import { IqueryParams } from "../../interfaces/query.interface";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const getAllSchedules = catchAsync( async (req : Request, res : Response) => {
    const query = req.query;
    const result = await ScheduleService.getAllSchedules(query as IqueryParams);
    sendResponse(res, {
        success: true,
        httpStatus: status.OK,
        message: 'Schedules retrieved successfully',
        data: result.data,
        meta: {
            page: result.meta.page,
            limit: result.meta.limit,
            total: result.meta.total,
            totalPage: result.meta.totalPages
        }
    });
});


export const ScheduleController = {
    
    getAllSchedules,
   
}