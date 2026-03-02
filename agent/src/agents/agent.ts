import { LlmAgent, GOOGLE_SEARCH } from '@google/adk';
import AgentRunner from './runner';
import { fleetAnalyzerPrompt, globalFleetAnalyzerPrompt } from '../prompts/agent.prompts';
import { geocodingTool } from '../tools/agent.tool';

const fleetAnalyzerAgent = new LlmAgent({
  name: 'fleet_sustainability_agent',
  model: 'gemini-2.5-flash',
  description: 'Analiza telemetría para recomendar transiciones por vehículo.',
  instruction: fleetAnalyzerPrompt,
});

const globalFleetAnalyzerAgent = new LlmAgent({
  name: 'global_fleet_agent',
  model: 'gemini-2.5-flash',
  description: 'Genera un diagnóstico global ejecutivo y predicciones para toda la flotilla.',
  instruction: globalFleetAnalyzerPrompt,
});

export const newsSearcherAgent = new LlmAgent({
  name: 'news_searcher_agent',
  model: 'gemini-2.5-pro',
  description: 'Busca incidentes viales y clima en tiempo real.',
  instruction: `
    Eres un investigador de tráfico y clima en México.
    Usa GOOGLE_SEARCH para buscar:
    1. "Noticias accidentes viales carreteras México CAPUFE hoy"
    2. "Alertas clima extremo México hoy"
    
    Tu única tarea es devolver una lista en texto claro con los incidentes encontrados.
    Ejemplo de salida:
    - Accidente: Autopista México-Querétaro km 160 (Tráfico pesado).
    - Clima: Lluvia intensa en Monterrey, Nuevo León.
  `,
  tools: [GOOGLE_SEARCH], // Solo Google Search
});

// --- PASO 2: El Cartógrafo (Solo Custom Tools) ---
export const mapFormatterAgent = new LlmAgent({
  name: 'map_formatter_agent',
  model: 'gemini-2.5-pro',
  description: 'Convierte texto de incidentes a un JSON geolocalizado.',
  instruction: `
    Eres un experto en Sistemas de Información Geográfica (GIS).
    Recibirás una lista de incidentes viales y climatológicos en texto.
    
    Instrucciones:
    1. Por cada incidente vial, usa la herramienta 'geocode_location' pasándole el nombre del lugar para obtener sus coordenadas (lat, lon).
    2. Estructura un JSON puro con los datos.

    Formato de Salida REQUERIDO (Estrictamente JSON):
    {
       "trafficZones": [
          {
             "lat": 19.8322,
             "lon": -99.2133,
             "type": "Accident",
             "description": "Autopista México-Querétaro km 160 (Tráfico pesado)"
          }
       ],
       "weatherKPIs": [
          {
             "condition": "Lluvia intensa",
             "region": "Monterrey, Nuevo León"
          }
       ]
    }
    Devuelve SOLO el JSON, sin bloques de markdown.
  `,
  tools: [geocodingTool], // Solo tus Custom Tools
});

export const fleetAgentRunner = new AgentRunner(fleetAnalyzerAgent, 'fleet_green_app');
export const globalAgentRunner = new AgentRunner(globalFleetAnalyzerAgent, 'global_fleet_app');
export const searchRunner = new AgentRunner(newsSearcherAgent, 'search_app');
export const mapRunner = new AgentRunner(mapFormatterAgent, 'map_app');
