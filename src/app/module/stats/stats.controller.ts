import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import { StatsService } from "./stats.service.js";
import { sendResponse } from "../../shared/sendResponse.js";
import status from "http-status";

const getDashboardStatsData = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const result = await StatsService.getDashboardStatsData(user);

    sendResponse(res, {
        httpStatus: status.OK,
        success: true,
        message: "Stats data retrieved successfully!",
        data: result
    })
});

export const StatsController = {
    getDashboardStatsData
}