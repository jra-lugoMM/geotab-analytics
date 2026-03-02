import React, { useState, useEffect } from "react";
import { I } from "../components/Icons";
import { StatCard } from "../components/StatCard";

export const PerformanceView = ({ onAnalyze, analyzingId }) => {
  const [vehicles, setVehicles] = useState([]);
  const [kpis, setKpis] = useState({
    avgPerformance: 0,
    totalCo2: 0,
    totalIdling: 0,
    totalPrice: 0,
  });

  // Estado para el análisis global de IA
  const [globalAnalysis, setGlobalAnalysis] = useState(null);
  const [isAnalyzingGlobal, setIsAnalyzingGlobal] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 1. Obtenemos los vehículos y KPIs
        const response = await fetch("http://localhost:3000/api/vehicles");
        const json = await response.json();

        if (json.success) {
          setVehicles(json.data);

          const totalDistance = json.data.reduce(
            (sum, v) => sum + v.distance,
            0,
          );
          const totalFuel = json.data.reduce((sum, v) => sum + v.fuelUsed, 0);
          const calculatedPerformance =
            totalFuel > 0 ? totalDistance / totalFuel : 0;

          setKpis({
            ...json.kpis,
            avgPerformance: json.kpis.avgPerformance || calculatedPerformance,
          });

          // 2. Filtramos vehículos con performance > 0 y pedimos el análisis global
          const activeVehicles = json.data.filter((v) => v.performance > 0);

          if (activeVehicles.length > 0) {
            fetchGlobalAnalysis(activeVehicles);
          } else {
            // Si no hay vehículos activos, evitamos que se quede cargando infinitamente
            setGlobalAnalysis({
              executiveSummary:
                "No hay vehículos en movimiento o con rendimiento registrado para analizar en este periodo.",
              overallEfficiencyScore: 0,
              topRisk: "Sin datos",
              recommendedGlobalAction:
                "Verificar conexión de dispositivos o seleccionar otro rango de fechas.",
              aiPredictions: [],
            });
          }
        } else {
          setError("Error al obtener los datos del servidor.");
        }
      } catch (err) {
        console.error(err);
        setError(
          "Error de conexión. Asegúrate de que tu backend esté corriendo.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Función para obtener el resumen ejecutivo de la IA
  const fetchGlobalAnalysis = async (vehiclesData) => {
    setIsAnalyzingGlobal(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/agent/analyze-global",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(vehiclesData), // Enviamos solo los activos
        },
      );
      const { data } = await response.json();
      setGlobalAnalysis(data);
    } catch (error) {
      console.error("Error al obtener el análisis global:", error);
    } finally {
      setIsAnalyzingGlobal(false);
    }
  };

  // Lógica matemática de paginación
  const totalPages = Math.ceil(vehicles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentVehicles = vehicles.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Rendimiento de Flota
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Monitoreo en tiempo real y análisis predictivo.
        </p>
      </header>

      {/* Tarjetas de KPIs Animadas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          animated={true}
          title="Rendimiento Promedio"
          value={isLoading ? "..." : `${kpis.avgPerformance.toFixed(2)} km/l`}
          icon={I.Zap}
          colorClass={{
            bg: "bg-purple-500",
            text: "text-purple-600 dark:text-purple-400",
          }}
          subtitle="Eficiencia global"
        />
        <StatCard
          animated={true}
          title="Emisiones CO2"
          value={isLoading ? "..." : `${kpis.totalCo2.toFixed(2)} ton`}
          icon={I.Leaf}
          colorClass={{
            bg: "bg-neonGreen",
            text: "text-green-600 dark:text-neonGreen",
          }}
          subtitle="Huella de carbono"
        />
        <StatCard
          animated={true}
          title="Tiempo en Ralentí"
          value={isLoading ? "..." : `${kpis.totalIdling.toFixed(1)} hrs`}
          icon={I.AlertTriangle}
          colorClass={{
            bg: "bg-red-500",
            text: "text-red-500 dark:text-red-400",
          }}
          subtitle="Motor encendido"
        />
        <StatCard
          animated={true}
          title="Gasto Estimado"
          value={
            isLoading
              ? "..."
              : `$${kpis.totalPrice.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
          }
          icon={I.Battery}
          colorClass={{
            bg: "bg-neonBlue",
            text: "text-blue-600 dark:text-neonBlue",
          }}
          subtitle="Costo operativo"
        />
      </div>

      {/* NUEVO COMPONENTE: Análisis Global de IA */}
      {/* Solo se muestra cuando ya no estamos cargando los vehículos principales */}
      {!isLoading && (isAnalyzingGlobal || globalAnalysis) && (
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group border border-blue-500/20 dark:border-neonBlue/20 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10">
          {/* Fondo animado sutil */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 dark:bg-neonBlue rounded-full mix-blend-multiply filter blur-3xl animate-pulse-fast"></div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 dark:from-neonBlue dark:to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              {isAnalyzingGlobal ? (
                <I.Cpu className="w-6 h-6 text-white animate-spin" />
              ) : (
                <I.Sparkles className="w-6 h-6 text-white animate-pulse" />
              )}
            </div>

            <div className="flex-1 w-full">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  Resumen Ejecutivo
                </h3>
                {globalAnalysis &&
                  !isAnalyzingGlobal &&
                  globalAnalysis.overallEfficiencyScore > 0 && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        globalAnalysis.overallEfficiencyScore >= 80
                          ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-neonGreen"
                          : globalAnalysis.overallEfficiencyScore >= 60
                            ? "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400"
                            : "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400"
                      }`}
                    >
                      Score: {globalAnalysis.overallEfficiencyScore}/100
                    </span>
                  )}
              </div>

              {isAnalyzingGlobal ? (
                <div className="space-y-2 py-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                </div>
              ) : !globalAnalysis ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  El agente de IA no pudo generar el resumen global.
                </p>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                    {globalAnalysis.executiveSummary}
                  </p>

                  {/* Validamos que existan datos antes de dibujar las tarjetas interiores */}
                  {globalAnalysis.overallEfficiencyScore > 0 && (
                    <>
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 bg-white/60 dark:bg-black/40 p-3 rounded-xl border border-red-100 dark:border-red-900/30">
                          <div className="flex items-center gap-2 mb-1">
                            <I.AlertTriangle className="w-4 h-4 text-red-500" />
                            <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase">
                              Riesgo Principal
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            {globalAnalysis.topRisk}
                          </p>
                        </div>

                        <div className="flex-1 bg-white/60 dark:bg-black/40 p-3 rounded-xl border border-blue-100 dark:border-blue-900/30">
                          <div className="flex items-center gap-2 mb-1">
                            <I.Cpu className="w-4 h-4 text-blue-500 dark:text-neonBlue" />
                            <span className="text-xs font-bold text-blue-600 dark:text-neonBlue uppercase">
                              Acción Recomendada
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            {globalAnalysis.recommendedGlobalAction}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">
                          Predicciones de IA
                        </h4>
                        <ul className="space-y-1">
                          {globalAnalysis.aiPredictions?.map(
                            (prediction, idx) => (
                              <li
                                key={idx}
                                className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2"
                              >
                                <span className="text-purple-500 mt-0.5">
                                  •
                                </span>{" "}
                                {prediction}
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabla de Vehículos */}
      <div className="glass-panel rounded-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h3 className="text-lg font-bold">Estado de la Flota por Vehículo</h3>
          <span className="text-xs text-gray-500">
            Total de vehículos: {vehicles.length}
          </span>
        </div>

        {isLoading ? (
          <div className="p-10 flex flex-col items-center justify-center text-gray-500">
            <I.Cpu className="w-8 h-8 animate-spin mb-2" />
            <p>Cargando métricas y telemetría...</p>
          </div>
        ) : error ? (
          <div className="p-10 text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-100/50 dark:bg-black/20">
                  <tr>
                    <th className="px-6 py-4">Vehículo</th>
                    <th className="px-6 py-4">Viaje (Distancia / Tiempo)</th>
                    <th className="px-6 py-4">Rendimiento (km/l)</th>
                    <th className="px-6 py-4">Combustible Usado</th>
                    <th className="px-6 py-4 text-right">Acción IA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {currentVehicles.map((v) => (
                    <tr
                      key={v.id}
                      className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium">
                        <div className="flex flex-col">
                          <span>{v.name}</span>
                          <span className="text-xs text-gray-500">
                            Placa: {v.plate} • SN: {v.serialNumber}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {v.distance.toFixed(2)} km
                          </span>
                          <span className="text-xs text-gray-500">
                            Manejo: {v.drivingTime.toFixed(1)}h | Ralentí:{" "}
                            {v.idlingTime.toFixed(1)}h
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                            v.performance > 3
                              ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-neonGreen dark:border-green-500/20"
                              : v.performance > 0
                                ? "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20"
                                : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20"
                          }`}
                        >
                          {v.performance.toFixed(2)} km/l
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {v.fuelUsed.toFixed(2)} L
                          </span>
                          <span className="text-xs text-gray-500">
                            Costo aprox: ${v.fuelPrice.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => onAnalyze(v, "vehicle")}
                          disabled={analyzingId === v.id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 transition-colors disabled:opacity-50"
                        >
                          {analyzingId === v.id ? (
                            <>
                              <I.Cpu className="w-3.5 h-3.5 animate-spin" />{" "}
                              Analizando...
                            </>
                          ) : (
                            <>
                              <I.Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-neonBlue" />{" "}
                              Analizar
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Controles de Paginación */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-black/10">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Mostrando página{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {currentPage}
                  </span>{" "}
                  de{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {totalPages}
                  </span>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
