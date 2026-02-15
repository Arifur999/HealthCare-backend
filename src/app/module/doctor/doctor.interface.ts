export interface IUpdateDoctorPayload {
     specialtyId: string;
    shouldDelete?: boolean;
}

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
  gender: string;
  appointmentFee: number;
  qualification: string;
  currentWorkingPlace: string;
  designation: string;
 
    }
    specialties: string[]; // Array of specialty IDs
}
