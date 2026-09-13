"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "@/lib/stores/useStore";
import AdminLayout from "@/components/layout/AdminLayout";
import { formatCurrency } from "@/lib/utils/helpers";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, AlertCircle, Check } from "lucide-react";

type PlanForm = {
  id: string;
  name: string;
  minCapital: number;
  maxCapital: number;
  dailyPercentage: number;
  days: number;
  description: string;
  color: string;
  icon: string;
};

const emptyForm: PlanForm = {
  id: "",
  name: "",
  minCapital: 100,
  maxCapital: 1000,
  dailyPercentage: 2.5,
  days: 4,
  description: "",
  color: "from-blue-500 to-cyan-400",
  icon: "🚀",
};

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

  const [mode, setMode] = useState<"list" | "form">("list");
  const [form, setForm] = useState<PlanForm>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const notify = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const openCreate = () => {
    setForm(emptyForm);
    setIsEditing(false);
    setMode("form");
  };

  const openEdit = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;
    setForm({ ...plan });
    setIsEditing(true);
    setMode("form");
  };

  const savePlan = () => {
    if (!form.name.trim()) {
      notify("error", "Plan name is required");
      return;
    }
    if (form.minCapital <= 0) {
      notify("error", "Minimum capital must be greater than 0");
      return;
    }
    if (form.maxCapital <= form.minCapital) {
      notify("error", "Maximum capital must be greater than minimum");
      return;
    }
    if (form.dailyPercentage < 0) {
      notify("error", "Daily percentage cannot be negative");
      return;
    }
    if (form.days <= 0) {
      notify("error", "Duration must be at least 1 day");
      return;
    }

    if (isEditing) {
      updatePlan(form.id, { ...form });
      notify("success", `Plan "${form.name}" updated`);
    } else {
      addPlan({ ...form, id: `plan-${Date.now()}` });
      notify("success", `Plan "${form.name}" created`);
    }
    setMode("list");
  };

  const handleDelete = (planId: string, name: string) => {
    if (!confirm(`Delete plan "${name}"?`)) return;
    deletePlan(planId);
    notify("success", `Plan "${name}" deleted`);
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
        <button onClick={openCreate} className="btn-primary">
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

      {mode === "form" ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
          <h2 className="mb-5 text-lg font-semibold text-gold-200">
            {isEditing ? t("admin.editPlan") : t("admin.createPlan")}
          </h2>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-medium text-navy-300">Plan Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="input-field"
                  placeholder="Professional"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-navy-300">Icon (emoji)</label>
                <input
                  type="text"
                  value={form.icon}
                  onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                  className="input-field"
                  placeholder="💎"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-navy-300">Gradient</label>
                <select
                  value={form.color}
                  onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                  className="input-field"
                >
                  <option value="from-blue-500 to-cyan-400">Blue → Cyan</option>
                  <option value="from-purple-500 to-pink-400">Purple → Pink</option>
                  <option value="from-amber-500 to-orange-400">Amber → Orange</option>
                  <option value="from-emerald-500 to-teal-400">Emerald → Teal</option>
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-navy-300">{t("plans.minCapital")}</label>
                <input
                  type="number"
                  value={form.minCapital}
                  onChange={(e) => setForm((f) => ({ ...f, minCapital: Number(e.target.value) || 0 }))}
                  className="input-field"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-navy-300">{t("plans.maxCapital")}</label>
                <input
                  type="number"
                  value={form.maxCapital}
                  onChange={(e) => setForm((f) => ({ ...f, maxCapital: Number(e.target.value) || 0 }))}
                  className="input-field"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-navy-300">{t("plans.dailyReturn")} (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.dailyPercentage}
                  onChange={(e) => setForm((f) => ({ ...f, dailyPercentage: Number(e.target.value) || 0 }))}
                  className="input-field"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-navy-300">{t("plans.duration")} ({t("plans.days")})</label>
                <input
                  type="number"
                  value={form.days}
                  onChange={(e) => setForm((f) => ({ ...f, days: Number(e.target.value) || 1 }))}
                  className="input-field"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-navy-300">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="input-field min-h-[80px] resize-y"
                placeholder="Brief description of this plan..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setMode("list")} className="btn-outline">
                {t("common.cancel")}
              </button>
              <button onClick={savePlan} className="btn-primary">
                {isEditing ? t("admin.editPlan") : t("admin.createPlan")}
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
                    <span className="text-xl">{plan.icon}</span>
                    <span className="text-lg font-bold text-gold-200">{plan.name}</span>
                  </div>
                  <div className="mt-1 text-sm text-navy-300">{plan.description}</div>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-navy-400">
                    <span>
                      {formatCurrency(plan.minCapital)} – {formatCurrency(plan.maxCapital)}
                    </span>
                    <span>{plan.dailyPercentage}% daily</span>
                    <span>{plan.days} days</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(plan.id)}
                    className="flex h-9 items-center gap-1 rounded-lg px-3 text-xs font-medium text-navy-300 transition hover:bg-navy-800/60 hover:text-gold-300"
                  >
                    <Edit2 className="h-3.5 w-3.5" aria-hidden />
                    {t("admin.editPlan")}
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id, plan.name)}
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
