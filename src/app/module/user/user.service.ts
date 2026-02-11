import { Role, Specialty } from "../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreateDoctor } from "./user.interface";

const createDoctor=async(payload:ICreateDoctor)=>{
const specialties:Specialty[] = []

for (const specialtyId of payload.specialties) {
  const specialty = await prisma.specialty.findUnique({
    where: {
      id: specialtyId,
    },
  });
  if (!specialty) {
    throw new AppError(400, `Specialty with ID ${specialtyId} not found`);  
  } else {
    specialties.push(specialty);
  }
}

const userExists = await prisma.user.findUnique({
  where: {
    email: payload.doctor.email,
  },});

if (userExists) {
  throw new AppError(400, 'User with this email already exists');               

}

const userData=await auth.api.signUpEmail({
  body: {
    email: payload.doctor.email,
    password: payload.password,
    role: Role.DOCTOR,
    name: payload.doctor.name,
    needPasswordChange: true,
  }
})


try {
    const result =await prisma.$transaction(async (tx) => {
      const doctor = await tx.doctor.create({
        data: {
            userId: userData.user.id,
            ...payload.doctor,
        }
        });


const doctorSpecialtiesData = specialties.map((specialty) => {
    return {
      doctorId: doctor.id,
      specialtyId: specialty.id,
    };
  });

        await tx.doctorSpecialty.createMany({
          data: doctorSpecialtiesData,
        });
       
        const doctorWithSpecialties = await tx.doctor.findUnique({
          where: {
            id: doctor.id,
          },
          select: {
            id: true,
            userId: true,
            name: true,
            email: true,
            profilePhoto: true,
            contactNumber: true,
            address: true,
            registrationNumber: true,
            experience: true,
            gender: true,
            appointmentFee: true,
            qualification: true,
            currentWorkplace: true,
            designation: true,
            createdAt: true,
            updatedAt: true,
            isDeleted: true,
            deletedAt: true,
            user: {
              select: {
                id: true,
                email: true,
                role: true,
                name: true,
                status: true,
                emailVerified: true,
                image: true,
                isDeleted: true,
                createdAt: true,
                deletedAt: true,
                updatedAt: true,
              },
            },

            specialties: {
              select: {
                specialty: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
                },
              },
          },
        });
        return doctorWithSpecialties;

    });
    return result;
    
} catch (error) {
    console.error('Error creating doctor:', error);
    await prisma.user.delete({
      where: {
        id: userData.user.id,
      },
    });
    throw new AppError(500, 'Failed to create doctor');
  
}

}


export const userService={
    createDoctor,
}