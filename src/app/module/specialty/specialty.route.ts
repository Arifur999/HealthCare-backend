import {Router,} from "express";
import { specialtyController } from "./specialty.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../../config/multer.config";
import { validateRequest } from "../../middleware/validateRequest";
import { specialtyValidation } from "./specialty.validation";




const router = Router();

router.post('/',
    checkAuth(Role.ADMIN,Role.SUPER_ADMIN)
,multerUpload.single("file"),validateRequest(specialtyValidation.createSpecialty),
 specialtyController.createSpecialty);
router.get('/', specialtyController.getAllSpecialties);
router.delete('/:id', specialtyController.deleteSpecialty);
router.put('/:id',checkAuth(Role.ADMIN,Role.SUPER_ADMIN), specialtyController.updateSpecialty);


export const specialtyRoute = router;