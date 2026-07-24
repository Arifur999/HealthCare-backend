import { Router } from "express";
import { authController } from "./auth.controller.js";
import { Role } from "../../../generated/prisma/enums.js";
import { checkAuth } from "../../middleware/checkAuth.js";
import { authRateLimiter } from "../../middleware/rateLimiter.js";

const router = Router();

export const AuthRoute = router;

// Throttle brute-force-prone endpoints (credential stuffing, password reset abuse).
router.post('/register', authRateLimiter, authController.registerPatient);
router.post('/login', authRateLimiter, authController.loginUser);
router.get("/me", checkAuth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN), authController.getMe)
router.post("/refresh-token", authController.getNewToken)
router.post("/change-password", checkAuth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN), authController.changePassword)
router.post("/logout", checkAuth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN), authController.logoutUser)
router.post("/verify-email", authController.verifyEmail)
router.post("/forget-password", authRateLimiter, authController.forgetPassword)
router.post("/reset-password", authRateLimiter, authController.resetPassword)

router.get("/login/google",authController.googleLogin)
router.get("/google/success",authController.googleLoginSuccess)
router.get("/oauth/error",authController.handleOAuthError)



