import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import { userService } from "./user.service.js";
import { sendResponse } from "../../shared/sendResponse.js";
import status from "http-status";


const createDoctor = catchAsync (
    async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await userService.createDoctor(payload);
    sendResponse(res, {
      httpStatus: status.CREATED,
      success: true,
      data: result,
      message: "Doctor created successfully",
    });
    }
);

export const userController = {
  createDoctor,

};