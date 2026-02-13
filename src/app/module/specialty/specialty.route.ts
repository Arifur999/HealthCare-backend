import {Router,Request, Response, NextFunction} from "express";
import { specialtyController } from "./specialty.controller";
import { cookieUtils } from "../../utils/cookie";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { jwtUtils } from "../../utils/jwt";
import { env } from "../../../config/env";




const router = Router();

router.post('/', specialtyController.createSpecialty);
router.get('/', async(req:Request,res:Response,next :NextFunction)=>{
try {
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
} catch (error :any) {
    next(error);
}
    
} ,specialtyController.getAllSpecialties);
router.delete('/:id', specialtyController.deleteSpecialty);
router.put('/:id', specialtyController.updateSpecialty);


export const specialtyRoute = router;