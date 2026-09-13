"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

const plans = [
  {
    id: "starter",
    labelKey: "landing.planStarter",
    price: "$500",
    minKey: "landing.planStarterMin",
    highlightKey: "landing.planStarterHighlight",
    highlight: false,
    features: [
      "landing.planStarterF1",
      "landing.planStarterF2",
      "landing.planStarterF3",
      "landing.planStarterF4",
    ],
    bgClass:
      "bg-navy-900/70 border-navy-500/40 hover:border-gold-400/50",
  },
  {
    id: "growth",
    labelKey: "landing.planGrowth",
    price: "$5,000",
    minKey: "landing.planGrowthMin",
    highlightKey: "landing.planGrowthHighlight",
    highlight: true,
    features: [
      "landing.planGrowthF1",
      "landing.planGrowthF2",
      "landing.planGrowthF3",
      "landing.planGrowthF4",
      "landing.planGrowthF5",
    ],
    bgClass:
      "relative bg-gradient-to-b from-gold-400/10 to-transparent border-gold-400/50 shadow-[0_30px_60px_-20px_rgba(224,165,35,0.4)]",
  },
  {
    id: "premium",
    labelKey: "landing.planPremium",
    price: "$25,000",
    minKey: "landing.planPremiumMin",
    highlightKey: "landing.planPremiumHighlight",
    highlight: false,
    features: [
      "landing.planPremiumF1",
      "landing.planPremiumF2",
      "landing.planPremiumF3",
      "landing.planPremiumF4",
      "landing.planPremiumF5",
      "landing.planPremiumF6",
    ],
    bgClass:
      "bg-navy-900/70 border-navy-500/40 hover:border-gold-400/50",
  },
];

const container = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export default function Plans() {
  const { t } = useTranslation();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section
      id="plans"
      className="relative scroll-mt-16 px-5 py-24 lg:py-32"
      style={{ scrollMarginTop: "8rem" }}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1000px 500px at 80% 0%, rgba(224,165,35,0.12) 0%, transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mb-14 text-center"
        >
          <span className="badge mb-4">
            {t("landing.plansLabel")}
          </span>
          <h2 className="font-display text-balance text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-gold-200">
            {t("landing.plansTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-navy-300 text-lg sm:text-xl">
            {t("landing.plansSubtitle")}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 lg:grid-cols-3"
        >
          {plans.map((plan) => {
            const isHovered = hoveredId === plan.id;
            return (
              <motion.div
                key={plan.id}
                onMouseEnter={() => setHoveredId(plan.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`relative flex flex-col rounded-2xl border p-6 transition duration-300 ${
                  plan.bgClass
                } ${
                  isHovered
                    ? "shadow-[0_30px_60px_-20px_rgba(224,165,35,0.45)] -translate-y-1"
                    : ""
                }`}
                style={{
                  transformOrigin: "center",
                }}
              >
                {plan.highlight && (
                  <div className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-gold-400 shadow-sm shadow-gold-400/60" />
                )}
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight text-gold-200">
                    {t(plan.price)}
                  </span>
                  <span className="text-sm text-navy-400">
                    {t(plan.minKey)}
                  </span>
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-lg font-semibold text-gold-300">
                    {t(plan.labelKey)}
                  </span>
                  {plan.highlight && (
                    <span className="badge text-xs">
                      {t(plan.highlightKey)}
                    </span>
                  )}
                </div>
                <ul className="flex flex-col gap-3 text-sm text-navy-300">
                  {plan.features.map((featureKey) => (
                    <li key={featureKey} className="flex items-start gap-3">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-gold-400"
                        aria-hidden
                      />
                      <span>{t(featureKey)}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/auth?mode=signup&plan=${plan.id}`}
                  className={`mt-auto text-center ${
                    plan.highlight
                      ? "btn-primary"
                      : "btn-outline"
                  }`}
                >
                  {t("landing.getStarted")}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
