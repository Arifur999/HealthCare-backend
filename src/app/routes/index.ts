import {Router} from 'express';
import { specialtyRoute } from '../module/specialty.route';

const router = Router();

router.use('/specialty', specialtyRoute);

export const indexRoute = router;