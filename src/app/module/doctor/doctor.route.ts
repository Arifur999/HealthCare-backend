import { Router } from "express";
import { doctorController } from "./doctor.controller";
import { updateDoctorZodSchema } from "./doctor.validation";
import { validateRequest } from "../../middleware/validateRequest";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router =Router()

router.get('/',checkAuth (Role.ADMIN,Role.SUPER_ADMIN),doctorController.getAllDoctors)
router.get('/:id', checkAuth (Role.ADMIN,Role.SUPER_ADMIN),doctorController.getDoctorById)
router.put('/:id',checkAuth (Role.ADMIN,Role.SUPER_ADMIN),validateRequest(updateDoctorZodSchema), doctorController.updateDoctor)
router.delete('/:id',checkAuth (Role.ADMIN,Role.SUPER_ADMIN), doctorController.deleteDoctor)

export const doctorRoute=router;