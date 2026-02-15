import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { doctorService } from "./doctor.service";

const getAllDoctors =catchAsync (
    async (req: Request, res: Response) => {
 
  const result = await doctorService.getAllDoctors();
    sendResponse(res, {
      httpStatus: status.OK,
      success: true,
      data: result,
      message: "Doctor created successfully",
    });
    }
);

const getDoctorById =catchAsync (
    async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await doctorService.getDoctorById(id);
    sendResponse(res, {
      httpStatus: status.OK,
      success: true,
        data: result,
      message: "Doctor created successfully",
    });
    }
);

const updateDoctor =catchAsync (   
    async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const payload = req.body;
  const result = await doctorService.updateDoctor(id, payload);
    sendResponse(res, {
      httpStatus: status.OK,
      success: true,
      data: result,
      message: "Doctor updated successfully",
    });
    }
);


const deleteDoctor =catchAsync (
    async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await doctorService.deleteDoctor(id); 
    sendResponse(res, {
      httpStatus: status.OK,
      success: true,
      data: result,
      message: "Doctor deleted successfully",
    });
    }
);


export const doctorController = {
  getAllDoctors,
  getDoctorById,
    updateDoctor,
  deleteDoctor,

};
