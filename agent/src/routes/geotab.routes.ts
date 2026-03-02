import express from 'express';

import GeotabController from '../controllers/geotab.controller';

const router = express.Router();
router.get('/', GeotabController.get);

export default router;
