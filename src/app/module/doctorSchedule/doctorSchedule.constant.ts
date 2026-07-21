import { Prisma } from "../../../generated/prisma/client.js"


export const doctorScheduleSearchableFields = [
    'id',
    'doctorId',
    'scheduleId',
]

export const doctorScheduleFilterableFields = [
    'id',
    'doctorId',
    'scheduleId',
    'createdAt',
    'updatedAt',
    'isBooked',
    'schedule.startTime',
    'schedule.endTime',
]

export const doctorScheduleIncludeConfig : Partial<Record<keyof Prisma.DoctorSchedulesInclude, Prisma.DoctorSchedulesInclude[keyof Prisma.DoctorSchedulesInclude]>> ={
    doctor: {
        include: {
            user: true,
            appointments: true,
            specialties: true,
        }
    },
    schedule: true

}