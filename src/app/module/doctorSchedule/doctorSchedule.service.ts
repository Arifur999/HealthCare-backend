import { DoctorSchedules, Prisma } from "../../../generated/prisma/client";
import { IqueryParams } from "../../interfaces/query.interface";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { doctorScheduleFilterableFields, doctorScheduleIncludeConfig, doctorScheduleSearchableFields } from "./doctorSchedule.constant";
import { ICreateDoctorSchedulePayload } from "./doctorSchedule.interface";


const createMyDoctorSchedule = async (user : IRequestUser, payload : ICreateDoctorSchedulePayload) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where:{
            email : user.email
        }
    });

    const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
        doctorId : doctorData.id,
        scheduleId
    }) )

    await prisma.doctorSchedules.createMany({
        data : doctorScheduleData
    });

    const result = await prisma.doctorSchedules.findMany({
        where : {
            doctorId : doctorData.id,
            scheduleId : {
                in : payload.scheduleIds
            }
        },
        include : {
            schedule: true
        }
    })
    

    return result;
}

const getMyDoctorSchedules = async (user : IRequestUser, query : IqueryParams) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where:{
            email : user.email
        }
    });
    const queryBuilder = new QueryBuilder<DoctorSchedules, Prisma.DoctorSchedulesWhereInput, Prisma.DoctorSchedulesInclude>(prisma.doctorSchedules,
    {
    doctorId: doctorData.id,
    ...query
    }, 
    {
        filterableFields: doctorScheduleFilterableFields,
        searchableFields: doctorScheduleSearchableFields
    })
    const doctorSchedules = await queryBuilder
    .search()
    .filter()
    .paginate()
    .include({
        schedule: true,
        doctor : {
            include:{
                user: true,
            }
        }
    })
    .sort()
    .fields()
    .dynamicInclude(doctorScheduleIncludeConfig)
    .execute();
    return doctorSchedules;
}

const getAllDoctorSchedules = async (query: IqueryParams) => {
    const queryBuilder = new QueryBuilder<DoctorSchedules, Prisma.DoctorSchedulesWhereInput, Prisma.DoctorSchedulesInclude>(prisma.doctorSchedules, query, {
        filterableFields: doctorScheduleFilterableFields,
        searchableFields: doctorScheduleSearchableFields
    })

    const result = await queryBuilder
    .search()
    .filter()
    .paginate()
    .dynamicInclude(doctorScheduleIncludeConfig)
    .sort()
    .execute();

    return result;
}

const getDoctorScheduleById = async (doctorId: string, scheduleId: string) => {
    const doctorSchedule = await prisma.doctorSchedules.findUnique({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorId,
                scheduleId: scheduleId
            }
        },
        include: {
            schedule: true,
            doctor: true
        }
    });
    return doctorSchedule;
}


export const DoctorScheduleService = {
    createMyDoctorSchedule,
    getMyDoctorSchedules,
    getAllDoctorSchedules,
    getDoctorScheduleById,
}