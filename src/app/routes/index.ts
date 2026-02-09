import {Router} from 'express';
import { specialtyRoute } from '../module/specialty/specialty.route';
import { AuthRoute } from '../module/auth/auth.route';
import { UserRoutes } from '../module/user/user.route';
import { doctorRoute } from '../module/doctor/doctor.route';

const router = Router();


router.use('/auth', AuthRoute);
router.use('/specialty', specialtyRoute);
router.use('/users', UserRoutes);
router.use('/doctors', doctorRoute);

export const indexRoute = router;