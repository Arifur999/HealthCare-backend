import { NextFunction, Request, Response } from "express";
import { cookieUtils } from "../utils/cookie";
import { prisma } from "../lib/prisma";
import { UserStatus } from "../../generated/prisma/enums";
import AppError from "../errorHelpers/AppError";
import status from "http-status";
import { jwtUtils } from "../utils/jwt";
import { env } from "../../config/env";

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
if(user.isDeleted){
    throw new AppError(status.UNAUTHORIZED,"Unauthorized access! User is deleted")

}

if(authRoles.length >0 && !authRoles.includes(user.role)){
    throw new AppError(status.FORBIDDEN,"Forbidden access! You are not authorized to access this route")
    }



    }


const accessToken = cookieUtils.getCookie(req, "accessToken");
if (!accessToken) {
    throw new AppError(status.UNAUTHORIZED, "Unauthorized access! No access token found");
}





}

//access token verification 
const accessToken =cookieUtils.getCookie(req,"accessToken");
    if(!accessToken){
        throw new AppError(status.UNAUTHORIZED," Unauthorized access! No access token found")
    }
    const verifiedToken= jwtUtils.verifyToken(accessToken,env.ACCESS_TOKEN_SECRET);
    if(!verifiedToken.success){
        throw new AppError(status.UNAUTHORIZED,verifiedToken.message)
    }

if(verifiedToken.decoded!.role !== "ADMIN"){
    throw new AppError(status.FORBIDDEN,"Forbidden access! Only admins can access this route")
}

    next();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch (error: any) {
    next(error)

}


}