
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";

const registerPatient = catchAsync (
    async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authService.registerPatient(payload);    
   sendResponse(res, {
    httpStatus: 201,
    success: true,
    data: result,
    message: "Patient created successfully",
  });
  }
);

const loginPatient = catchAsync (
    async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authService.loginPatient(payload);
    sendResponse(res, {
      httpStatus: 200,
      success: true,
      data: result,
      message: "Patient logged in successfully",
    });
    }
);


export const authController = {
  registerPatient,
  loginPatient,

};