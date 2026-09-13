"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useStore } from "@/lib/stores/useStore";
import Navbar from "@/components/landing/Navbar";
import ChatPopup from "@/components/user/ChatPopup";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

const layoutMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
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
  const { currentUser } = useStore();
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.replace("/auth?returnTo=" + encodeURIComponent(pathname || "/dashboard"));
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
    <div className="min-h-screen bg-navy-950">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 py-8 pt-28">
        <motion.div
          variants={layoutMotion}
          initial="initial"
          animate="animate"
        >
          {children}
        </motion.div>
        <div className="h-20" aria-hidden />
      </main>

      {/* Floating chat button */}
      <AnimatePresence>
        {!chatOpen && (
          <motion.button
            key="chat-fab"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", damping: 20, stiffness: 260 }}
            onClick={() => setChatOpen(true)}
            className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-amber-500 text-navy-950 shadow-[0_10px_30px_-8px_rgba(224,165,35,0.6)] transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-2"
            aria-label={t("nav.chat")}
          >
            <MessageCircle className="h-6 w-6" aria-hidden />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat popup */}
      <AnimatePresence>
        {chatOpen && <ChatPopup onClose={() => setChatOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
