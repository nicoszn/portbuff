"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useSetLang, useAvailableLangs } from "@/lib/i18n";
import { useStore } from "@/lib/stores/useStore";
import { motion } from "framer-motion";
import { Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { currentUser, logout } = useStore();
  const setLang = useSetLang();
  const langs = useAvailableLangs();
  const [menuOpen, setMenuOpen] = useState(false);

  const isPublicPage =
    pathname === "/" || pathname.startsWith("/auth");

  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 w-full"
      style={{
        background:
          "linear-gradient(180deg, rgba(7,10,23,0.85) 0%, rgba(7,10,23,0.65) 100%)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom:
          "1px solid rgba(255,215,120,0.08)",
      }}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8"
        aria-label="Primary"
      >
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-1 py-1 transition focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-4"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-gold-300 to-amber-500 text-lg font-bold text-navy-950 shadow-lg shadow-gold-400/20"
              aria-hidden
            >
              P
            </span>
            <span className="text-lg font-bold tracking-tight">
              Port<span className="text-gold-400">buff</span>
            </span>
          </Link>
        </div>

        <div className="hidden items-center gap-1 lg:flex">
          {isPublicPage ? (
            <>
              <Link
                href="#features"
                className="rounded-lg px-4 py-2 text-sm font-medium text-navy-200 transition hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-4"
              >
                {t("nav.features")}
              </Link>
              <Link
                href="#plans"
                className="rounded-lg px-4 py-2 text-sm font-medium text-navy-200 transition hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-4"
              >
                {t("nav.plans").split(" ")[0]}
              </Link>
              <Link
                href="#preview"
                className="rounded-lg px-4 py-2 text-sm font-medium text-navy-200 transition hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-4"
              >
                {t("landing.dashLabel")}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="rounded-lg px-4 py-2 text-sm font-medium text-navy-200 transition hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-4"
              >
                {t("nav.dashboard")}
              </Link>
              <Link
                href="/dashboard/plans"
                className="rounded-lg px-4 py-2 text-sm font-medium text-navy-200 transition hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-4"
              >
                {t("nav.plans")}
              </Link>
              <Link
                href="/dashboard/transactions"
                className="rounded-lg px-4 py-2 text-sm font-medium text-navy-200 transition hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-4"
              >
                {t("nav.transactions")}
              </Link>
              {currentUser?.role === "admin" && (
                <Link
                  href="/admin"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gold-300 transition hover:text-gold-200 focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-4"
                >
                  {t("admin.title")}
                </Link>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-xl border border-[rgba(255,215,120,0.14)] bg-navy-900/70 px-2 py-1 transition hover:border-gold-400/50 lg:flex">
            {langs.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLang(lang.code)}
                className={`m-1 rounded-lg px-3 py-1 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-2 ${
                  lang.code === langs.find(
                    (l) => l.code === lang.code
                  )?.code
                    ? "bg-gold-400/15 text-gold-300 border border-gold-400/40"
                    : "text-navy-300 hover:text-gold-300"
                }`}
                aria-label={`Switch language to ${lang.nativeName}`}
              >
                {lang.name}
              </button>
            ))}
          </div>

          {currentUser ? (
            <div className="ml-2 flex items-center gap-2">
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-navy-300 transition hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-4"
                title={t("nav.settings")}
              >
                <User className="h-4 w-4" aria-hidden />
                <span className="hidden lg:inline">
                  {currentUser.firstName}
                </span>
              </Link>
              {currentUser.role === "admin" && (
                <Link
                  href="/admin"
                  className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-gold-300 transition hover:text-gold-200 lg:inline-block focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-4"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  window.location.href = "/";
                }}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-navy-300 transition hover:text-red-400 focus-visible:outline-2 focus-visible:outline-red-400 focus-visible:outline-offset-4"
                aria-label={t("nav.logout")}
              >
                <LogOut className="h-4 w-4" aria-hidden />
                <span className="hidden lg:inline">
                  {t("nav.logout")}
                </span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth"
                className="rounded-lg px-4 py-2 text-sm font-medium text-navy-200 transition hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-4"
              >
                {t("nav.login")}
              </Link>
              <Link
                href="/auth?mode=signup"
                className="btn-primary text-xs py-2 px-4"
              >
                {t("nav.signup")}
              </Link>
            </div>
          )}

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-lg p-2 text-navy-300 transition hover:text-gold-300 lg:hidden focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-4"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <X className="h-6 w-6" aria-hidden />
            ) : (
              <Menu className="h-6 w-6" aria-hidden />
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            className="border-t border-[rgba(255,215,120,0.12)] bg-navy-950/95 backdrop-blur-xl px-5 py-5 lg:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
          >
            <div className="flex flex-col gap-2">
              {isPublicPage ? (
                <>
                  <Link
                    href="#features"
                    className="rounded-lg px-4 py-3 text-base font-medium text-navy-200 transition hover:text-gold-300"
                    onClick={() => setMenuOpen(false)}
                  >
                    {t("nav.features")}
                  </Link>
                  <Link
                    href="#plans"
                    className="rounded-lg px-4 py-3 text-base font-medium text-navy-200 transition hover:text-gold-300"
                    onClick={() => setMenuOpen(false)}
                  >
                    {t("nav.plans")}
                  </Link>
                  <Link
                    href="#preview"
                    className="rounded-lg px-4 py-3 text-base font-medium text-navy-200 transition hover:text-gold-300"
                    onClick={() => setMenuOpen(false)}
                  >
                    {t("landing.dashLabel")}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    className="rounded-lg px-4 py-3 text-base font-medium text-navy-200 transition hover:text-gold-300"
                    onClick={() => setMenuOpen(false)}
                  >
                    {t("nav.dashboard")}
                  </Link>
                  <Link
                    href="/dashboard/plans"
                    className="rounded-lg px-4 py-3 text-base font-medium text-navy-200 transition hover:text-gold-300"
                    onClick={() => setMenuOpen(false)}
                  >
                    {t("nav.plans")}
                  </Link>
                  <Link
                    href="/dashboard/transactions"
                    className="rounded-lg px-4 py-3 text-base font-medium text-navy-200 transition hover:text-gold-300"
                    onClick={() => setMenuOpen(false)}
                  >
                    {t("nav.transactions")}
                  </Link>
                  {currentUser?.role === "admin" && (
                    <Link
                      href="/admin"
                      className="rounded-lg px-4 py-3 text-base font-semibold text-gold-300 transition hover:text-gold-200"
                      onClick={() => setMenuOpen(false)}
                    >
                      {t("admin.title")}
                    </Link>
                  )}
                </>
              )}
              {langs.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLang(lang.code);
                    setMenuOpen(false);
                  }}
                  className={`w-full rounded-lg px-4 py-3 text-left text-base font-medium transition ${
                    lang.code === "en-US"
                      ? "bg-gold-400/15 text-gold-300 border border-gold-400/40"
                      : "text-navy-300 hover:text-gold-300"
                  }`}
                >
                  {lang.nativeName}
                </button>
              ))}
              {!currentUser && (
                <div className="mt-3 flex flex-col gap-2">
                  <Link
                    href="/auth"
                    className="rounded-lg px-4 py-3 text-center text-base font-medium text-navy-200 transition hover:text-gold-300"
                  >
                    {t("nav.login")}
                  </Link>
                  <Link
                    href="/auth?mode=signup"
                    className="btn-primary text-center w-full"
                  >
                    {t("nav.signup")}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
