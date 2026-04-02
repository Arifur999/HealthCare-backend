import status from "http-status";
import { Role, UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { IChangeUserRolePayload, IChangeUserStatusPayload, IUpdateAdminPayload } from "./admin.interface";


const getAllAdmins = async () => {
    const admins = await prisma.admin.findMany({
        include: {
            user: true,
        }
    })
    return admins;
}

const getAdminById = async (id: string) => {
    const admin = await prisma.admin.findUnique({
        where: {
            id,
        },
        include: {
            user: true,
        }
    })
    return admin;
}

const updateAdmin = async (id: string, payload: IUpdateAdminPayload, user: IRequestUser) => {
    //TODO: Validate who is updating the admin user. Only super admin can update admin user and only super admin can update super admin user but admin user cannot update super admin user

    const isAdminExist = await prisma.admin.findUnique({
        where: {
            id,
        }
    })

    if (!isAdminExist) {
        throw new AppError(status.NOT_FOUND, "Admin Or Super Admin not found");
    }

    if(isAdminExist.id===user.userId){
        throw new AppError(status.BAD_REQUEST,"You cannot delete yourself" )
    }

    const { admin } = payload;

    const updatedAdmin = await prisma.admin.update({
        where: {
            id,
        },
        data: {
            ...admin,
        }
    })

    return updatedAdmin;
}

//soft delete admin user by setting isDeleted to true and also delete the user session and account
const deleteAdmin = async (id: string, user : IRequestUser) => {
    //TODO: Validate who is deleting the admin user. Only super admin can delete admin user and only super admin can delete super admin user but admin user cannot delete super admin user


    const isAdminExist = await prisma.admin.findUnique({
        where: {
            id,
        }
    })

    if (!isAdminExist) {
        throw new AppError(status.NOT_FOUND, "Admin Or Super Admin not found");
    }

    if(isAdminExist.id === user.userId){
        throw new AppError(status.BAD_REQUEST, "You cannot delete yourself");
    }

    const result = await prisma.$transaction(async (tx) => {
        await tx.admin.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
            },
        })

        await tx.user.update({
            where: { id: isAdminExist.userId },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                status: UserStatus.DELETED // Optional: you may also want to block the user
            },
        })

        await tx.session.deleteMany({
            where: { userId: isAdminExist.userId }
        })

        await tx.account.deleteMany({
            where: { userId: isAdminExist.userId }
        })

        const admin = await getAdminById(id);

        return admin;
    }
    )

    return result;
}

const changeUserStatus = async (user: IRequestUser, payload: IChangeUserStatusPayload) => {
  const isAdminExist = await prisma.admin.findUniqueOrThrow({
        where: {
            email: user.email,
        },
        include: {
            user: true,
        }

    });
    const { userId, userStatus } = payload;
        const userToChangeStatus = await prisma.user.findUniqueOrThrow({
            where: {
                id: userId,
            },
        })
    const selfStatusChange = isAdminExist.userId === userId;

    if (selfStatusChange) {
        throw new AppError(status.BAD_REQUEST, "You cannot change your own status");
    }
    if(isAdminExist.user.role === Role.ADMIN && userToChangeStatus.role === Role.SUPER_ADMIN){
        throw new AppError(status.BAD_REQUEST, "Admin cannot change super admin status");
    }
    if(isAdminExist.user.role === Role.ADMIN && userToChangeStatus.role === Role.ADMIN){
        throw new AppError(status.BAD_REQUEST, "Admin cannot change other admin status");
    }
    if(userStatus === UserStatus.DELETED){
        throw new AppError(status.BAD_REQUEST, "You cannot set user status to deleted. Please delete the user instead");
     
    }
    const updatedUser = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            status: userStatus,
        },
    })

    return updatedUser;

}

const changeUserRole=async(user :IRequestUser, payload :IChangeUserRolePayload )  =>{
    const isAdminExist = await prisma.admin.findUniqueOrThrow({
        where: {
            email: user.email,
        },
        include: {
            user: true,
        }

    });
    
    if (isAdminExist.user.role !== Role.SUPER_ADMIN) {
        throw new AppError(status.FORBIDDEN, "Only super admin can change user roles");
    }
    const { userId, role } = payload;
        const userToChangeRole = await prisma.user.findUniqueOrThrow({
            where: {
                id: userId,
            },
        })
    const selfRoleChange = isAdminExist.userId === userId; 
    
    if (selfRoleChange) {
        throw new AppError(status.BAD_REQUEST, "You cannot change your own role");
    }
    if(userToChangeRole.role === Role.DOCTOR || userToChangeRole.role === Role.PATIENT){
        throw new AppError(status.BAD_REQUEST, "You cannot change role of doctor or patient user");
    }
    
    const updatedUser = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            role: role,
        },
    })

    return updatedUser;
}

export const AdminService = {
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin,
    changeUserStatus,
    changeUserRole
}
