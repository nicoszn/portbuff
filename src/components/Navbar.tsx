import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Globe, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const languages = [
    { code: "en", label: "EN" },
    { code: "fr", label: "FR" },
    { code: "es", label: "ES" },
    { code: "pt", label: "PT" },
    { code: "zh", label: "ZH" },
    { code: "ar", label: "AR" },
  ];

  const currentLang =
    languages.find((l) => l.code === i18n.language) || languages[0];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-navy-950/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold-400 to-gold-600">
            <span className="text-sm font-bold text-navy-950">P</span>
          </div>
          <span className="text-xl font-bold text-white">
            Port
            <span className="text-gold-400">buff</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm text-navy-300 transition-colors hover:text-gold-400"
          >
            {t("nav.features")}
          </a>
          <a
            href="#plans"
            className="text-sm text-navy-300 transition-colors hover:text-gold-400"
          >
            {t("nav.plans")}
          </a>
          <a
            href="#dashboard"
            className="text-sm text-navy-300 transition-colors hover:text-gold-400"
          >
            {t("nav.dashboard")}
          </a>

          {/* Language Switcher */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-navy-300 transition-colors hover:border-gold-400/50 hover:text-gold-400">
              <Globe className="h-3.5 w-3.5" />
              {currentLang.label}
            </button>
            <div className="absolute right-0 top-full mt-1 hidden w-24 rounded-lg border border-white/10 bg-navy-900 py-1 shadow-xl group-hover:block">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => i18n.changeLanguage(lang.code)}
                  className={cn(
                    "block w-full px-3 py-1.5 text-left text-sm transition-colors hover:bg-white/5",
                    i18n.language === lang.code
                      ? "text-gold-400"
                      : "text-navy-300"
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Auth Buttons */}
          <a
            href="/auth"
            className="text-sm text-navy-300 transition-colors hover:text-white"
          >
            {t("nav.login")}
          </a>
          <a
            href="/auth"
            className="rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 px-4 py-2 text-sm font-semibold text-navy-950 transition-all hover:from-gold-400 hover:to-gold-500 hover:shadow-lg hover:shadow-gold-500/25"
          >
            {t("nav.signup")}
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-navy-300 md:hidden"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-white/5 bg-navy-950/95 px-4 pb-6 pt-4 backdrop-blur-xl md:hidden"
        >
          <div className="flex flex-col gap-4">
            <a
              href="#features"
              onClick={() => setMobileOpen(false)}
              className="text-sm text-navy-300"
            >
              {t("nav.features")}
            </a>
            <a
              href="#plans"
              onClick={() => setMobileOpen(false)}
              className="text-sm text-navy-300"
            >
              {t("nav.plans")}
            </a>
            <a
              href="#dashboard"
              onClick={() => setMobileOpen(false)}
              className="text-sm text-navy-300"
            >
              {t("nav.dashboard")}
            </a>

            <div className="flex gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => i18n.changeLanguage(lang.code)}
                  className={cn(
                    "rounded-md px-2 py-1 text-xs",
                    i18n.language === lang.code
                      ? "bg-gold-500/20 text-gold-400"
                      : "text-navy-400 hover:text-navy-200"
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <a
                href="/auth"
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-navy-300"
              >
                {t("nav.login")}
              </a>
              <a
                href="/auth"
                className="rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 px-4 py-2 text-sm font-semibold text-navy-950"
              >
                {t("nav.signup")}
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
