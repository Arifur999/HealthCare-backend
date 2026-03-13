import { Request, Response } from "express";
import status from "http-status";

import { sendResponse } from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";

import { IqueryParams } from "../../interfaces/query.interface";
import { DoctorService } from "./doctor.service";


const getAllDoctors = catchAsync(
    async (req: Request, res: Response) => {
        const query = req.query;

        const result = await DoctorService.getAllDoctors(query as IqueryParams);

        sendResponse(res, {
            httpStatus: status.OK,
            success: true,
            message: "Doctors fetched successfully",
            data: result.data,
           meta: {
                page: result.meta.page,
                limit: result.meta.limit,
                total: result.meta.total,
                totalPage: result.meta.totalPages
            },
        })
    }
)

const getDoctorById = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const doctor = await DoctorService.getDoctorById(id as string);

        sendResponse(res, {
            httpStatus: status.OK,
            success: true,
            message: "Doctor fetched successfully",
            data: doctor,
        })
    }
)

const updateDoctor = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const payload = req.body;

        const updatedDoctor = await DoctorService.updateDoctor(id as string, payload);

        sendResponse(res, {
            httpStatus: status.OK,
            success: true,
            message: "Doctor updated successfully",
            data: updatedDoctor,
        })
    }
)

const deleteDoctor = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const result = await DoctorService.deleteDoctor(id as string);

        sendResponse(res, {
            httpStatus: status.OK,
            success: true,
            message: "Doctor deleted successfully",
            data: result,
        })
    }
)

export const DoctorController = {
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
};