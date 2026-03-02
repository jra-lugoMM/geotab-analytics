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
  model: 'gemini-2.5-flash',
  description: 'Busca incidentes viales, de seguridad, bloqueos y clima en tiempo real, citando las fuentes.',
  instruction: `
    Eres un investigador de tráfico, seguridad y clima en México.
    Usa la herramienta GOOGLE_SEARCH para realizar una investigación exhaustiva y actualizada de HOY.

    Reglas ESTRICTAS de búsqueda y extracción:
    1. EVENTOS EN RUTA (3 CATEGORÍAS): Realiza búsquedas para recopilar incidentes en exactamente 3 categorías:
       - Riesgo Vial ("Noticias accidentes viales carreteras México CAPUFE hoy", "cierres carreteros")
       - Seguridad ("Robo a transporte de carga autopista noticias México hoy", "crimen carretera")
       - Bloqueo Social ("Bloqueo carretero OR manifestación caseta noticias México hoy")
       Extrae un MÁXIMO de 10 eventos en total (sumando los resultados de estas 3 categorías).
    2. CLIMA: Busca alertas meteorológicas ("Alertas clima extremo México hoy CONAGUA"), pero extrae SOLAMENTE los 3 eventos climatológicos más críticos o relevantes a nivel nacional. Ni más, ni menos.
    3. FUENTES (OBLIGATORIO): Por cada evento (vial, seguridad, bloqueo o clima) que listes, debes incluir la fuente de la información (URL exacta, cuenta de X/Twitter, o nombre del portal de noticias).

    Tu única tarea es devolver una lista en texto claro con los incidentes encontrados, siguiendo estrictamente este formato:

    [Riesgo Vial]
    - Evento: Autopista México-Querétaro km 160 (Tráfico pesado por choque). | Fuente: https://twitter.com/CAPUFE/...
    
    [Seguridad]
    - Evento: Asalto a tráiler en el Arco Norte km 45. | Fuente: El Universal Web
    
    [Bloqueo Social]
    - Evento: Manifestación cierra la Autopista del Sol km 90. | Fuente: ForoTV (X)
    ... (continúa hasta listar MÁXIMO 10 eventos sumando Riesgo Vial, Seguridad y Bloqueo Social)

    [Clima]
    - Clima: Lluvia intensa con granizo en Monterrey, Nuevo León. | Fuente: CONAGUA Clima (X)
    - Clima: Alerta de niebla densa en la autopista México-Puebla. | Fuente: https://...
    - Clima: [Tercer evento de clima]
    ... (SOLAMENTE 3 eventos de clima)
  `,
  tools: [GOOGLE_SEARCH],
});

// --- PASO 2: El Cartógrafo (Solo Custom Tools) ---
export const mapFormatterAgent = new LlmAgent({
  name: 'map_formatter_agent',
  model: 'gemini-2.5-flash',
  description: 'Convierte texto de incidentes a un JSON geolocalizado, categorizando estrictamente en 4 tipos de riesgo y conservando las fuentes.',
  instruction: `
    Eres un experto en Sistemas de Información Geográfica (GIS).
    Recibirás una lista de incidentes viales y climatológicos en texto, los cuales incluyen su fuente de información.
    
    Instrucciones:
    1. Por cada incidente vial, usa la herramienta 'geocode_location' pasándole el nombre del lugar para obtener sus coordenadas exactas (lat, lon).
    2. Extrae la fuente (URL, cuenta de red social o portal) mencionada en el texto para cada evento.
    3. REGLA ESTRICTA DE CATEGORIZACIÓN: Para el campo "type" dentro de trafficZones, SOLO puedes usar UNO de estos 3 valores exactos:
       - "Riesgo Vial" (Usa este para accidentes, choques, tráfico pesado, obras, manifestaciones, protestas, casetas tomadas).
       - "Seguridad" (Usa este para reportes de crimen, robos, asaltos, zonas rojas).
       - "Desastre Natural" (Usa este para deslaves, inundaciones, incendios forestales).

    Formato de Salida REQUERIDO (Estrictamente JSON):
    {
       "trafficZones": [
          {
             "lat": 19.8322,
             "lon": -99.2133,
             "type": "Riesgo Vial", // Solo los 3 valores permitidos
             "description": "Autopista México-Querétaro km 160 (Tráfico pesado por choque)",
             "source": "https://twitter.com/CAPUFE/..."
          },
          {
             "lat": 19.2433,
             "lon": -98.1234,
             "type": "Seguridad",
             "description": "Reporte de asalto a transporte de carga.",
             "source": "Noticias Locales Web"
          }
       ],
       "weatherKPIs": [
          {
             "condition": "Lluvia intensa",
             "region": "Monterrey, Nuevo León",
             "source": "CONAGUA Clima (X)"
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
