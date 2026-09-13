"use client";

import { useMemo, useState } from "react";
import enJson from "@/locales/en-US.json";
import { useTranslation } from "react-i18next";
import { useStore } from "@/lib/stores/useStore";
import AdminLayout from "@/components/layout/AdminLayout";
import { defaultTranslations } from "@/lib/i18n/defaultTranslations";
import { motion } from "framer-motion";
import {
  Languages as LanguagesIcon,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Search,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

type TranslationMap = Record<string, Record<string, string>>;

export default function AdminLanguagesPage() {
  return (
    <AdminLayout>
      <AdminLanguagesContent />
    </AdminLayout>
  );
}

function flatten(nested: Record<string, unknown>, prefix = ""): Record<string, string> {
  const flat: Record<string, string> = {};
  for (const [key, value] of Object.entries(nested)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object") {
      Object.assign(flat, flatten(value as Record<string, unknown>, fullKey));
    } else if (typeof value === "string") {
      flat[fullKey] = value;
    }
  }
  return flat;
}

function AdminLanguagesContent() {
  const { t } = useTranslation();
  const { languages, addLanguage, updateLanguage, updateLanguageTranslations, deleteLanguage } =
    useStore();

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newLang, setNewLang] = useState({ code: "", name: "", nativeName: "" });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const englishFlat = useMemo(() => flatten(enJson), []);

  const notify = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCreate = () => {
    const code = newLang.code.trim();
    if (!code || !newLang.name.trim()) {
      notify("error", "Code and name are required");
      return;
    }
    if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(code)) {
      notify("error", "Code must look like 'fr' or 'fr-FR'");
      return;
    }
    if (languages.some((l) => l.code === code)) {
      notify("error", `Language ${code} already exists`);
      return;
    }
    addLanguage({
      code,
      name: newLang.name.trim(),
      nativeName: newLang.nativeName.trim() || newLang.name.trim(),
      enabled: true,
      translations: {},
    });
    notify("success", `Language ${code} created`);
    setNewLang({ code: "", name: "", nativeName: "" });
    setCreateOpen(false);
  };

  const handleDelete = (code: string) => {
    if (code === "en-US") return;
    if (!confirm(`Delete language ${code}?`)) return;
    deleteLanguage(code);
    notify("success", `Language ${code} deleted`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gold-200">
            {t("admin.languages")}
          </h1>
          <p className="mt-1 text-sm text-navy-300">
            {t("admin.manageLanguages")}
          </p>
        </div>
        <button onClick={() => setCreateOpen(true)} className="btn-primary">
          <Plus className="h-4 w-4" aria-hidden />
          {t("admin.createLanguage")}
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

      {createOpen && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
          <h2 className="mb-5 text-lg font-semibold text-gold-200">
            {t("admin.createLanguage")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-navy-300">
                {t("admin.languageCode")}
              </label>
              <input
                type="text"
                value={newLang.code}
                onChange={(e) => setNewLang((f) => ({ ...f, code: e.target.value }))}
                className="input-field font-mono"
                placeholder="fr-FR"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-navy-300">
                {t("admin.languageName")}
              </label>
              <input
                type="text"
                value={newLang.name}
                onChange={(e) => setNewLang((f) => ({ ...f, name: e.target.value }))}
                className="input-field"
                placeholder="French"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-navy-300">
                {t("admin.nativeName")}
              </label>
              <input
                type="text"
                value={newLang.nativeName}
                onChange={(e) => setNewLang((f) => ({ ...f, nativeName: e.target.value }))}
                className="input-field"
                placeholder="Français"
              />
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <button onClick={() => setCreateOpen(false)} className="btn-outline">
              {t("common.cancel")}
            </button>
            <button onClick={handleCreate} className="btn-primary">
              {t("admin.createLanguage")}
            </button>
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        {languages.map((lang, idx) => {
          const translatedCount = Object.keys(lang.translations).length;
          const isDefault = lang.code === "en-US";
          return (
            <motion.div
              key={lang.code}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02, duration: 0.25 }}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[rgba(255,215,120,0.1)] bg-navy-900/70 p-5 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-gold-300/20 to-amber-500/20">
                  <LanguagesIcon className="h-5 w-5 text-gold-300" aria-hidden />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-navy-200">
                    {lang.name}
                    <span className="rounded-md bg-navy-800 px-2 py-0.5 font-mono text-xs text-gold-300">
                      {lang.code}
                    </span>
                    {isDefault && (
                      <span className="rounded-full bg-gold-400/10 px-2 py-0.5 text-xs text-gold-400">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-xs text-navy-400">
                    {lang.nativeName} · {translatedCount} translations
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingCode(lang.code);
                    setEditorOpen(true);
                  }}
                  className="flex h-8 items-center gap-1 rounded-lg px-3 text-xs font-medium text-navy-300 transition hover:bg-navy-800/60 hover:text-gold-300"
                >
                  <Pencil className="h-3.5 w-3.5" aria-hidden />
                  {t("admin.editLanguage")}
                </button>
                {!isDefault && (
                  <button
                    onClick={() => handleDelete(lang.code)}
                    className="flex h-8 items-center gap-1 rounded-lg px-3 text-xs font-medium text-red-400 transition hover:bg-red-400/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    {t("admin.deleteLanguage")}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {editorOpen && editingCode && (
        <TranslationEditor languageCode={editingCode} onClose={() => setEditorOpen(false)} />
      )}
    </div>
  );
}

function TranslationEditor({
  languageCode,
  onClose,
}: {
  languageCode: string;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { languages, updateLanguageTranslations } = useStore();

  const lang = languages.find((l) => l.code === languageCode);
  const savedTranslations = lang?.translations ?? {};

  const nested = useMemo((): TranslationMap => {
    const map: TranslationMap = {};
    for (const [section, keys] of Object.entries(defaultTranslations)) {
      map[section] = {};
      for (const key of Object.keys(keys)) {
        const flatKey = `${section}.${key}`;
        map[section][key] = savedTranslations[flatKey] ?? "";
      }
    }
    return map;
  }, [savedTranslations]);

  const [formData, setFormData] = useState<TranslationMap>(nested);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(Object.keys(defaultTranslations).map((s) => [s, s === "landing"]))
  );

  const englishFlat = useMemo(() => flatten(enJson), []);

  const totalKeys = useMemo(
    () => Object.values(defaultTranslations).reduce((n, keys) => n + Object.keys(keys).length, 0),
    []
  );
  const filledKeys = useMemo(
    () =>
      Object.values(formData).reduce(
        (n, keys) => n + Object.values(keys).filter((v) => v.trim() !== "").length,
        0
      ),
    [formData]
  );

  const matchesSearch = (section: string, key: string) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      key.toLowerCase().includes(q) ||
      (formData[section]?.[key] ?? "").toLowerCase().includes(q) ||
      (englishFlat[`${section}.${key}`] ?? "").toLowerCase().includes(q)
    );
  };

  const handleSave = () => {
    const flat: Record<string, string> = {};
    for (const [section, keys] of Object.entries(formData)) {
      for (const [key, value] of Object.entries(keys)) {
        if (value.trim() !== "") {
          flat[`${section}.${key}`] = value.trim();
        }
      }
    }
    updateLanguageTranslations(languageCode, flat);
    notifyEditor("success", "Translations saved");
  };

  const [editorMessage, setEditorMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const notifyEditor = (type: "success" | "error", text: string) => {
    setEditorMessage({ type, text });
    setTimeout(() => setEditorMessage(null), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-[rgba(255,215,120,0.14)] bg-navy-900/70 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between border-b border-[rgba(255,215,120,0.1)] p-5">
        <div>
          <h2 className="text-lg font-semibold text-gold-200">
            {t("admin.editLanguage")}: {lang?.name ?? languageCode}
          </h2>
          <p className="mt-0.5 text-xs text-navy-400">
            {filledKeys}/{totalKeys} keys translated · empty falls back to English
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-navy-400 transition hover:text-gold-300"
          aria-label="Close editor"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      {editorMessage && (
        <div
          className={`mx-5 mt-4 flex items-start gap-3 rounded-xl p-3 text-sm ${
            editorMessage.type === "success"
              ? "bg-emerald-400/10 border border-emerald-400/20 text-emerald-300"
              : "bg-red-400/10 border border-red-400/20 text-red-300"
          }`}
        >
          {editorMessage.type === "success" ? (
            <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          )}
          <span>{editorMessage.text}</span>
        </div>
      )}

      <div className="p-5">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" aria-hidden />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search keys or text..."
            className="input-field pl-9"
          />
        </div>

        <div className="max-h-[50vh] space-y-2 overflow-y-auto pr-1">
          {Object.entries(formData).map(([section, keys]) => {
            const visibleKeys = Object.keys(keys).filter((key) =>
              matchesSearch(section, key)
            );
            if (visibleKeys.length === 0) return null;
            const isOpen = expanded[section];
            return (
              <div key={section} className="rounded-xl border border-[rgba(255,215,120,0.08)]">
                <button
                  onClick={() => setExpanded((e) => ({ ...e, [section]: !e[section] }))}
                  className="flex w-full items-center gap-2 rounded-t-xl bg-navy-800/50 px-4 py-3 text-left text-sm font-medium text-navy-200 transition hover:text-gold-300"
                >
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-gold-400" aria-hidden />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-navy-400" aria-hidden />
                  )}
                  <span className="capitalize">{section}</span>
                  <span className="ml-auto text-xs text-navy-400">
                    {visibleKeys.filter((k) => keys[k]?.trim()).length}/{visibleKeys.length}
                  </span>
                </button>
                {isOpen && (
                  <div className="space-y-3 p-4">
                    {visibleKeys.map((key) => (
                      <div key={key} className="grid gap-2 sm:grid-cols-2">
                        <div className="rounded-lg bg-navy-800/30 px-3 py-2 text-xs text-navy-400">
                          <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-navy-500">
                            EN · {section}.{key}
                          </div>
                          {englishFlat[`${section}.${key}`] ?? "—"}
                        </div>
                        <div>
                          <input
                            type="text"
                            value={keys[key] ?? ""}
                            onChange={(e) =>
                              setFormData((f) => ({
                                ...f,
                                [section]: { ...f[section], [key]: e.target.value },
                              }))
                            }
                            className="input-field text-sm"
                            placeholder="Translation…"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onClose} className="btn-outline">
            {t("common.cancel")}
          </button>
          <button onClick={handleSave} className="btn-primary">
            <Save className="h-4 w-4" aria-hidden />
            {t("common.save")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
