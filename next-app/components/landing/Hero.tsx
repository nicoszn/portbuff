"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, MapPin, Users, DollarSign } from "lucide-react";

const stats = [
  {
    labelKey: "landing.statInvestors",
    value: "10,000+",
    icon: Users,
    delay: 0,
  },
  {
    labelKey: "landing.statInvested",
    value: "$240M+",
    icon: DollarSign,
    delay: 1,
  },
  {
    labelKey: "landing.statReturn",
    value: "18.4%",
    icon: TrendingUp,
    delay: 2,
  },
  {
    labelKey: "landing.statCountries",
    value: "52",
    icon: MapPin,
    delay: 3,
  },
];

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative isolation-isolate overflow-hidden px-5 pt-28 pb-20 lg:pt-32 lg:pb-28">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 600px at 80% -10%, rgba(224,165,35,0.18) 0%, transparent 60%), radial-gradient(900px 500px at 0% 10%, rgba(51,65,138,0.45) 0%, transparent 55%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,215,120,0.06) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mb-8 flex items-center gap-3"
        >
          <span className="badge animate-float">
            {t("landing.badge")}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10 max-w-4xl"
        >
          <h1 className="font-display text-balance text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
            {t("landing.heroTitle")}{" "}
            <span className="gradient-text">
              {t("landing.heroTitleHighlight")}
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-navy-300 leading-relaxed sm:text-xl lg:text-2xl">
            {t("landing.heroSubtitle")}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4 sm:gap-6">
            <Link
              href="/auth?mode=signup"
              className="btn-primary text-base px-7 py-4"
            >
              {t("landing.ctaStart")}
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
            <a
              href="#features"
              className="btn-outline text-base px-7 py-4"
            >
              {t("landing.ctaExplore")}
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="relative mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.labelKey}
                className="card p-6 sm:p-8"
              >
                <div className="mb-4 flex items-center justify-center sm:h-12 sm:w-12 rounded-xl bg-gold-400/12 border border-gold-400/25 p-3 text-gold-400">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <div className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-navy-300">
                  {t(stat.labelKey)}
                </div>
              </div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 flex items-center gap-6 rounded-2xl border border-[rgba(255,215,120,0.14)] bg-navy-900/40 px-6 py-5 sm:px-8 sm:py-6 backdrop-blur-sm"
        >
          <div className="h-2 w-2 rounded-full bg-green-400 shadow-lg shadow-green-400/40 animate-pulse-soft" />
          <span className="text-sm font-medium text-navy-200">
            Market open — 142 opportunities available now
          </span>
          <span className="ml-auto text-xs text-navy-400">
            Live data simulation
          </span>
        </motion.div>
      </div>
    </section>
  );
}
