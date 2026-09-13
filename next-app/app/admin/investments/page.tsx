"use client";

import { useTranslation } from "react-i18next";
import { useStore } from "@/lib/stores/useStore";
import AdminLayout from "@/components/layout/AdminLayout";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils/helpers";

export default function AdminInvestmentsPage() {
  return (
    <AdminLayout>
      <AdminInvestmentsContent />
    </AdminLayout>
  );
}

function AdminInvestmentsContent() {
  const { t } = useTranslation();
  const { investments, users, plans } = useStore();

  const sorted = [...investments].sort(
    (a, b) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const statusColors: Record<string, string> = {
    active: "bg-emerald-400/20 text-emerald-400",
    completed: "bg-blue-400/20 text-blue-400",
    cancelled: "bg-red-400/20 text-red-400",
  };

  const getUserName = (userId: string) => {
    const owner = users.find((u) => u.id === userId);
    if (!owner) return userId;
    return `${owner.firstName} ${owner.lastName}`;
  };

  const getPlanName = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    return plan?.name ?? planId;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gold-200">
          {t("admin.investments")}
        </h1>
        <p className="mt-1 text-sm text-navy-300">
          {investments.length} total
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-2xl border border-[rgba(255,215,120,0.12)] bg-navy-900/70 text-center text-sm text-navy-400 backdrop-blur-sm">
          No investments yet
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((inv, idx) => {
            const daysLeft = Math.max(
              0,
              Math.ceil(
                (new Date(inv.endDate).getTime() - Date.now()) /
                  (24 * 60 * 60 * 1000)
              )
            );
            return (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02, duration: 0.25 }}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[rgba(255,215,120,0.1)] bg-navy-900/70 p-4 sm:p-5 backdrop-blur-sm"
              >
                <div>
                  <div className="text-sm font-medium text-navy-200">
                    {getPlanName(inv.planId)}
                    {" · "}
                    {formatCurrency(inv.amount)}
                  </div>
                  <div className="mt-0.5 text-xs text-navy-400">
                    {getUserName(inv.userId)} · {inv.dailyPercentage}% daily ·{" "}
                    {inv.days} days
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-xs text-navy-400">
                    <div>
                      {format(new Date(inv.startDate), "MMM d")} →{" "}
                      {format(new Date(inv.endDate), "MMM d, yyyy")}
                    </div>
                    <div className="mt-0.5">
                      {inv.status === "active"
                        ? `${daysLeft} days left`
                        : "—"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-emerald-400">
                      {formatCurrency(inv.currentProfit)}
                    </div>
                    <div className="text-xs text-navy-400">
                      est. {formatCurrency(inv.estimatedProfit)}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium uppercase ${
                      statusColors[inv.status] ?? "text-navy-400"
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
