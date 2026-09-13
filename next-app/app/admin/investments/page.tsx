"use client";

import { useTranslation } from "react-i18next";
import { useStore } from "@/lib/stores/useStore";
import AdminLayout from "@/components/layout/AdminLayout";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { TrendingUp, Calendar, AlertCircle, Check } from "lucide-react";

export default function AdminInvestmentsPage() {
  return (
    <AdminLayout>
      <AdminInvestmentsContent />
    </AdminLayout>
  );
}

function AdminInvestmentsContent() {
  const { t } = useTranslation();
  const { investments, updateInvestment } = useStore();

  const sorted = [...investments].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

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
          {t("admin.investments")}
        </h1>
        <p className="mt-1 text-sm text-navy-300">
          {t("admin.editInvestment")}
        </p>
      </div>

      {investments.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-2xl border border-[rgba(255,215,120,0.12)] bg-navy-900/70 text-center text-sm text-navy-400 backdrop-blur-sm">
          No investments yet
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((inv, idx) => {
            const user = (typeof window !== "undefined" && (window as any).__next_fallback)
              ? null
              : null;
            const owner = (typeof window !== "undefined")
              ? (window as any).__mockUsers?.find((u: any) => u?.id === inv.userId)
              : null;
            const userName =
              owner?.firstName &&
              owner?.lastName
                ? `${owner.firstName} ${owner.lastName}`
                : inv.userId ?? "Unknown";

            return (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02, duration: 0.25 }}
                className="rounded-2xl border border-[rgba(255,215,120,0.1)] bg-navy-900/70 p-4 sm:p-5 backdrop-blur-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-gold-300/20 to-amber-500/20 text-lg font-bold text-gold-300">
                      {inv.amount?.toLocaleString()}
                      <span className="ml-1 text-xs font-normal text-navy-400">USD</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-navy-200">
                        {inv.plan?.name || inv.planId || "Investment"}
                        {inv.sector ? ` · ${inv.sector?.charAt(0).toUpperCase() + inv.sector?.slice(1)}` : ""}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-navy-400">
                        <span>{userName}</span>
                        {inv.userId && (
                          <span className="text-navy-500">·</span>
                        )}
                        {inv.userId}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs text-navy-400">
                      <Calendar className="h-3.5 w-3.5" aria-hidden />
                      {format(new Date(inv.startDate), "MMM d, yyyy")} —{" "}
                      {format(new Date(inv.endDate), "MMM d, yyyy")}
                    </div>
                    <span className={`text-xs uppercase ${statusColors[inv.status] ?? "text-navy-400"}`}>
                      {inv.status}
                    </span>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-emerald-400">
                        +${Math.abs(inv.totalReturn || 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-navy-400">
                        {t("plans.totalReturn").toLowerCase()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-navy-400">
                  <TrendingUp className="h-3.5 w-3.5 text-gold-400" aria-hidden />
                  <span>Daily return: {inv.dailyReturn}%</span>
                  <span className="text-navy-500">·</span>
                  <span>
                    {format(new Date(inv.startDate), "MMM d")} → {format(new Date(inv.endDate), "MMM d, yyyy")}
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
