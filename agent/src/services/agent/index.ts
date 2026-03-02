import { createRunners } from '../../agents/agent';

class AgentService {
  async analyzeFleet(vehiclesData: any[], lang: string = 'es'): Promise<any> {
    try {
      // Creamos los runners específicos para el idioma solicitado
      const { fleetAgentRunner } = createRunners(lang);
      const response = await fleetAgentRunner.runAgent(vehiclesData);

      const cleanedResponse = response.replace(/```json|```/g, '').trim();
      const jsonResponse = JSON.parse(cleanedResponse);

      return { success: true, insights: jsonResponse };
    } catch (error) {
      console.error('Error in AgentService:', error);
      throw new Error('Failed to process fleet data');
    }
  }

  async analyzeGlobalFleet(vehiclesData: any[], lang: string = 'es'): Promise<any> {
    try {
      const { globalAgentRunner } = createRunners(lang);
      const response = await globalAgentRunner.runAgent(vehiclesData, `global_session_${Date.now()}`);

      const cleanedResponse = response.replace(/```json|```/g, '').trim();
      const jsonResponse = JSON.parse(cleanedResponse);

      return { success: true, globalInsights: jsonResponse };
    } catch (error) {
      console.error('Error in analyzeGlobalFleet:', error);
      throw new Error('Failed to process global fleet data');
    }
  }

  async fetchMapData(lang: string = 'es') {
    try {
      const { searchRunner, mapRunner } = createRunners(lang);

      console.log(`🕵️‍♂️ [Paso 1] Agente Investigador buscando en idioma: ${lang}...`);
      const rawIncidentsText = await searchRunner.runAgent(
        `Obtén el reporte vial y de clima más reciente de México. Responde en ${lang === 'en' ? 'Inglés' : 'Español'}.`,
        `session_search_${Date.now()}`,
      );

      console.log('🗺️ [Paso 2] Agente Cartógrafo procesando ubicaciones y armando JSON...');
      const jsonResponseText = await mapRunner.runAgent(rawIncidentsText, `session_map_${Date.now()}`);

      const cleanedResponse = jsonResponseText.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error('Error en el pipeline de inteligencia de mapas:', error);
      throw error;
    }
  }
}

export default new AgentService();
