"use client";

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from "@/lib/store/useStore";
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Ban, CheckCircle, X, Search, User } from 'lucide-react';
import { formatDate, formatCurrency, generateId } from "@/lib/utils/helpers";
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const { t } = useTranslation();
  const { users, addUser, updateUser, deleteUser } = useStore();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user' as 'user' | 'admin',
    balance: 0,
    status: 'active' as 'active' | 'blocked',
  });

  const regularUsers = users.filter(
    (u) =>
      u.role === 'user' &&
      (u.firstName.toLowerCase().includes(search.toLowerCase()) ||
        u.lastName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const openCreate = () => {
    setEditingUser(null);
    setForm({ firstName: '', lastName: '', email: '', password: '', role: 'user', balance: 0, status: 'active' });
    setShowModal(true);
  };

  const openEdit = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    setEditingUser(userId);
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      role: user.role,
      balance: user.balance,
      status: user.status,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingUser) {
      updateUser(editingUser, form);
      toast.success('User updated!');
    } else {
      addUser({
        id: generateId(),
        ...form,
        totalInvested: 0,
        totalEarned: 0,
        currentProfit: 0,
        createdAt: new Date().toISOString(),
      });
      toast.success('User created!');
    }
    setShowModal(false);
  };

  const toggleBlock = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    updateUser(userId, { status: user.status === 'active' ? 'blocked' : 'active' });
    toast.success(user.status === 'active' ? 'User blocked!' : 'User unblocked!');
  };

  const handleDelete = (userId: string) => {
    if (window.confirm(t('admin.confirmDelete'))) {
      deleteUser(userId);
      toast.success('User deleted!');
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
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-surface-900">{t('admin.manageUsers')}</h1>
          <p className="text-surface-500 mt-1">{regularUsers.length} users total</p>
        </div>
        <motion.button onClick={openCreate} className="btn-primary flex items-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Plus className="w-4 h-4" />
          {t('admin.createUser')}
        </motion.button>
      </motion.div>

      {/* Search */}
      <motion.div variants={item} className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input
          type="text"
          className="input-field pl-10"
          placeholder={t('common.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </motion.div>

      {/* Users Table */}
      {/* CRITICAL FIX 1: Removed overflow-hidden. Added bg-white, rounded-2xl, border. */}
      <motion.div 
        variants={item} 
        className="bg-white rounded-2xl border border-surface-100 shadow-sm w-full max-w-full"
      >
        {/* CRITICAL FIX 2: Added touch-pan-x, overscroll-x-contain, rounded-2xl. */}
        <div className="w-full overflow-x-auto relative rounded-2xl touch-pan-x overscroll-x-contain">
          {/* CRITICAL FIX 3: Added min-w-[800px] to force overflow. */}
          <table className="w-full text-sm min-w-[800px] border-collapse">
            <thead>
              <tr className="text-left text-surface-400 bg-surface-50 border-b border-surface-100">
                {/* CRITICAL FIX 4: Sticky First Column Header */}
                <th className="px-4 md:px-6 py-3 font-medium sticky left-0 z-20 bg-surface-50 border-r border-surface-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] whitespace-nowrap">
                  User
                </th>
                <th className="px-4 md:px-6 py-3 font-medium whitespace-nowrap">Balance</th>
                <th className="px-4 md:px-6 py-3 font-medium whitespace-nowrap">Invested</th>
                <th className="px-4 md:px-6 py-3 font-medium whitespace-nowrap">Status</th>
                <th className="px-4 md:px-6 py-3 font-medium whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {regularUsers.map((user, i) => (
                <motion.tr
                  key={user.id}
                  variants={item}
                  className="group border-b border-surface-50 last:border-0 hover:bg-surface-50 transition-colors"
                >
                  {/* CRITICAL FIX 4: Sticky First Column Body */}
                  <td className="px-4 md:px-6 py-4 sticky left-0 z-10 bg-white group-hover:bg-surface-50 border-r border-surface-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] transition-colors whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-surface-900 truncate max-w-[140px] md:max-w-none">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-surface-400 truncate max-w-[140px] md:max-w-none">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 font-medium whitespace-nowrap">{formatCurrency(user.balance)}</td>
                  <td className="px-4 md:px-6 py-4 text-surface-600 whitespace-nowrap">{formatCurrency(user.totalInvested)}</td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <span className={user.status === 'active' ? 'badge-success' : 'badge-danger'}>
                      {user.status === 'active' ? t('common.active') : t('common.blocked')}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(user.id)}
                        className="p-1.5 text-surface-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title={t('admin.editUser')}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleBlock(user.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          user.status === 'active'
                            ? 'text-surface-400 hover:text-amber-600 hover:bg-amber-50'
                            : 'text-surface-400 hover:text-accent-600 hover:bg-accent-50'
                        }`}
                        title={user.status === 'active' ? t('admin.blockUser') : t('admin.unblockUser')}
                      >
                        {user.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-1.5 text-surface-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title={t('admin.deleteUser')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {regularUsers.length === 0 && (
            <div className="p-8 text-center text-surface-400 bg-white">
              <p>No users found.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-surface-900">
                    {editingUser ? t('admin.editUser') : t('admin.createUser')}
                  </h3>
                  <button onClick={() => setShowModal(false)} className="text-surface-400 hover:text-surface-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">{t('auth.firstName')}</label>
                      <input type="text" className="input-field" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">{t('auth.lastName')}</label>
                      <input type="text" className="input-field" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">{t('auth.email')}</label>
                    <input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">{t('auth.password')}</label>
                    <input type="text" className="input-field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">Balance (USD)</label>
                      <input type="number" className="input-field" value={form.balance} onChange={(e) => setForm({ ...form, balance: parseFloat(e.target.value) || 0 })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">Role</label>
                      <select className="input-field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as 'user' | 'admin' })}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Status</label>
                    <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'active' | 'blocked' })}>
                      <option value="active">Active</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowModal(false)} className="flex-1 btn-secondary">
                    {t('common.cancel')}
                  </button>
                  <button onClick={handleSave} className="flex-1 btn-primary">
                    {editingUser ? t('common.save') : t('common.create')}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
