import {
  AlertTriangle,
  Battery,
  Bot,
  CheckCircle,
  ChevronLeft, // ¡Agregado desde Lucide!
  Flame, // <--- NUEVO
  ShieldAlert, // <--- NUEVO
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
  ShieldAlert,
  Flame,

  // --- PERSONALIZADOS ---
  CarCrash: (p) => (
    <CustomSvg fill="currentColor" stroke="transparent" {...p}>
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-5h14v5z" />
      <circle cx="7.5" cy="14.5" r="1.5" />
      <circle cx="16.5" cy="14.5" r="1.5" />
      <path d="M11.69 4.31 10.27 5.73 11.86 7.32 10.27 8.91 11.69 10.33 14.7 7.32z" />
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
