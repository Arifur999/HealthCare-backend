import {Router} from 'express';
import { specialtyRoute } from '../module/specialty/specialty.route';
import { AuthRoute } from '../module/auth/auth.route';
import { UserRoutes } from '../module/user/user.route';

const router = Router();


router.use('/auth', AuthRoute);
router.use('/specialty', specialtyRoute);
router.use('/doctor', UserRoutes);

export const indexRoute = router;