'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, Lock, Loader2, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useLocale } from '@/src/contexts/LocaleContext';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

function ResetForm() {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      setError(t('authInvalidLink'));
    }
  }, [token, email, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError(t('authPasswordLength'));
      return;
    }
    if (password !== confirm) {
      setError(t('authPasswordMismatch'));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur');
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('authConnectionError'));
    }
    setLoading(false);
  };

  if (!token || !email) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center px-4">
        <div className="bg-[#1A2035] border border-[#EF4444]/20 rounded-xl p-6 max-w-md text-center">
          <AlertCircle size={48} className="mx-auto text-[#EF4444] mb-3" />
          <h1 className="text-lg font-semibold text-[#F8FAFC] mb-2">{t('authInvalidLinkTitle')}</h1>
          <p className="text-sm text-[#94A3B8] mb-4">{t('authInvalidLinkDesc')}</p>
          <Link href="/auth/forgot-password" className="text-sm text-[#3B82F6] hover:underline">
            {t('authRequestNewLink')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center mx-auto mb-3">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">{t('authNewPassword')}</h1>
          <p className="text-sm text-[#94A3B8] mt-1">{t('authNewPasswordDesc')}</p>
        </div>

        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6">
          {done ? (
            <div className="text-center py-4">
              <CheckCircle size={48} className="mx-auto text-[#22C55E] mb-3" />
              <h2 className="text-lg font-semibold text-[#F8FAFC] mb-1">{t('authPasswordReset')}</h2>
              <p className="text-sm text-[#94A3B8] mb-4">{t('authPasswordResetDesc')}</p>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] rounded-lg text-white font-medium"
              >
                {t('authPasswordLogin')}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">{t('authNewPassword')}</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder={t('authPasswordPlaceholder')}
                    className="w-full pl-10 pr-10 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8]">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">{t('authConfirmPassword')}</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    minLength={8}
                    placeholder={t('authConfirmPasswordPlaceholder')}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 px-3 py-2 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg text-sm text-[#EF4444]">
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !password || !confirm}
                className="w-full py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] rounded-lg font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                {loading ? t('authResetting') : t('authResetPassword')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-[#3B82F6]" />
      </div>
    }>
      <ResetForm />
    </Suspense>
  );
}
