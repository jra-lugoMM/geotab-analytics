import AgentService from '../services/agent/index';

class AgentController {
  async analyzeVehicles(request: any, reply: any) {
    try {
      const data = request.body as any[];
      const lang = request.query.lang || 'es';
      const result = await AgentService.analyzeFleet(data, lang);

      reply.status(200).send({
        success: true,
        message: 'Vehicles analyzed successfully',
        data: result.insights,
      });
    } catch (error: any) {
      reply.status(400).send({
        success: false,
        message: error.message || 'Error processing request',
      });
    }
  }

  async analyzeGlobal(request: any, reply: any) {
    try {
      const data = request.body as any[];
      const lang = request.query.lang || 'es';
      const result = await AgentService.analyzeGlobalFleet(data, lang);

      reply.status(200).send({
        status: true,
        message: 'Global fleet analysis completed successfully',
        data: result.globalInsights,
      });
    } catch (error: any) {
      reply.status(400).send({
        status: false,
        message: error.message || 'Error processing global analysis request',
        data: null,
      });
    }
  }

  async getMapIntelligence(request: any, reply: any) {
    try {
      const lang = request.query.lang || 'es';
      const result = await AgentService.fetchMapData(lang);

      reply.status(200).send({
        status: true,
        message: 'Map intelligence fetched successfully',
        data: result,
      });
    } catch (error: any) {
      reply.status(400).send({
        status: false,
        message: error.message || 'Error processing map intelligence request',
        data: null,
      });
    }
  }
}

export default new AgentController();
