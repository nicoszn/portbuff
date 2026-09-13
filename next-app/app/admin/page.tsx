"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { useTranslation } from "react-i18next";
import { useStore } from "@/lib/stores/useStore";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils/helpers";
import {
  Users,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
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
  const { users, investments, transactions, plans } = useStore();

  const activeUsers = users.filter((u) => u.status === "active").length;
  const blockedUsers = users.filter((u) => u.status === "blocked").length;
  const activeInvestments = investments.filter(
    (i) => i.status === "active"
  ).length;
  const pendingDeposits = transactions.filter(
    (tx) => tx.type === "deposit" && tx.status === "pending"
  );
  const pendingWithdrawals = transactions.filter(
    (tx) => tx.type === "withdrawal" && tx.status === "pending"
  );
  const totalDeposited = transactions
    .filter((tx) => tx.type === "deposit" && tx.status === "approved")
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

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
            {users.length}
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
            {pendingDeposits.length}
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
            {pendingWithdrawals.length}
          </div>
          <div className="mt-1 text-xs text-navy-400">
            Revenue: {formatCurrency(totalDeposited)}
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
                    <span
                      className={`text-xs ${
                        user.status === "active" ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
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
                .map((tx) => {
                  const owner = users.find((u) => u.id === tx.userId);
                  return (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between rounded-xl bg-navy-800/30 border border-[rgba(255,215,120,0.08)] px-4 py-3"
                    >
                      <div>
                        <div className="text-sm font-medium text-navy-200">
                          {formatCurrency(Math.abs(tx.amount))}
                        </div>
                        <div className="text-xs text-navy-400">
                          {owner
                            ? `${owner.firstName} ${owner.lastName}`
                            : tx.userId}
                          {` · ${tx.cryptoNetwork}`}
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-xs uppercase ${
                            tx.status === "approved"
                              ? "text-emerald-400"
                              : tx.status === "rejected"
                                ? "text-red-400"
                                : "text-amber-400"
                          }`}
                        >
                          {tx.status}
                        </span>
                        <div className="text-xs text-navy-400 mt-0.5">
                          {format(new Date(tx.createdAt), "MMM d, yyyy")}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      <div className="card p-5 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-gold-200">
          {t("admin.managePlans")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-xl border border-[rgba(255,215,120,0.1)] bg-navy-800/30 p-4"
            >
              <div className="mb-1 flex items-center gap-2">
                <span className="text-lg">{plan.icon}</span>
                <span className="text-sm font-semibold text-navy-200">
                  {plan.name}
                </span>
              </div>
              <div className="text-xs text-navy-400">
                {formatCurrency(plan.minCapital)} – {formatCurrency(plan.maxCapital)}{" "}
                · {plan.dailyPercentage}% daily · {plan.days} days
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
