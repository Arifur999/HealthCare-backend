import {Router,} from "express";
import { specialtyController } from "./specialty.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";




const router = Router();

router.post('/',checkAuth(Role.ADMIN,Role.SUPER_ADMIN,Role.DOCTOR), specialtyController.createSpecialty);
router.get('/', specialtyController.getAllSpecialties);
router.delete('/:id', specialtyController.deleteSpecialty);
router.put('/:id',checkAuth(Role.ADMIN,Role.SUPER_ADMIN), specialtyController.updateSpecialty);


export const specialtyRoute = router;