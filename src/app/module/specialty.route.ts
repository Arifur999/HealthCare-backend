import {Router} from "express";
import { specialtyController } from "./specialty.controller";




const router = Router();

router.post('/', specialtyController.createSpecialty);
router.get('/', specialtyController.getAllSpecialties);
router.post('/', specialtyController.createSpecialty);

export const specialtyRoute = router;