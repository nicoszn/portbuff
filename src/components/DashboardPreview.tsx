import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Wallet,
  BarChart3,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useState } from "react";

const tabs = ["overview", "portfolio", "returns"];

export default function DashboardPreview() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  const activities = [
    {
      titleKey: "agriculture_invested",
      returnKey: "agriculture_return",
      positive: true,
    },
    {
      titleKey: "energy_invested",
      returnKey: "energy_return",
      positive: true,
    },
    {
      titleKey: "minerals_invested",
      returnKey: "minerals_return",
      positive: true,
    },
  ];

  const portfolio = [
    { key: "portfolio_agri", pct: 35, color: "bg-green-400" },
    { key: "portfolio_energy", pct: 25, color: "bg-gold-400" },
    { key: "portfolio_minerals", pct: 20, color: "bg-amber-400" },
    { key: "portfolio_realestate", pct: 12, color: "bg-blue-400" },
    { key: "portfolio_tech", pct: 8, color: "bg-purple-400" },
  ];

  return (
    <section id="dashboard" className="relative py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block rounded-full border border-gold-400/20 bg-gold-400/5 px-4 py-1.5 text-xs font-medium tracking-wide text-gold-400 uppercase"
          >
            {t("dashboard_preview.section_label")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          >
            {t("dashboard_preview.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-navy-300"
          >
            {t("dashboard_preview.subtitle")}
          </motion.p>
        </div>

        {/* Dashboard Mock */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-16"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-navy-900/50 p-1 shadow-2xl shadow-black/20 backdrop-blur-xl">
            {/* Window Chrome */}
            <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-400/60" />
              <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
              <div className="h-3 w-3 rounded-full bg-green-400/60" />
              <div className="ml-4 flex gap-1">
                {tabs.map((tab, i) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(i)}
                    className={cn(
                      "rounded-lg px-3 py-1 text-xs font-medium transition-all",
                      activeTab === i
                        ? "bg-gold-400/10 text-gold-400"
                        : "text-navy-500 hover:text-navy-300"
                    )}
                  >
                    {t(`dashboard_preview.tab_${tab}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  {
                    label: "dashboard_preview.total_value",
                    value: "$142,580",
                    icon: Wallet,
                    change: "+12.4%",
                    positive: true,
                  },
                  {
                    label: "dashboard_preview.total_return",
                    value: "+$18,420",
                    icon: TrendingUp,
                    change: "+18.4%",
                    positive: true,
                  },
                  {
                    label: "dashboard_preview.active_investments",
                    value: "12",
                    icon: BarChart3,
                    change: "+2",
                    positive: true,
                  },
                  {
                    label: "dashboard_preview.monthly_income",
                    value: "$3,240",
                    icon: DollarSign,
                    change: "+8.2%",
                    positive: true,
                  },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
                  >
                    <div className="flex items-center justify-between">
                      <metric.icon className="h-4 w-4 text-navy-500" />
                      <span
                        className={cn(
                          "flex items-center gap-0.5 text-xs font-medium",
                          metric.positive ? "text-green-400" : "text-red-400"
                        )}
                      >
                        {metric.positive ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        {metric.change}
                      </span>
                    </div>
                    <div className="mt-2 text-xl font-bold text-white">
                      {metric.value}
                    </div>
                    <div className="mt-0.5 text-xs text-navy-500">
                      {t(metric.label)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Row */}
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {/* Activity */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                  <h4 className="mb-4 text-sm font-semibold text-white">
                    {t("dashboard_preview.recent_activity")}
                  </h4>
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <div
                        key={activity.titleKey}
                        className="flex items-center justify-between rounded-lg bg-white/[0.02] px-4 py-3"
                      >
                        <span className="text-sm text-navy-300">
                          {t(`dashboard_preview.${activity.titleKey}`)}
                        </span>
                        <span
                          className={cn(
                            "text-xs font-medium",
                            activity.positive
                              ? "text-green-400"
                              : "text-red-400"
                          )}
                        >
                          {t(`dashboard_preview.${activity.returnKey}`)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Portfolio Allocation */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                  <h4 className="mb-4 text-sm font-semibold text-white">
                    {t("dashboard_preview.portfolio_agri") === "Agriculture"
                      ? "Portfolio Allocation"
                      : t("dashboard_preview.portfolio_agri")}
                  </h4>
                  {/* Bar */}
                  <div className="mb-4 flex h-3 overflow-hidden rounded-full bg-navy-800">
                    {portfolio.map((seg) => (
                      <div
                        key={seg.key}
                        className={cn("h-full transition-all", seg.color)}
                        style={{ width: `${seg.pct}%` }}
                      />
                    ))}
                  </div>
                  {/* Legend */}
                  <div className="grid grid-cols-2 gap-2">
                    {portfolio.map((seg) => (
                      <div key={seg.key} className="flex items-center gap-2">
                        <div
                          className={cn("h-2.5 w-2.5 rounded-full", seg.color)}
                        />
                        <span className="text-xs text-navy-400">
                          {t(`dashboard_preview.${seg.key}`)} ({seg.pct}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Glow Effect */}
          <div className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-b from-gold-500/10 via-transparent to-transparent opacity-50 blur-2xl" />
        </motion.div>
      </div>
    </section>
  );
}
