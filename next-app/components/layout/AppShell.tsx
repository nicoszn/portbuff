"use client";

import { I18nextProvider } from "@/lib/i18n";

export function AppShell({ children }: { children: React.ReactNode }) {
  return <I18nextProvider>{children}</I18nextProvider>;
}
