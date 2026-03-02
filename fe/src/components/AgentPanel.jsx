import React, { useState, useEffect } from "react";
import { I } from "./Icons";

export const AgentPanel = ({ setIsAgentOpen, agentAnalysis, analyzingId }) => {
  const [actionStatus, setActionStatus] = useState("idle");

  useEffect(() => {
    setActionStatus("idle");
  }, [agentAnalysis]);

  // 1. SISTEMA DE COLORES ESCALABLE ACTUALIZADO
  const getCategoryStyles = (category) => {
    switch (category) {
      case "Seguridad":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30";
      case "Desastre Natural":
        return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/30";
      case "Riesgo Vial":
        return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/30";
      // ... deja tus otras categorías (Top Performer, EV Candidate, etc.) abajo
      case "Top Performer":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-neonGreen dark:border-green-500/30";
      case "EV Candidate":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-neonBlue dark:border-blue-500/30";
      case "High Waste":
      case "Accident": // <--- AGREGADO AQUÍ (Usa el mismo rojo que High Waste)
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30";
      case "Technical Failure":
      case "Vialidad": // <--- AGREGADO AQUÍ (Usa el mismo naranja)
        return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/30";
      case "Inactive":
        return "bg-gray-200 text-gray-600 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600";
      default:
        return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/30";
    }
  };

  // 2. SISTEMA DE ÍCONOS DINÁMICOS ACTUALIZADO
  const getDynamicIcon = (iconName, category) => {
    const name = iconName?.toLowerCase() || "";

    if (name.includes("shield") || category === "Seguridad") {
      return (
        <I.Shield className="w-4 h-4 text-red-500 dark:text-red-400 group-hover:scale-110 transition-transform" />
      );
    }
    if (name.includes("flame") || category === "Desastre Natural") {
      return (
        <I.Flame className="w-4 h-4 text-purple-500 dark:text-purple-400 group-hover:scale-110 transition-transform" />
      );
    }
    if (name.includes("carcrash") || category === "Riesgo Vial") {
      return (
        <I.CarCrash className="w-4 h-4 text-orange-500 dark:text-orange-400 group-hover:scale-110 transition-transform" />
      );
    }

    // Eventos de Mapa: Vialidad / Obras
    if (name.includes("barrier") || category === "Vialidad") {
      return (
        <I.Barrier className="w-4 h-4 text-orange-500 dark:text-orange-400 group-hover:scale-110 transition-transform" />
      );
    }
    if (
      name.includes("bolt") ||
      name.includes("ev_station") ||
      category === "EV Candidate"
    ) {
      return (
        <I.Zap className="w-4 h-4 text-blue-500 dark:text-neonBlue group-hover:scale-110 transition-transform" />
      );
    }
    // Desempeño / Eco
    if (
      name.includes("eco") ||
      name.includes("emoji_events") ||
      category === "Top Performer"
    ) {
      return (
        <I.Leaf className="w-4 h-4 text-green-500 dark:text-neonGreen group-hover:scale-110 transition-transform" />
      );
    }
    // Alertas / Desperdicio
    if (
      name.includes("warning") ||
      name.includes("local_gas_station") ||
      category === "High Waste"
    ) {
      return (
        <I.AlertTriangle className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
      );
    }
    // Falla de Hardware / Telemática (NUEVO)
    if (
      name.includes("sensors_off") ||
      name.includes("build_circle") ||
      category === "Technical Failure"
    ) {
      return (
        <I.Cpu className="w-4 h-4 text-orange-500 dark:text-orange-400 group-hover:scale-110 transition-transform" />
      );
    }
    // Inactivos / Dormidos
    if (name.includes("directions_car_off") || category === "Inactive") {
      return (
        <I.Moon className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:scale-110 transition-transform" />
      );
    }

    // DEFAULT
    return (
      <I.CheckCircle className="w-4 h-4 text-purple-500 dark:text-purple-400 group-hover:scale-110 transition-transform" />
    );
  };

  const handleExecuteAction = async () => {
    setActionStatus("loading");
    try {
      // Simulación de conexión a la API de MyGeotab
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setActionStatus("success");
    } catch (error) {
      console.error("Error ejecutando acción", error);
      setActionStatus("idle");
    }
  };

  return (
    <aside className="w-80 lg:w-96 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-darkPanel flex flex-col z-20 shadow-2xl transition-colors">
      {/* HEADER */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-black/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center">
            <I.Cpu className="w-5 h-5 text-white dark:text-black" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Geotab Analytics Copilot</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-fast"></div>
              <span className="text-[10px] text-green-600 dark:text-neonGreen tracking-widest font-mono uppercase">
                AI Online
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsAgentOpen(false)}
          className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <I.X className="w-5 h-5" />
        </button>
      </div>

      {/* ÁREA DE MENSAJES */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-white/10 flex-shrink-0 flex items-center justify-center border border-blue-200 dark:border-white/20">
            <I.Zap className="w-4 h-4 text-blue-600 dark:text-neonBlue" />
          </div>

          <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-2xl rounded-tl-none border border-gray-200 dark:border-white/10 text-sm leading-relaxed shadow-sm w-full">
            {!agentAnalysis && !analyzingId ? (
              <p className="text-gray-700 dark:text-gray-300">
                Hola. Selecciona un vehículo de la tabla para que pueda analizar
                su telemetría con IA.
              </p>
            ) : analyzingId ? (
              <div className="flex items-center gap-2 text-blue-500 dark:text-neonBlue font-medium">
                <I.Cpu className="w-4 h-4 animate-spin" />
                <span>Procesando métricas...</span>
              </div>
            ) : !agentAnalysis.ai ? (
              <p className="text-red-500">
                Error: No se pudo generar un análisis.
              </p>
            ) : (
              <div className="flex flex-col gap-3 animate-fade-in">
                {/* 1. BADGE DE CATEGORÍA DINÁMICO */}
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold border ${getCategoryStyles(agentAnalysis.ai?.category)}`}
                  >
                    {agentAnalysis.ai?.category || "Análisis"}
                  </span>
                </div>

                {/* 2. TEXTO EJECUTIVO DE LA IA */}
                <p className="text-gray-700 dark:text-gray-200">
                  {agentAnalysis.ai?.aiRecommendation}
                </p>

                {agentAnalysis.ai?.source && (
                  <div className="flex items-center gap-1 mt-1 text-xs">
                    <I.Satellite className="w-3 h-3 text-blue-500" />
                    {agentAnalysis.ai.source.startsWith("http") ? (
                      <a
                        href={agentAnalysis.ai.source}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 dark:text-neonBlue hover:underline truncate"
                      >
                        Ver reporte oficial de vialidad
                      </a>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">
                        Fuente: {agentAnalysis.ai.source}
                      </span>
                    )}
                  </div>
                )}

                {/* 3. ACCIÓN DE GEOTAB */}
                {agentAnalysis.ai?.geotabAction && (
                  <div className="mt-2 flex flex-col gap-2">
                    <button
                      onClick={handleExecuteAction}
                      disabled={actionStatus !== "idle"}
                      className={`text-xs px-3 py-2.5 rounded-lg text-left transition-all font-medium flex gap-2 items-center group border
                        ${
                          actionStatus === "success"
                            ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-500/20 dark:border-green-500/30 dark:text-neonGreen"
                            : "bg-white dark:bg-black/50 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-neonBlue text-gray-700 dark:text-gray-200"
                        }
                      `}
                    >
                      {actionStatus === "loading" ? (
                        <>
                          <I.Cpu className="w-4 h-4 animate-spin text-blue-500" />{" "}
                          <span className="flex-1">Aplicando en Geotab...</span>
                        </>
                      ) : actionStatus === "success" ? (
                        <>
                          <I.CheckCircle className="w-4 h-4 text-green-500 dark:text-neonGreen" />{" "}
                          <span className="flex-1">
                            ¡Acción ejecutada con éxito!
                          </span>
                        </>
                      ) : (
                        <>
                          {getDynamicIcon(
                            agentAnalysis.ai.icon,
                            agentAnalysis.ai.category,
                          )}
                          <span className="flex-1">
                            {agentAnalysis.ai.geotabAction}
                          </span>
                          <I.ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-neonBlue" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black/20">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Pregúntale a Vibe..."
            className="w-full bg-white dark:bg-black/50 border border-gray-300 dark:border-gray-700 text-sm rounded-xl focus:ring-1 focus:ring-blue-500 dark:focus:ring-neonBlue focus:border-blue-500 dark:focus:border-neonBlue block p-3 pr-10 outline-none transition-colors"
          />
          <button className="absolute right-2 p-1.5 text-gray-400 hover:text-blue-500 dark:hover:text-neonBlue transition-colors">
            <I.Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-center text-gray-400 mt-2 font-medium">
          Vibe puede cometer errores. Verifica la info importante.
        </p>
      </div>
    </aside>
  );
};
