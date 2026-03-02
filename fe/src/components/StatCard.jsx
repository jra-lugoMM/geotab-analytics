import React from "react";

export const StatCard = ({
  title,
  value,
  icon: IconCmp,
  colorClass,
  subtitle,
  animated = false,
}) => (
  <div className="relative glass-panel p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-2xl overflow-hidden group border border-gray-200/50 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-xl">
    {/* FONDO ANIMADO SVG (Se muestra si le pasamos animated={true}) */}
    {animated && (
      <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-overlay dark:mix-blend-screen opacity-30 dark:opacity-20">
        <svg
          className="absolute w-full h-full object-cover"
          preserveAspectRatio="none"
          viewBox="0 0 400 200"
        >
          {/* Onda fluida animada */}
          <path
            className={`fill-current ${colorClass.text} opacity-20`}
            d="M0,100 C100,50 300,150 400,100 L400,200 L0,200 Z"
          >
            <animate
              attributeName="d"
              dur="6s"
              repeatCount="indefinite"
              values="
                M0,100 C100,50 300,150 400,100 L400,200 L0,200 Z;
                M0,100 C100,150 300,50 400,100 L400,200 L0,200 Z;
                M0,100 C100,50 300,150 400,100 L400,200 L0,200 Z
              "
            />
          </path>

          {/* Orbe de luz pulsante y flotante */}
          <circle
            cx="200"
            cy="100"
            r="40"
            className={`fill-current ${colorClass.text} opacity-30 blur-2xl`}
          >
            <animate
              attributeName="cx"
              values="100;300;100"
              dur="8s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.2;0.5;0.2"
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
    )}

    {/* CONTENIDO DE LA TARJETA */}
    <div className="relative z-10 flex justify-between items-start mb-4">
      {/* Contenedor del ícono con efecto glow */}
      <div className="relative">
        {/* Glow difuminado detrás del ícono */}
        <div
          className={`absolute inset-0 rounded-xl blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-300 ${colorClass.bg}`}
        ></div>

        {/* Ícono principal */}
        <div
          className={`relative p-3 rounded-xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-md transition-transform duration-300 group-hover:scale-110`}
        >
          <IconCmp className={`w-6 h-6 ${colorClass.text}`} />
        </div>
      </div>

      {/* Subtítulo (Badge) */}
      {subtitle && (
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100/80 dark:bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-md border border-gray-200/50 dark:border-white/10 shadow-sm transition-colors group-hover:bg-gray-200/80 dark:group-hover:bg-white/20">
          {subtitle}
        </span>
      )}
    </div>

    {/* Textos */}
    <div className="relative z-10 mt-6">
      <h3 className="text-3xl font-extrabold mb-1 text-gray-900 dark:text-white tracking-tight drop-shadow-sm">
        {value}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase">
        {title}
      </p>
    </div>
  </div>
);
