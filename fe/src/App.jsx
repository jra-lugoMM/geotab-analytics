import { useState, useEffect } from "react";
import { I } from "./components/Icons";
import { PerformanceView } from "./views/PerformanceView";
import { DriversView } from "./views/DriversView";
import { LoginView } from "./views/LoginView";
import { AgentPanel } from "./components/AgentPanel";
import { Sidebar } from "./components/Sidebar";
import { MapView } from "./views/MapView";

function App() {
  const [currentScreen, setCurrentScreen] = useState("login");
  const [theme, setTheme] = useState("dark");
  const [isAgentOpen, setIsAgentOpen] = useState(window.innerWidth > 1024);
  const [agentAnalysis, setAgentAnalysis] = useState(null);
  const [analyzingId, setAnalyzingId] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const handleAnalyze = async (item, type) => {
    // 1. Iniciamos el loader del botón
    setAnalyzingId(item.id);

    // 2. Limpiamos el análisis anterior para que el chat se resetee
    setAgentAnalysis(null);

    // --- VÍA RÁPIDA PARA EVENTOS DEL MAPA ---
    // Si el tipo es map-event, armamos la respuesta de la IA de forma local
    // --- VÍA RÁPIDA PARA EVENTOS DEL MAPA ---
    if (type === "map-event") {
      setAgentAnalysis({
        item: item,
        type: type,
        ai: {
          category: item.type, // "Riesgo Vial", "Seguridad" o "Desastre Natural"
          aiRecommendation: item.description,
          // Mapeamos los nuevos íconos
          icon:
            item.type === "Seguridad"
              ? "shieldalert"
              : item.type === "Desastre Natural"
                ? "flame"
                : "carcrash",
          geotabAction:
            item.type === "Seguridad"
              ? "Activar paro de motor preventivo y alertar"
              : "Notificar a flota cercana y recalcular ruta",
          estimatedWasteCost: 0,
          source: item.source,
        },
      });
      setIsAgentOpen(true);
      setAnalyzingId(null);
      return;
    }
    // ----------------------------------------

    try {
      console.log("Enviando al BE el vehículo:", item.id);

      const response = await fetch("http://localhost:3000/api/agent/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([item]),
      });

      const { data } = await response.json();
      console.log("Respuesta cruda del BE:", data);

      let recommendation = null;

      if (Array.isArray(data) && data.length > 0) {
        recommendation = data.find((r) => r.id === item.id) || data[0];
      }

      if (recommendation) {
        console.log("Actualizando UI con:", recommendation);
        setAgentAnalysis({
          item: item,
          type: type,
          ai: recommendation,
        });
        setIsAgentOpen(true);
      } else {
        console.warn("El Backend no devolvió una recomendación válida.");
      }
    } catch (error) {
      console.error("Error de conexión con Vibe AI:", error);
    } finally {
      setAnalyzingId(null);
    }
  };

  if (currentScreen === "login") {
    return (
      <LoginView onLoginSuccess={() => setCurrentScreen("dashboard-mapa")} />
    );
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 text-gray-900 dark:bg-darkBg dark:text-gray-100 transition-colors duration-300 overflow-hidden">
      <Sidebar
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        theme={theme}
        toggleTheme={toggleTheme}
        isAgentOpen={isAgentOpen}
        setIsAgentOpen={setIsAgentOpen}
      />

      <main className="flex-1 h-full overflow-y-auto p-8 relative">
        <div className="max-w-6xl mx-auto h-full">
          {currentScreen === "dashboard-rendimiento" ? (
            <PerformanceView
              onAnalyze={handleAnalyze}
              analyzingId={analyzingId}
            />
          ) : currentScreen === "dashboard-mapa" ? (
            /* SE PASAN LAS PROPS onAnalyze y analyzingId AQUÍ */
            <MapView onAnalyze={handleAnalyze} analyzingId={analyzingId} />
          ) : (
            <DriversView onAnalyze={handleAnalyze} analyzingId={analyzingId} />
          )}
        </div>
      </main>

      {isAgentOpen && (
        <AgentPanel
          setIsAgentOpen={setIsAgentOpen}
          agentAnalysis={agentAnalysis}
          analyzingId={analyzingId}
        />
      )}
    </div>
  );
}

export default App;
