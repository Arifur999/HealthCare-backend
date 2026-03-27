import { Request, Response } from "express";
import { ReviewService } from "./review.service";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import httpStatus from 'http-status';


const giveReview = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const user = req.user;
    const result = await ReviewService.giveReview(user, payload);
    sendResponse(res, {
        httpStatus: httpStatus.OK,
        success: true,
        message: 'Review created successfully',
        data: result,
    });
});


export const ReviewController = {
    giveReview,
};