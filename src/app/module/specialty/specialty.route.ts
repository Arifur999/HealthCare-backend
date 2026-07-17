import {Router,} from "express";
import { specialtyController } from "./specialty.controller.js";
import { checkAuth } from "../../middleware/checkAuth.js";
import { Role } from "../../../generated/prisma/enums.js";
import { multerUpload } from "../../../config/multer.config.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { specialtyValidation } from "./specialty.validation.js";




const router = Router();

router.post('/',
    checkAuth(Role.ADMIN,Role.SUPER_ADMIN)
,multerUpload.single("file"),validateRequest(specialtyValidation.createSpecialty),
 specialtyController.createSpecialty);
router.get('/', specialtyController.getAllSpecialties);
router.delete('/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), specialtyController.deleteSpecialty);
router.put('/:id',checkAuth(Role.ADMIN,Role.SUPER_ADMIN), specialtyController.updateSpecialty);


export const specialtyRoute = router;