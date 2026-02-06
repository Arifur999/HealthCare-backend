import {  Request,  Response } from "express";
import { specialtyService } from "./specialty.service";
import catchAsync from "../shared/catchAsync";

const createSpecialty = catchAsync (
    async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await specialtyService.createSpecialty(payload);
    res.status(200).json({
      success: true,
      data: result,
      message: "Specialty created successfully",
    });
  }
);
    
const getAllSpecialties = catchAsync (
    async (req: Request, res: Response) => {
  const result = await specialtyService.getAllSpecialties();
  res.status(200).json({
    success: true,
    data: result,
    message: "Specialties retrieved successfully",
  });
});


const deleteSpecialty = catchAsync (
    async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await specialtyService.deleteSpecialty(id);
    res.status(200).json({
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
    res.status(200).json({
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
