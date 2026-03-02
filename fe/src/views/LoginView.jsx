import { useState } from "react";
import { I } from "../components/Icons";

export const LoginView = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    database: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("vibe_token", data.token);
        localStorage.setItem("vibe_user", JSON.stringify(data.user));

        onLoginSuccess();
      } else {
        setError(data.message || "Credenciales inválidas. Intenta de nuevo.");
      }
    } catch (err) {
      console.error("Error en el login:", err);
      setError(
        "Error de conexión con el servidor. Verifica que tu backend esté corriendo.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-[#030712] transition-colors duration-500">
      {/* --- AI Background Animations & SVGs --- */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        {/* Orbes brillantes pulsantes */}
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-cyan-400/20 dark:bg-cyan-500/10 rounded-full blur-[120px] animate-pulse duration-[4000ms]"></div>
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-blue-600/20 dark:bg-purple-600/10 rounded-full blur-[120px] animate-pulse duration-[5000ms]"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* SVG Grid Neural Net AI effect */}
        <svg
          className="absolute inset-0 w-full h-full opacity-30 dark:opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="ai-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-cyan-500/30 dark:text-cyan-400/20"
              />
              <circle
                cx="40"
                cy="40"
                r="1"
                className="fill-cyan-500/50 dark:fill-cyan-400/50 animate-pulse"
              />
              <circle
                cx="0"
                cy="0"
                r="1"
                className="fill-cyan-500/50 dark:fill-cyan-400/50 animate-pulse"
              />
            </pattern>
            <linearGradient id="grid-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <mask id="fade-mask">
              <rect width="100%" height="100%" fill="url(#grid-fade)" />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#ai-grid)"
            mask="url(#fade-mask)"
          />
        </svg>
      </div>

      {/* --- Glassmorphism Panel --- */}
      <div className="relative z-10 w-full max-w-md p-10 backdrop-blur-2xl bg-white/60 dark:bg-black/40 border border-white/40 dark:border-white/10 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] group">
        {/* Borde de gradiente animado en hover del panel */}
        <div className="absolute -inset-[1px] bg-gradient-to-b from-cyan-400/30 to-purple-500/30 dark:from-cyan-400/20 dark:to-purple-500/20 rounded-[2.5rem] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm"></div>

        <div className="flex flex-col items-center mb-10">
          {/* Logo animado */}
          <div className="relative flex justify-center items-center w-20 h-20 mb-4">
            <div className="absolute inset-0 bg-cyan-400/30 dark:bg-cyan-500/20 rounded-2xl animate-ping"></div>
            <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)]">
              <I.Satellite className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-blue-800 dark:from-cyan-300 dark:via-blue-400 dark:to-purple-400">
            Geotab Analytics
          </h1>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-600/80 dark:text-cyan-400/80 mt-1">
            Plataforma inteligente
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-3 p-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/30 rounded-2xl animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></div>
              {error}
            </div>
          )}

          {/* Input: Usuario */}
          <div className="relative group/input">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur opacity-0 group-focus-within/input:opacity-30 dark:group-focus-within/input:opacity-50 transition duration-500"></div>
            <div className="relative flex items-center bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden transition-all duration-300 group-focus-within/input:border-transparent">
              <div className="pl-4 pr-3 text-gray-400 group-focus-within/input:text-cyan-500 dark:group-focus-within/input:text-cyan-400 transition-colors">
                <I.User className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Usuario"
                required
                className="w-full bg-transparent text-gray-900 dark:text-white text-sm py-4 pr-4 focus:ring-0 focus:outline-none placeholder-gray-400 transition-colors"
              />
            </div>
          </div>

          {/* Input: Contraseña */}
          <div className="relative group/input">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur opacity-0 group-focus-within/input:opacity-30 dark:group-focus-within/input:opacity-50 transition duration-500"></div>
            <div className="relative flex items-center bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden transition-all duration-300 group-focus-within/input:border-transparent">
              <div className="pl-4 pr-3 text-gray-400 group-focus-within/input:text-cyan-500 dark:group-focus-within/input:text-cyan-400 transition-colors">
                <I.Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Contraseña"
                required
                className="w-full bg-transparent text-gray-900 dark:text-white text-sm py-4 pr-4 focus:ring-0 focus:outline-none placeholder-gray-400 transition-colors"
              />
            </div>
          </div>

          {/* Input: Base de Datos */}
          <div className="relative group/input">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur opacity-0 group-focus-within/input:opacity-30 dark:group-focus-within/input:opacity-50 transition duration-500"></div>
            <div className="relative flex items-center bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden transition-all duration-300 group-focus-within/input:border-transparent">
              <div className="pl-4 pr-3 text-gray-400 group-focus-within/input:text-cyan-500 dark:group-focus-within/input:text-cyan-400 transition-colors">
                <I.Database className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="database"
                value={formData.database}
                onChange={handleChange}
                placeholder="Base de Datos"
                required
                className="w-full bg-transparent text-gray-900 dark:text-white text-sm py-4 pr-4 focus:ring-0 focus:outline-none placeholder-gray-400 transition-colors"
              />
            </div>
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full mt-8 overflow-hidden rounded-2xl disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {/* Fondo gradiente base */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 dark:from-cyan-600 dark:via-blue-500 dark:to-purple-600 bg-[length:200%_auto] group-hover:bg-[position:right_center] transition-all duration-500"></div>

            {/* Overlay de brillo en hover */}
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative flex items-center justify-center gap-2 px-5 py-4 text-sm font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
              {isLoading ? (
                <>
                  <span className="tracking-wide">Iniciando Enlace...</span>
                  <I.Loader2 className="w-5 h-5 animate-spin" />
                </>
              ) : (
                <>
                  <span className="tracking-wide">Ingresar al Sistema</span>
                  <I.ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};
