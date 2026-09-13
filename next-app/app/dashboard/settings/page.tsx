"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "@/lib/stores/useStore";
import { useLang, useSetLang, useAvailableLangs } from "@/lib/i18n";
import { Save, AlertCircle, Check, Globe } from "lucide-react";

export default function SettingsPage() {
  return <SettingsContent />;
}

function SettingsContent() {
  const { t } = useTranslation();
  const { currentUser, updateProfile, languages } = useStore();
  const currentLang = useLang();
  const setLang = useSetLang();
  const langs = useAvailableLangs();

  const [form, setForm] = useState({
    firstName: currentUser?.firstName ?? "",
    lastName: currentUser?.lastName ?? "",
    email: currentUser?.email ?? "",
  });
  const [cryptoAddress, setCryptoAddress] = useState(
    currentUser?.cryptoAddress ?? ""
  );
  const [cryptoNetwork, setCryptoNetwork] = useState(
    currentUser?.cryptoNetwork ?? "Ethereum (ERC-20)"
  );
  const [cryptoName, setCryptoName] = useState(
    currentUser?.cryptoName ?? "USDT"
  );
  const [message, setMessage] = useState<{type: "success" | "error", text: string} | null>(null);

  const update = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setMessage(null);
  };

  const handleSave = () => {
    if (!currentUser) return;
    updateProfile({
      firstName: form.firstName || currentUser.firstName,
      lastName: form.lastName || currentUser.lastName,
      email: form.email || currentUser.email,
      cryptoAddress: cryptoAddress || currentUser.cryptoAddress,
      cryptoNetwork: cryptoNetwork || currentUser.cryptoNetwork,
      cryptoName: cryptoName || currentUser.cryptoName,
    });
    setMessage({ type: "success", text: t("settings.saved") });
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gold-200">
          {t("settings.title")}
        </h1>
        <p className="mt-1 text-sm text-navy-300">
          {t("settings.subtitle")}
        </p>
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

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-2 text-sm font-medium text-gold-200">
            <Globe className="h-4 w-4 text-gold-400" aria-hidden />
            {t("settings.language")}
          </div>
          <div className="space-y-3">
            {langs.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLang(lang.code)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                  lang.code === currentLang
                    ? "bg-gold-400/15 border-gold-400/40 text-gold-300"
                    : "bg-navy-800/40 border-[rgba(255,215,120,0.1)] text-navy-300 hover:text-gold-300"
                }`}
              >
                <span className="font-medium">{lang.nativeName}</span>
                <span className="ml-2 text-xs text-navy-400">({lang.code})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card p-5 sm:p-6">
          <h2 className="mb-5 text-sm font-medium text-gold-200">
            {t("settings.personalInfo")}
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-navy-300">
                  {t("settings.firstName")}
                </label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-navy-300">
                  {t("settings.lastName")}
                </label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-navy-300">
                {t("settings.email")}
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-5 sm:p-6">
        <h2 className="mb-5 text-sm font-medium text-gold-200">
          {t("settings.cryptoInfo")}
        </h2>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-navy-300">
              {t("settings.cryptoAddress")}
            </label>
            <input
              type="text"
              value={cryptoAddress}
              onChange={(e) => setCryptoAddress(e.target.value)}
              className="input-field font-mono text-sm"
              placeholder="0x..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-navy-300">
                {t("settings.cryptoName")}
              </label>
              <select
                value={cryptoName}
                onChange={(e) => setCryptoName(e.target.value)}
                className="input-field"
              >
                {["USDT", "USDC", "BTC", "ETH", "BNB"].map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-navy-300">
                {t("settings.cryptoNetwork")}
              </label>
              <select
                value={cryptoNetwork}
                onChange={(e) => setCryptoNetwork(e.target.value)}
                className="input-field"
              >
                {[
                  "Ethereum (ERC-20)",
                  "BSC (BEP-20)",
                  "Tron (TRC-20)",
                ].map((network) => (
                  <option key={network} value={network}>
                    {network}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-primary">
          <Save className="h-4 w-4" aria-hidden />
          {t("settings.saveChanges")}
        </button>
      </div>
    </div>
  );
}
