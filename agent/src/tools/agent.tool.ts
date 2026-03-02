import { FunctionTool } from '@google/adk';
import { z } from 'zod';
import { config } from '../config';

export const geocodingTool = new FunctionTool({
  name: 'geocode_location',
  description: 'Convierte el nombre de una calle, carretera o kilómetro en México a coordenadas de latitud y longitud.',
  parameters: z.object({
    locationQuery: z.string().describe("Ejemplo: 'Autopista México-Querétaro km 160'"),
  }),
  execute: async ({ locationQuery }) => {
    console.log(`[Tool] Solicitando coordenadas reales a Google Maps para: ${locationQuery}`);

    try {
      // 1. Obtén tu API Key del entorno (Backend)
      const apiKey = config.GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        throw new Error('Falta GOOGLE_MAPS_API_KEY en el entorno.');
      }

      // 2. Concatenamos ", México" para que Maps no busque calles en otros países
      const query = encodeURIComponent(`${locationQuery}, México`);
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${apiKey}`;

      // 3. Hacemos la petición a Google Maps
      const response = await fetch(url);
      const data = await response.json();

      // 4. Si Google Maps encontró el lugar, extraemos lat y lng
      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        const formattedAddress = data.results[0].formatted_address;

        console.log(`[Tool] Éxito: ${formattedAddress} -> ${location.lat}, ${location.lng}`);

        return {
          lat: location.lat,
          lon: location.lng, // Google usa 'lng', lo pasamos como 'lon' a nuestra IA
          match: formattedAddress,
        };
      } else {
        console.warn(`[Tool] Google Maps no encontró: ${locationQuery}`);
        // Retornamos el centro de México como fallback en caso de que no exista
        return { lat: 23.6345, lon: -102.5528, match: 'Centro de México (Fallback)' };
      }
    } catch (error) {
      console.error('[Tool] Error al consultar Google Maps Geocoding API:', error);
      // Fallback seguro para no romper el JSON del agente
      return { lat: 23.6345, lon: -102.5528, match: 'Error de red' };
    }
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
