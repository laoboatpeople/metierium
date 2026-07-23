'use client';

import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Users, Shield, CreditCard, Circle } from 'lucide-react';
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

export default function AdminUsers() {
  const { t } = useLocale();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const data = await authApi('/api/admin/users');
      setUsers(data?.data ?? data?.users ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('adminUsersLoadError'));
    } finally {
      setLoading(false);
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
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users size={24} className="text-[#3B82F6]" />
          <h1 className="text-2xl font-bold text-[#F8FAFC]">{t('adminUsers')}</h1>
        </div>
        <p className="text-sm text-[#94A3B8]">{t('adminUsersDesc')}</p>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D3A52]">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#64748B] text-sm">
                    {t('adminNoUsers')}
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#243047]/50 transition-colors">
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
                        u.role === 'admin'
                          ? 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20'
                          : 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20'
                      }`}>
                        <Shield size={10} />
                        {t(u.role === 'admin' ? 'adminRoleAdmin' : 'adminRoleStudent')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded border ${
                        u.plan === 'monthly'
                          ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20'
                          : 'bg-[#64748B]/10 text-[#64748B] border-[#64748B]/20'
                      }`}>
                        <CreditCard size={10} />
                        {t(u.plan === 'monthly' ? 'adminPlanMonthly' : 'adminPlanFree')}
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
