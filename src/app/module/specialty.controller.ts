import { Request, Response } from "express";
import { specialtyService } from "./specialty.service";

const createSpecialty = async (req: Request, res: Response) => {
  
  try {
    const payload = req.body;
    const result = await specialtyService.createSpecialty(payload);
    res.status(200).json({
      success: true,
      data: result,
      message: "Specialty created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to create specialty",
    });
  }
};

const getAllSpecialties = async (req: Request, res: Response) => {
  try {
    
    const result = await specialtyService.getAllSpecialties();
    res.status(200).json({
      success: true,
        data: result,
      message: "Specialties retrieved successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve specialties",
    });
  }
};








export const specialtyController = { createSpecialty, getAllSpecialties };
