"use client";

import { useEffect, useMemo, useState } from "react";
import i18nInstance, { builtInLanguages } from "./i18n";
import { I18nextProvider as ReactI18nextProvider, useTranslation } from "react-i18next";

export { useTranslation };

export function I18nextProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!i18nInstance.isInitialized) {
      i18nInstance.init().then(() => setReady(true));
    } else {
      setReady(true);
    }
  }, []);

  if (!ready) {
    return <>{children}</>;
  }

  return <ReactI18nextProvider i18n={i18nInstance}>{children}</ReactI18nextProvider>;
}

export function useLang() {
  const { i18n } = useTranslation();
  return i18n.language || "en-US";
}

export function useSetLang() {
  const { i18n } = useTranslation();

  return (code: string) => {
    void i18n.changeLanguage(code);
    if (typeof document !== "undefined") {
      document.documentElement.lang = code.split("-")[0];
    }
  };
}

export function useAvailableLangs() {
  return useMemo(
    () =>
      Object.values(builtInLanguages).map((l) => ({
        code: l.code,
        name: l.name,
        nativeName: l.nativeName,
      })),
    []
  );
}
