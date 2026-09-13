"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "@/lib/stores/useStore";
import AdminLayout from "@/components/layout/AdminLayout";
import { motion } from "framer-motion";
import { UserPlus, Search, Ban, Check, Trash2, AlertCircle, Shield } from "lucide-react";

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <AdminUsersContent />
    </AdminLayout>
  );
}

function AdminUsersContent() {
  const { t } = useTranslation();
  const {
    users,
    addUser,
    updateUser,
    deleteUser,
  } = useStore();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user" as "user" | "admin",
  });
  const [message, setMessage] = useState<{type: "success" | "error", text: string} | null>(null);

  const filtered =
    search.trim() === ""
      ? users
      : users.filter(
          (u) =>
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            `${u.firstName} ${u.lastName}`
              .toLowerCase()
              .includes(search.toLowerCase())
        );

  const createUser = () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.password.trim()) {
      setMessage({ type: "error", text: t("common.error") });
      return;
    }
    if (form.password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }
    if (users.find((u) => u.email === form.email)) {
      setMessage({ type: "error", text: "Email already exists" });
      return;
    }
    addUser({
      id: `user-${Date.now()}`,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      role: form.role,
      balance: 0,
      totalInvested: 0,
      totalEarned: 0,
      currentProfit: 0,
      status: "active",
      createdAt: new Date().toISOString(),
    });
    setMessage({ type: "success", text: `${form.firstName} ${form.lastName} created` });
    setForm({ firstName: "", lastName: "", email: "", password: "", role: "user" });
    setTimeout(() => setMessage(null), 3000);
  };

  const toggleStatus = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    updateUser(id, { status: user.status === "active" ? "blocked" : "active" });
    setMessage({
      type: "success",
      text: `${user.firstName} ${user.lastName} ${user.status === "active" ? "blocked" : "unblocked"}`,
    });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gold-200">
            {t("admin.users")}
          </h1>
          <p className="mt-1 text-sm text-navy-300">
            {t("admin.manageUsers")}
          </p>
        </div>
        <button
          onClick={() => setActiveTab("create")}
          className="btn-primary"
        >
          <UserPlus className="h-4 w-4" aria-hidden />
          {t("admin.createUser")}
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

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" aria-hidden />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("common.search") || "Search users..."}
          className="input-field pl-10"
        />
      </div>

      {activeTab === "create" ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <h2 className="mb-5 text-lg font-semibold text-gold-200">
            {t("admin.createUser")}
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-navy-300">{t("settings.firstName")}</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  className="input-field"
                  placeholder="Alex"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-navy-300">{t("settings.lastName")}</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  className="input-field"
                  placeholder="Rivera"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-navy-300">{t("settings.email")}</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="input-field"
                placeholder="alex@portbuff.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-navy-300">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="input-field"
                  placeholder="Min 6 characters"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-navy-300">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as "user" | "admin" }))}
                  className="input-field"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setActiveTab("list");
                  setMessage(null);
                }}
                className="btn-outline"
              >
                {t("common.cancel")}
              </button>
              <button onClick={createUser} className="btn-primary">
                {t("admin.createUser")}
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-[rgba(255,215,120,0.12)] bg-navy-900/70 text-center text-sm text-navy-400 backdrop-blur-sm">
              {t("common.noResults") || "No users found"}
            </div>
          ) : (
            filtered.map((user, idx) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02, duration: 0.25 }}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[rgba(255,215,120,0.1)] bg-navy-900/70 p-4 sm:p-5 backdrop-blur-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-gold-300/20 to-amber-500/20 text-sm font-bold text-gold-300">
                    {user.firstName?.charAt(0)}
                    {user.lastName?.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-navy-200">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-navy-400">
                      <span className="font-mono">{user.email}</span>
                      {user.role === "admin" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gold-400/10 px-2 py-0.5 text-gold-400">
                          <Shield className="h-3 w-3" aria-hidden />
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs uppercase ${
                    user.status === "active" ? "text-emerald-400" : "text-red-400"
                  }`}>
                    {user.status}
                  </span>
                  <button
                    onClick={() => toggleStatus(user.id)}
                    className={`flex h-8 items-center gap-1 rounded-lg px-3 text-xs font-medium transition ${
                      user.status === "active"
                        ? "bg-red-400/10 text-red-400 hover:bg-red-400/20"
                        : "bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20"
                    }`}
                  >
                    {user.status === "active" ? (
                      <>
                        <Ban className="h-3.5 w-3.5" aria-hidden />
                        {t("admin.blockUser")}
                      </>
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5" aria-hidden />
                        {t("admin.unblockUser")}
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(t("admin.confirmDelete"))) {
                        deleteUser(user.id);
                        setMessage({ type: "success", text: `User deleted` });
                        setTimeout(() => setMessage(null), 3000);
                      }
                    }}
                    className="flex h-8 items-center gap-1 rounded-lg px-3 text-xs font-medium text-red-400 transition hover:bg-red-400/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    {t("admin.deleteUser")}
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
