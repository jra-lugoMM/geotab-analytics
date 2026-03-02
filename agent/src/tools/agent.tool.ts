import { FunctionTool } from '@google/adk';
import { z } from 'zod';

export const geocodingTool = new FunctionTool({
  name: 'geocode_location',
  description: 'Convierte el nombre de una calle, carretera o kilómetro en México a coordenadas de latitud y longitud.',
  parameters: z.object({
    locationQuery: z.string().describe("Ejemplo: 'Autopista México-Querétaro km 160'"),
  }),
  execute: async ({ locationQuery }) => {
    console.log(`[Tool] Buscando coordenadas para: ${locationQuery}`);

    return {
      lat: 19.8322,
      lon: -99.2133,
      match: 'Ubicación encontrada para: ' + locationQuery,
    };
  },
});

export const weatherTool = new FunctionTool({
  name: 'get_weather_alerts',
  description: 'Obtiene alertas climatológicas extremas para unas coordenadas geográficas específicas.',
  parameters: z.object({
    lat: z.number().describe('Latitud de la zona a consultar'),
    lon: z.number().describe('Longitud de la zona a consultar'),
  }),
  execute: async ({ lat, lon }) => {
    console.log(`[Tool] Buscando clima para: ${lat}, ${lon}`);
    return {
      condition: 'Lluvia intensa',
      riskLevel: 'High',
      recommendation: 'Reducir velocidad a 60 km/h',
    };
  },
});
