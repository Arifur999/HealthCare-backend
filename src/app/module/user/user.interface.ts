import { Gender } from "../../../generated/prisma/enums";

export interface ICreateDoctor   {
 password: string;
 doctor: {
  name: string;
  email: string;
  profilePhoto: string;
  contactNumber: string;
  address?: string;
  registrationNumber: string;
  experience?: number;
  gender: Gender;
  appointmentFee: number;
  qualification: string;
  currentWorkplace: string;
  designation: string;
 
    }
    specialties: string[]; // Array of specialty IDs
}