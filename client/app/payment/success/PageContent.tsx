'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import Nav from '@/components/Nav';
import { useLocale } from '@/src/contexts/LocaleContext';

function PaymentContent() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      const timer = setTimeout(() => setStatus('success'), 2000);
      return () => clearTimeout(timer);
    } else {
      setStatus('error');
    }
  }, [searchParams]);

  return (
    <>
      {status === 'loading' && (
        <>
          <Loader2 size={48} className="mx-auto mb-4 text-[#3B82F6] animate-spin" />
          <h1 className="text-xl font-bold text-[#F8FAFC] mb-2">{t('paymentSuccessLoadingTitle')}</h1>
          <p className="text-sm text-[#94A3B8]">{t('paymentSuccessLoadingDesc')}</p>
        </>
      )}

      {status === 'success' && (
        <>
          <CheckCircle size={48} className="mx-auto mb-4 text-[#22C55E]" />
          <h1 className="text-xl font-bold text-[#F8FAFC] mb-2">{t('paymentSuccessTitle')}</h1>
          <p className="text-sm text-[#94A3B8] mb-6">
            {t('paymentSuccessDesc')}
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#3B82F6]/20 transition-all"
          >
            {t('paymentSuccessDashboardButton')}
            <ArrowRight size={16} />
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={24} className="text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-[#F8FAFC] mb-2">{t('paymentSuccessInvalidTitle')}</h1>
          <p className="text-sm text-[#94A3B8] mb-6">
            {t('paymentSuccessInvalidDesc')}
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#3B82F6] text-white rounded-xl font-medium hover:bg-[#2563EB] transition-all"
          >
            {t('paymentSuccessBackToDashboard')}
          </Link>
        </>
      )}
    </>
  );
}

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <Nav />
      <div className="max-w-lg mx-auto px-4 pt-24">
        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-2xl p-8 text-center">
          <Suspense fallback={
            <Loader2 size={48} className="mx-auto mb-4 text-[#3B82F6] animate-spin" />
          }>
            <PaymentContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
