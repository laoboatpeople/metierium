'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Menu, X, Globe } from 'lucide-react';
import { useLocale } from '@/src/contexts/LocaleContext';

export default function Nav() {
  const { t, locale, toggleLocale } = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0A0E1A]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">{t('heroTitle')}</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-sm text-[#94A3B8] hover:text-white transition-colors">{t('navFeatures')}</Link>
            <Link href="/#trades" className="text-sm text-[#94A3B8] hover:text-white transition-colors">{t('navTrades')}</Link>
            <Link href="/#pricing" className="text-sm text-[#94A3B8] hover:text-white transition-colors">{t('navPricing')}</Link>
            <Link href="/faq" className="text-sm text-[#94A3B8] hover:text-white transition-colors">FAQ</Link>
            <Link href="/blog" className="text-sm text-[#94A3B8] hover:text-white transition-colors">Blog</Link>
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
            <button
              className="md:hidden p-2 text-[#94A3B8] hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#0A0E1A]/95 backdrop-blur-md">
            <div className="px-6 py-4 space-y-3">
              <Link href="/#features" className="block text-sm text-[#94A3B8] hover:text-white" onClick={() => setMobileMenuOpen(false)}>{t('navFeatures')}</Link>
              <Link href="/#trades" className="block text-sm text-[#94A3B8] hover:text-white" onClick={() => setMobileMenuOpen(false)}>{t('navTrades')}</Link>
              <Link href="/#pricing" className="block text-sm text-[#94A3B8] hover:text-white" onClick={() => setMobileMenuOpen(false)}>{t('navPricing')}</Link>
              <Link href="/faq" className="block text-sm text-[#94A3B8] hover:text-white" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
              <Link href="/blog" className="block text-sm text-[#94A3B8] hover:text-white" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
              <Link href="/auth/login" className="block w-full text-center px-4 py-2 bg-[#3B82F6] rounded-lg text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                {t('navSignIn')}
              </Link>
            </div>
          </div>
        )}
      </nav>
      {/* Spacer for fixed nav */}
      <div className="h-[73px]" />
    </>
  );
}
