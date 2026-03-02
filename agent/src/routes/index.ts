import { Router } from 'express';
import Geotab from './geotab.routes';
import Auth from './auth.routes';
import Vehicles from './vehicles.routes';
import Agent from './agents.routes';

const router = Router();
router.use('/geotab', Geotab);
router.use('/auth', Auth);
router.use('/vehicles', Vehicles);
router.use('/agent', Agent);

export default router;
