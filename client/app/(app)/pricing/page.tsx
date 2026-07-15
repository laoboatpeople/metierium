'use client';

import { useState, useEffect } from 'react';
import { useLocale } from '@/src/contexts/LocaleContext';
import { Check, X, Sparkles, Loader2 } from 'lucide-react';

interface Trade {
  id: string;
  code: string;
  name: string;
  nameFr: string;
}

export default function PricingPage() {
  const { t, locale } = useLocale();
  const plans = [
    {
      id: 'free',
      name: t('pricingPageFree'),
      price: '0',
      period: t('pricingPagePerMonth'),
      desc: t('pricingPagePlanFreeDesc'),
      features: [
        { text: t('pricingFeatureOneTrade'), included: true },
        { text: t('pricingFeatureFullTheory'), included: true },
        { text: t('pricingFeatureLimitedQ'), included: true },
        { text: t('pricingFeatureSwitchTrade'), included: true },
        { text: t('pricingFeatureUnlimitedExams'), included: false },
        { text: t('pricingFeatureAiTutor'), included: false },
      ],
      cta: t('pricingPageCtaFree'),
      popular: false,
      type: 'free' as const,
    },
    {
      id: 'essential',
      name: t('pricingPageEssential'),
      price: '29',
      period: t('pricingPagePerMonth'),
      desc: t('pricingPagePlanEssentialDesc'),
      features: [
        { text: t('pricingFeatureOneTrade'), included: true },
        { text: t('pricingFeatureFullTheory'), included: true },
        { text: t('pricingFeatureUnlimitedQ'), included: true },
        { text: t('pricingFeatureUnlimitedExams'), included: true },
        { text: t('pricingFeatureAiTutor'), included: true },
        { text: t('pricingFeatureLockedTrade'), included: true, highlight: true },
      ],
      cta: t('pricingPageCtaSubscribe'),
      popular: false,
      type: 'single' as const,
    },
    {
      id: 'pro',
      name: t('pricingPagePro'),
      price: '49',
      period: t('pricingPagePerMonth'),
      desc: t('pricingPagePlanProDesc'),
      features: [
        { text: t('pricingFeatureAllTrades'), included: true },
        { text: t('pricingFeatureFullTheory'), included: true },
        { text: t('pricingFeatureUnlimitedQ'), included: true },
        { text: t('pricingFeatureUnlimitedExams'), included: true },
        { text: t('pricingFeatureAiTutor'), included: true },
        { text: t('pricingFeatureProgress'), included: true },
      ],
      cta: t('pricingPageCtaSubscribe'),
      popular: true,
      type: 'all' as const,
    },
    {
      id: 'lifetime',
      name: t('pricingPageLifetime'),
      price: '559',
      period: '',
      desc: t('pricingPagePlanLifetimeDesc'),
      features: [
        { text: t('pricingFeatureAllTrades'), included: true, highlight: true },
        { text: t('pricingFeatureFullTheory'), included: true },
        { text: t('pricingFeatureUnlimitedQ'), included: true },
        { text: t('pricingFeatureUnlimitedExams'), included: true },
        { text: t('pricingFeatureAiTutor'), included: true },
        { text: t('pricingFeatureUpdates'), included: true },
      ],
      cta: t('pricingPageCtaLifetime'),
      popular: false,
      type: 'all' as const,
    },
  ];
  const [trades, setTrades] = useState<Trade[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [showTradePicker, setShowTradePicker] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [subStatus, setSubStatus] = useState<string | null>(null);
  const [subscriptionEndDate, setSubscriptionEndDate] = useState<number | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  // Fetch trades + current plan
  useEffect(() => {
    // Fetch trades
    fetch('/api/trades')
      .then(r => r.json())
      .then(d => {
        const list: Trade[] = d.data || d || [];
        setTrades(list);
        if (list.length > 0) setSelectedTrade(list[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Fetch current user subscription
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => {
          const plan = data.plan || data.subscription?.plan || 'FREE';
          const map: Record<string, string> = {
            'FREE': 'free',
            'MONTHLY': 'essential',
            'PRO': 'pro',
            'LIFETIME': 'lifetime',
          };
          setCurrentPlan(map[plan] || null);
          setSubStatus(data.subStatus || data.subscription?.status || null);
          if (data.subscription?.currentPeriod) {
            const d = new Date(data.subscription.currentPeriod).getTime();
            setSubscriptionEndDate(d);
          }
        })
        .catch(() => {});
    }
  }, []);

  async function handleSubscribe(planId: string, tradeId?: string) {
    setSubscribing(planId);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/auth/login';
        return;
      }

      const body: any = { plan: planId };
      if (tradeId) body.tradeId = tradeId;

      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || t('pricingPageErrorPayment'));
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
      setSubscribing(null);
    }
  }

  function handlePlanClick(planId: string) {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    if (plan.type === 'free') {
      window.location.href = '/auth/register';
      return;
    }

    // Single-trade plan: show trade picker first
    if (plan.type === 'single' && trades.length > 1) {
      setPendingPlan(planId);
      setShowTradePicker(true);
      return;
    }

    handleSubscribe(planId);
  }

  function confirmTradeSelection() {
    setShowTradePicker(false);
    if (pendingPlan && selectedTrade) {
      handleSubscribe(pendingPlan, selectedTrade.id);
      setPendingPlan(null);
    }
  }

  async function handleManageSubscription() {
    setPortalLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to open billing portal');
      const data = await res.json();
      window.location.href = data.url;
    } catch {
      setPortalLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-full text-sm text-[#3B82F6] mb-4">
            <Sparkles size={14} /><span>{t('pricingPageBadge')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#F8FAFC] mb-4">{t('pricingPageTitle')}</h1>
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
            {t('pricingPageSubtitle')}
          </p>
        </div>

        {error && (
          <div className="max-w-xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Plans grid */}
        <div className="grid md:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border transition-all duration-300 ${
                plan.popular
                  ? 'bg-[#1A2035] border-[#3B82F6]/40 shadow-[0_0_30px_rgba(59,130,246,0.15)]'
                  : currentPlan === plan.id
                  ? 'bg-[#1A2035] border-[#22C55E]/40 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
                  : 'bg-[#1A2035] border-[#2D3A52] hover:border-[#3B82F6]/30'
              }`}
            >
              {plan.popular && !currentPlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-4 py-1 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white text-xs font-semibold rounded-full whitespace-nowrap">
                    {t('pricingPagePopular')}
                  </span>
                </div>
              )}
              {currentPlan === plan.id && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-4 py-1 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white text-xs font-semibold rounded-full whitespace-nowrap shadow-lg shadow-green/20">
                    {t('pricingPageCurrentPlanBadge')}
                  </span>
                </div>
              )}
              <div className="p-4 flex flex-col h-full">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">{plan.name}</h3>
                  <p className="text-[11px] text-[#94A3B8] mb-4 min-h-[28px]">{plan.desc}</p>

                  <div className="flex items-baseline gap-0.5 mb-5">
                    <span className="text-3xl font-bold text-[#F8FAFC]">{plan.price}</span>
                    <span className="text-xs text-[#94A3B8]">$</span>
                    {plan.period && <span className="text-xs text-[#64748B]">{plan.period}</span>}
                  </div>

                  <ul className="space-y-2 mb-5">
                    {plan.features.map((f) => (
                      <li key={f.text} className="flex items-start gap-2">
                        {f.included ? (
                          <Check size={14} className={`mt-0.5 shrink-0 ${f.highlight ? 'text-[#3B82F6]' : 'text-[#10B981]'}`} />
                        ) : (
                          <X size={14} className="mt-0.5 text-[#64748B] shrink-0" />
                        )}
                        <span className={`text-xs ${f.included ? (f.highlight ? 'text-[#3B82F6] font-medium' : 'text-[#F8FAFC]') : 'text-[#64748B]'}`}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handlePlanClick(plan.id)}
                  disabled={subscribing === plan.id || currentPlan === plan.id}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-all flex items-center justify-center gap-2 ${
                    currentPlan === plan.id
                      ? 'bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] cursor-default'
                      : plan.popular
                      ? 'bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white hover:shadow-lg hover:shadow-[#3B82F6]/20'
                      : plan.type === 'free'
                      ? 'bg-[#3B82F6] text-white hover:bg-[#2563EB]'
                      : 'bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white hover:shadow-lg hover:shadow-[#3B82F6]/20'
                  } ${subscribing === plan.id ? 'opacity-70' : ''}`}
                >
                  {currentPlan === plan.id ? (
                    <span>{t('pricingPageActive')}</span>
                  ) : subscribing === plan.id ? (
                    <><Loader2 size={14} className="animate-spin" /> {t('pricingPageRedirecting')}</>
                  ) : (
                    plan.cta
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Manage / Cancel subscription */}
        {currentPlan && currentPlan !== 'free' && (
          <div className="text-center mt-6">
            <button
              onClick={handleManageSubscription}
              disabled={portalLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A2035] border border-[#2D3A52] rounded-xl text-sm text-[#94A3B8] hover:border-[#EF4444]/40 hover:text-[#EF4444] transition-all disabled:opacity-50"
            >
              {portalLoading ? (
                <><Loader2 size={14} className="animate-spin" /> {t('pricingPageLoading')}</>
              ) : (
                <>{t('pricingPageManageOrCancel')}</>
              )}
            </button>
          </div>
        )}

        {/* Cancellation notice */}
        {subStatus === 'CANCELLED' && subscriptionEndDate && (
          <div className="text-center mt-8">
            <div className="inline-block px-6 py-4 bg-[#1A2035] border border-[#F59E0B]/30 rounded-xl">
              <p className="text-[#F59E0B] text-sm font-medium">
                {t('pricingPageCancelledNotice')}{' '}
                <span className="font-bold">{new Date(subscriptionEndDate).toLocaleDateString(locale === 'fr' ? 'fr-CA' : 'en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </p>
              <p className="text-[#64748B] text-xs mt-1">
                {t('pricingPageCancelledDesc')}
              </p>
            </div>
          </div>
        )}

        <p className="text-center text-sm text-[#64748B] mt-12">
          {t('pricingPageCancelAnytime')}
        </p>
      </div>

      {/* Trade Picker Modal */}
      {showTradePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => { setShowTradePicker(false); setPendingPlan(null); }} />
          <div className="relative bg-[#0A0E1A] border border-[#2D3A52] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-[#F8FAFC] mb-1">{t('pricingPageModalTitle')}</h3>
            <p className="text-sm text-[#94A3B8] mb-5">
              {t('pricingPageModalDesc')}
            </p>

            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 size={20} className="text-[#3B82F6] animate-spin" />
              </div>
            ) : (
              <div className="space-y-2 mb-5 max-h-[320px] overflow-y-auto pr-1">
                {trades.map((trade) => (
                  <button
                    key={trade.id}
                    onClick={() => setSelectedTrade(trade)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                      selectedTrade?.id === trade.id
                        ? 'bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#F8FAFC]'
                        : 'bg-[#1A2035] border border-[#2D3A52] text-[#94A3B8] hover:border-[#3B82F6]/20'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedTrade?.id === trade.id ? 'border-[#3B82F6]' : 'border-[#64748B]'
                    }`}>
                      {selectedTrade?.id === trade.id && <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{locale === 'fr' ? trade.nameFr : trade.name}</div>
                      <div className="text-[11px] text-[#64748B]">{locale === 'fr' ? `${trade.name} (${trade.code})` : `${trade.nameFr} (${trade.code})`}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setShowTradePicker(false); setPendingPlan(null); }}
                className="flex-1 py-2.5 rounded-xl bg-[#1A2035] text-[#94A3B8] text-sm font-medium hover:bg-[#243047] transition-colors"
              >
                {t('pricingPageModalCancel')}
              </button>
              <button
                onClick={confirmTradeSelection}
                disabled={!selectedTrade || loading || subscribing === pendingPlan!}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#3B82F6]/20 transition-all disabled:opacity-40"
              >
                {subscribing === pendingPlan ? (
                  <><Loader2 size={14} className="animate-spin inline mr-1" /> {t('pricingPageRedirecting')}</>
                ) : t('pricingPageModalConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
