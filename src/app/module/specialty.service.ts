import { Specialty } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

const createSpecialty = async (payload: Specialty): Promise<Specialty | null> => {
  try {
    const specialty = await prisma.specialty.create({
      data: payload,
    });
    return specialty;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getAllSpecialties = async (): Promise<Specialty[]> => {
  try {
    const specialties = await prisma.specialty.findMany();
    return specialties;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const deleteSpecialty = async (id: string): Promise<Specialty | null> => {
  try {
    const specialty = await prisma.specialty.delete({
      where: {
        id,
      },
    });
    return specialty;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const updateSpecialty = async (id: string, payload: Partial<Specialty>): Promise<Specialty | null> => {
  try {
    const specialty = await prisma.specialty.update({
      where: {
        id,
      },
      data: payload,
    });
    return specialty;
    } catch (error) {
      console.log(error);
      return null;
    }
  };





export const specialtyService = {
  createSpecialty,
    getAllSpecialties,
    deleteSpecialty,
    updateSpecialty,
};
