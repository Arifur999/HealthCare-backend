import status from "http-status";
import { sendResponse } from "../../shared/sendResponse";
import { AppointmentService } from "./appointment.service";
import catchAsync from "../../shared/catchAsync";
import { Request, Response } from "express";

const bookAppointment = catchAsync( async (req : Request, res : Response) => {
    const payload = req.body;
    const user = req.user;
    const appointment = await AppointmentService.bookAppointment(payload, user);
    sendResponse(res, {
        success: true,
        httpStatus: status.CREATED, 
        message: 'Appointment booked successfully',
        data: appointment
    });
});


export const AppointmentController = {
    bookAppointment,
   
}