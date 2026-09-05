import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "../lib/utils";

const plans = [
  {
    nameKey: "starter",
    features: [1, 2, 3, 4],
    popular: false,
    borderColor: "border-white/5 hover:border-white/10",
  },
  {
    nameKey: "growth",
    features: [1, 2, 3, 4, 5],
    popular: true,
    borderColor: "border-gold-400/30",
  },
  {
    nameKey: "premium",
    features: [1, 2, 3, 4, 5, 6],
    popular: false,
    borderColor: "border-white/5 hover:border-white/10",
  },
];

export default function Plans() {
  const { t } = useTranslation();

  return (
    <section id="plans" className="relative py-32">
      {/* Background Accent */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/3 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block rounded-full border border-gold-400/20 bg-gold-400/5 px-4 py-1.5 text-xs font-medium tracking-wide text-gold-400 uppercase"
          >
            {t("plans.section_label")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          >
            {t("plans.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-navy-300"
          >
            {t("plans.subtitle")}
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.nameKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className={cn(
                "relative rounded-2xl border bg-white/[0.02] p-8 transition-all",
                plan.borderColor,
                plan.popular && "scale-[1.02] bg-gold-400/[0.03] shadow-xl shadow-gold-500/10"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 px-4 py-1 text-xs font-bold text-navy-950 uppercase tracking-wider">
                  {t("plans.growth_highlight")}
                </div>
              )}

              {/* Header */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white">
                  {t(`plans.${plan.nameKey}_name`)}
                </h3>
                <p className="mt-1 text-xs text-navy-400">
                  {t(`plans.${plan.nameKey}_highlight`)}
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span
                    className={cn(
                      "text-4xl font-bold",
                      plan.popular ? "text-gold-400" : "text-white"
                    )}
                  >
                    {t(`plans.${plan.nameKey}_price`)}
                  </span>
                  <span className="text-sm text-navy-500">
                    /{t(`plans.${plan.nameKey}_period`)}
                  </span>
                </div>
              </div>

              {/* Features */}
              <ul className="mb-8 space-y-3">
                {plan.features.map((n) => (
                  <li key={n} className="flex items-start gap-3">
                    <Check
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0",
                        plan.popular ? "text-gold-400" : "text-navy-500"
                      )}
                    />
                    <span className="text-sm text-navy-300">
                      {t(`plans.${plan.nameKey}_feature${n}`)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="/auth"
                className={cn(
                  "block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all",
                  plan.popular
                    ? "bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 shadow-lg shadow-gold-500/25 hover:shadow-xl hover:shadow-gold-500/30"
                    : "border border-white/10 bg-white/5 text-white hover:border-gold-400/30 hover:bg-gold-400/10"
                )}
              >
                {t("plans.get_started")}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
