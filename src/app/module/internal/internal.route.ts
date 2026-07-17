import { Router } from "express";
import { InternalController } from "./internal.controller";

const router = Router();

router.post("/cancel-unpaid-appointments", InternalController.cancelUnpaidAppointments);

export const InternalRoutes = router;
