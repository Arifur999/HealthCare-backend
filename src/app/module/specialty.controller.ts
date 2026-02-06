import { Request, Response } from "express";
import { specialtyService } from "./specialty.service";

const createSpecialty = async (req: Request, res: Response) => {
  const payload = req.body;
  try {
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
export const specialtyController = { createSpecialty };
