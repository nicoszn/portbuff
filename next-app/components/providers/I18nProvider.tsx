"use client";

import { useState, useEffect } from "react";
import i18n, { initI18n } from "@/lib/i18n";

export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // lib/i18n/index.ts now calls initI18n() synchronously on import, so by
  // the time this component's module code runs, init has already been
  // kicked off (or finished). We still call it here too (it's idempotent)
  // as a safety net, and gate rendering on `isInitialized` so no component
  // can call t() before resources are loaded.
  initI18n();
  const [ready, setReady] = useState(i18n.isInitialized);

  useEffect(() => {
    if (i18n.isInitialized) {
      setReady(true);
      return;
    }
    const onInitialized = () => setReady(true);
    i18n.on("initialized", onInitialized);
    return () => {
      i18n.off("initialized", onInitialized);
    };
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}
