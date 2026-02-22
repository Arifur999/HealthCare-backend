import { IRequestUser } from "../../interfaces/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { IBookAppointmentPayload } from "./appointment.interface";

const bookAppointment = async (payload : IBookAppointmentPayload, user : IRequestUser) => {
   const patientData = await prisma.patient.findUniqueOrThrow({
    where : {
        email : user.email,
    }
   });

   const doctorData = await prisma.doctor.findUniqueOrThrow({
    where : {
        id : payload.doctorId,
        isDeleted : false,
    }
   });


const scheduleData = await prisma.schedule.findUniqueOrThrow({
    where : {
        id : payload.scheduleId,
    }
   });



}


export const AppointmentService = {
    bookAppointment,

}
