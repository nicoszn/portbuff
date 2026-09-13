"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "@/lib/stores/useStore";
import { calculateProfit, formatCurrency } from "@/lib/utils/helpers";
import { motion } from "framer-motion";
import { ArrowRight, AlertCircle, Check } from "lucide-react";

export default function PlansPage() {
  const { t } = useTranslation();
  const { plans, currentUser, addInvestment, updateProfile } = useStore();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const plan = plans.find((p) => p.id === selectedPlanId);

  const numericAmount = Number(amount) || 0;

  const estimatedProfit = plan
    ? calculateProfit(numericAmount, plan.dailyPercentage, plan.days)
    : 0;

  const openPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setAmount("");
    setError("");
    setSuccess("");
  };

  const confirmInvestment = () => {
    if (!plan || !currentUser) {
      setError(t("common.error"));
      return;
    }
    if (!numericAmount || numericAmount < plan.minCapital) {
      setError(`${t("plans.minAmount")}: ${formatCurrency(plan.minCapital)}`);
      return;
    }
    if (numericAmount > plan.maxCapital) {
      setError(`${t("plans.maxAmount")}: ${formatCurrency(plan.maxCapital)}`);
      return;
    }
    if (numericAmount > (currentUser.balance || 0)) {
      setError(t("plans.insufficientBalance"));
      return;
    }

    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + plan.days);

    addInvestment({
      id: `inv-${Date.now()}`,
      userId: currentUser.id,
      planId: plan.id,
      amount: numericAmount,
      dailyPercentage: plan.dailyPercentage,
      days: plan.days,
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      estimatedProfit,
      currentProfit: 0,
      status: "active",
    });

    updateProfile({
      balance: (currentUser.balance || 0) - numericAmount,
      totalInvested: (currentUser.totalInvested || 0) + numericAmount,
    });

    setSuccess(t("plans.investmentSuccess"));
    setAmount("");
    setSelectedPlanId(null);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1200);
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
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
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
            className="rounded-2xl border border-[rgba(255,215,120,0.12)] bg-navy-900/60 p-6 transition hover:border-gold-400/40"
          >
            <div className="mb-3 text-2xl">{plan.icon}</div>
            <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-r ${plan.color} bg-clip-text text-lg font-semibold text-transparent`}>
              {plan.name}
            </div>
            <p className="mb-4 text-sm text-navy-300">
              {plan.description}
            </p>
            <ul className="space-y-2 text-sm text-navy-300">
              <li className="flex justify-between">
                <span className="text-navy-400">{t("plans.minCapital")}</span>
                <span className="text-navy-100">{formatCurrency(plan.minCapital)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-navy-400">{t("plans.maxCapital")}</span>
                <span className="text-navy-100">{formatCurrency(plan.maxCapital)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-navy-400">{t("plans.dailyReturn")}</span>
                <span className="text-gold-300">{plan.dailyPercentage}%</span>
              </li>
              <li className="flex justify-between">
                <span className="text-navy-400">{t("plans.duration")}</span>
                <span className="text-navy-100">
                  {plan.days} {t("plans.days").toLowerCase()}
                </span>
              </li>
            </ul>
            <button
              className="btn-primary mt-6 w-full"
              onClick={() => openPlan(plan.id)}
            >
              {t("plans.invest")}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </motion.div>
        ))}
      </div>

      {selectedPlanId && plan && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden"
        >
          <div className="rounded-2xl border border-[rgba(255,215,120,0.14)] bg-navy-900/70 p-6 backdrop-blur-sm">
            <h2 className="mb-1 text-xl font-semibold text-gold-200">
              {plan.name}
            </h2>
            <p className="mb-5 text-sm text-navy-300">
              {t("plans.investmentSummary")}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-navy-300">
                  {t("plans.investAmount")}
                </label>
                <input
                  type="number"
                  min={plan.minCapital}
                  max={plan.maxCapital}
                  step="100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field"
                  placeholder={String(plan.minCapital)}
                />
                <div className="mt-1 text-xs text-navy-400">
                  {t("plans.minAmount")}: {formatCurrency(plan.minCapital)} ·{" "}
                  {t("plans.maxAmount")}: {formatCurrency(plan.maxCapital)}
                </div>
                <div className="mt-1 text-xs text-navy-400">
                  {t("plans.availableBalance")}: {formatCurrency(currentUser?.balance || 0)}
                </div>
              </div>
              <div className="rounded-xl bg-navy-800/40 border border-[rgba(255,215,120,0.1)] p-4">
                <div className="mb-3 text-xs font-medium text-navy-400">
                  {t("plans.estimatedProfit")}
                </div>
                <div className="text-2xl font-bold text-emerald-400">
                  +{formatCurrency(estimatedProfit)}
                </div>
                <div className="mt-3 space-y-1.5 text-xs text-navy-400">
                  <div className="flex justify-between">
                    <span>{t("plans.startDate")}</span>
                    <span className="text-navy-200">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("plans.endDate")}</span>
                    <span className="text-navy-200">
                      {(() => {
                        const d = new Date();
                        d.setDate(d.getDate() + plan.days);
                        return d.toLocaleDateString();
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={confirmInvestment}
                disabled={
                  !numericAmount ||
                  numericAmount < plan.minCapital ||
                  numericAmount > (currentUser?.balance || 0)
                }
                className="btn-primary disabled:opacity-50 disabled:pointer-events-none"
              >
                {t("plans.confirmInvestment")}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
              <button
                onClick={() => {
                  setSelectedPlanId(null);
                  setAmount("");
                  setError("");
                }}
                className="btn-outline"
              >
                {t("common.cancel")}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
