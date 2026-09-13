"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "@/lib/stores/useStore";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Filter } from "lucide-react";

type FilterType = "all" | "deposit" | "withdrawal";

export default function TransactionsPage() {
  const { t } = useTranslation();
  const { transactions, addTransaction } = useStore();
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered =
    filter === "all"
      ? transactions
      : transactions.filter((tx) => tx.type === filter);

  const sorted = [...filtered].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gold-200">
          {t("transactions.title")}
        </h1>
        <p className="mt-1 text-sm text-navy-300">
          {t("transactions.subtitle")}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
            filter === "all"
              ? "bg-gold-400/15 text-gold-300 border border-gold-400/30"
              : "bg-navy-800/40 text-navy-300 hover:text-gold-300"
          }`}
          onClick={() => setFilter("all")}
        >
          {t("transactions.all")}
        </button>
        <button
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
            filter === "deposit"
              ? "bg-gold-400/15 text-gold-300 border border-gold-400/30"
              : "bg-navy-800/40 text-navy-300 hover:text-gold-300"
          }`}
          onClick={() => setFilter("deposit")}
        >
          <ArrowRight className="h-4 w-4" aria-hidden />
          {t("transactions.deposits")}
        </button>
        <button
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
            filter === "withdrawal"
              ? "bg-gold-400/15 text-gold-300 border border-gold-400/30"
              : "bg-navy-800/40 text-navy-300 hover:text-gold-300"
          }`}
          onClick={() => setFilter("withdrawal")}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t("transactions.withdrawals")}
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-[rgba(255,215,120,0.12)] bg-navy-900/70 p-10 text-center backdrop-blur-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-navy-800/60 text-navy-400">
            <Filter className="h-6 w-6" aria-hidden />
          </div>
          <h2 className="text-lg font-semibold text-navy-200">
            {t("transactions.noTransactions")}
          </h2>
          <p className="mt-1 text-sm text-navy-400">
            Your transaction history will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((tx, idx) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03, duration: 0.3 }}
              className="rounded-2xl border border-[rgba(255,215,120,0.1)] bg-navy-900/70 p-4 sm:p-5 backdrop-blur-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      tx.type === "deposit"
                        ? "bg-emerald-400/10 text-emerald-400"
                        : "bg-amber-400/10 text-amber-400"
                    }`}
                  >
                    {tx.type === "deposit" ? (
                      <ArrowRight className="h-5 w-5" aria-hidden />
                    ) : (
                      <ArrowLeft className="h-5 w-5" aria-hidden />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-navy-200">
                      {tx.type === "deposit"
                        ? t("transactions.deposit")
                        : t("transactions.withdrawal")}
                      {tx.network ? ` · ${tx.network}` : ""}
                      {tx.cryptoName ? ` · ${tx.cryptoName}` : ""}
                    </div>
                    <div className="mt-0.5 text-xs text-navy-400">
                      {format(new Date(tx.createdAt), "MMM d, yyyy 'at' h:mm a")}
                      {tx.address ? ` · ${tx.address.slice(0, 10)}...` : ""}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${
                      tx.type === "deposit"
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }`}>
                      {tx.type === "deposit" ? "+" : "-"}$
                      {Math.abs(tx.amount || 0).toLocaleString()}
                    </div>
                    <div className={`text-xs uppercase tracking-wide ${
                      tx.status === "approved"
                        ? "text-emerald-400"
                        : tx.status === "rejected"
                          ? "text-red-400"
                          : "text-amber-400"
                    }`}>
                      {tx.status}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
