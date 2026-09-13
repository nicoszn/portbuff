"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t border-[rgba(255,215,120,0.08)] bg-navy-950/80 backdrop-blur-sm"
      style={{ backgroundColor: "rgba(7,10,23,0.85)" }}
    >
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 grid-cols-2 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold tracking-tight"
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold-300 to-amber-500 text-sm font-bold text-navy-950 shadow-md"
                aria-hidden
              >
                P
              </span>
              Port<span className="text-gold-400">buff</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-navy-300 leading-relaxed">
              {t("landing.footerDesc")}
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold-400">
              {t("landing.footerPlatform")}
            </h3>
            <ul className="space-y-3 text-sm text-navy-300">
              <li>
                <Link
                  href="/dashboard/plans"
                  className="transition hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-2"
                >
                  {t("nav.plans")}
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="transition hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-2"
                >
                  {t("nav.dashboard")}
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/transactions"
                  className="transition hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-2"
                >
                  {t("nav.transactions")}
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/settings"
                  className="transition hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-2"
                >
                  {t("nav.settings")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold-400">
              {t("landing.footerCompany")}
            </h3>
            <ul className="space-y-3 text-sm text-navy-300">
              <li>
                <Link
                  href="#"
                  className="transition hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-2"
                >
                  {t("landing.footerAbout")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-2"
                >
                  {t("landing.footerCareers")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-2"
                >
                  {t("landing.footerBlog")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-2"
                >
                  {t("landing.footerHelp")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold-400">
              {t("landing.footerLegal")}
            </h3>
            <ul className="space-y-3 text-sm text-navy-300">
              <li>
                <Link
                  href="#"
                  className="transition hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-2"
                >
                  {t("landing.footerTerms")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-2"
                >
                  {t("landing.footerPrivacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-2"
                >
                  {t("landing.footerRisk")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[rgba(255,215,120,0.08)] pt-8 sm:flex-row">
          <p className="text-xs text-navy-500">
            {currentYear === 2026
              ? t("landing.footerCopyright")
              : `${currentYear} Portbuff. All rights reserved.`}
          </p>
          <p className="text-xs text-navy-500 text-center sm:text-right">
            {t("landing.footerDisclaimer")}
          </p>
        </div>
      </div>
    </footer>
  );
}
