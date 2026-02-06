import {Router} from 'express';
import { specialtyRoute } from '../module/specialty/specialty.route';
import { AuthRoute } from '../module/auth/auth.route';

const router = Router();


router.use('/auth', AuthRoute);
router.use('/specialty', specialtyRoute);

export const indexRoute = router;