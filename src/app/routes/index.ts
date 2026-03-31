import {Router} from 'express';
import { specialtyRoute } from '../module/specialty/specialty.route';
import { AuthRoute } from '../module/auth/auth.route';
import { UserRoutes } from '../module/user/user.route';
import { DoctorRoutes } from '../module/doctor/doctor.route';
import { PatientRoutes } from '../module/patient/patient.route';
import { AdminRoutes } from '../module/admin/admin.route';
import { DoctorScheduleRoutes } from '../module/doctorSchedule/doctorSchedule.route';
import { AppointmentRoutes } from '../module/appointment/appointment.route';
import { scheduleRoutes } from '../module/schedule/schedule.route';
import { PrescriptionRoutes } from '../module/prescription/prescription.route';
import { ReviewRoutes } from '../module/review/review.route';
import { PaymentRoutes } from '../module/payment/payment.route';
import { StatsRoutes } from '../module/stats/stats.route';

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
router.use('/doctor-specialties', DoctorScheduleRoutes);
router.use('/appointments',AppointmentRoutes);
router.use("/prescriptions", PrescriptionRoutes);
router.use("/reviews", ReviewRoutes);
router.use("/stats", StatsRoutes);
router.use("/payments", PaymentRoutes)
export const indexRoute = router;








