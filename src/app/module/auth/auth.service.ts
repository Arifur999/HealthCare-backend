import {  UserStatus } from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";


interface RegisterPatientPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPatientPayload {
  email: string;
  password: string;
}


const registerPatient = async (payload : RegisterPatientPayload) => {
  const { name, email, password } = payload;
  const createdUser = await auth.api.signUpEmail({
    body: {
         name,
      email,
      password,
      needPasswordChange: false,
      isDeleted: false,
      deletedAt: null,
      status: "ACTIVE",
      role: "PATIENT"
    },
  });
if (!createdUser?.user) {
    throw new Error("Failed to create user");
}

try {
    const patient = await prisma.$transaction(async (tx) => {

    const patientTX = await tx.patient.create({
      data: {
        userId: createdUser.user!.id,
        name: payload.name,
        email: payload.email,
      
      },
    });
    return patientTX;
    
});



  return {
    ...createdUser,
    patient,
  }
}catch (error) {
    // If patient creation fails, delete the created user to maintain consistency
    await prisma.user.delete({
      where: {
        id: createdUser.user!.id,
      },
    });
    throw error; // Rethrow the error after cleanup
  } 
};


const loginPatient = async (payload: LoginPatientPayload) => {
  const { email, password } = payload;
  const loginResult = await auth.api.signInEmail({  
    body: {
      email,
      password,
    },
  });

  if(loginResult.user?.status === UserStatus.BLOCKED) {
    throw new Error("User is blocked");
  }

  if(loginResult.user?.isDeleted || loginResult.user?.status === UserStatus.DELETED) {
    throw new Error("User is deleted");
  }



  return loginResult;
}
 export const authService = {
  registerPatient,
  loginPatient
 };
