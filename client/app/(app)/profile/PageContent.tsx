'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Shield, Calendar, CreditCard, BadgeCheck, LogOut, Loader2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/src/contexts/LocaleContext';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useLocale();
  const [user, setUser] = useState<{ name: string; email: string; role?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<{ plan: string; status: string; tradeName?: string } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) setUser(JSON.parse(raw));
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-[#3B82F6]" />
      </div>
    );
  }

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <User size={28} className="text-[#3B82F6]" />
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">{t('profile')}</h1>
          <p className="text-sm text-[#94A3B8]">{t('profileSubtitle')}</p>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center text-xl font-bold text-white">
            {userInitial}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#F8FAFC]">{user?.name || t('profileDefaultName')}</h2>
            <p className="text-sm text-[#94A3B8]">{user?.email || ''}</p>
            <span className="inline-flex items-center gap-1 text-xs text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-0.5 rounded-full mt-1">
              <BadgeCheck size={12} />
              {user?.role === 'ADMIN' ? t('profileRoleAdmin') : t('profileRoleStudent')}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#111827]">
            <Mail size={16} className="text-[#64748B]" />
            <span className="text-sm text-[#94A3B8]">{user?.email || ''}</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#111827]">
            <Shield size={16} className="text-[#64748B]" />
            <span className="text-sm text-[#94A3B8]">{t('profileRoleLabel')}: {user?.role === 'ADMIN' ? t('adminRoleAdmin') : t('adminRoleStudent')}</span>
          </div>
        </div>
      </div>

      {/* Subscription */}
      <Link href="/pricing">
        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-4 hover:border-[#3B82F6]/40 transition-colors flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
              <CreditCard size={20} className="text-[#F59E0B]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#F8FAFC]">{t('subscription')}</p>
              <p className="text-xs text-[#94A3B8]">{t('profileSubscriptionDesc')}</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-[#64748B] group-hover:text-[#F8FAFC] transition-colors" />
        </div>
      </Link>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl text-[#EF4444] font-medium hover:bg-[#EF4444]/20 transition-colors"
      >
        <LogOut size={18} />
        {t('signOut')}
      </button>
    </div>
  );
}
