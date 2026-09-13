"use client";

import { useTranslation } from "react-i18next";
import { useStore } from "@/lib/stores/useStore";
import { format } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Activity,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

const COLORS = [
  "#e0a523",
  "#34d399",
  "#60a5fa",
  "#a78bfa",
  "#fbbf24",
  "#f59e0b",
];

const COLORS_BY_SECTOR: Record<string, string> = {
  agriculture: "#34d399",
  energy: "#fbbf24",
  minerals: "#f59e0b",
  realestate: "#60a5fa",
  technology: "#a78bfa",
  infrastructure: "#06b6d4",
};

export default function DashboardPage() {
  const { t } = useTranslation();
  const {
    currentUser,
    investments,
    transactions,
    addInvestment,
    plans,
  } = useStore();

  const balance = currentUser?.balance ?? 0;
  const invested = currentUser?.totalInvested ?? 0;
  const earned = currentUser?.totalEarned ?? 0;
  const currentProfit = currentUser?.currentProfit ?? 0;
  const activeInvestmentCount = investments.filter(
    (i) => i.status === "active"
  ).length;

  const profitChartData =
    typeof window !== "undefined"
      ? require("@/lib/data").generateProfitChartData()
      : [];

  const portfolioBySector = investments.reduce(
    (acc, inv) => {
      const sector =
        (inv.plan?.sector as string) ?? "other";
      acc[sector] = (acc[sector] ?? 0) + (inv.amount ?? 0);
      return acc;
    },
    {} as Record<string, number>
  );

  const portfolioChartData = Object.entries(portfolioBySector)
    .filter(([, amount]) => amount > 0)
    .map(([sector, amount]) => ({
      name:
        sector.charAt(0).toUpperCase() +
        sector.slice(1).replace(/([A-Z])/g, " $1"),
      value: amount,
      color: COLORS_BY_SECTOR[sector] ?? COLORS[0],
    }));

  const recentTransactions = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 6);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gold-200">
          {t("dashboard.title")}
        </h1>
        <p className="mt-1 text-sm text-navy-300">
          {t("dashboard.welcome")}, {currentUser?.firstName}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-2 text-sm text-navy-400">
            <Wallet className="h-4 w-4 text-gold-400" aria-hidden />
            {t("dashboard.balance")}
          </div>
          <div className="text-2xl font-bold tracking-tight text-gold-200">
            ${balance.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-emerald-400">
            <TrendingUp className="h-3 w-3" aria-hidden />
            +12.4% this month
          </div>
        </div>
        <div className="card p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-2 text-sm text-navy-400">
            <PiggyBank className="h-4 w-4 text-gold-400" aria-hidden />
            {t("dashboard.invested")}
          </div>
          <div className="text-2xl font-bold tracking-tight text-gold-200">
            ${invested.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-navy-400">
            across {investments.length} investments
          </div>
        </div>
        <div className="card p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-2 text-sm text-navy-400">
            <TrendingUp className="h-4 w-4 text-emerald-400" aria-hidden />
            {t("dashboard.currentProfit")}
          </div>
          <div className="text-2xl font-bold tracking-tight text-emerald-400">
            ${currentProfit.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-navy-400">
            <DollarSign className="h-3 w-3" aria-hidden />
            {t("dashboard.totalEarned")}: ${earned.toLocaleString()}
          </div>
        </div>
        <div className="card p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-2 text-sm text-navy-400">
            <Activity className="h-4 w-4 text-cyan-400" aria-hidden />
            {t("dashboard.activeInvestments")}
          </div>
          <div className="text-2xl font-bold tracking-tight text-cyan-400">
            {activeInvestmentCount}
          </div>
          <div className="mt-1 text-xs text-navy-400">
            {investments.filter((i) => i.status === "active").length}{" "}
            active ·{" "}
            {investments.filter((i) => i.status === "completed").length}{" "}
            completed
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5 sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-gold-200">
            {t("dashboard.profitTrend")}
          </h2>
          <div className="h-64 sm:h-72 rounded-xl bg-navy-800/30 border border-[rgba(255,215,120,0.08)] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={profitChartData}>
                <defs>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 4" stroke="rgba(255,215,120,0.08)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#a8a4b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#a8a4b8", fontSize: 11 }} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
                <Tooltip contentStyle={{ backgroundColor: "#0d1028", border: "1px solid rgba(255,215,120,0.2)", borderRadius: "10px", color: "#f5f3e8" }} />
                <Area type="monotone" dataKey="profit" stroke="#34d399" strokeWidth={2} fill="url(#profitGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5 sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-gold-200">
            {t("dashboard.portfolioOverview")}
          </h2>
          {portfolioChartData.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-navy-400">
              {t("dashboard.noInvestments")}
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    innerRadius="45%"
                    paddingAngle={2}
                  >
                    {portfolioChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="transparent"
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0d1028", border: "1px solid rgba(255,215,120,0.2)", borderRadius: "10px", color: "#f5f3e8" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          {portfolioChartData.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {portfolioChartData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs text-navy-300">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gold-200">
            {t("dashboard.recentTransactions")}
          </h2>
          <Link
            href="/dashboard/transactions"
            className="text-sm text-gold-400 transition hover:text-gold-300"
          >
            {t("dashboard.viewAll")} {">"}
          </Link>
        </div>
        {recentTransactions.length === 0 ? (
          <div className="mt-6 flex h-40 items-center justify-center text-sm text-navy-400">
            {t("transactions.noTransactions")}
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-xl bg-navy-800/30 border border-[rgba(255,215,120,0.08)] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      tx.type === "deposit"
                        ? "bg-emerald-400/20"
                        : "bg-amber-400/20"
                    }`}
                    style={{
                      boxShadow: tx.type === "deposit"
                        ? "0 0 10px #34d39955"
                        : "0 0 10px #fbbf2455",
                    }}
                  />
                  <div>
                    <div className="text-sm text-navy-200">
                      {tx.type === "deposit"
                        ? t("transactions.deposit")
                        : t("transactions.withdrawal")}
                      {" · "}
                      {tx.network || tx.cryptoName || ""}
                    </div>
                    <div className="text-xs text-navy-400">
                      {format(new Date(tx.createdAt), "MMM d, yyyy")}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${
                    tx.type === "deposit" ? "text-emerald-400" : "text-amber-400"
                  }`}>
                    {tx.type === "deposit" ? "+" : "-"}$
                    {Math.abs(tx.amount || 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-navy-400 uppercase">
                    {tx.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card p-5 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-gold-200">
          {t("dashboard.startInvesting")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-xl border border-[rgba(255,215,120,0.1)] bg-navy-800/30 p-4 transition hover:border-gold-400/40"
            >
              <div className="mb-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gold-200">
                  ${plan.minInvestment}
                </span>
                <span className="text-xs text-navy-400">
                  {t("plans.minCapital").toLowerCase()}
                </span>
              </div>
              <div className="text-xs text-navy-300">
                {t("plans.dailyReturn")}: {plan.dailyReturn}% ·{" "}
                {t("plans.duration")}: {plan.durationDays} {t("plans.days").toLowerCase()}
              </div>
              <button
                className="mt-3 w-full rounded-lg bg-gold-400/10 px-4 py-2 text-sm font-medium text-gold-300 transition hover:bg-gold-400/20"
                onClick={() => {
                  if (!currentUser) return;
                  addInvestment({
                    id: `inv-${Date.now()}`,
                    userId: currentUser.id,
                    planId: plan.id,
                    plan: plan,
                    amount: plan.minInvestment,
                    status: "active",
                    startDate: new Date().toISOString(),
                    endDate: new Date(
                      Date.now() + plan.durationDays * 24 * 60 * 60 * 1000
                    ).toISOString(),
                    dailyReturn: plan.dailyReturn,
                    totalReturn: 0,
                    sector: plan.sector,
                  });
                  window.location.href = "/dashboard/plans?selected=" + plan.id;
                }}
                disabled={!currentUser}
              >
                {t("plans.invest")}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
