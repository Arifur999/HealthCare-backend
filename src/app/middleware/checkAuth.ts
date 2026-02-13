import { NextFunction, Request, Response } from "express";
import { cookieUtils } from "../utils/cookie";
import { prisma } from "../lib/prisma";
import { UserStatus } from "../../generated/prisma/enums";
import AppError from "../errorHelpers/AppError";
import status from "http-status";

export const checkAuth=(...authRoles:string[])=> async(req:Request,res:Response,next:NextFunction) =>{
try {
    const sessionToken = cookieUtils.getCookie(req, "better-auth.session_token");
if (!sessionToken){
    throw new Error('Unauthorized access! No session token found')
}

if(sessionToken){
    const sessionExists=await prisma.session.findFirst({
        where:{
            token: sessionToken,
            expiresAt: {
                gt: new Date(),
            },
        
        },
        include: {
            user: true,
        },
    
    })


    if(sessionExists && sessionExists.user){
        const user = sessionExists.user;
        const now =new Date();
const expiresAt =new Date (sessionExists.expiresAt)
const createAt =new Date (sessionExists.createdAt)
const sessionLifeTime =expiresAt.getTime() - createAt.getTime();
const timeRemaining = expiresAt.getTime() - now.getTime();
const percentRemaining = (timeRemaining / sessionLifeTime) * 100;

if (percentRemaining <20){
    res.setHeader("x-session-Refresh", "true");
    res.setHeader("x-session-expires-at", expiresAt.toISOString());
    res.setHeader ("x-Time-Remaining", timeRemaining.toString());
    

}


if( user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED){
    throw new AppError(status.UNAUTHORIZED,"Unauthorized access! User is blocked or deleted")
}






    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch (error: any) {
    next(error)

}


}