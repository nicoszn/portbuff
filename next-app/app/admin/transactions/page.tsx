"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "@/lib/stores/useStore";
import AdminLayout from "@/components/layout/AdminLayout";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Search, Check, X, AlertCircle, Filter } from "lucide-react";

type FilterType = "all" | "deposit" | "withdrawal";
type StatusFilter = "all" | "pending" | "approved" | "rejected";

export default function AdminTransactionsPage() {
  return (
    <AdminLayout>
      <AdminTransactionsContent />
    </AdminLayout>
  );
}

function AdminTransactionsContent() {
  const { t } = useTranslation();
  const { transactions, updateTransaction, users } = useStore();

  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const filtered = transactions.filter((tx) => {
    if (typeFilter !== "all" && tx.type !== typeFilter) return false;
    if (statusFilter !== "all" && tx.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const address = tx.address ?? "";
      const hasUser = users.find((u) =>
        u.email.toLowerCase().includes(q) ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q)
      );
      if (!hasUser && !address.toLowerCase().includes(q) && !tx.cryptoName?.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const sorted = [...filtered].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getUser = (userId?: string) => {
    if (!userId) return null;
    return users.find((u) => u.id === userId);
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === "approved") {
      return <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden />;
    }
    if (status === "rejected") {
      return <X className="h-3.5 w-3.5 text-red-400" aria-hidden />;
    }
    return <AlertCircle className="h-3.5 w-3.5 text-amber-400" aria-hidden />;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gold-200">
            {t("admin.transactions")}
          </h1>
          <p className="mt-1 text-sm text-navy-300">
            {t("admin.deposits")} / {t("admin.withdrawals")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="input-field w-36"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as FilterType)}
            className="input-field w-36"
          >
            <option value="all">All Types</option>
            <option value="deposit">Deposits</option>
            <option value="withdrawal">Withdrawals</option>
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" aria-hidden />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by user or address..."
              className="input-field pl-9 w-48"
            />
          </div>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-2xl border border-[rgba(255,215,120,0.12)] bg-navy-900/70 text-center text-sm text-navy-400 backdrop-blur-sm">
          No transactions found
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((tx, idx) => {
            const owner = getUser(tx.userId);
            const displayName =
              owner?.firstName && owner?.lastName
                ? `${owner.firstName} ${owner.lastName}`
                : tx.userId ?? "Unknown";

            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02, duration: 0.25 }}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[rgba(255,215,120,0.1)] bg-navy-900/70 p-4 sm:p-5 backdrop-blur-sm"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    tx.type === "deposit"
                      ? "bg-emerald-400/10 text-emerald-400"
                      : "bg-amber-400/10 text-amber-400"
                  }`}>
                    {tx.type === "deposit" ? (
                      <ArrowRight className="h-5 w-5" aria-hidden />
                    ) : (
                      <ArrowLeft className="h-5 w-5" aria-hidden />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-navy-200 truncate">
                      {displayName}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-navy-400 truncate">
                      {tx.cryptoName || tx.network || tx.type}
                      {tx.address && (
                        <>
                          <span className="text-navy-500">·</span>
                          <span className="font-mono">{tx.address}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${
                      tx.type === "deposit"
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }`}>
                      {tx.type === "deposit" ? "+" : "-"}$
                      {Math.abs(tx.amount || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-navy-400 mt-0.5">
                      {tx.cryptoName || tx.network || tx.type}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-navy-400">
                      {format(new Date(tx.createdAt), "MMM d, yyyy")}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs uppercase ${
                      tx.status === "approved"
                        ? "text-emerald-400"
                        : tx.status === "rejected"
                          ? "text-red-400"
                          : "text-amber-400"
                    }`}>
                      {tx.status}
                    </span>
                    {tx.status === "pending" && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            updateTransaction(tx.id, { status: "approved" });
                          }}
                          className="flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-medium bg-emerald-400/10 text-emerald-400 transition hover:bg-emerald-400/20"
                        >
                          <Check className="h-3 w-3" aria-hidden />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            updateTransaction(tx.id, { status: "rejected" });
                          }}
                          className="flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-medium bg-red-400/10 text-red-400 transition hover:bg-red-400/20"
                        >
                          <X className="h-3 w-3" aria-hidden />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
