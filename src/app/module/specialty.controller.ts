import {  Request,  Response } from "express";
import { specialtyService } from "./specialty.service";
import catchAsync from "../shared/catchAsync";
import { sendResponse } from "../shared/sendResponse";





const createSpecialty = catchAsync (
    async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await specialtyService.createSpecialty(payload);
  sendResponse(res, {
    httpStatus: 201,
    success: true,
    data: result,
    message: "Specialty created successfully",
  });
  }
);
    
const getAllSpecialties = catchAsync (
    async (req: Request, res: Response) => {
  const result = await specialtyService.getAllSpecialties();
    sendResponse(res, {
      httpStatus: 200,
      success: true,
      data: result,
      message: "Specialties retrieved successfully",
    });
    
});


const deleteSpecialty = catchAsync (
    async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await specialtyService.deleteSpecialty(id);
    sendResponse(res, {
      httpStatus: 200,
      success: true,  
     data: result,
      message: "Specialty deleted successfully",
    });
  }
);  


const updateSpecialty = catchAsync (
    async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const payload = req.body;
    const result = await specialtyService.updateSpecialty(id, payload);
    sendResponse(res, {
      httpStatus: 200,
      success: true,
      data: result,
      message: "Specialty updated successfully",
    });
  }
);  





export const specialtyController = { 
    createSpecialty,
     getAllSpecialties,
deleteSpecialty,
updateSpecialty
 };
