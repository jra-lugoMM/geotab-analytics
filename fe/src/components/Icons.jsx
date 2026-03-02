import {
  AlertTriangle,
  Battery,
  Bot,
  CheckCircle,
  ChevronLeft, // ¡Agregado desde Lucide!
  ChevronRight,
  CloudRain,
  Cpu,
  Database,
  LayoutDashboard,
  Leaf,
  Loader2,
  Lock,
  Map,
  Moon,
  Satellite,
  Send,
  Sparkles,
  Sun,
  Truck,
  User,
  UserCircle,
  Wind,
  X,
  Zap,
} from "lucide-react";

const CustomSvg = ({ children, className = "w-6 h-6", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {children}
  </svg>
);

export const I = {
  AlertTriangle,
  Battery,
  Bot,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  CloudRain,
  Cpu,
  Database,
  LayoutDashboard,
  Leaf,
  Loader2,
  Lock,
  Map,
  Moon,
  Satellite,
  Send,
  Sparkles,
  Sun,
  Truck,
  User,
  UserCircle,
  Wind,
  X,
  Zap,

  // --- PERSONALIZADOS ---
  CarCrash: (p) => (
    <CustomSvg {...p}>
      {/* Parte trasera y techo del auto */}
      <path d="M15 11h4.5a1.5 1.5 0 0 1 1.4 1.1L22 16v3a1 1 0 0 1-1 1h-2" />
      <path d="M15 11l-2.5-3.5A2 2 0 0 0 10.9 6H8" />
      {/* Llantas */}
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
      <path d="M9 20h6" />
      {/* Efecto de impacto (estallido) en el frente */}
      <path
        d="M6 14 3.5 17 1 14l2.5-3L1 8l4-1 1.5-3.5L8 7l4-1-1.5 3.5L13 13l-4 1-1.5 3.5L6 14Z"
        strokeWidth="1.5"
      />
    </CustomSvg>
  ),

  Barrier: (p) => (
    <CustomSvg {...p}>
      <path d="M5 22v-6" />
      <path d="M19 22v-6" />
      <path d="M2 16h20" />
      <path d="M4 12h16a2 2 0 0 1 2 2v2H2v-2a2 2 0 0 1 2-2Z" />
      <path d="m5 12 6.5-6.5" />
      <path d="m13 12 6-6" />
    </CustomSvg>
  ),
};
