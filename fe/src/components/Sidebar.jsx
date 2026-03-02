import React from "react";
import { I } from "./Icons";

export const Sidebar = ({
  currentScreen,
  setCurrentScreen,
  theme,
  toggleTheme,
  isAgentOpen,
  setIsAgentOpen,
}) => {
  return (
    <aside className="w-20 border-r border-gray-200 dark:border-gray-800 flex flex-col items-center py-6 bg-white dark:bg-darkPanel z-20 transition-colors">
      <div
        className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-green-400 dark:from-neonBlue dark:to-neonGreen flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.3)] mb-8 cursor-pointer"
        onClick={() => setCurrentScreen("login")}
      >
        <I.Satellite className="w-6 h-6 text-white dark:text-black" />
      </div>

      <nav className="flex-1 flex flex-col gap-6 w-full px-4">
        <button
          onClick={() => setCurrentScreen("dashboard-mapa")}
          className={`p-3 rounded-xl flex justify-center transition-all ${currentScreen === "dashboard-mapa" ? "bg-orange-50 text-orange-600 dark:bg-white/10 dark:text-orange-400 shadow-inner" : "text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"}`}
          title="Mapa de Inteligencia"
        >
          <I.Map className="w-6 h-6" />
        </button>
        <button
          onClick={() => setCurrentScreen("dashboard-rendimiento")}
          className={`p-3 rounded-xl flex justify-center transition-all ${currentScreen === "dashboard-rendimiento" ? "bg-blue-50 text-blue-600 dark:bg-white/10 dark:text-neonBlue shadow-inner" : "text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"}`}
          title="Rendimiento de Flota"
        >
          <I.Truck className="w-6 h-6" />
        </button>
        <button
          onClick={() => setCurrentScreen("dashboard-conductores")}
          className={`p-3 rounded-xl flex justify-center transition-all ${currentScreen === "dashboard-conductores" ? "bg-green-50 text-green-600 dark:bg-white/10 dark:text-neonGreen shadow-inner" : "text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"}`}
          title="Conductores"
        >
          <I.UserCircle className="w-6 h-6" />
        </button>
        <button
          onClick={() => setIsAgentOpen(!isAgentOpen)}
          className={`p-3 rounded-xl flex justify-center transition-all ${isAgentOpen ? "bg-purple-50 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400" : "text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"}`}
          title="Geotab Analytics"
        >
          <I.Bot className="w-6 h-6" />
        </button>
      </nav>

      <div className="flex flex-col gap-4 mt-auto">
        <button
          onClick={toggleTheme}
          className="p-3 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          title="Cambiar Tema"
        >
          {theme === "dark" ? (
            <I.Sun className="w-6 h-6" />
          ) : (
            <I.Moon className="w-6 h-6" />
          )}
        </button>
      </div>
    </aside>
  );
};
