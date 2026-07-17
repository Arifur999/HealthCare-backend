import { Prisma } from "../../../generated/prisma/client.js";

export const doctorSearchableFields = ['name', 'email', 'qualification', 'designation', 'currentWorkingPlace', 'registrationNumber', 'specialties.specialty.title'];

export const doctorFilterableFields = ['gender', 'isDeleted', 'appointmentFee', 'experience', 'registrationNumber', 'specialties.specialtyId', 'currentWorkingPlace', 'designation', 'qualification', 'specialties.specialty.title', 'user.role'];

// GET /doctors is a fully public, unauthenticated listing route, and this config drives a
// client-controlled `?include=` query param (see QueryBuilder.dynamicInclude). Appointments and
// prescriptions carry patient PII/medical data, so they must never be whitelisted here — do that
// kind of lookup through an authenticated, per-doctor admin endpoint instead.
export const doctorIncludeConfig : Partial<Record<keyof Prisma.DoctorInclude, Prisma.DoctorInclude[keyof Prisma.DoctorInclude]>> ={
    user: true,
    specialties: {
        include:{
            specialty: true
        }
    },
    doctorSchedules: {
        include: {
            schedule: true
        }
    },
    reviews: true,
}