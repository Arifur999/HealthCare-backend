import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth.js";
import { Role } from "../../../generated/prisma/enums.js";
import { PaymentController } from "./payment.controller.js";

const router =Router();

router.get("/",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    PaymentController.getAllPayments
)

export const PaymentRoutes = router;
