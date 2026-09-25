import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

export const dynamic = "force-dynamic";
import I18nProvider from "@/components/providers/I18nProvider";
import ToasterWrapper from "@/components/providers/ToasterWrapper";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PortBuff - Smart Investment Portfolio",
  description:
    "Invest in the world's most promising opportunities across agriculture, minerals, energy, and more.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1F3358",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${inter.variable}`}>
      <body>
        <I18nProvider>
          <ToasterWrapper />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
