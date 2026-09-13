"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "@/lib/stores/useStore";
import { motion } from "framer-motion";
import { Check, ArrowRight, X, AlertCircle } from "lucide-react";

export default function PlansPage() {
  const { t } = useTranslation();
  const { plans, currentUser, addInvestment } = useStore();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const plan = plans.find((p) => p.id === selectedPlan);

  const parseAmount = () => {
    const num = Math.max(0, Math.min(
      Number(amount) || 0,
      plan?.maxInvestment ?? Infinity
    ));
    return num;
  };

  const estimatedProfit =
    parseAmount() *
    ((plan?.dailyReturn ?? 0) / 100) *
    (plan?.durationDays ?? 0);

  const openPlan = (planId: string) => {
    setSelectedPlan(planId);
    setAmount("");
    setError("");
    setSuccess("");
    setShowConfirm(false);
  };

  const confirmInvestment = () => {
    if (!currentUser) {
      setError(t("common.error"));
      return;
    }
    const finalAmount = parseAmount();
    if (!finalAmount || finalAmount < (plan?.minInvestment ?? 0)) {
      setError(t("plans.minAmount"));
      return;
    }
    if (finalAmount > (plan?.maxInvestment ?? Infinity)) {
      setError(t("plans.maxAmount"));
      return;
    }
    if (finalAmount > (currentUser?.balance ?? 0)) {
      setError(t("plans.insufficientBalance"));
      return;
    }
    addInvestment({
      id: `inv-${Date.now()}`,
      userId: currentUser.id,
      planId: plan?.id ?? "",
      plan: plan ?? null,
      amount: finalAmount,
      status: "active",
      startDate: new Date().toISOString(),
      endDate: new Date(
        Date.now() + ((plan?.durationDays ?? 0) * 24 * 60 * 60 * 1000)
      ).toISOString(),
      dailyReturn: plan?.dailyReturn ?? 0,
      totalReturn: estimatedProfit,
      sector: plan?.sector ?? "other",
    });
    setSuccess(t("plans.investmentSuccess"));
    setShowConfirm(false);
    setAmount("");
    setTimeout(() => window.location.href = "/dashboard", 1200);
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gold-200">
          {t("plans.title")}
        </h1>
        <p className="mt-1 text-sm text-navy-300">
          {t("plans.subtitle")}
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl bg-red-400/10 border border-red-400/20 p-4 text-sm text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-hidden />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-xl bg-emerald-400/10 border border-emerald-400/20 p-4 text-sm text-emerald-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
          <span>{success}</span>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.4 }}
            className={`rounded-2xl border p-6 transition ${
              plan.id === "growth"
                ? "border-gold-400/50 bg-gradient-to-b from-gold-400/8 to-transparent"
                : "border-navy-500/30 bg-navy-900/40"
            }`}
          >
            <div className="mb-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-gold-200">
                ${plan.minInvestment}
              </span>
              <span className="text-sm text-navy-400">
                {t("plans.minCapital").toLowerCase()}
              </span>
            </div>
            <div className="mb-4 text-lg font-semibold text-gold-300">
              {t(`landing.plan${plan.id.charAt(0).toUpperCase() + plan.id.slice(1)}`)}
              {plan.id === "growth" && (
                <span className="ml-2 badge text-xs">
                  {t("landing.planGrowthHighlight")}
                </span>
              )}
            </div>
            <ul className="space-y-2 text-sm text-navy-300">
              <li className="flex items-center gap-2">
                <span className="text-navy-400">{t("plans.dailyReturn")}:</span>{" "}
                <span className="text-gold-300">{plan.dailyReturn}%</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-navy-400">{t("plans.duration")}:</span>{" "}
                <span className="text-navy-200">
                  {plan.durationDays} {t("plans.days").toLowerCase()}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-navy-400">{t("plans.maxCapital")}:</span>{" "}
                <span className="text-navy-200">
                  ${plan.maxInvestment.toLocaleString()}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-navy-400">Sector:</span>{" "}
                <span className="text-navy-200">
                  {plan.sector?.charAt(0).toUpperCase() + plan.sector?.slice(1)}
                </span>
              </li>
            </ul>
            <button
              className={`mt-6 w-full rounded-lg py-3 text-sm font-semibold transition ${
                plan.id === "growth"
                  ? "bg-gold-400 text-navy-950 hover:bg-gold-300 shadow-md shadow-gold-400/25"
                  : "bg-navy-800/60 text-gold-300 hover:bg-navy-700/70"
              }`}
              onClick={() => openPlan(plan.id)}
            >
              {t("plans.invest")} <ArrowRight className="ml-1 h-4 w-4 inline" aria-hidden />
            </button>
          </motion.div>
        ))}
      </div>

      {selectedPlan && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="rounded-2xl border border-[rgba(255,215,120,0.14)] bg-navy-900/70 p-6 backdrop-blur-sm"
        >
          <h2 className="mb-4 text-xl font-semibold text-gold-200">
            {t("plans.investmentSummary")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-navy-300">
                {t("plans.investAmount")}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 h-8 w-8 -translate-y-1/2 items-center justify-center rounded-l-lg bg-navy-800 border border-r-0 border-[rgba(255,215,120,0.12)] text-sm text-navy-300">
                  $
                </span>
                <input
                  type="number"
                  min={plan?.minInvestment}
                  max={plan?.maxInvestment}
                  step="100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field pl-10 pr-4"
                  placeholder={`$${plan?.minInvestment}`}
                />
              </div>
              <div className="mt-1 text-xs text-navy-400">
                {t("plans.minAmount")} ${plan?.minInvestment} ·{" "}
                {t("plans.maxAmount")} ${plan?.maxInvestment?.toLocaleString()}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-navy-300">
                {t("plans.estimatedProfit")}
              </label>
              <div className="rounded-xl bg-navy-800/40 border border-[rgba(255,215,120,0.1)] p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">
                  +${estimatedProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="mt-1 text-xs text-navy-400">
                  {t("plans.totalReturn").toLowerCase()}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-400/8 border border-amber-400/20 p-3 text-xs text-amber-300">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>
              {t("deposit.warning")}
            </span>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={confirmInvestment}
              className="btn-primary"
            >
              {t("plans.confirmInvestment")}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <button
              onClick={() => {
                setSelectedPlan(null);
                setAmount("");
                setError("");
                setSuccess("");
              }}
              className="btn-outline"
            >
              {t("common.cancel")}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
