import { fleetAgentRunner, globalAgentRunner, mapRunner, searchRunner } from '../../agents/agent';

class AgentService {
  async analyzeFleet(vehiclesData: any[]): Promise<any> {
    try {
      const response = await fleetAgentRunner.runAgent(vehiclesData);

      const cleanedResponse = response.replace(/```json|```/g, '').trim();
      const jsonResponse = JSON.parse(cleanedResponse);

      return { success: true, insights: jsonResponse };
    } catch (error) {
      console.error('Error in AgentService:', error);
      throw new Error('Failed to process fleet data');
    }
  }

  async analyzeGlobalFleet(vehiclesData: any[]): Promise<any> {
    try {
      const response = await globalAgentRunner.runAgent(vehiclesData, 'global_session_1');

      const cleanedResponse = response.replace(/```json|```/g, '').trim();
      const jsonResponse = JSON.parse(cleanedResponse);

      return { success: true, globalInsights: jsonResponse };
    } catch (error) {
      console.error('Error in analyzeGlobalFleet:', error);
      throw new Error('Failed to process global fleet data');
    }
  }

  async fetchMapData() {
    try {
      console.log('🕵️‍♂️ [Paso 1] Agente Investigador buscando noticias en Google...');
      const rawIncidentsText = await searchRunner.runAgent('Obtén el reporte vial y de clima más reciente de México.', 'session_search_1');

      console.log('🗺️ [Paso 2] Agente Cartógrafo procesando ubicaciones y armando JSON...');
      // Le pasamos el texto que encontró el primer agente al segundo agente
      const jsonResponseText = await mapRunner.runAgent(rawIncidentsText, 'session_map_1');

      const cleanedResponse = jsonResponseText.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error('Error en el pipeline de inteligencia de mapas:', error);
      throw error;
    }
  }
}

export default new AgentService();
