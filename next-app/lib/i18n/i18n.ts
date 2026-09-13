import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enJson from "../../locales/en-US.json";
import esJson from "../../locales/es-ES.json";

export const builtInLanguages = {
  "en-US": {
    name: "English",
    nativeName: "English",
    dir: "ltr",
    translations: enJson as Record<string, unknown>,
  },
  "es-ES": {
    name: "Español",
    nativeName: "Español",
    dir: "ltr",
    translations: esJson as Record<string, unknown>,
  },
};

const savedCustomLanguageRaw = typeof window !== "undefined"
  ? localStorage.getItem("portbuff_custom_lang")
  : null;

let savedCustomLanguage: {
  code: string;
  name: string;
  nativeName: string;
  dir: string;
  translations: Record<string, unknown>;
} | null = null;

if (savedCustomLanguageRaw) {
  try {
    savedCustomLanguage = JSON.parse(savedCustomLanguageRaw);
  } catch {
    savedCustomLanguage = null;
  }
}

function buildResources() {
  const resources: Record<
    string,
    { translation: Record<string, unknown> }
  > = {};

  for (const entry of Object.values(builtInLanguages)) {
    resources[entry.name] = { translation: entry.translations };
  }

  if (savedCustomLanguage) {
    resources[savedCustomLanguage.name] = {
      translation: savedCustomLanguage.translations,
    };
  }

  return resources;
}

const instance = i18next.createInstance();

instance.use(initReactI18next).init({
  fallbackLng: "en-US",
  supportedLngs: [
    "en-US",
    "es-ES",
    ...Object.keys(builtInLanguages),
  ].filter(
    (lang, index, array) => array.indexOf(lang) === index
  ),
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
  resources: buildResources(),
});

export default instance;

export function saveCustomLanguage(lang: typeof savedCustomLanguage) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    "portbuff_custom_lang",
    JSON.stringify(lang)
  );
}

export function removeCustomLanguage() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("portbuff_custom_lang");
  instance.changeLanguage(instance.language);
  instance.resources = buildResources();
}
