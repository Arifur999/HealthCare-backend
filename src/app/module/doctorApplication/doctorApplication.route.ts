import { Router } from "express";
import { Role } from "../../../generated/prisma/enums.js";
import { checkAuth } from "../../middleware/checkAuth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { DoctorApplicationController } from "./doctorApplication.controller.js";
import { createDoctorApplicationZodSchema } from "./doctorApplication.validation.js";

const router = Router();

// Public: anyone can apply to join as a doctor.
router.post(
    "/",
    validateRequest(createDoctorApplicationZodSchema),
    DoctorApplicationController.createApplication,
);

// Admin: review and decide on applications.
router.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DoctorApplicationController.getApplications);
router.patch("/:id/approve", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DoctorApplicationController.approveApplication);
router.patch("/:id/reject", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DoctorApplicationController.rejectApplication);

export const DoctorApplicationRoutes = router;
