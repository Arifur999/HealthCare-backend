import { addMinutes } from "date-fns";
import { Prisma, Schedule } from "../../../generated/prisma/client";
import { IqueryParams } from "../../interfaces/query.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { scheduleFilterableFields, scheduleIncludeConfig, scheduleSearchableFields } from "./schedule.constant";
import { ICreateSchedulePayload } from "./schedule.interface";

const createDateTime = (date: Date, time: string): Date => {
    const [hours, minutes] = time.split(":").map(Number);
    const dateTime = new Date(date);
    dateTime.setHours(hours, minutes, 0, 0);
    return dateTime;
}

const createSchedule = async (payload: ICreateSchedulePayload) =>{
    const { startDate, endDate, startTime, endTime } = payload;

    const interval = 30;

    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    const schedules = [];

    while (currentDate <= lastDate) {
        const slotDate = new Date(currentDate);
        slotDate.setHours(0, 0, 0, 0);

        let slotStart = createDateTime(currentDate, startTime);
        const dayEndTime = createDateTime(currentDate, endTime);

        while (slotStart < dayEndTime) {
            const slotEnd = addMinutes(slotStart, interval);

            const scheduleData: Prisma.ScheduleCreateInput = {
                startDate: new Date(slotDate),
                endDate: new Date(slotDate),
                startTime: new Date(slotStart),
                endTime: new Date(slotEnd)
            }

            const existingSchedule = await prisma.schedule.findFirst({
                where: {
                    startDate: scheduleData.startDate,
                    endDate: scheduleData.endDate,
                    startTime: scheduleData.startTime,
                    endTime: scheduleData.endTime
                }
            })

            if (!existingSchedule) {
                const result = await prisma.schedule.create({
                    data: scheduleData
                })
                console.log(result);
                schedules.push(result);
            }

            slotStart = slotEnd;
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return schedules;
}




const getAllSchedules = async (query : IqueryParams) => {
    const queryBuilder = new QueryBuilder<Schedule, Prisma.ScheduleWhereInput, Prisma.ScheduleInclude>(
        prisma.schedule,
        query,
        {
            searchableFields: scheduleSearchableFields,
            filterableFields:scheduleFilterableFields
        }
    )

    const result = await queryBuilder
    .search()
    .filter()
    .paginate()
    .dynamicInclude(scheduleIncludeConfig)
    .sort()
    .fields()
    .execute();

    return result;
}

export const ScheduleService = {
    createSchedule,
    getAllSchedules,
    
}
