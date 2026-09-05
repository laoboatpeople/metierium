'use client';

import Link from 'next/link';
import { Check, ArrowRight, ChevronDown, Minus } from 'lucide-react';
import Nav from '@/components/Nav';
import { useLocale } from '@/src/contexts/LocaleContext';

export default function PricingPage() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-[#F8FAFC] font-sans overflow-x-hidden">
      <Nav />

      <main>
<section id="pricing" className="py-16 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#3B82F6]/5 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
                {t('pricingTitle')}
              </span>
            </h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto">
              {t('pricingSubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {/* GRATUIT */}
            <div className="bg-[#1A2035] border border-[#2D3A52] hover:border-[#3B82F6]/30 rounded-2xl p-4 flex flex-col transition-all duration-300">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">GRATUIT</h3>
                <p className="text-[11px] text-[#94A3B8] mb-4 min-h-[28px]">{t('pricingPagePlanFreeDesc')}</p>
                <div className="flex items-baseline gap-0.5 mb-5">
                  <span className="text-3xl font-bold text-[#F8FAFC]">0</span>
                  <span className="text-xs text-[#94A3B8]">$</span>
                  <span className="text-xs text-[#64748B]">{t('pricingPagePerMonth')}</span>
                </div>
                <ul className="space-y-2 mb-5">
                  {[
                    { text: t('pricingFeatOneTrade'), inc: true },
                    { text: t('pricingFeatTheory'), inc: true },
                    { text: t('pricingFeatLimitedQ'), inc: true },
                    { text: t('pricingFeatAiTutorLimited'), inc: true },
                    { text: t('pricingFeatUnlimitedExams'), inc: false },
                  ].map((f) => (
                    <li key={f.text} className="flex items-start gap-2">
                      {f.inc ? (
                        <Check size={14} className={`mt-0.5 shrink-0 ${f.highlight ? 'text-[#3B82F6]' : 'text-[#10B981]'}`} />
                      ) : (
                        <div className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      )}
                      <span className={`text-xs ${f.highlight ? 'text-[#3B82F6] font-medium' : (f.inc ? 'text-[#F8FAFC]' : 'text-[#64748B]')}`}>{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/auth/register"
                className="block w-full text-center py-2.5 rounded-xl bg-[#3B82F6] text-white text-sm font-semibold hover:bg-[#2563EB] transition-all"
              >
                {t('pricingPageCtaFree')}
              </Link>
            </div>

            {/* ESSENTIEL */}
            <div className="bg-[#1A2035] border border-[#2D3A52] hover:border-[#3B82F6]/30 rounded-2xl p-4 flex flex-col transition-all duration-300">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-[#3B82F6] mb-1">ESSENTIEL</h3>
                <p className="text-[11px] text-[#94A3B8] mb-4 min-h-[28px]">{t('pricingPagePlanEssentialDesc')}</p>
                <div className="flex items-baseline gap-0.5 mb-5">
                  <span className="text-3xl font-bold text-[#F8FAFC]">29</span>
                  <span className="text-xs text-[#94A3B8]">$</span>
                  <span className="text-xs text-[#64748B]">{t('pricingPagePerMonth')}</span>
                </div>
                <ul className="space-y-2 mb-5">
                  {[
                    { text: t('pricingFeatOneTrade'), inc: true },
                    { text: t('pricingFeatTheory'), inc: true },
                    { text: t('pricingFeatUnlimitedQ'), inc: true },
                    { text: t('pricingFeatUnlimitedExams'), inc: true },
                    { text: t('pricingFeatAiTutor'), inc: true },
                    { text: t('pricingFeatLocked'), inc: true, highlight: true },
                  ].map((f) => (
                    <li key={f.text} className="flex items-start gap-2">
                      <Check size={14} className={`mt-0.5 shrink-0 ${f.highlight ? 'text-[#3B82F6]' : 'text-[#10B981]'}`} />
                      <span className={`text-xs ${f.highlight ? 'text-[#3B82F6] font-medium' : 'text-[#F8FAFC]'}`}>{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/auth/register"
                className="block w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#3B82F6]/20 transition-all"
              >
                {t('pricingPageCtaSubscribe')}
              </Link>
            </div>

            {/* PRO — popular */}
            <div className="bg-[#1A2035] border border-[#3B82F6]/40 rounded-2xl p-4 flex flex-col shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <span className="px-4 py-1 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white text-xs font-semibold rounded-full whitespace-nowrap">
                  {t('pricingPopular')}
                </span>
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-base font-semibold text-[#8B5CF6] mb-1">PRO</h3>
                <p className="text-[11px] text-[#94A3B8] mb-4 min-h-[28px]">{t('pricingPagePlanProDesc')}</p>
                <div className="flex items-baseline gap-0.5 mb-5">
                  <span className="text-3xl font-bold text-[#F8FAFC]">99</span>
                  <span className="text-xs text-[#94A3B8]">$</span>
                  <span className="text-xs text-[#64748B]">{t('pricingPagePerYear')}</span>
                </div>
                <ul className="space-y-2 mb-5">
                  {[
                    { text: t('pricingFeatAllTrades'), inc: true },
                    { text: t('pricingFeatTheory'), inc: true },
                    { text: t('pricingFeatUnlimitedQ'), inc: true },
                    { text: t('pricingFeatUnlimitedExams'), inc: true },
                    { text: t('pricingFeatAiTutor'), inc: true },
                    { text: t('planFeatureTracking'), inc: true },
                  ].map((f) => (
                    <li key={f.text} className="flex items-start gap-2">
                      <Check size={14} className="mt-0.5 text-[#10B981] shrink-0" />
                      <span className="text-xs text-[#F8FAFC]">{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/auth/register"
                className="block w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#3B82F6]/20 transition-all"
              >
                {t('pricingPageCtaSubscribe')}
              </Link>
            </div>

            {/* À VIE */}
            <div className="bg-[#1A2035] border border-[#2D3A52] hover:border-[#F59E0B]/30 rounded-2xl p-4 flex flex-col transition-all duration-300">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-[#F59E0B] mb-1">À VIE</h3>
                <p className="text-[11px] text-[#94A3B8] mb-4 min-h-[28px]">{t('pricingPagePlanLifetimeDesc')}</p>
                <div className="flex items-baseline gap-0.5 mb-5">
                  <span className="text-3xl font-bold text-[#F8FAFC]">399</span>
                  <span className="text-xs text-[#94A3B8]">$</span>
                </div>
                <ul className="space-y-2 mb-5">
                  {[
                    { text: t('pricingFeatAllTrades'), inc: true, highlight: true },
                    { text: t('pricingFeatTheory'), inc: true },
                    { text: t('pricingFeatUnlimitedQ'), inc: true },
                    { text: t('pricingFeatUnlimitedExams'), inc: true },
                    { text: t('pricingFeatAiTutor'), inc: true },
                    { text: t('pricingFeatUpdates'), inc: true },
                  ].map((f) => (
                    <li key={f.text} className="flex items-start gap-2">
                      <Check size={14} className={`mt-0.5 shrink-0 ${f.highlight ? 'text-[#F59E0B]' : 'text-[#10B981]'}`} />
                      <span className={`text-xs ${f.highlight ? 'text-[#F59E0B] font-medium' : 'text-[#F8FAFC]'}`}>{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/auth/register"
                className="block w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#F59E0B]/20 transition-all"
              >
                {t('pricingPageCtaLifetime')}
              </Link>
            </div>
          </div>

          <p className="text-center text-sm text-[#64748B] mt-8">
            {t('planCancelAnytime')}
          </p>
        </div>
      </section>

        {/* Compare plans table */}
        <section className="py-10 px-6 relative">
          <div className="relative z-10 max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
                {t('pricingCompareTitle')}
              </span>
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-[#2D3A52] bg-[#0F1524]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2D3A52]">
                    <th className="text-left py-4 px-5 text-[#94A3B8] font-medium"></th>
                    <th className="text-center py-4 px-3 text-[#F8FAFC] font-semibold">GRATUIT</th>
                    <th className="text-center py-4 px-3 text-[#3B82F6] font-semibold">ESSENTIEL</th>
                    <th className="text-center py-4 px-3 text-[#8B5CF6] font-semibold">PRO</th>
                    <th className="text-center py-4 px-3 text-[#F59E0B] font-semibold">À VIE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2D3A52]/60">
                  {[
                    { label: t('pricingFeatOneTrade'), cells: [true, true, false, false] },
                    { label: t('pricingFeatAllTrades'), cells: [false, false, true, true] },
                    { label: t('pricingFeatTheory'), cells: [true, true, true, true] },
                    { label: t('pricingFeatUnlimitedQ'), cells: [false, true, true, true] },
                    { label: t('pricingFeatUnlimitedExams'), cells: [false, true, true, true] },
                    { label: t('pricingFeatAiTutor'), cells: [false, true, true, true] },
                    { label: t('planFeatureTracking'), cells: [false, false, true, true] },
                    { label: t('pricingFeatUpdates'), cells: [false, false, false, true] },
                  ].map((row) => (
                    <tr key={row.label} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-5 text-[#F8FAFC]">{row.label}</td>
                      {row.cells.map((inc, ci) => (
                        <td key={ci} className="py-3.5 px-3 text-center">
                          {inc === true ? (
                            <Check size={16} className="inline text-[#10B981]" />
                          ) : (
                            <Minus size={16} className="inline text-[#475569]" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-center text-sm text-[#64748B] mt-4">{t('planCancelAnytime')}</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-10 px-6 relative">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
                {t('faqTitle')}
              </span>
            </h2>
            <div className="space-y-3">
              {[
                { q: t('pricingFaqQ1'), a: t('pricingFaqA1') },
                { q: t('pricingFaqQ2'), a: t('pricingFaqA2') },
                { q: t('pricingFaqQ3'), a: t('pricingFaqA3') },
                { q: t('pricingFaqQ4'), a: t('pricingFaqA4') },
                { q: t('pricingFaqQ5'), a: t('pricingFaqA5') },
                { q: t('pricingFaqQ6'), a: t('pricingFaqA6') },
              ].map((item, idx) => (
                <details
                  key={idx}
                  className="group bg-[#1A2035] border border-[#2D3A52] rounded-xl overflow-hidden hover:border-[#3B82F6]/30 transition-colors"
                >
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none text-sm font-medium text-[#F8FAFC]">
                    {item.q}
                    <ChevronDown size={16} className="text-[#94A3B8] group-open:rotate-180 transition-transform shrink-0" />
                  </summary>
                  <p className="px-5 pb-4 text-sm text-[#94A3B8] leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-20 px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-[#F8FAFC]">{t('pricingCtaTitle')}</h2>
          <p className="text-sm text-[#94A3B8] max-w-xl mx-auto mb-6">{t('pricingCtaText')}</p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#3B82F6] text-white text-base font-semibold hover:bg-[#2563EB] transition-all"
          >
            {t('pricingPageCtaFree') || 'Commencer gratuitement'} <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}
