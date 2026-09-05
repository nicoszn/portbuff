import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  const { t } = useTranslation();

  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-gold-400/20 bg-gradient-to-br from-gold-400/10 via-navy-900 to-navy-900 p-12 text-center sm:p-16"
        >
          {/* Background Effect */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/2 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/10 blur-[80px]" />
          </div>

          <div className="relative">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
            >
              {t("cta.title")}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mx-auto mt-4 max-w-xl text-navy-300"
            >
              {t("cta.subtitle")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <a
                href="/auth"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-8 py-3.5 text-base font-semibold text-navy-950 shadow-lg shadow-gold-500/25 transition-all hover:shadow-xl hover:shadow-gold-500/30"
              >
                {t("cta.button")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
