"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Wallet,
  Activity,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mockMetrics = [
  {
    labelKey: "landing.dashTotalValue",
    value: "$124,850",
    subtext: "+12.4% this month",
    accent: "text-gold-300",
    icon: Wallet,
  },
  {
    labelKey: "landing.dashTotalReturn",
    value: "+$18,420",
    subtext: "14.6% total return",
    accent: "text-emerald-400",
    icon: TrendingUp,
  },
  {
    labelKey: "landing.dashActiveInv",
    value: "8",
    subtext: "across 5 sectors",
    accent: "text-cyan-400",
    icon: Activity,
  },
  {
    labelKey: "landing.dashMonthlyIncome",
    value: "$3,240",
    subtext: "projected this month",
    accent: "text-violet-400",
    icon: DollarSign,
  },
];

const mockActivity = [
  {
    titleKey: "landing.dashAgriFund",
    returnKey: "landing.dashAgriReturn",
    color: "emerald",
  },
  {
    titleKey: "landing.dashSolarProject",
    returnKey: "landing.dashSolarReturn",
    color: "yellow",
  },
  {
    titleKey: "landing.dashGoldMining",
    returnKey: "landing.dashGoldReturn",
    color: "amber",
  },
];

const portfolioAllocation = [
  { name: "Agriculture", value: 24, color: "#34d399" },
  { name: "Energy", value: 22, color: "#fbbf24" },
  { name: "Minerals", value: 18, color: "#f59e0b" },
  { name: "Real Estate", value: 20, color: "#60a5fa" },
  { name: "Technology", value: 16, color: "#a78bfa" },
];

const chartData = [
  { month: "Jan", value: 98 },
  { month: "Feb", value: 104 },
  { month: "Mar", value: 112 },
  { month: "Apr", value: 121 },
  { month: "May", value: 128 },
  { month: "Jun", value: 134 },
  { month: "Jul", value: 142 },
];

const container = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function DashboardPreview() {
  const { t } = useTranslation();
  return (
    <section
      id="preview"
      className="relative px-5 py-24 lg:py-32"
      style={{ scrollMarginTop: "8rem" }}
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mb-14 text-center"
        >
          <span className="badge mb-4">
            {t("landing.dashLabel")}
          </span>
          <h2 className="font-display text-balance text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-gold-200">
            {t("landing.dashTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-navy-300 text-lg sm:text-xl">
            {t("landing.dashSubtitle")}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-5xl"
        >
          <div className="rounded-2xl border border-[rgba(255,215,120,0.14)] bg-navy-900/70 p-4 sm:p-6 backdrop-blur-sm shadow-xl">
            <div className="flex items-center gap-3 pl-1 pr-1 pt-1">
              <div className="flex items-center gap-2 rounded-lg bg-navy-950/80 px-3 py-1.5 border border-[rgba(255,215,120,0.12)]">
                <div className="flex gap-1.5">
                  <span className="block h-3 w-3 rounded-full bg-red-500/60" />
                  <span className="block h-3 w-3 rounded-full bg-yellow-400/60" />
                  <span className="block h-3 w-3 rounded-full bg-green-400/60" />
                </div>
                <span className="ml-2 text-xs text-navy-400">
                  portbuff.app/dashboard
                </span>
              </div>
              <span className="ml-auto text-xs text-navy-400">
                Portbuff / Dashboard
              </span>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {mockMetrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div
                    key={metric.labelKey}
                    className="rounded-xl bg-navy-800/40 border border-[rgba(255,215,120,0.08)] p-4 sm:p-5"
                  >
                    <div className="mb-3 flex items-center gap-2 text-sm text-navy-400">
                      <Icon className="h-4 w-4 text-gold-400" aria-hidden />
                      <span className="capitalize">
                        {t(metric.labelKey).toLowerCase()}
                      </span>
                    </div>
                    <div className={`text-2xl font-bold tracking-tight sm:text-3xl ${metric.accent}`}>
                      {metric.value}
                    </div>
                    <div className="mt-1 text-xs text-navy-400">
                      {metric.subtext}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-5">
              <div className="xl:col-span-3">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-navy-200">
                    {t("landing.dashRecentActivity")}
                  </h3>
                  <button className="text-xs text-gold-400 transition hover:text-gold-300">
                    {t("dashboard.viewAll")} {">"}
                  </button>
                </div>
                <div className="space-y-3">
                  {mockActivity.map((item) => (
                    <div
                      key={item.titleKey}
                      className="flex items-center justify-between rounded-xl bg-navy-800/30 border border-[rgba(255,215,120,0.08)] px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-2 w-2 rounded-full bg-${item.color}-400/20`}
                          style={{
                            boxShadow:
                              `0 0 12px ${
                                item.color === "emerald"
                                  ? "#34d399"
                                  : item.color === "yellow"
                                    ? "#fbbf24"
                                    : "#f59e0b"
                              }55`,
                          }}
                        />
                        <span className="text-sm text-navy-200">
                          {t(item.titleKey)}
                        </span>
                      </div>
                      <span className={`text-sm font-semibold text-${item.color}-400`}>
                        {t(item.returnKey)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="xl:col-span-2">
                <h3 className="mb-3 text-sm font-semibold text-navy-200">
                  {t("landing.dashPortfolio")}
                </h3>
                <div className="h-48 rounded-xl bg-navy-800/30 border border-[rgba(255,215,120,0.08)] p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="previewGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#e0a523" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#e0a523" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 4"
                        stroke="rgba(255,215,120,0.08)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="month"
                        tick={{ fill: "#a8a4b8", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#a8a4b8", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        domain={["auto", "auto"]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0d1028",
                          border: "1px solid rgba(255,215,120,0.2)",
                          borderRadius: "10px",
                          color: "#f5f3e8",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#e0a523"
                        strokeWidth={2}
                        fill="url(#previewGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {portfolioAllocation.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-2 text-xs text-navy-300"
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 rounded-2xl border border-[rgba(255,215,120,0.12)] bg-navy-900/40 px-6 py-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm text-navy-300">
              <Activity className="h-4 w-4 text-gold-400" aria-hidden />
              <span>Live portfolio simulation</span>
            </div>
            <Link
              href="/auth?mode=signup"
              className="btn-primary text-sm"
            >
              {t("landing.ctaStart")}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
