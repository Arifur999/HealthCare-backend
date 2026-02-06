import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

export const AuthRoute = router;

router.post('/register', authController.registerPatient);
router.post('/login', authController.loginPatient);