import React, { useState, useEffect, useMemo } from "react";
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

export const MapView = ({ onAnalyze, analyzingId }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [mapData, setMapData] = useState({ trafficZones: [], weatherKPIs: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeMarker, setActiveMarker] = useState(null);
  const [currentWeatherIndex, setCurrentWeatherIndex] = useState(0);

  const [activeFilters, setActiveFilters] = useState([]);

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
          const uniqueTypes = [
            ...new Set(json.data.trafficZones.map((z) => z.type)),
          ];
          setActiveFilters(uniqueTypes);
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

  const handlePrevWeather = () =>
    setCurrentWeatherIndex((prev) =>
      prev === 0 ? mapData.weatherKPIs.length - 1 : prev - 1,
    );
  const handleNextWeather = () =>
    setCurrentWeatherIndex((prev) => (prev + 1) % mapData.weatherKPIs.length);

  const toggleFilter = (type) => {
    setActiveFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const filteredZones = mapData.trafficZones.filter((zone) =>
    activeFilters.includes(zone.type),
  );
  const uniqueEventTypes = useMemo(
    () => [...new Set(mapData.trafficZones.map((z) => z.type))],
    [mapData.trafficZones],
  );

  // --- ESTILOS MODERNOS (FLAT ELEVATED) ---
  // --- ESTILOS MODERNOS (FLAT ELEVATED) PARA 3 CATEGORÍAS ---
  const getEventOrbStyles = (type) => {
    if (type === "Seguridad") {
      return {
        bg: "bg-red-500",
        shadow:
          "shadow-lg shadow-red-500/40 border-2 border-white dark:border-gray-800",
        icon: <I.ShieldAlert className="w-5 h-5 text-white" />,
        themeText: "text-red-500",
        themeBg: "bg-red-500/10",
      };
    }
    if (type === "Desastre Natural") {
      return {
        bg: "bg-purple-500",
        shadow:
          "shadow-lg shadow-purple-500/40 border-2 border-white dark:border-gray-800",
        icon: <I.Flame className="w-5 h-5 text-white" />,
        themeText: "text-purple-500",
        themeBg: "bg-purple-500/10",
      };
    }
    // Por defecto: Riesgo Vial
    return {
      bg: "bg-orange-500",
      shadow:
        "shadow-lg shadow-orange-500/40 border-2 border-white dark:border-gray-800",
      icon: <I.CarCrash className="w-5 h-5 text-white" />,
      themeText: "text-orange-500",
      themeBg: "bg-orange-500/10",
    };
  };

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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <I.Sparkles className="w-6 h-6 text-blue-500" /> Vibe Environmental
          Map AI
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-4xl mt-1">
          Monitoreo impulsado por IA que extrae y procesa noticias, redes
          sociales y reportes ciudadanos en tiempo real. Al anticipar
          disrupciones viales, optimizamos las rutas para erradicar el ralentí
          estático y reducir drásticamente la huella de carbono y emisiones de
          CO2 de la flotilla.
        </p>
      </header>

      {uniqueEventTypes.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-2">
            Filtrar Eventos:
          </span>
          {uniqueEventTypes.map((type) => {
            const isActive = activeFilters.includes(type);
            const orbTheme = getEventOrbStyles(type);
            return (
              <button
                key={type}
                onClick={() => toggleFilter(type)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-2
                  ${
                    isActive
                      ? `bg-white dark:bg-white/10 ${orbTheme.themeText} border-current shadow-md`
                      : `bg-transparent text-gray-400 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-white/5`
                  }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${isActive ? orbTheme.bg : "bg-gray-400"}`}
                ></div>
                {type}
              </button>
            );
          })}
        </div>
      )}

      <div className="relative flex-1 rounded-2xl overflow-hidden glass-panel border border-gray-200 dark:border-gray-800 shadow-xl">
        {isLoading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gray-50/80 dark:bg-black/80 backdrop-blur-sm">
            <I.Cpu className="w-10 h-10 animate-spin text-blue-500 mb-4" />
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              Analizando reportes y noticias del tráfico...
            </p>
          </div>
        )}

        {!isLoading && mapData.weatherKPIs.length > 0 && currentTheme && (
          <div className="absolute top-6 right-6 z-10 w-80 pointer-events-none">
            <div
              key={currentWeatherIndex}
              className={`p-5 rounded-2xl backdrop-blur-xl border ${currentTheme.bg} pointer-events-auto transition-all duration-500 animate-fade-in`}
            >
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
                  {mapData.weatherKPIs[currentWeatherIndex].source && (
                    <span className="text-[9px] text-white/40 block mt-1 font-medium tracking-wide">
                      Fuente: {mapData.weatherKPIs[currentWeatherIndex].source}
                    </span>
                  )}
                </div>
              </div>

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

        {isLoaded && !error && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={5}
            onClick={() => setActiveMarker(null)}
            options={{
              styles: darkMapStyle,
              disableDefaultUI: true,
              zoomControl: true,
            }}
          >
            {filteredZones.map((zone, idx) => {
              const pseudoId = `${zone.lat}-${zone.lon}-${idx}`;
              const isAnalyzingThis = analyzingId === pseudoId;
              const orbTheme = getEventOrbStyles(zone.type);

              // MAGIA: El pulso solo se activa si la descripción menciona un accidente/choque explícito
              // (Incluso si la categoría general es "Riesgo Vial")
              const isAccident =
                /(accidente|choque|volcadura|siniestro|carambola)/i.test(
                  zone.description,
                );

              return (
                <OverlayView
                  key={pseudoId}
                  position={{ lat: zone.lat, lng: zone.lon }}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  getPixelPositionOffset={(w, h) => ({
                    x: -(w / 2),
                    y: -(h / 2),
                  })}
                >
                  <div
                    className="relative flex items-center justify-center w-12 h-12 cursor-pointer group pointer-events-auto"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                      onAnalyze({ ...zone, id: pseudoId }, "map-event");
                      setActiveMarker(zone);
                    }}
                  >
                    {/* PULSO INTELIGENTE */}
                    {isAccident && !isAnalyzingThis && (
                      <span
                        className={`absolute inline-flex h-full w-full rounded-full opacity-50 animate-ping ${orbTheme.bg}`}
                      ></span>
                    )}

                    {/* FLAT ELEVATED DESIGN */}
                    <span
                      className={`relative flex rounded-full h-10 w-10 items-center justify-center transition-transform group-hover:scale-110 ${orbTheme.bg} ${orbTheme.shadow}`}
                    >
                      {isAnalyzingThis ? (
                        <I.Cpu className="w-5 h-5 text-white animate-spin" />
                      ) : (
                        orbTheme.icon
                      )}
                    </span>
                  </div>
                </OverlayView>
              );
            })}

            {activeMarker && (
              <OverlayView
                position={{ lat: activeMarker.lat, lng: activeMarker.lon }}
                mapPaneName={OverlayView.OVERLAY_FLOAT_PANE}
                getPixelPositionOffset={(w, h) => ({ x: -160, y: -200 })}
              >
                <div className="w-80 glass-panel bg-white/95 dark:bg-darkPanel/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-2xl animate-fade-in pointer-events-auto relative">
                  <button
                    onClick={() => setActiveMarker(null)}
                    className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                  >
                    <I.X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-3 mb-3 border-b border-gray-200 dark:border-gray-700 pb-3 pr-6">
                    <div
                      className={`p-2 rounded-xl shadow-inner ${getEventOrbStyles(activeMarker.type).themeBg} ${getEventOrbStyles(activeMarker.type).themeText}`}
                    >
                      {getEventOrbStyles(activeMarker.type).icon}
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">
                        Reporte de Medio
                      </span>
                      <h4 className="font-bold text-gray-900 dark:text-white leading-none">
                        {activeMarker.type}
                      </h4>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    {activeMarker.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      Vía: {activeMarker.source}
                    </span>
                    <button className="text-xs font-bold text-green-600 dark:text-neonGreen hover:text-green-700 dark:hover:text-green-400 flex items-center gap-1 transition-colors group">
                      Recalcular rutas{" "}
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
