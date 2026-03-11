import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { ScheduleController } from "./schedule.controller";

const router = Router();

router.get('/', checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR), ScheduleController.getAllSchedules);
router.get('/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR), ScheduleController.getScheduleById);

export const scheduleRoutes = router;