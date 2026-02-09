import { prisma } from "../../lib/prisma";
import { ICreateDoctor } from "./doctor.interface";

const getAllDoctors = async () => {
  const doctors = await prisma.doctor.findMany({
  
    include: {
      user:true,
      specialties: {
        include: {
          specialty: true,
        },
      },
      
    },
  });
  return doctors;
};

const updateDoctor = async (id: string, payload: ICreateDoctor) => {
  const { specialties, ...doctorData } = payload;

  const doctor = await prisma.doctor.update({
    where: {
      id,
    },
    data: {
      ...doctorData,
      specialties: specialties ? {
        deleteMany: {},
        createMany: {
          data: specialties.map(specialtyId => ({
            specialtyId,
          })),
        },
      } : undefined,
    },
  });
  return doctor;
};


const getDoctorById = async (id: string) => {
  const doctor = await prisma.doctor.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      specialties: {
        include: {
          specialty: true,
        },
      },
    },
  });
  return doctor;
};

const deleteDoctor = async (id: string) => {
  const doctor = await prisma.doctor.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
  return doctor;
};


export const doctorService = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,

};