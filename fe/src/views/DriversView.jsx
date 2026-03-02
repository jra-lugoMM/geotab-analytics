import React from "react";
import { useTranslation } from "react-i18next";
import { I } from "../components/Icons";
import { StatCard } from "../components/StatCard";

export const DriversView = ({ onAnalyze, analyzingId }) => {
  const { t } = useTranslation();

  // Los datos mockeados se quedan igual, esto vendrá de tu BE eventualmente.
  const drivers = [
    {
      id: "D-102",
      name: "Juan Pérez",
      exceptions: 24,
      rating: 65,
      status: "Riesgo",
    },
    {
      id: "D-441",
      name: "María González",
      exceptions: 2,
      rating: 98,
      status: "Excelente",
    },
    {
      id: "D-892",
      name: "Carlos Ruiz",
      exceptions: 12,
      rating: 82,
      status: "Regular",
    },
    {
      id: "D-201",
      name: "Ana Silva",
      exceptions: 5,
      rating: 91,
      status: "Bueno",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("drivers_title")}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("drivers_subtitle")}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title={t("drivers_stat_avg_rating")}
          value="85/100"
          icon={I.CheckCircle}
          colorClass={{
            bg: "bg-green-500",
            text: "text-green-600 dark:text-neonGreen",
          }}
          subtitle={t("drivers_stat_avg_rating_sub")}
        />
        <StatCard
          title={t("drivers_stat_exceptions")}
          value="43"
          icon={I.AlertTriangle}
          colorClass={{
            bg: "bg-yellow-500",
            text: "text-yellow-600 dark:text-yellow-400",
          }}
          subtitle={t("drivers_stat_exceptions_sub")}
        />
        <StatCard
          title={t("drivers_stat_risk")}
          value="2"
          icon={I.User}
          colorClass={{
            bg: "bg-red-500",
            text: "text-red-500 dark:text-red-400",
          }}
          subtitle={t("drivers_stat_risk_sub")}
        />
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h3 className="text-lg font-bold">{t("drivers_table_title")}</h3>
          <button className="text-sm text-blue-600 dark:text-neonBlue hover:underline">
            {t("drivers_download_report")}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-100/50 dark:bg-black/20">
              <tr>
                <th className="px-6 py-4">{t("drivers_col_driver")}</th>
                <th className="px-6 py-4">{t("drivers_col_events")}</th>
                <th className="px-6 py-4">{t("drivers_col_safety")}</th>
                <th className="px-6 py-4 text-right">
                  {t("drivers_col_ai_action")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {drivers.map((d) => (
                <tr
                  key={d.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-400">
                        {d.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span>{d.name}</span>
                        <span className="text-xs text-gray-500">{d.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-medium ${d.exceptions > 15 ? "text-red-500" : "text-gray-700 dark:text-gray-300"}`}
                    >
                      {d.exceptions} {t("drivers_events_label")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-[120px]">
                        <div
                          className={`h-2 rounded-full ${d.rating < 70 ? "bg-red-500" : d.rating < 85 ? "bg-yellow-500" : "bg-green-500 dark:bg-neonGreen"}`}
                          style={{ width: `${d.rating}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold">{d.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onAnalyze(d, "driver")}
                      disabled={analyzingId === d.id}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 transition-colors disabled:opacity-50"
                    >
                      {analyzingId === d.id ? (
                        <>
                          <I.Cpu className="w-3.5 h-3.5 animate-spin" />{" "}
                          {t("drivers_btn_analyzing")}
                        </>
                      ) : (
                        <>
                          <I.Cpu className="w-3.5 h-3.5 text-green-500 dark:text-neonGreen" />{" "}
                          {t("drivers_btn_analyze")}
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
