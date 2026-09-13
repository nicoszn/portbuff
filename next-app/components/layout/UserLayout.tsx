"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useStore } from "@/lib/stores/useStore";
import Navbar from "@/components/landing/Navbar";
import ChatPopup from "@/components/user/ChatPopup";
import { motion, AnimatePresence } from "framer-motion";

const layoutMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
  transition: { duration: 0.22 },
};

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, logout } = useStore();
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      const dest = new URLSearchParams(pathname + window.location.search).get("returnTo") ?? "/auth";
      router.replace("/auth?returnTo=" + encodeURIComponent(dest || "/dashboard"));
    }
  }, [currentUser, router, pathname]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-navy-950 px-5 py-24 text-center">
        <div className="mx-auto max-w-md">
          <div className="mb-6 rounded-xl bg-navy-900/60 border border-[rgba(255,215,120,0.12)] p-6">
            <p className="text-lg font-semibold text-gold-200">
              {t("common.loading")}
            </p>
          </div>
          <p className="mt-4 text-sm text-navy-400">
            Please sign in to continue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 px-5 py-8">
      <Navbar />
      <main className="mx-auto max-w-7xl">
        <motion.div
          variants={layoutMotion}
          initial="initial"
          animate="animate"
          className="mb-10"
        >
          {children}
        </motion.div>
      </main>
      <ChatPopup onClose={() => setChatOpen(false)} />
      <button
        onClick={() => setChatOpen(true)}
        className="fixed right-5 bottom-5 z-40 rounded-full bg-gradient-to-br shadow-[0_10px_30px_-10px_rgba(224,165,35,0.6)] p-3 transition hover:scale-[1.04] sm:right-6 sm:bottom-6"
        aria-label={t("nav.chat")}
      >
        <svg
          className="h-6 w-6 text-navy-950"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </button>
    </div>
  );
}

import { useState } from "react";
