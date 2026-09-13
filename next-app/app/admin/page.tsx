"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { useTranslation } from "react-i18next";
import { useStore } from "@/lib/stores/useStore";
import { format } from "date-fns";
import {
  Users,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  Clock,
} from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <AdminDashboardContent />
    </AdminLayout>
  );
}

function AdminDashboardContent() {
  const { t } = useTranslation();
  const {
    users,
    investments,
    transactions,
    plans,
    depositAddresses,
  } = useStore();

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const blockedUsers = users.filter((u) => u.status === "blocked").length;
  const activeInvestments = investments.filter(
    (i) => i.status === "active"
  ).length;
  const pendingDeposits = transactions.filter(
    (tx) => tx.type === "deposit" && tx.status === "pending"
  ).length;
  const pendingWithdrawals = transactions.filter(
    (tx) => tx.type === "withdrawal" && tx.status === "pending"
  ).length;
  const totalDeposited = transactions
    .filter((tx) => tx.type === "deposit" && tx.status !== "rejected")
    .reduce((sum, tx) => sum + Math.abs(tx.amount || 0), 0);

  const statusColors: Record<string, string> = {
    pending: "bg-amber-400/20 text-amber-400",
    approved: "bg-emerald-400/20 text-emerald-400",
    rejected: "bg-red-400/20 text-red-400",
    active: "bg-emerald-400/20 text-emerald-400",
    completed: "bg-blue-400/20 text-blue-400",
    blocked: "bg-red-400/20 text-red-400",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gold-200">
          {t("admin.title")}
        </h1>
        <p className="mt-1 text-sm text-navy-300">
          {t("admin.overview")}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-2 text-sm text-navy-400">
            <Users className="h-4 w-4 text-gold-400" aria-hidden />
            {t("admin.totalUsers")}
          </div>
          <div className="text-2xl font-bold tracking-tight text-gold-200">
            {totalUsers}
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-navy-400">
            <span className="text-emerald-400">{activeUsers} active</span>
            <span className="text-navy-500">·</span>
            <span className="text-red-400">{blockedUsers} blocked</span>
          </div>
        </div>
        <div className="card p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-2 text-sm text-navy-400">
            <TrendingUp className="h-4 w-4 text-emerald-400" aria-hidden />
            {t("admin.activeInvestments")}
          </div>
          <div className="text-2xl font-bold tracking-tight text-emerald-400">
            {activeInvestments}
          </div>
          <div className="mt-1 text-xs text-navy-400">
            {investments.length} total investments
          </div>
        </div>
        <div className="card p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-2 text-sm text-navy-400">
            <ArrowRight className="h-4 w-4 text-amber-400" aria-hidden />
            {t("admin.pendingDeposits")}
          </div>
          <div className="text-2xl font-bold tracking-tight text-amber-400">
            {pendingDeposits}
          </div>
          <div className="mt-1 text-xs text-navy-400">
            {transactions.filter((tx) => tx.type === "deposit").length} total
          </div>
        </div>
        <div className="card p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-2 text-sm text-navy-400">
            <ArrowLeft className="h-4 w-4 text-amber-400" aria-hidden />
            {t("admin.pendingWithdrawals")}
          </div>
          <div className="text-2xl font-bold tracking-tight text-amber-400">
            {pendingWithdrawals}
          </div>
          <div className="mt-1 text-xs text-navy-400">
            {t("admin.totalRevenue")}: ${totalDeposited.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5 sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-gold-200">
            {t("admin.manageUsers")}
          </h2>
          {users.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-sm text-navy-400">
              No users yet
            </div>
          ) : (
            <div className="space-y-2">
              {users.slice(0, 8).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-xl bg-navy-800/30 border border-[rgba(255,215,120,0.08)] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold-300/20 to-amber-500/20 text-sm font-bold text-gold-300">
                      {user.firstName?.charAt(0)}
                      {user.lastName?.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-navy-200">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-xs text-navy-400">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs uppercase ${user.role === "admin" ? "text-gold-400" : "text-navy-400"}`}>
                      {user.role}
                    </span>
                    <span className={`text-xs ${statusColors[user.status]}`}>
                      {user.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-5 sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-gold-200">
            {t("admin.pendingDeposits")}
          </h2>
          {transactions.filter((tx) => tx.type === "deposit").length === 0 ? (
            <div className="flex h-40 items-center justify-center text-sm text-navy-400">
              No deposits yet
            </div>
          ) : (
            <div className="space-y-2">
              {transactions
                .filter((tx) => tx.type === "deposit")
                .slice(0, 8)
                .map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between rounded-xl bg-navy-800/30 border border-[rgba(255,215,120,0.08)] px-4 py-3"
                  >
                    <div>
                      <div className="text-sm font-medium text-navy-200">
                        ${Math.abs(tx.amount || 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-navy-400">
                        {tx.address?.slice(0, 12)}...
                        {tx.network ? ` · ${tx.network}` : ""}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs uppercase ${statusColors[tx.status]}`}>
                        {tx.status}
                      </span>
                      <div className="text-xs text-navy-400 mt-0.5">
                        {format(new Date(tx.createdAt), "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <div className="card p-5 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-gold-200">
          {t("admin.managePlans")}
        </h2>
        {plans.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-sm text-navy-400">
            No plans configured
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="rounded-xl border border-[rgba(255,215,120,0.1)] bg-navy-800/30 p-4"
              >
                <div className="mb-2 flex items-baseline gap-1">
                  <span className="text-lg font-bold text-gold-200">
                    ${plan.minInvestment}
                  </span>
                  <span className="text-xs text-navy-400">
                    {t("plans.minCapital").toLowerCase()}
                  </span>
                </div>
                <div className="text-sm text-navy-200">
                  {plan.name || plan.id}
                </div>
                <div className="mt-2 text-xs text-navy-400">
                  {plan.dailyReturn}% daily · {plan.durationDays} days · max $
                  {plan.maxInvestment.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
