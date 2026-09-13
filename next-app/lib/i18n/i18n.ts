import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enJson from "../../locales/en-US.json";
import esJson from "../../locales/es-ES.json";

export const builtInLanguages: Record<
  string,
  {
    code: string;
    name: string;
    nativeName: string;
    dir: string;
    translations: Record<string, unknown>;
  }
> = {
  "en-US": {
    code: "en-US",
    name: "English",
    nativeName: "English",
    dir: "ltr",
    translations: enJson as Record<string, unknown>,
  },
  "es-ES": {
    code: "es-ES",
    name: "Español",
    nativeName: "Español",
    dir: "ltr",
    translations: esJson as Record<string, unknown>,
  },
};

export interface CustomLanguage {
  code: string;
  name: string;
  nativeName: string;
  dir: string;
  translations: Record<string, unknown>;
}

function readCustomLanguage(): CustomLanguage | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("portbuff_custom_lang");
    return raw ? (JSON.parse(raw) as CustomLanguage) : null;
  } catch {
    return null;
  }
}

function buildResources() {
  const resources: Record<string, { translation: Record<string, unknown> }> = {};
  for (const entry of Object.values(builtInLanguages)) {
    resources[entry.code] = { translation: entry.translations };
  }
  const custom = readCustomLanguage();
  if (custom) {
    resources[custom.code] = { translation: custom.translations };
  }
  return resources;
}

const instance = i18n.createInstance();

if (!instance.isInitialized) {
  instance.use(initReactI18next).init({
    lng: "en-US",
    fallbackLng: "en-US",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    resources: buildResources(),
  });
}

export default instance;

export function saveCustomLanguage(lang: CustomLanguage) {
  if (typeof window === "undefined") return;
  localStorage.setItem("portbuff_custom_lang", JSON.stringify(lang));
}

export function removeCustomLanguage() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("portbuff_custom_lang");
}
