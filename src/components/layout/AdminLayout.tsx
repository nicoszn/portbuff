import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../stores/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Banknote,
  History,
  MessageCircle,
  Languages,
  LogOut,
  Settings,
  Menu,
  X,
  Shield,
  ChevronLeft,
} from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout() {
  const { t } = useTranslation();
  const { currentUser, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: t('admin.overview'), exact: true },
    { to: '/admin/users', icon: Users, label: t('admin.users') },
    { to: '/admin/plans', icon: TrendingUp, label: t('admin.plans') },
    { to: '/admin/investments', icon: Banknote, label: t('admin.investments') },
    { to: '/admin/transactions', icon: History, label: t('admin.transactions') },
    { to: '/admin/chats', icon: MessageCircle, label: t('admin.chats') },
    { to: '/admin/languages', icon: Languages, label: t('admin.languages') },
  ];

  const isActive = (to: string, exact?: boolean) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-surface-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-surface-900">{t('app.name')}</h1>
            <p className="text-xs text-amber-600 font-medium">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive: active }) =>
              (item.exact ? active && location.pathname === item.to : active) || isActive(item.to, item.exact)
                ? 'sidebar-link-active'
                : 'sidebar-link'
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-surface-100">
        <button
          onClick={() => { setSidebarOpen(false); navigate('/'); }}
          className="sidebar-link w-full text-primary-600 hover:bg-primary-50 mb-1"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>User Dashboard</span>
        </button>
        <button onClick={handleLogout} className="sidebar-link w-full text-red-500 hover:text-red-600 hover:bg-red-50">
          <LogOut className="w-5 h-5" />
          <span>{t('nav.logout')}</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-surface-100 fixed h-full z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-72 bg-white z-50 lg:hidden shadow-xl flex flex-col"
            >
              <div className="p-5 border-b border-surface-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-lg font-bold text-surface-900">{t('app.name')}</h1>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-surface-400 hover:text-surface-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-surface-100 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="text-surface-600">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-600" />
            <span className="font-bold text-surface-900">Admin</span>
          </div>
          <div className="w-6" />
        </div>

        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
