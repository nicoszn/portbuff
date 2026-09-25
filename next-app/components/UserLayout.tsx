"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "@/lib/store/useStore";
import { useRequireAuth } from "@/lib/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  History,
  Settings,
  LogOut,
  MessageCircle,
  X,
  User,
} from "lucide-react";
import ChatPopup from "@/components/ChatPopup";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const currentUser = useRequireAuth();
  const { logout } = useStore();
  const pathname = usePathname();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    router.replace("/auth");
  };

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: t("nav.dashboard") },
    { to: "/dashboard/plans", icon: TrendingUp, label: t("nav.plans") },
    {
      to: "/dashboard/transactions",
      icon: History,
      label: t("nav.transactions"),
    },
    { to: "/dashboard/settings", icon: Settings, label: t("nav.settings") },
  ];

  const isCurrentPath = (path: string) => {
    if (path === "/dashboard")
      return pathname === "/dashboard" || pathname === "/dashboard/";
    return pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Desktop sidebar — icon+label, pill active state */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-surface-100 fixed h-full z-30">
        <div className="p-6 border-b border-surface-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-display text-surface-900">
                {t("app.name")}
              </h1>
              <p className="text-xs text-surface-400">{t("app.tagline")}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className={isCurrentPath(item.to) ? "sidebar-link-active" : "sidebar-link"}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-surface-100">
          <div className="flex items-center gap-3 mb-3 px-4 py-2">
            <div className="w-9 h-9 bg-primary-50 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-surface-900 truncate">
                {currentUser.firstName} {currentUser.lastName}
              </p>
              <p className="text-xs text-surface-400 truncate">
                {currentUser.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="sidebar-link w-full text-loss-500 hover:text-loss-600 hover:bg-loss-50"
          >
            <LogOut className="w-5 h-5" />
            <span>{t("nav.logout")}</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 min-h-screen">
        {/* Mobile header — brand + profile avatar (opens a light sheet, not full nav) */}
        <div
          className="lg:hidden sticky top-0 z-30 bg-white/90 backdrop-blur-lg border-b border-surface-100 px-4 py-3 flex items-center justify-between"
          style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top, 0px))" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-accent-400" />
            </div>
            <span className="font-display font-bold text-surface-900">{t("app.name")}</span>
          </div>
          <button
            onClick={() => setProfileOpen(true)}
            className="w-9 h-9 bg-primary-50 rounded-full flex items-center justify-center active:scale-95 transition-transform"
          >
            <User className="w-4 h-4 text-primary-600" />
          </button>
        </div>

        {/* pb-24 clears the fixed bottom tab bar on mobile */}
        <main className="p-4 pb-24 lg:pb-8 lg:p-8">{children}</main>
      </div>

      {/* Mobile bottom tab bar — thumb-reachable primary nav */}
      <nav className="tab-bar">
        {navItems.map((item) => {
          const active = isCurrentPath(item.to);
          return (
            <Link
              key={item.to}
              href={item.to}
              className={active ? "tab-item-active" : "tab-item"}
            >
              <item.icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
              <span className="text-[11px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile profile sheet */}
      <AnimatePresence>
        {profileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-primary-900/50 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setProfileOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed left-0 right-0 bottom-0 bg-white rounded-t-3xl z-50 lg:hidden shadow-card-hover"
              style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))" }}
            >
              <div className="flex justify-center pt-3">
                <div className="w-10 h-1 rounded-full bg-surface-200" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-surface-900">
                        {currentUser.firstName} {currentUser.lastName}
                      </p>
                      <p className="text-xs text-surface-400">{currentUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setProfileOpen(false)}
                    className="btn-icon"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={handleLogout}
                  className="sidebar-link w-full text-loss-500 hover:text-loss-600 hover:bg-loss-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{t("nav.logout")}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Chat FAB — sits above the tab bar on mobile */}
      <motion.button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-24 right-5 lg:bottom-6 lg:right-6 w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-800 text-accent-400 rounded-full shadow-pill flex items-center justify-center z-40"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {chatOpen && <ChatPopup onClose={() => setChatOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
