import { Gender } from "../../../generated/prisma/enums.js";

export interface ICreateDoctorApplication {
    name: string;
    email: string;
    contactNumber: string;
    registrationNumber: string;
    experience?: number;
    gender: Gender;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
    appointmentFee: number;
    message?: string;
}
