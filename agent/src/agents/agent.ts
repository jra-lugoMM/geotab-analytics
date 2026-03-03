import { LlmAgent, GOOGLE_SEARCH } from '@google/adk';
import AgentRunner from './runner';
import { fleetAnalyzerPrompt, globalFleetAnalyzerPrompt } from '../prompts/agent.prompts';
import { geocodingTool } from '../tools/agent.tool';

// Función auxiliar para generar la instrucción de idioma
const getLangInstruction = (lang: string) =>
  lang === 'en'
    ? 'CRITICAL: All your output (descriptions, event details, weather conditions) MUST be in ENGLISH.'
    : 'CRÍTICO: Todas tus respuestas (descripciones, detalles de eventos, condiciones climáticas) DEBEN estar en ESPAÑOL.';

// --- AGENTES DE FLOTA (Ahora como funciones para soportar idioma) ---

export const getFleetAnalyzerAgent = (lang: string) =>
  new LlmAgent({
    name: 'fleet_sustainability_agent',
    model: 'gemini-2.5-flash',
    description: 'Analiza telemetría para recomendar transiciones por vehículo.',
    instruction: `${fleetAnalyzerPrompt}\n\n${getLangInstruction(lang)}`,
  });

export const getGlobalFleetAnalyzerAgent = (lang: string) =>
  new LlmAgent({
    name: 'global_fleet_agent',
    model: 'gemini-2.5-flash',
    description: 'Genera un diagnóstico global ejecutivo y predicciones para toda la flotilla.',
    instruction: `${globalFleetAnalyzerPrompt}\n\n${getLangInstruction(lang)}`,
  });

// --- AGENTES DE MAPA E INTELIGENCIA ---

export const getNewsSearcherAgent = (lang: string) =>
  new LlmAgent({
    name: 'news_searcher_agent',
    model: 'gemini-2.5-flash',
    description: 'Busca incidentes viales, de seguridad, bloqueos y clima en tiempo real, citando las fuentes.',
    instruction: `
    Eres un investigador de tráfico, seguridad y clima en México.
    Usa la herramienta GOOGLE_SEARCH para realizar una investigación exhaustiva y actualizada de HOY.

    ${getLangInstruction(lang)}

    Reglas ESTRICTAS de búsqueda y extracción:
    1. EVENTOS EN RUTA (3 CATEGORÍAS): Realiza búsquedas para recopilar incidentes en exactamente 3 categorías:
       - Riesgo Vial ("Noticias accidentes viales carreteras México CAPUFE hoy", "cierres carreteros")
       - Seguridad ("Robo a transporte de carga autopista noticias México hoy", "crimen carretera")
       - Bloqueo Social ("Bloqueo carretero OR manifestación caseta noticias México hoy")
       Extrae un MÁXIMO de 4 eventos en total.
    2. CLIMA: Busca alertas meteorológicas ("Alertas clima extremo México hoy CONAGUA"), extrae SOLAMENTE los 3 eventos más críticos.
    3. FUENTES (OBLIGATORIO): Incluye la URL exacta o portal para cada evento.

    Tu única tarea es devolver una lista en texto claro siguiendo este formato:

    [Riesgo Vial]
    - Evento: [Descripción en ${lang}] | Fuente: [URL]
    
    [Seguridad]
    - Evento: [Descripción en ${lang}] | Fuente: [URL]
    
    [Bloqueo Social]
    - Evento: [Descripción en ${lang}] | Fuente: [URL]

    [Clima]
    - Clima: [Descripción en ${lang}] | Fuente: [URL]
  `,
    tools: [GOOGLE_SEARCH],
  });

export const getMapFormatterAgent = (lang: string) =>
  new LlmAgent({
    name: 'map_formatter_agent',
    model: 'gemini-2.5-flash',
    description: 'Convierte texto de incidentes a un JSON geolocalizado.',
    instruction: `
    Eres un experto en Sistemas de Información Geográfica (GIS).
    Recibirás una lista de incidentes.
    
    ${getLangInstruction(lang)}

    Instrucciones:
    1. Por cada incidente vial, usa 'geocode_location' para obtener (lat, lon).
    2. Extrae la fuente (source).
    3. REGLA DE IDIOMA PARA JSON: Traduce los campos "description", "condition" y "region" al idioma solicitado (${lang}).
    4. REGLA DE CATEGORIZACIÓN (NO TRADUCIR ESTO): Para el campo "type", utiliza EXCLUSIVAMENTE uno de estos valores en español para compatibilidad con el sistema: "Riesgo Vial", "Seguridad", "Desastre Natural".

    Formato de Salida REQUERIDO (JSON puro):
    {
       "trafficZones": [
          {
             "lat": number,
             "lon": number,
             "type": "Riesgo Vial" | "Seguridad" | "Desastre Natural",
             "description": "Translated description here",
             "source": "string"
          }
       ],
       "weatherKPIs": [
          {
             "condition": "Translated condition",
             "region": "Translated region",
             "source": "string"
          }
       ]
    }
  `,
    tools: [geocodingTool],
  });

export const createRunners = (lang: string = 'es') => {
  return {
    fleetAgentRunner: new AgentRunner(getFleetAnalyzerAgent(lang), `fleet_app_${lang}`),
    globalAgentRunner: new AgentRunner(getGlobalFleetAnalyzerAgent(lang), `global_app_${lang}`),
    searchRunner: new AgentRunner(getNewsSearcherAgent(lang), `search_app_${lang}`),
    mapRunner: new AgentRunner(getMapFormatterAgent(lang), `map_app_${lang}`),
  };
};
