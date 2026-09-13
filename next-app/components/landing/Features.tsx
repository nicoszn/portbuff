"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Sprout,
  Pickaxe,
  Zap,
  Building2,
  Cpu,
  Truck,
} from "lucide-react";

const features = [
  {
    icon: Sprout,
    labelKey: "landing.featAgriculture",
    descKey: "landing.featAgricultureDesc",
    color: "from-emerald-400/20 to-green-500/10 border-emerald-400/30",
    accent: "text-emerald-400",
  },
  {
    icon: Pickaxe,
    labelKey: "landing.featMinerals",
    descKey: "landing.featMineralsDesc",
    color: "from-amber-400/20 to-orange-500/10 border-amber-400/30",
    accent: "text-amber-400",
  },
  {
    icon: Zap,
    labelKey: "landing.featEnergy",
    descKey: "landing.featEnergyDesc",
    color: "from-yellow-400/20 to-amber-500/10 border-yellow-400/30",
    accent: "text-yellow-400",
  },
  {
    icon: Building2,
    labelKey: "landing.featRealEstate",
    descKey: "landing.featRealEstateDesc",
    color: "from-blue-400/20 to-indigo-500/10 border-blue-400/30",
    accent: "text-blue-400",
  },
  {
    icon: Cpu,
    labelKey: "landing.featTechnology",
    descKey: "landing.featTechnologyDesc",
    color: "from-violet-400/20 to-purple-500/10 border-violet-400/30",
    accent: "text-violet-400",
  },
  {
    icon: Truck,
    labelKey: "landing.featInfrastructure",
    descKey: "landing.featInfrastructureDesc",
    color: "from-cyan-400/20 to-sky-500/10 border-cyan-400/30",
    accent: "text-cyan-400",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export default function Features() {
  const { t } = useTranslation();

  return (
    <section
      id="features"
      className="relative scroll-mt-16 px-5 py-24 lg:py-32"
      style={{ scrollMarginTop: "8rem" }}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1000px 500px at 20% 0%, rgba(224,165,35,0.12) 0%, transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <span className="badge mb-4">
            {t("landing.featuresLabel")}
          </span>
          <h2 className="font-display text-balance text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-gold-200">
            {t("landing.featuresTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-navy-300 text-lg sm:text-xl">
            {t("landing.featuresSubtitle")}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.labelKey} variants={item}>
                <div
                  className={`group relative card p-6 transition hover:border-[var(--color-border-strong)] hover:shadow-[0_20px_50px_-20px_rgba(224,165,35,0.25)]`}
                >
                  <div
                    className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} p-3 shadow-md transition group-hover:scale-[1.05]`}
                  >
                    <Icon className={`h-6 w-6 ${feature.accent}`} aria-hidden />
                  </div>
                  <h3 className="mb-3 font-semibold text-lg text-gold-200">
                    {t(feature.labelKey)}
                  </h3>
                  <p className="text-navy-300 leading-relaxed text-sm sm:text-base">
                    {t(feature.descKey)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
