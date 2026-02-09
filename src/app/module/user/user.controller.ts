import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";


const createUser = catchAsync (
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
  createUser,

};