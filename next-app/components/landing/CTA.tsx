"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const container = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export default function CTA() {
  const { t } = useTranslation();

  return (
    <section className="relative px-5 py-24 lg:py-32">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1100px 500px at 50% -20%, rgba(224,165,35,0.22) 0%, transparent 60%), radial-gradient(900px 500px at 0% 100%, rgba(51,65,138,0.4) 0%, transparent 60%)",
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

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-4xl text-center"
      >
        <h2 className="font-display text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-gold-200">
          {t("landing.ctaTitle")}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-navy-300 sm:text-xl">
          {t("landing.ctaSubtitle")}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/auth?mode=signup"
            className="btn-primary text-lg px-8 py-4"
          >
            {t("landing.ctaButton")}
            <ArrowRight className="h-5 w-5" aria-hidden />
          </Link>
          <Link
            href="/auth"
            className="btn-outline text-lg px-8 py-4"
          >
            {t("nav.login")}
          </Link>
        </div>
        <p className="mt-6 text-xs text-navy-500">
          No credit card required. Start free, upgrade anytime.
        </p>
      </motion.div>
    </section>
  );
}
