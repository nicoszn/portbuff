"use client";

import { useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { i18n } from "i18next";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";

export { useTranslation };

export type { i18n };

export function I18nextProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const lang = useLang();
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    i18n.init();
  }, []);

  useEffect(() => {
    const instance = i18n as i18n;
    if (!instance.isInitialized) return;
    instance.changeLanguage(lang);
  }, [lang]);

  useEffect(() => {
    const instance = i18n as i18n;
    if (!instance.isInitialized) return;
    document.documentElement.lang = lang.split("-")[0];
    document.documentElement.dir = instance.getDataByLanguage(lang)?.dir ?? "ltr";
  }, [lang]);

  return (
    <>
      {children}
    </>
  );
}

export function useLang() {
  if (typeof window === "undefined") {
    return "en-US";
  }
  const stored =
    (typeof window !== "undefined" &&
      localStorage.getItem("portbuff_lang")) ||
    "en-US";
  return stored;
}

export function useSetLang() {
  const router = useRouter();
  const t = useTranslation().t;

  return (code: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("portbuff_lang", code);
    const instance = i18n as i18n;
    instance.changeLanguage(code);
    const dir =
      instance.getDataByLanguage(code)?.dir ?? "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = code.split("-")[0];
    router.refresh();
  };
}

export function useAvailableLangs() {
  return useMemo(
    () => [
      { code: "en-US", name: "EN", nativeName: "English" },
      { code: "es-ES", name: "ES", nativeName: "Español" },
    ],
    []
  );
}
