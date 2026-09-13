import type { Metadata } from "next";
import "./globals.css";

export const dynamic = "force-dynamic";
import I18nProvider from "@/components/providers/I18nProvider";
import ToasterWrapper from "@/components/providers/ToasterWrapper";

export const metadata: Metadata = {
  title: "PortBuff - Smart Investment Portfolio",
  description:
    "Invest in the world's most promising opportunities across agriculture, minerals, energy, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <I18nProvider>
          <ToasterWrapper />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
