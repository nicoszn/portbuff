import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";

const stats = [
  { key: "stats_investors", value: "10,000+" },
  { key: "stats_invested", value: "$240M+" },
  { key: "stats_returns", value: "18.4%" },
  { key: "stats_countries", value: "52" },
];

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/5 blur-[128px]" />
        <div className="absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-gold-600/3 blur-[100px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-gold-400/20 bg-gold-400/5 px-4 py-1.5"
          >
            <Shield className="h-3.5 w-3.5 text-gold-400" />
            <span className="text-xs font-medium tracking-wide text-gold-400 uppercase">
              {t("hero.badge")}
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {t("hero.title")
              .split("Opportunities")
              .reduce(
                (acc: React.ReactNode[], part, i, arr) => {
                  if (i < arr.length - 1) {
                    return [
                      ...acc,
                      part,
                      <span key="gold" className="bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">
                        Opportunities
                      </span>,
                    ];
                  }
                  return [...acc, part];
                },
                [] as React.ReactNode[]
              )}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg text-navy-300"
          >
            {t("hero.subtitle")}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <a
              href="/auth"
              className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-8 py-3.5 text-base font-semibold text-navy-950 shadow-lg shadow-gold-500/25 transition-all hover:shadow-xl hover:shadow-gold-500/30"
            >
              {t("hero.cta_primary")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#features"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-base font-semibold text-white transition-all hover:border-gold-400/30 hover:bg-white/10"
            >
              <Zap className="h-4 w-4 text-gold-400" />
              {t("hero.cta_secondary")}
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-20 grid w-full max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                className="group rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all hover:border-gold-400/20 hover:bg-gold-400/5"
              >
                <div className="text-2xl font-bold text-white sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-navy-400">
                  {t(`hero.${stat.key}`)}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Floating Icons */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-1/4 left-[10%] hidden rounded-2xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur-sm lg:block"
            >
              <TrendingUp className="h-5 w-5 text-green-400" />
            </motion.div>
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              className="absolute top-1/3 right-[12%] hidden rounded-2xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur-sm lg:block"
            >
              <Shield className="h-5 w-5 text-gold-400" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
