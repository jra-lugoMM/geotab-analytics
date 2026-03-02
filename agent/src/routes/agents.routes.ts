import express from 'express';

import AgentController from '../controllers/agent.controller';

const router = express.Router();
router.post('/analyze', AgentController.analyzeVehicles);
router.post('/analyze-global', AgentController.analyzeGlobal);
router.post('/map-intelligence', AgentController.getMapIntelligence);

export default router;
