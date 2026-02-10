import { Router } from "express";
import { doctorController } from "./doctor.controller";
import { updateDoctorZodSchema } from "./doctor.validation";
import { validateRequest } from "../../middleware/validateRequest";

const router =Router()

router.get('/', doctorController.getAllDoctors)
router.get('/:id', doctorController.getDoctorById)
router.put('/:id',validateRequest(updateDoctorZodSchema), doctorController.updateDoctor)
router.delete('/:id', doctorController.deleteDoctor)

export const doctorRoute=router;