import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enUS from "./locales/en-US.json";
import esES from "./locales/es-ES.json";
import type { Language } from "../types";

// ── LocalStorage keys ──
const LANG_KEY = "portbuff-lang";
const LANG_AUTO_KEY = "portbuff-lang-auto";

// ── Helpers ──

function loadSavedTranslations(): Language[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("portbuff-languages");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function loadEnabledLanguageCodes(): string[] {
  const languages = loadSavedTranslations();
  return languages.filter((l) => l.enabled).map((l) => l.code);
}

function detectBrowserLanguage(): string | null {
  if (typeof navigator === "undefined") return null;
  const browserLangs: readonly string[] =
    navigator.languages || [navigator.language];

  const builtIn = ["en-US", "es-ES"];
  const customEnabled = loadEnabledLanguageCodes();
  const allAvailable = [...new Set([...builtIn, ...customEnabled])];

  const codeMap = new Map<string, string>();
  for (const code of allAvailable) {
    codeMap.set(code.toLowerCase(), code);
    const base = code.split("-")[0].toLowerCase();
    if (!codeMap.has(base)) {
      codeMap.set(base, code);
    }
  }

  for (const bl of browserLangs) {
    const normalized = bl.trim().toLowerCase();
    if (codeMap.has(normalized)) return codeMap.get(normalized)!;
    const base = normalized.split("-")[0];
    if (codeMap.has(base)) return codeMap.get(base)!;
  }

  return null;
}

function setHtmlLang(code: string) {
  if (typeof document !== "undefined") {
    document.documentElement.lang = code;
  }
}

function autoDetectAndSet(): string {
  if (typeof window === "undefined") return "en-US";
  const isAuto = localStorage.getItem(LANG_AUTO_KEY);
  const hasManualChoice = localStorage.getItem(LANG_KEY) !== null;

  if (hasManualChoice && isAuto !== "true") {
    return localStorage.getItem(LANG_KEY)!;
  }

  const detected = detectBrowserLanguage();
  if (detected) {
    localStorage.setItem(LANG_KEY, detected);
    setHtmlLang(detected);
    return detected;
  }

  localStorage.setItem(LANG_KEY, "en-US");
  setHtmlLang("en-US");
  return "en-US";
}

// ── Init (client-side only, runs synchronously at module load) ──
let initialized = false;

export function initI18n() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  const resolvedLang = autoDetectAndSet();

  i18n.use(initReactI18next).init({
    resources: {
      "en-US": { translation: enUS },
      "es-ES": { translation: esES },
    },
    lng: resolvedLang,
    fallbackLng: "en-US",
    interpolation: {
      escapeValue: false,
    },
  });

  registerAllSavedTranslations();
}

// Run immediately on import (client only — no-ops during SSR since
// `typeof window === "undefined"` short-circuits above). This ensures
// i18next is initialized before any component's first render calls
// `t()`, instead of waiting for a post-mount useEffect to fire.
initI18n();

// ── Public API ──

export function registerTranslations(
  code: string,
  translations: Record<string, string>
) {
  if (!code || Object.keys(translations).length === 0) return;
  if (code === "en-US" || code === "es-ES") return;
  i18n.addResources(code, "translation", translations);
}

export function registerAllSavedTranslations() {
  const languages = loadSavedTranslations();
  for (const lang of languages) {
    if (
      lang.enabled &&
      lang.translations &&
      Object.keys(lang.translations).length > 0
    ) {
      registerTranslations(lang.code, lang.translations);
    }
  }
}

export const changeLanguage = (lang: string) => {
  i18n.changeLanguage(lang);
  localStorage.setItem(LANG_KEY, lang);
  localStorage.setItem(LANG_AUTO_KEY, "false");
  setHtmlLang(lang);
};

export const enableAutoDetect = (): string => {
  localStorage.setItem(LANG_AUTO_KEY, "true");
  const detected = detectBrowserLanguage();
  const chosen = detected || "en-US";
  i18n.changeLanguage(chosen);
  localStorage.setItem(LANG_KEY, chosen);
  setHtmlLang(chosen);
  return chosen;
};

export const isAutoDetectEnabled = (): boolean => {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(LANG_AUTO_KEY) !== "false";
};

export const getBrowserLanguages = (): readonly string[] => {
  if (typeof navigator !== "undefined") {
    return navigator.languages || [navigator.language];
  }
  return [];
};

export default i18n;
