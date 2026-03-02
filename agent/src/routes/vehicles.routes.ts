import express from 'express';

import VehiclesController from '../controllers/vehicles.controller';

const router = express.Router();
router.get('/', VehiclesController.getDevices);
router.get('/kpis', VehiclesController.getKPIs);

export default router;
