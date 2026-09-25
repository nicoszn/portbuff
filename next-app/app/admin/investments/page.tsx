"use client";

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from "@/lib/store/useStore";
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, X } from 'lucide-react';
import { formatCurrency, formatDate } from "@/lib/utils/helpers";
import toast from 'react-hot-toast';

export default function AdminInvestments() {
  const { t } = useTranslation();
  const { investments, users, plans, updateInvestment, deleteInvestment } = useStore();
  const [editingInvestment, setEditingInvestment] = useState<string | null>(null);
  const [form, setForm] = useState({
    amount: 0,
    dailyPercentage: 0,
    days: 4,
    status: 'active' as 'active' | 'completed' | 'cancelled',
  });

  const investmentsWithDetails = investments.map((inv) => ({
    ...inv,
    user: users.find((u) => u.id === inv.userId),
    plan: plans.find((p) => p.id === inv.planId),
  }));

  const openEdit = (invId: string) => {
    const inv = investments.find((i) => i.id === invId);
    if (!inv) return;
    setEditingInvestment(invId);
    setForm({ amount: inv.amount, dailyPercentage: inv.dailyPercentage, days: inv.days, status: inv.status });
  };

  const handleSave = () => {
    if (!editingInvestment) return;
    updateInvestment(editingInvestment, form);
    toast.success('Investment updated!');
    setEditingInvestment(null);
  };

  const handleDelete = (invId: string) => {
    if (window.confirm(t('admin.confirmDelete'))) {
      deleteInvestment(invId);
      toast.success('Investment deleted!');
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 w-full">
      <motion.div variants={item}>
        <h1 className="text-2xl lg:text-3xl font-bold text-surface-900">{t('admin.investments')}</h1>
        <p className="text-surface-500 mt-1">{investments.length} investments total</p>
      </motion.div>

      {/* CRITICAL FIX 1: Removed overflow-hidden. Added bg-white, rounded-2xl, border. */}
      <motion.div 
        variants={item} 
        className="bg-white rounded-2xl border border-surface-100 shadow-sm w-full max-w-full"
      >
        {/* CRITICAL FIX 2: Added touch-pan-x, overscroll-x-contain, rounded-2xl. */}
        <div className="w-full overflow-x-auto relative rounded-2xl touch-pan-x overscroll-x-contain">
          {/* CRITICAL FIX 3: Added min-w-[880px] to force overflow. */}
          <table className="w-full text-sm min-w-[880px] border-collapse">
            <thead>
              <tr className="text-left text-surface-400 bg-surface-50 border-b border-surface-100">
                {/* CRITICAL FIX 4: Sticky First Column Header */}
                <th className="px-4 md:px-6 py-3 font-medium sticky left-0 z-20 bg-surface-50 border-r border-surface-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] whitespace-nowrap">
                  User
                </th>
                <th className="px-4 md:px-6 py-3 font-medium whitespace-nowrap">Plan</th>
                <th className="px-4 md:px-6 py-3 font-medium whitespace-nowrap">Amount</th>
                <th className="px-4 md:px-6 py-3 font-medium whitespace-nowrap">Daily %</th>
                <th className="px-4 md:px-6 py-3 font-medium whitespace-nowrap">Dates</th>
                <th className="px-4 md:px-6 py-3 font-medium whitespace-nowrap">Status</th>
                <th className="px-4 md:px-6 py-3 font-medium whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {investmentsWithDetails.map((inv) => (
                <tr key={inv.id} className="group border-b border-surface-50 last:border-0 hover:bg-surface-50 transition-colors">
                  {/* CRITICAL FIX 4: Sticky First Column Body */}
                  <td className="px-4 md:px-6 py-4 sticky left-0 z-10 bg-white group-hover:bg-surface-50 border-r border-surface-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] transition-colors whitespace-nowrap">
                    <p className="font-medium text-surface-900 truncate max-w-[140px] md:max-w-none">
                      {inv.user?.firstName} {inv.user?.lastName}
                    </p>
                    <p className="text-xs text-surface-400 truncate max-w-[140px] md:max-w-none">
                      {inv.user?.email}
                    </p>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span>{inv.plan?.icon}</span>
                      <span className="font-medium">{inv.plan?.name}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 font-semibold whitespace-nowrap">{formatCurrency(inv.amount)}</td>
                  <td className="px-4 md:px-6 py-4 text-accent-600 font-medium whitespace-nowrap">{inv.dailyPercentage}%</td>
                  <td className="px-4 md:px-6 py-4 text-surface-500 text-xs whitespace-nowrap">
                    {formatDate(inv.startDate)} - {formatDate(inv.endDate)}
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <span className={
                      inv.status === 'active' ? 'badge-success' :
                      inv.status === 'completed' ? 'badge-info' : 'badge-danger'
                    }>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(inv.id)} className="p-1.5 text-surface-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(inv.id)} className="p-1.5 text-surface-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {investmentsWithDetails.length === 0 && (
            <div className="p-8 text-center text-surface-400 bg-white">
              <p>No investments found.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingInvestment && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" onClick={() => setEditingInvestment(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-surface-900">{t('admin.editInvestment')}</h3>
                  <button onClick={() => setEditingInvestment(null)} className="text-surface-400 hover:text-surface-600"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Amount (USD)</label>
                    <input type="number" className="input-field" value={form.amount} onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">Daily %</label>
                      <input type="number" className="input-field" value={form.dailyPercentage} onChange={(e) => setForm({ ...form, dailyPercentage: parseFloat(e.target.value) || 0 })} step="0.1" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">Days</label>
                      <input type="number" className="input-field" value={form.days} onChange={(e) => setForm({ ...form, days: parseInt(e.target.value) || 4 })} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Status</label>
                    <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'active' | 'completed' | 'cancelled' })}>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setEditingInvestment(null)} className="flex-1 btn-secondary">{t('common.cancel')}</button>
                  <button onClick={handleSave} className="flex-1 btn-primary">{t('common.save')}</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
