import {Router} from 'express';
import { specialtyRoute } from '../module/specialty/specialty.route.js';
import { AuthRoute } from '../module/auth/auth.route.js';
import { UserRoutes } from '../module/user/user.route.js';
import { DoctorRoutes } from '../module/doctor/doctor.route.js';
import { PatientRoutes } from '../module/patient/patient.route.js';
import { AdminRoutes } from '../module/admin/admin.route.js';
import { DoctorScheduleRoutes } from '../module/doctorSchedule/doctorSchedule.route.js';
import { AppointmentRoutes } from '../module/appointment/appointment.route.js';
import { scheduleRoutes } from '../module/schedule/schedule.route.js';
import { PrescriptionRoutes } from '../module/prescription/prescription.route.js';
import { ReviewRoutes } from '../module/review/review.route.js';
import { PaymentRoutes } from '../module/payment/payment.route.js';
import { StatsRoutes } from '../module/stats/stats.route.js';
import { RagRoutes } from '../module/rag/rag.route.js';
import { InternalRoutes } from '../module/internal/internal.route.js';
import { NotificationRoutes } from '../module/notification/notification.route.js';
import { NewsRoutes } from '../module/news/news.route.js';
import { DoctorApplicationRoutes } from '../module/doctorApplication/doctorApplication.route.js';

const router = Router();


router.use('/auth', AuthRoute);
router.use('/specialty', specialtyRoute);
router.use('/users', UserRoutes);
router.use('/patients', PatientRoutes);
router.use('/doctors', DoctorRoutes);
router.use('/admins', AdminRoutes);
router.use("/schedules", scheduleRoutes);
router.use('/specialties', specialtyRoute);
router.use("/doctor-schedules", DoctorScheduleRoutes)
router.use('/appointments',AppointmentRoutes);
router.use("/prescriptions", PrescriptionRoutes);
router.use("/reviews", ReviewRoutes);
router.use("/stats", StatsRoutes);
router.use("/payments", PaymentRoutes);
router.use("/rag", RagRoutes);
router.use("/internal", InternalRoutes);
router.use("/notifications", NotificationRoutes);
router.use("/news", NewsRoutes);
router.use("/doctor-applications", DoctorApplicationRoutes);


export const indexRoute = router;








