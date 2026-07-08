'use client';

import Link from 'next/link';
import {
  GraduationCap,
  BookOpen,
  FileText,
  BarChart3,
  ChevronRight,
  Sparkles,
  Zap,
  LogIn,
  Monitor,
  Smartphone,
  Check,
  ArrowRight,
  Globe,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useLocale } from '@/src/contexts/LocaleContext';

export default function LandingPage() {
  const { t, locale, toggleLocale } = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-[#F8FAFC] font-sans overflow-x-hidden">
      {/* ===== NAVIGATION ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0A0E1A]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">{t('heroTitle')}</span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-[#94A3B8] hover:text-white transition-colors">{t('navFeatures')}</a>
            <a href="#trades" className="text-sm text-[#94A3B8] hover:text-white transition-colors">{t('navTrades')}</a>
            <a href="#pricing" className="text-sm text-[#94A3B8] hover:text-white transition-colors">{t('navPricing')}</a>
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-sm text-[#94A3B8] hover:text-white hover:border-white/20 transition-all"
            >
              <Globe className="w-4 h-4" />
              {locale === 'fr' ? 'EN' : 'FR'}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="hidden md:inline-flex px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg text-sm font-medium transition-colors"
            >
              {t('navSignIn')}
            </Link>
            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-[#94A3B8] hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#0A0E1A]/95 backdrop-blur-md">
            <div className="px-6 py-4 flex flex-col gap-3">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#94A3B8] hover:text-white transition-colors py-2">{t('navFeatures')}</a>
              <a href="#trades" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#94A3B8] hover:text-white transition-colors py-2">{t('navTrades')}</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#94A3B8] hover:text-white transition-colors py-2">{t('navPricing')}</a>
              <button
                onClick={() => { toggleLocale(); setMobileMenuOpen(false); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-[#94A3B8] hover:text-white w-fit"
              >
                <Globe className="w-4 h-4" />
                {locale === 'fr' ? 'EN' : 'FR'}
              </button>
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg text-sm font-medium transition-colors text-center"
              >
                {t('navSignIn')}
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#3B82F6]/10 via-[#0A0E1A] to-[#0A0E1A]" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#3B82F6]/20 rounded-full blur-[120px]" />
        <div className="absolute top-40 right-20 w-[400px] h-[400px] bg-[#06B6D4]/10 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-sm text-[#94A3B8]">{t('heroBadge')}</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
                  {t('heroTitle')}
                </span>
                <br />
                <span>
                  {t('heroTagline')}
                </span>
              </h1>

              <p className="text-lg md:text-xl text-[#94A3B8] mb-8 max-w-xl mx-auto lg:mx-0">
                {t('heroDesc')}
              </p>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
                {[
                  { icon: Sparkles, key: 'heroPillTheory' },
                  { icon: Monitor, key: 'heroPillExams' },
                  { icon: Smartphone, key: 'heroPillTracking' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <item.icon className="w-4 h-4 text-[#3B82F6]" />
                    <span className="text-sm text-[#94A3B8]">{t(item.key)}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/auth/register"
                  className="group px-8 py-4 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] rounded-xl font-semibold text-white hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  {t('heroCta')}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Hero right - visual card */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="relative w-80 h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] rounded-3xl rotate-6 opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#06B6D4] to-[#3B82F6] rounded-3xl -rotate-3 opacity-30" />
                <div className="relative w-full h-full bg-[#1A2035] rounded-3xl border border-[#2D3A52] flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center">
                      <GraduationCap className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">{t('heroTitle')}</h3>
                    <p className="text-sm text-[#94A3B8]">{t('heroBadge')}</p>
                    <div className="mt-4 flex justify-center gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS SECTION (NEW) ===== */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#06B6D4]/5 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
                {t('howItWorksTitle')}
              </span>
            </h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto">
              {t('howItWorksSubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '1',
                icon: BookOpen,
                titleKey: 'step1Title',
                descKey: 'step1Desc',
              },
              {
                step: '2',
                icon: Monitor,
                titleKey: 'step2Title',
                descKey: 'step2Desc',
              },
              {
                step: '3',
                icon: GraduationCap,
                titleKey: 'step3Title',
                descKey: 'step3Desc',
              },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="relative mb-6 inline-flex">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#F59E0B] flex items-center justify-center text-xs font-bold text-[#0A0E1A]">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[#F8FAFC] mb-3">{t(item.titleKey)}</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed max-w-xs mx-auto">
                  {t(item.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section id="features" className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#3B82F6]/5 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
                {t('featuresTitle')}
              </span>
            </h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto">
              {t('featuresSubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                titleKey: 'featureTheorie',
                descKey: 'featureTheorieDesc',
                gradient: 'from-[#3B82F6] to-[#06B6D4]',
              },
              {
                icon: FileText,
                titleKey: 'featureExamens',
                descKey: 'featureExamensDesc',
                gradient: 'from-[#8B5CF6] to-[#3B82F6]',
              },
              {
                icon: BarChart3,
                titleKey: 'featureSuivi',
                descKey: 'featureSuiviDesc',
                gradient: 'from-[#06B6D4] to-[#10B981]',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#3B82F6]/30 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#F8FAFC] mb-2 group-hover:text-[#3B82F6] transition-colors">
                  {t(item.titleKey)}
                </h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  {t(item.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRADES SECTION ===== */}
      <section id="trades" className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#06B6D4]/5 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
                {t('tradesTitle')}
              </span>
            </h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto">
              {t('tradesSubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Électricien (CMEQ) - Active */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#3B82F6]/10 to-[#06B6D4]/10 border border-[#3B82F6]/20 hover:border-[#3B82F6]/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-2 group-hover:text-[#3B82F6] transition-colors">
                {t('tradeElectricien')}
              </h3>
              <p className="text-sm text-[#94A3B8] mb-4">
                {t('tradeElectricienDesc')}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#3B82F6]">
                <Check size={14} />
                <span>{t('tradeTheoryComplete')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#3B82F6] mt-1">
                <Check size={14} />
                <span>{t('tradeExamQuestions')}</span>
              </div>
            </div>

            {/* Plombier (CMMTQ) - Coming Soon */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 opacity-60">
              <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                <span className="text-[#64748B] text-sm font-medium">{t('comingSoon')}</span>
              </div>
              <h3 className="text-lg font-bold text-[#94A3B8] mb-2">
                {t('tradePlombier')}
              </h3>
              <p className="text-sm text-[#64748B]">
                {t('tradePlombierDesc')}
              </p>
            </div>

            {/* Soudeur (QBQ) - Coming Soon */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 opacity-60">
              <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                <span className="text-[#64748B] text-sm font-medium">{t('comingSoon')}</span>
              </div>
              <h3 className="text-lg font-bold text-[#94A3B8] mb-2">
                {t('tradeSoudeur')}
              </h3>
              <p className="text-sm text-[#64748B]">
                {t('tradeSoudeurDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING SECTION (NEW) ===== */}
      <section id="pricing" className="py-20 px-6 relative">
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

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* FREE Plan */}
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#3B82F6]/30 transition-all duration-300">
              <h3 className="text-lg font-semibold text-[#94A3B8] mb-1">{t('planFree')}</h3>
              <p className="text-sm text-[#64748B] mb-6">{t('planFreeDesc')}</p>
              <div className="mb-6">
                <span className="text-sm text-[#94A3B8] align-top">$</span>
                <span className="text-4xl font-bold text-[#F8FAFC]">{t('planFreePrice')}</span>
                <span className="text-[#94A3B8] text-lg ml-1">{t('planPerMonth')}</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                  {t('planFeatureTheory')}
                </li>
                <li className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                  {t('planFeatureLimited')}
                </li>
                <li className="flex items-center gap-2 text-sm text-[#64748B]">
                  <div className="w-4 h-4 shrink-0" />
                  {t('planFeatureAiTutor')}
                </li>
                <li className="flex items-center gap-2 text-sm text-[#64748B]">
                  <div className="w-4 h-4 shrink-0" />
                  {t('planFeatureTracking')}
                </li>
              </ul>
              <Link
                href="/auth/register"
                className="block w-full text-center px-6 py-3 rounded-xl border border-white/10 text-[#F8FAFC] font-medium hover:bg-white/5 transition-all"
              >
                {t('planFreeCta')}
              </Link>
            </div>

            {/* MONTHLY Plan */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#3B82F6]/10 to-[#06B6D4]/10 border border-[#3B82F6]/30 hover:border-[#3B82F6]/50 transition-all duration-300 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-xs font-semibold text-white">
                {locale === 'fr' ? 'POPULAIRE' : 'POPULAR'}
              </div>
              <h3 className="text-lg font-semibold text-[#F8FAFC] mb-1">{t('planMonthly')}</h3>
              <p className="text-sm text-[#94A3B8] mb-6">{t('planMonthlyDesc')}</p>
              <div className="mb-6">
                <span className="text-sm text-[#94A3B8] align-top">$</span>
                <span className="text-4xl font-bold text-[#F8FAFC]">{t('planMonthlyPrice')}</span>
                <span className="text-[#94A3B8] text-lg ml-1">{t('planPerMonth')}</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                  {t('planFeatureTheory')}
                </li>
                <li className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                  {t('planFeatureUnlimited')}
                </li>
                <li className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                  {t('planFeatureExams')}
                </li>
                <li className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                  {t('planFeatureAiTutor')}
                </li>
                <li className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                  {t('planFeatureTracking')}
                </li>
                <li className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                  {t('planFeatureStats')}
                </li>
              </ul>
              <Link
                href="/pricing"
                className="block w-full text-center px-6 py-3 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-medium hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300"
              >
                {t('planMonthlyCta')}
              </Link>
              <p className="text-xs text-[#64748B] text-center mt-4">
                {t('planCancelAnytime')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6]/20 via-[#06B6D4]/20 to-[#3B82F6]/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3B82F6]/10 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('ctaTitle')}
          </h2>
          <p className="text-lg text-[#94A3B8] mb-8 max-w-xl mx-auto">
            {t('ctaDesc')}
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] rounded-xl font-semibold text-white hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300"
          >
            <Zap className="w-5 h-5" />
            {t('ctaButton')}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ===== FOOTER (NEW) ===== */}
      <footer className="border-t border-white/5 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">{t('footerBrand')}</span>
              </div>
              <p className="text-sm text-[#64748B] leading-relaxed">
                {t('heroBadge')}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-[#94A3B8] mb-4">{t('footerQuickLinks')}</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-sm text-[#64748B] hover:text-[#3B82F6] transition-colors">{t('footerLinkFeatures')}</a>
                </li>
                <li>
                  <a href="#trades" className="text-sm text-[#64748B] hover:text-[#3B82F6] transition-colors">{t('footerLinkTrades')}</a>
                </li>
                <li>
                  <a href="#pricing" className="text-sm text-[#64748B] hover:text-[#3B82F6] transition-colors">{t('footerLinkPricing')}</a>
                </li>
                <li>
                  <a href="#contact" className="text-sm text-[#64748B] hover:text-[#3B82F6] transition-colors">{t('footerLinkContact')}</a>
                </li>
              </ul>
            </div>

            {/* Legal / Resources */}
            <div>
              <h4 className="text-sm font-semibold text-[#94A3B8] mb-4">{t('navTrades')}</h4>
              <ul className="space-y-2">
                <li>
                  <span className="text-sm text-[#64748B]">{t('tradeElectricien')}</span>
                </li>
                <li>
                  <span className="text-sm text-[#64748B] opacity-60">{t('tradePlombier')}</span>
                </li>
                <li>
                  <span className="text-sm text-[#64748B] opacity-60">{t('tradeSoudeur')}</span>
                </li>
              </ul>
            </div>

            {/* Language & Auth */}
            <div>
              <h4 className="text-sm font-semibold text-[#94A3B8] mb-4">{t('language')}</h4>
              <button
                onClick={toggleLocale}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-sm text-[#94A3B8] hover:text-white hover:border-white/20 transition-all"
              >
                <Globe className="w-4 h-4" />
                {locale === 'fr' ? 'English' : 'Français'}
              </button>
              <div className="mt-4">
                <Link
                  href="/auth/login"
                  className="text-sm text-[#64748B] hover:text-[#3B82F6] transition-colors"
                >
                  {t('navSignIn')}
                </Link>
                <span className="text-[#64748B] mx-2">·</span>
                <Link
                  href="/auth/register"
                  className="text-sm text-[#64748B] hover:text-[#3B82F6] transition-colors"
                >
                  {t('navSignUp')}
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#64748B]">
              {t('footerRights', { year: new Date().getFullYear() })}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
