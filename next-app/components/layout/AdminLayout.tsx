"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useStore } from "@/lib/stores/useStore";
import Navbar from "@/components/landing/Navbar";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  TrendingUp,
  ArrowLeftRight,
  MessageSquare,
  Globe,
  LogOut,
} from "lucide-react";

const adminLinks = [
  {
    href: "/admin",
    labelKey: "admin.overview",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/users",
    labelKey: "admin.users",
    icon: Users,
  },
  {
    href: "/admin/plans",
    labelKey: "admin.plans",
    icon: CreditCard,
  },
  {
    href: "/admin/investments",
    labelKey: "admin.investments",
    icon: TrendingUp,
  },
  {
    href: "/admin/transactions",
    labelKey: "admin.transactions",
    icon: ArrowLeftRight,
  },
  {
    href: "/admin/chats",
    labelKey: "admin.chats",
    icon: MessageSquare,
  },
  {
    href: "/admin/languages",
    labelKey: "admin.languages",
    icon: Globe,
  },
];

const layoutMotion = {
  initial: { opacity: 0, x: -8 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -8 },
  transition: { duration: 0.2 },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, logout } = useStore();

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      router.replace("/auth?returnTo=/admin");
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="min-h-screen bg-navy-950 px-5 py-24 text-center">
        <div className="mx-auto max-w-md">
          <div className="mb-6 rounded-xl bg-navy-900/60 border border-[rgba(255,215,120,0.12)] p-6">
            <p className="text-lg font-semibold text-gold-200">
              {t("common.loading")}
            </p>
          </div>
          <p className="mt-4 text-sm text-navy-400">
            Admin access required.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 px-5 py-8">
      <Navbar />
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row lg:gap-8">
        <aside className="lg:w-56">
          <nav className="sticky top-28 z-30 flex flex-col gap-1 rounded-2xl border border-[rgba(255,215,120,0.1)] bg-navy-900/70 p-2 backdrop-blur-sm">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.exact
                  ? pathname === link.href
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-gold-400/15 text-gold-300 border border-gold-400/25 shadow-sm"
                      : "text-navy-300 hover:bg-navy-800/60 hover:text-gold-300"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? "text-gold-400" : "text-navy-400"
                    }`}
                    aria-hidden
                  />
                  {t(link.labelKey)}
                </Link>
              );
            })}
            <div className="my-2 border-t border-[rgba(255,215,120,0.1)]" />
            <button
              onClick={() => {
                logout();
                window.location.href = "/";
              }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-400/10"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              {t("nav.logout")}
            </button>
          </nav>
        </aside>
        <main className="flex-1">
          <motion.div
            variants={layoutMotion}
            initial="initial"
            animate="animate"
            className="mb-10"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
