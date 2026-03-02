import React, { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, OverlayView } from "@react-google-maps/api";
import { I } from "../components/Icons";

const containerStyle = { width: "100%", height: "100%" };
const center = { lat: 23.6345, lng: -102.5528 };

// Estilo Ciberpunk Oscuro para Google Maps
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9e9e9e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [{ color: "#2c2c2c" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#000000" }],
  },
];

export const MapView = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [mapData, setMapData] = useState({ trafficZones: [], weatherKPIs: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);

  const [currentWeatherIndex, setCurrentWeatherIndex] = useState(0);

  useEffect(() => {
    const fetchMapIntelligence = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "http://localhost:3000/api/agent/map-intelligence",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          },
        );
        const json = await response.json();

        if (json.status) {
          setMapData(json.data);
        } else {
          setError("Error al obtener inteligencia de mapeo.");
        }
      } catch (err) {
        console.error(err);
        setError("Error de conexión con el servidor de mapas.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMapIntelligence();
  }, []);

  // El carrusel automático se reinicia cada vez que cambia el índice (incluso si fue manual)
  useEffect(() => {
    if (mapData.weatherKPIs.length > 0) {
      const interval = setInterval(() => {
        setCurrentWeatherIndex(
          (prev) => (prev + 1) % mapData.weatherKPIs.length,
        );
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [mapData.weatherKPIs, currentWeatherIndex]);

  // Controles manuales del Clima
  const handlePrevWeather = () => {
    setCurrentWeatherIndex((prev) =>
      prev === 0 ? mapData.weatherKPIs.length - 1 : prev - 1,
    );
  };
  const handleNextWeather = () => {
    setCurrentWeatherIndex((prev) => (prev + 1) % mapData.weatherKPIs.length);
  };

  // --- LÓGICA DE ESTILOS DINÁMICOS ---

  const getWeatherTheme = (condition) => {
    const text = condition.toLowerCase();
    if (text.includes("lluvia")) {
      return {
        bg: "bg-gradient-to-br from-blue-900/80 to-blue-950/90 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.3)]",
        icon: (
          <I.CloudRain className="w-10 h-10 text-blue-400 animate-bounce" />
        ),
        accent: "text-blue-400",
      };
    }
    if (text.includes("viento") || text.includes("tolvanera")) {
      return {
        bg: "bg-gradient-to-br from-gray-800/80 to-teal-900/90 border-teal-500/50 shadow-[0_0_30px_rgba(20,184,166,0.3)]",
        icon: <I.Wind className="w-10 h-10 text-teal-400 animate-pulse" />,
        accent: "text-teal-400",
      };
    }
    return {
      bg: "bg-gradient-to-br from-orange-900/80 to-red-950/90 border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.3)]",
      icon: (
        <I.Sun className="w-10 h-10 text-orange-400 animate-[spin_8s_linear_infinite]" />
      ),
      accent: "text-orange-400",
    };
  };

  const currentTheme =
    mapData.weatherKPIs.length > 0
      ? getWeatherTheme(mapData.weatherKPIs[currentWeatherIndex].condition)
      : null;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] animate-fade-in space-y-4">
      <header>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Inteligencia de Ruta & Clima
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Monitoreo de vialidad y radar meteorológico impulsado por IA.
        </p>
      </header>

      <div className="relative flex-1 rounded-2xl overflow-hidden glass-panel border border-gray-200 dark:border-gray-800 shadow-xl">
        {isLoading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gray-50/80 dark:bg-black/80 backdrop-blur-sm">
            <I.Cpu className="w-10 h-10 animate-spin text-blue-500 mb-4" />
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              Conectando con Google Maps...
            </p>
          </div>
        )}

        {/* GALERÍA DE CLIMA (FLOTANTE, ESTILOS DINÁMICOS Y NAVEGACIÓN) */}
        {!isLoading && mapData.weatherKPIs.length > 0 && currentTheme && (
          <div className="absolute top-6 right-6 z-10 w-80 pointer-events-none">
            <div
              key={currentWeatherIndex}
              className={`p-5 rounded-2xl backdrop-blur-xl border ${currentTheme.bg} pointer-events-auto transition-all duration-500 animate-fade-in`}
            >
              {/* Animación de fondo decorativa */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none opacity-20 mix-blend-overlay">
                <div
                  className={`absolute w-[200%] h-[200%] -top-1/2 -left-1/2 bg-[radial-gradient(circle,rgba(255,255,255,0.8)_0%,transparent_60%)] animate-[spin_10s_linear_infinite]`}
                ></div>
              </div>

              <div className="relative z-10 flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-black/40 rounded-xl shadow-inner border border-white/10">
                  {currentTheme.icon}
                </div>
                <div className="flex-1">
                  <span
                    className={`text-[10px] uppercase tracking-widest font-bold mb-1 block ${currentTheme.accent}`}
                  >
                    Alerta Vibe AI
                  </span>
                  <h4 className="text-sm font-bold text-white leading-tight mb-1">
                    {mapData.weatherKPIs[currentWeatherIndex].condition}
                  </h4>
                  <p
                    className="text-xs text-white/70 line-clamp-2"
                    title={mapData.weatherKPIs[currentWeatherIndex].region}
                  >
                    {mapData.weatherKPIs[currentWeatherIndex].region}
                  </p>
                </div>
              </div>

              {/* Controles del Carrusel */}
              <div className="relative z-10 flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                <button
                  onClick={handlePrevWeather}
                  className="p-1 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
                >
                  <I.ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex gap-1">
                  {mapData.weatherKPIs.map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentWeatherIndex ? `bg-white scale-125` : `bg-white/30`}`}
                    />
                  ))}
                </div>
                <button
                  onClick={handleNextWeather}
                  className="p-1 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
                >
                  <I.ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAPA DE GOOGLE */}
        {isLoaded && !error && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={5}
            onClick={() => setActiveMarker(null)} // Cierra la tarjeta si das clic en el mapa vacío
            options={{
              styles: darkMapStyle,
              disableDefaultUI: true,
              zoomControl: true,
            }}
          >
            {/* MARCADORES PERSONALIZADOS (PINES CON ANIMACIÓN) */}
            {mapData.trafficZones.map((zone, idx) => (
              <OverlayView
                key={idx}
                position={{ lat: zone.lat, lng: zone.lon }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                getPixelPositionOffset={(w, h) => ({
                  x: -(w / 2),
                  y: -(h / 2),
                })} // Centra el pin
              >
                <div
                  // CRÍTICO: pointer-events-auto permite que el div reciba el clic sobre el mapa
                  className="relative flex items-center justify-center w-10 h-10 cursor-pointer group pointer-events-auto"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation(); // <-- ¡ESTA ES LA MAGIA!
                    setActiveMarker(zone);
                  }}
                >
                  {/* Animación de Pulso */}
                  <span
                    className={`absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping ${zone.type === "Accident" ? "bg-red-500" : "bg-orange-500"}`}
                  ></span>

                  {/* Círculo Principal */}
                  <span
                    className={`relative inline-flex rounded-full h-8 w-8 items-center justify-center border-2 border-black shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-colors ${zone.type === "Accident" ? "bg-red-500 group-hover:bg-red-400" : "bg-orange-500 group-hover:bg-orange-400"}`}
                  >
                    {zone.type === "Accident" ? (
                      <I.CarCrash className="w-4 h-4 text-white" />
                    ) : (
                      <I.Barrier className="w-4 h-4 text-white" />
                    )}
                  </span>
                </div>
              </OverlayView>
            ))}

            {/* TARJETA DE DETALLE DEL EVENTO (Aparece al hacer clic) */}
            {activeMarker && (
              <OverlayView
                position={{ lat: activeMarker.lat, lng: activeMarker.lon }}
                mapPaneName={OverlayView.OVERLAY_FLOAT_PANE}
                getPixelPositionOffset={(w, h) => ({ x: -160, y: -200 })} // Flotando justo arriba del pin
              >
                <div className="w-80 glass-panel bg-white/95 dark:bg-darkPanel/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-2xl animate-fade-in pointer-events-auto relative">
                  {/* Botón de cerrar (X) */}
                  <button
                    onClick={() => setActiveMarker(null)}
                    className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                  >
                    <I.X className="w-4 h-4" />
                  </button>

                  {/* Header de la Tarjeta */}
                  <div className="flex items-center gap-3 mb-3 border-b border-gray-200 dark:border-gray-700 pb-3 pr-6">
                    <div
                      className={`p-2 rounded-lg shadow-inner ${activeMarker.type === "Accident" ? "bg-red-500/10 text-red-500" : "bg-orange-500/10 text-orange-500"}`}
                    >
                      {activeMarker.type === "Accident" ? (
                        <I.CarCrash className="w-5 h-5" />
                      ) : (
                        <I.Barrier className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">
                        Tipo de Evento
                      </span>
                      <h4 className="font-bold text-gray-900 dark:text-white leading-none">
                        {activeMarker.type}
                      </h4>
                    </div>
                  </div>

                  {/* Descripción del backend */}
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    {activeMarker.description}
                  </p>

                  {/* Acción sugerida */}
                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <button className="text-xs font-bold text-blue-600 dark:text-neonBlue hover:text-blue-700 dark:hover:text-cyan-400 flex items-center gap-1 transition-colors group">
                      Notificar a flota cercana{" "}
                      <I.ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </OverlayView>
            )}
          </GoogleMap>
        )}
      </div>
    </div>
  );
};
