import {  Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createDoctorZodSchema } from "./user.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";



const router=Router()



router.post('/create-doctor',checkAuth(Role.ADMIN, Role.SUPER_ADMIN),validateRequest(createDoctorZodSchema),userController.createDoctor)
    
// router.post('/create-doctor', (req:Request, res:Response, next:NextFunction) => {
// const parseResult = createDoctorZodSchema.safeParse(req.body);
// if (!parseResult.success) {
//   next(parseResult.error);
// }
// req.body = parseResult.data;
// next();

// },validateRequest(createDoctorZodSchema),userController.createDoctor)

 
// router.post('/create-doctor', userController.createDoctor)
// router.post('/create-admin', userController.createDoctor)
// router.post('/create-super-admin', userController.createDoctor)


export const UserRoutes=router;