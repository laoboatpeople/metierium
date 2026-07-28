'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, Users, Shield, CreditCard, Circle, Plus, Pencil, Trash2, X } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useLocale } from '@/src/contexts/LocaleContext';

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
  plan?: string;
  active?: boolean;
  createdAt?: string;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  role: string;
  plan: string;
}

const emptyForm: FormData = { name: '', email: '', password: '', role: 'STUDENT', plan: 'FREE' };

export default function AdminUsers() {
  const { t } = useLocale();
  const router = useRouter();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<AppUser | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await authApi('/api/admin/users');
      setUsers(data?.data ?? data?.users ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('adminUsersLoadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  function openCreateModal() {
    setEditingUser(null);
    setFormData(emptyForm);
    setFormError(null);
    setShowFormModal(true);
  }

  function openEditModal(user: AppUser) {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: (user.role || 'STUDENT').toUpperCase(),
      plan: (user.plan || 'FREE').toUpperCase(),
    });
    setFormError(null);
    setShowFormModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      const body: Record<string, string> = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        plan: formData.plan,
      };
      if (formData.password) body.password = formData.password;

      if (editingUser) {
        await authApi(`/api/admin/users/${editingUser.id}`, {
          method: 'PUT',
          body: JSON.stringify(body),
        });
      } else {
        if (!formData.password) {
          setFormError(t('adminFieldPassword') + ' — requis');
          setSubmitting(false);
          return;
        }
        await authApi('/api/admin/users', {
          method: 'POST',
          body: JSON.stringify(body),
        });
      }
      setShowFormModal(false);
      await fetchUsers();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteError(null);
    setDeleting(true);

    try {
      await authApi(`/api/admin/users/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      await fetchUsers();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-[#3B82F6]" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Users size={24} className="text-[#3B82F6]" />
            <h1 className="text-2xl font-bold text-[#F8FAFC]">{t('adminUsers')}</h1>
          </div>
          <p className="text-sm text-[#94A3B8]">{t('adminUsersDesc')}</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={16} />
          {t('adminAddUser')}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 mb-6 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg text-sm text-[#EF4444]">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2D3A52]">
                <th className="text-left px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">{t('adminUsersColName')}</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">{t('adminUsersColEmail')}</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">{t('adminUsersColRole')}</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">{t('adminUsersColPlan')}</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">{t('adminUsersColStatus')}</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">{t('adminColActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D3A52]">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#64748B] text-sm">
                    {t('adminNoUsers')}
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => router.push(`/admin/users/${u.id}`)}
                    className="hover:bg-[#243047]/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#3B82F6]/20 flex items-center justify-center">
                          <Users size={14} className="text-[#3B82F6]" />
                        </div>
                        <span className="text-sm font-medium text-[#F8FAFC]">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#94A3B8]">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded border ${
                        u.role?.toUpperCase() === 'ADMIN'
                          ? 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20'
                          : 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20'
                      }`}>
                        <Shield size={10} />
                        {u.role?.toUpperCase() === 'ADMIN' ? t('adminRoleAdmin') : t('adminRoleStudent')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded border ${
                        u.plan?.toUpperCase() === 'MONTHLY'
                          ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20'
                          : u.plan?.toUpperCase() === 'LIFETIME'
                          ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20'
                          : 'bg-[#64748B]/10 text-[#64748B] border-[#64748B]/20'
                      }`}>
                        <CreditCard size={10} />
                        {u.plan?.toUpperCase() === 'MONTHLY' ? t('adminPlanMonthly') : u.plan?.toUpperCase() === 'LIFETIME' ? 'Lifetime' : t('adminPlanFree')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs rounded border ${
                        u.active !== false
                          ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20'
                          : 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20'
                      }`}>
                        <Circle size={6} className="fill-current" />
                        {u.active !== false ? t('adminStatusActive') : t('adminStatusInactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); openEditModal(u); }}
                          className="p-2 rounded-lg text-[#94A3B8] hover:text-[#3B82F6] hover:bg-[#3B82F6]/10 transition-colors"
                          title={t('adminEditUser')}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteTarget(u); setDeleteError(null); }}
                          className="p-2 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                          title={t('adminDeleteUser')}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFormModal(false)} />
          <div className="relative w-full max-w-md mx-4 bg-[#1A2035] border border-[#2D3A52] rounded-xl shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D3A52]">
              <h2 className="text-lg font-semibold text-[#F8FAFC]">
                {editingUser ? t('adminEditUser') : t('adminAddUser')}
              </h2>
              <button onClick={() => setShowFormModal(false)} className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#2D3A52] transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {formError && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg text-sm text-[#EF4444]">
                  <AlertCircle size={14} />
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">{t('adminFieldName')}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#0A0E1A] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6]"
                  placeholder={t('adminFieldName')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">{t('adminFieldEmail')} *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#0A0E1A] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6]"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">
                  {t('adminFieldPassword')} {!editingUser && '*'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#0A0E1A] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6]"
                  placeholder={editingUser ? t('adminPasswordHint') : '••••••••'}
                />
                {editingUser && (
                  <p className="mt-1 text-xs text-[#64748B]">{t('adminPasswordHint')}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">{t('adminFieldRole')}</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#0A0E1A] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6]"
                  >
                    <option value="STUDENT">STUDENT</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">{t('adminFieldPlan')}</label>
                  <select
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#0A0E1A] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6]"
                  >
                    <option value="FREE">FREE</option>
                    <option value="MONTHLY">MONTHLY</option>
                    <option value="LIFETIME">LIFETIME</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2.5 text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] border border-[#2D3A52] rounded-lg hover:bg-[#2D3A52]/50 transition-colors"
                >
                  {t('adminCancel')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  {t('adminSave')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative w-full max-w-sm mx-4 bg-[#1A2035] border border-[#2D3A52] rounded-xl shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#EF4444]/10 flex items-center justify-center">
                <Trash2 size={18} className="text-[#EF4444]" />
              </div>
              <h2 className="text-lg font-semibold text-[#F8FAFC]">{t('adminDeleteUser')}</h2>
            </div>

            {deleteError && (
              <div className="flex items-center gap-2 px-3 py-2.5 mb-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg text-sm text-[#EF4444]">
                <AlertCircle size={14} />
                {deleteError}
              </div>
            )}

            <p className="text-sm text-[#94A3B8] mb-6">
              {t('adminDeleteConfirm')}
              <span className="block mt-1 font-medium text-[#F8FAFC]">{deleteTarget.name || deleteTarget.email}</span>
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2.5 text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] border border-[#2D3A52] rounded-lg hover:bg-[#2D3A52]/50 transition-colors"
              >
                {t('adminCancel')}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#EF4444] hover:bg-[#DC2626] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {deleting && <Loader2 size={14} className="animate-spin" />}
                {t('adminDelete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
