"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "@/lib/stores/useStore";
import AdminLayout from "@/components/layout/AdminLayout";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, AlertCircle, Check, X } from "lucide-react";

export default function AdminPlansPage() {
  return (
    <AdminLayout>
      <AdminPlansContent />
    </AdminLayout>
  );
}

function AdminPlansContent() {
  const { t } = useTranslation();
  const { plans, addPlan, updatePlan, deletePlan } = useStore();

  const [activeTab, setActiveTab] = useState<"list" | "create" | "edit">("list");
  const [form, setForm] = useState({
    id: "",
    name: "",
    minInvestment: 500,
    maxInvestment: 100000,
    dailyReturn: 1,
    durationDays: 15,
    sector: "other",
    description: "",
  });
  const [message, setMessage] = useState<{type: "success" | "error", text: string} | null>(null);

  const editPlan = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;
    setForm({
      id: plan.id,
      name: plan.name ?? plan.id,
      minInvestment: plan.minInvestment ?? 500,
      maxInvestment: plan.maxInvestment ?? 100000,
      dailyReturn: plan.dailyReturn ?? 1,
      durationDays: plan.durationDays ?? 15,
      sector: plan.sector ?? "other",
      description: plan.description ?? "",
    });
    setActiveTab("edit");
  };

  const savePlan = () => {
    if (!form.name.trim()) {
      setMessage({ type: "error", text: "Plan name is required" });
      return;
    }
    if (form.minInvestment <= 0) {
      setMessage({ type: "error", text: "Minimum investment must be greater than 0" });
      return;
    }
    if (form.maxInvestment <= form.minInvestment) {
      setMessage({ type: "error", text: "Maximum investment must be greater than minimum" });
      return;
    }
    if (form.dailyReturn < 0) {
      setMessage({ type: "error", text: "Daily return cannot be negative" });
      return;
    }
    if (activeTab === "create") {
      if (plans.find((p) => p.name === form.name)) {
        setMessage({ type: "error", text: "A plan with this name already exists" });
        return;
      }
      addPlan({
        id: `plan-${Date.now()}`,
        name: form.name,
        minInvestment: form.minInvestment,
        maxInvestment: form.maxInvestment,
        dailyReturn: form.dailyReturn,
        durationDays: form.durationDays,
        sector: form.sector,
        description: form.description,
      });
      setMessage({ type: "success", text: `Plan "${form.name}" created` });
      setForm({
        id: "",
        name: "",
        minInvestment: 500,
        maxInvestment: 100000,
        dailyReturn: 1,
        durationDays: 15,
        sector: "other",
        description: "",
      });
    } else {
      updatePlan(form.id, {
        name: form.name,
        minInvestment: form.minInvestment,
        maxInvestment: form.maxInvestment,
        dailyReturn: form.dailyReturn,
        durationDays: form.durationDays,
        sector: form.sector,
        description: form.description,
      });
      setMessage({ type: "success", text: `Plan "${form.name}" updated` });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = (planId: string, name: string) => {
    if (!confirm(`Delete plan "${name}"?`)) return;
    deletePlan(planId);
    setMessage({ type: "success", text: `Plan "${name}" deleted` });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gold-200">
            {t("admin.plans")}
          </h1>
          <p className="mt-1 text-sm text-navy-300">
            {t("admin.managePlans")}
          </p>
        </div>
        <button
          onClick={() => {
            setActiveTab("create");
            setForm({
              id: "",
              name: "",
              minInvestment: 500,
              maxInvestment: 100000,
              dailyReturn: 1,
              durationDays: 15,
              sector: "other",
              description: "",
            });
          }}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" aria-hidden />
          {t("admin.createPlan")}
        </button>
      </div>

      {message && (
        <div
          className={`flex items-start gap-3 rounded-xl p-4 text-sm ${
            message.type === "success"
              ? "bg-emerald-400/10 border border-emerald-400/20 text-emerald-300"
              : "bg-red-400/10 border border-red-400/20 text-red-300"
          }`}
        >
          {message.type === "success" ? (
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-hidden />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {activeTab === "create" || activeTab === "edit" ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <h2 className="mb-5 text-lg font-semibold text-gold-200">
            {activeTab === "create" ? t("admin.createPlan") : t("admin.editPlan")}
          </h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-navy-300">Plan Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="input-field"
                placeholder="Growth Plus"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-navy-300">Min Investment</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 h-9 -translate-y-1/2 w-9 items-center justify-center rounded-l-lg bg-navy-800 border border-r-0 border-[rgba(255,215,120,0.12)] text-sm text-navy-300">$</span>
                  <input
                    type="number"
                    value={form.minInvestment}
                    onChange={(e) => setForm((f) => ({ ...f, minInvestment: Number(e.target.value) || 0 }))}
                    className="input-field pl-8"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-navy-300">Max Investment</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 h-9 -translate-y-1/2 w-9 items-center justify-center rounded-l-lg bg-navy-800 border border-r-0 border-[rgba(255,215,120,0.12)] text-sm text-navy-300">$</span>
                  <input
                    type="number"
                    value={form.maxInvestment}
                    onChange={(e) => setForm((f) => ({ ...f, maxInvestment: Number(e.target.value) || 0 }))}
                    className="input-field pl-8"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-navy-300">Daily Return (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.dailyReturn}
                  onChange={(e) => setForm((f) => ({ ...f, dailyReturn: Number(e.target.value) || 0 }))}
                  className="input-field"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-navy-300">Duration (days)</label>
                <input
                  type="number"
                  value={form.durationDays}
                  onChange={(e) => setForm((f) => ({ ...f, durationDays: Number(e.target.value) || 1 }))}
                  className="input-field"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-navy-300">Sector</label>
                <select
                  value={form.sector}
                  onChange={(e) => setForm((f) => ({ ...f, sector: e.target.value }))}
                  className="input-field"
                >
                  {["agriculture", "energy", "minerals", "realestate", "technology", "infrastructure", "other"].map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1).replace(/([A-Z])/g, " $1")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-navy-300">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="input-field resize-y min-h-[80px]"
                placeholder="Brief description of this plan..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setActiveTab("list")}
                className="btn-outline"
              >
                {t("common.cancel")}
              </button>
              <button onClick={savePlan} className="btn-primary">
                {activeTab === "create" ? t("admin.createPlan") : t("admin.editPlan")}
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {plans.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-[rgba(255,215,120,0.12)] bg-navy-900/70 text-center text-sm text-navy-400 backdrop-blur-sm">
              No plans created yet
            </div>
          ) : (
            plans.map((plan, idx) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02, duration: 0.25 }}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[rgba(255,215,120,0.1)] bg-navy-900/70 p-5 backdrop-blur-sm"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold text-gold-200">
                      ${plan.minInvestment?.toLocaleString()}
                    </div>
                    {plan.id === "growth" && (
                      <span className="badge text-xs">{t("landing.planGrowthHighlight")}</span>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-navy-200">
                    {plan.name || plan.id}
                    {plan.description ? ` — ${plan.description}` : ""}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-navy-400">
                    <span>☀ {plan.dailyReturn}% daily</span>
                    <span>📅 {plan.durationDays} days</span>
                    <span>📈 max ${plan.maxInvestment?.toLocaleString()}</span>
                    <span>🏷 {plan.sector?.charAt(0).toUpperCase() + plan.sector?.slice(1)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => editPlan(plan.id)}
                    className="flex h-9 items-center gap-1 rounded-lg px-3 text-xs font-medium text-navy-300 transition hover:bg-navy-800/60 hover:text-gold-300"
                  >
                    <Edit2 className="h-3.5 w-3.5" aria-hidden />
                    {t("admin.editPlan")}
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id, plan.name || plan.id)}
                    className="flex h-9 items-center gap-1 rounded-lg px-3 text-xs font-medium text-red-400 transition hover:bg-red-400/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    {t("admin.deletePlan")}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
