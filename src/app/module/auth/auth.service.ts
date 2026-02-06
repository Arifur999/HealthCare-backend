import { User } from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";


interface RegisterPatientPayload {
  name: string;
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

// const patient = await prisma.$transaction(async (tx) => {
//   const user = await prisma.user.update({
//     where: { id: createdUser.user.id },
//     data: {
//         name,
//       email,
//         role: "PATIENT",
//         status: "ACTIVE",
//         needPasswordChange: false,
//         isDeleted: false,
//         deletedAt: null,
//     },
//   });
//     return user;
// });



  return createdUser.user as User;
};


 export const authService = {
  registerPatient,
};