"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useStore } from "@/lib/stores/useStore";
import { motion } from "framer-motion";
import { LogIn, UserPlus, AlertCircle, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, signup, currentUser } = useStore();

  const mode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const returnTo = searchParams.get("returnTo") || "/dashboard";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      router.replace(returnTo);
    }
  }, [currentUser, router, returnTo]);

  const update = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (mode === "signup") {
      if (!form.firstName.trim() || !form.lastName.trim()) {
        setError(t("auth.firstName") + " " + t("auth.lastName") + " " + t("common.error").toLowerCase());
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError(t("auth.passwordMismatch"));
        return;
      }
    }

    if (form.password.length < 6) {
      setError(t("common.error"));
      return;
    }

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 350));

    if (mode === "login") {
      const ok = login(form.email, form.password);
      if (ok) {
        setSuccess(true);
        await new Promise((resolve) => setTimeout(resolve, 350));
        router.push(returnTo);
      } else {
        setError(t("auth.loginError"));
      }
    } else {
      const ok = signup(
        form.firstName,
        form.lastName,
        form.email,
        form.password
      );
      if (ok) {
        setSuccess(true);
        await new Promise((resolve) => setTimeout(resolve, 350));
        router.push(returnTo);
      } else {
        setError(t("auth.loginError"));
      }
    }

    setLoading(false);
  };

  return (
    <div className="mt-24 flex min-h-[70vh] items-center justify-center px-5 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="rounded-3xl border border-[rgba(255,215,120,0.14)] bg-navy-900/70 p-8 backdrop-blur-sm shadow-2xl sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold-300 to-amber-500 text-xl font-bold text-navy-950 shadow-lg shadow-gold-400/20">
              P
            </div>
            <h1 className="text-2xl font-bold text-gold-200">
              {mode === "login" ? t("auth.welcomeBack") : t("auth.signupMessage")}
            </h1>
            <p className="mt-2 text-sm text-navy-300">
              {mode === "login" ? t("auth.welcomeMessage") : t("auth.signupMessage")}
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl bg-red-400/10 border border-red-400/20 p-4 text-sm text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-hidden />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 flex items-start gap-3 rounded-xl bg-emerald-400/10 border border-emerald-400/20 p-4 text-sm text-emerald-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
              <span>
                {mode === "login" ? t("auth.loginSuccess") : t("auth.signupSuccess")}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-navy-300">
                    {t("auth.firstName")}
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    className="input-field"
                    placeholder="Alex"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-navy-300">
                    {t("auth.lastName")}
                  </label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                    className="input-field"
                    placeholder="Rivera"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-navy-300">
                {t("auth.email")}
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="input-field"
                placeholder="demo@portbuff.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-navy-300">
                {t("auth.password")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 h-5 -translate-y-1/2 text-navy-400 transition hover:text-gold-300"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden />
                  )}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-navy-300">
                  {t("auth.confirmPassword")}
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`btn-primary w-full ${
                loading ? "opacity-70 pointer-events-none" : ""
              }`}
            >
              {loading ? (
                t("common.loading")
              ) : (
                <>
                  {mode === "login" ? t("auth.login") : t("auth.createAccount")}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-4">
            <span className="text-sm text-navy-400">
              {mode === "login" ? t("auth.noAccount") : t("auth.hasAccount")}{" "}
            </span>
            <button
              type="button"
              onClick={() => {
                setError("");
                setSuccess(false);
                router.replace(
                  mode === "login"
                    ? `/auth?mode=signup${returnTo ? `&returnTo=${encodeURIComponent(returnTo)}` : ""}`
                    : `/auth${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`
                );
              }}
              className="text-sm font-medium text-gold-400 transition hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-2"
            >
              {mode === "login" ? t("auth.createAccount") : t("auth.login")}
            </button>
          </div>

          <div className="mt-6 rounded-xl border border-[rgba(255,215,120,0.1)] bg-navy-800/40 p-4">
            <p className="mb-3 text-xs font-medium text-navy-400">
              {t("auth.demoCredentials")}
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs text-navy-300">
              <div>
                <span className="text-navy-500">Sign In:</span>
                <div className="font-mono text-gold-300">demouser@portbuff.com</div>
                <div className="font-mono text-gold-300">demo1234</div>
              </div>
              <div>
                <span className="text-navy-500">or Sign Up:</span>
                <div className="text-gold-300">Any name + email</div>
                <div className="text-gold-300">Password 6+ chars</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
