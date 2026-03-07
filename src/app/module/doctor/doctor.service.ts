import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IUpdateDoctorPayload } from "./doctor.interface";
import { UserStatus } from "../../../generated/prisma/enums";
import { IqueryParams } from "../../interfaces/query.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { doctorFilterableFields, doctorInCludeConfig, doctorSearchableFields } from "./doctor.constants";
import { Doctor, Prisma } from "../../../generated/prisma/client";

const getAllDoctors = async (query:IqueryParams) => {


const queryBuilder = new QueryBuilder<Doctor,Prisma.DoctorWhereInput,Prisma.DoctorInclude>(
    prisma.doctor,
    query,
    {
        searchableFields: doctorSearchableFields,
        filterableFields: doctorFilterableFields,
        
    }
)

const result = await queryBuilder
.search()
.filter()
.where({ 
    isDeleted: false,
 })
.include({
    user:true,
    specialties: {
        include: {
            specialty: true,
        },
    },
})
.dynamicInclude(doctorInCludeConfig)

.paginate()
.sort()
.fields()
.execute();


return result;

};

const updateDoctor = async (id: string, payload: IUpdateDoctorPayload) => {
    const isDoctorExist = await prisma.doctor.findUnique({
        where: {
            id,
        }
    })

    if (!isDoctorExist) {
        throw new AppError(status.NOT_FOUND, "Doctor not found");
    }

    const { doctor: doctorData, specialties }= payload;

    await prisma.$transaction(async (tx) => {
        if (doctorData) {
            await tx.doctor.update({
                where: {
                    id,
                },
                data: {
                    ...doctorData,
                }
            })
        }

        if (specialties) {
            await tx.doctorSpecialty.deleteMany({
                where: {
                    doctorId: id,
                },
            });

            if (specialties.length > 0) {
                const uniqueSpecialtyIds = [...new Set(specialties)];
                await tx.doctorSpecialty.createMany({
                    data: uniqueSpecialtyIds.map((specialtyId) => ({
                        doctorId: id,
                        specialtyId,
                    })),
                    skipDuplicates: true,
                });
            }
        }
    })

    const doctor = await getDoctorById(id);

    return doctor;
}



const getDoctorById = async (id: string) => {
    const doctor = await prisma.doctor.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            user: true,
            specialties: {
                include: {
                    specialty: true
                }
            },
            appointments: {
                include: {
                    patient: true,
                    schedule: true,
                    prescription: true,
                }
            },
            doctorSchedules: {
                include: {
                    schedule: true,
                }
            },
            reviews: true
        }
    })
    return doctor;
}

const deleteDoctor = async (id: string) => {
    const isDoctorExist = await prisma.doctor.findUnique({
        where: { id },
        include: { user: true }
    })

    if (!isDoctorExist) {
        throw new AppError(status.NOT_FOUND, "Doctor not found");
    }

    await prisma.$transaction(async (tx) => {
        await tx.doctor.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
            },
        })

        await tx.user.update({
            where: { id: isDoctorExist.userId },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                status: UserStatus.DELETED // Optional: you may also want to block the user
            },
        })

        await tx.session.deleteMany({
            where: { userId: isDoctorExist.userId }
        })

        await tx.doctorSpecialty.deleteMany({
            where: { doctorId: id }
        })
    })

    return { message: "Doctor deleted successfully" };
}



export const doctorService = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,

};

