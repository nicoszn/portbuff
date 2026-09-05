import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Wheat,
  Gem,
  Zap,
  Building2,
  Cpu,
  Landmark,
} from "lucide-react";
import { cn } from "../lib/utils";

const features = [
  {
    key: "agriculture",
    icon: Wheat,
    color: "from-green-400 to-emerald-500",
    bgColor: "hover:border-green-400/20 hover:bg-green-400/5",
    iconColor: "text-green-400",
  },
  {
    key: "minerals",
    icon: Gem,
    color: "from-amber-400 to-orange-500",
    bgColor: "hover:border-amber-400/20 hover:bg-amber-400/5",
    iconColor: "text-amber-400",
  },
  {
    key: "energy",
    icon: Zap,
    color: "from-yellow-400 to-gold-500",
    bgColor: "hover:border-gold-400/20 hover:bg-gold-400/5",
    iconColor: "text-gold-400",
  },
  {
    key: "real_estate",
    icon: Building2,
    color: "from-blue-400 to-indigo-500",
    bgColor: "hover:border-blue-400/20 hover:bg-blue-400/5",
    iconColor: "text-blue-400",
  },
  {
    key: "technology",
    icon: Cpu,
    color: "from-purple-400 to-violet-500",
    bgColor: "hover:border-purple-400/20 hover:bg-purple-400/5",
    iconColor: "text-purple-400",
  },
  {
    key: "infrastructure",
    icon: Landmark,
    color: "from-cyan-400 to-teal-500",
    bgColor: "hover:border-cyan-400/20 hover:bg-cyan-400/5",
    iconColor: "text-cyan-400",
  },
];

export default function Features() {
  const { t } = useTranslation();

  return (
    <section id="features" className="relative py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block rounded-full border border-gold-400/20 bg-gold-400/5 px-4 py-1.5 text-xs font-medium tracking-wide text-gold-400 uppercase"
          >
            {t("features.section_label")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          >
            {t("features.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-navy-300"
          >
            {t("features.subtitle")}
          </motion.p>
        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className={cn(
                "group relative rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all duration-300",
                feature.bgColor
              )}
            >
              <div
                className={cn(
                  "mb-5 inline-flex rounded-xl bg-gradient-to-br p-3",
                  feature.color
                )}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">
                {t(`features.${feature.key}_title`)}
              </h3>
              <p className="text-sm leading-relaxed text-navy-400">
                {t(`features.${feature.key}_desc`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
