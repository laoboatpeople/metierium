'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { BookOpen, HelpCircle, ChevronRight, ArrowLeft, FileText, Zap } from 'lucide-react';
import { useLocale } from '@/src/contexts/LocaleContext';

const TRADES: Record<string, { name: string; descKey: string; color: string; faqTrade?: string }> = {
  cmeq: { name: 'CMEQ', descKey: 'tradePageCmeqDesc', color: '#3B82F6' },
  cmmtq: { name: 'CMMTQ', descKey: 'tradePageCmmtqDesc', color: '#06B6D4' },
  qbq: { name: 'QBQ', descKey: 'tradePageQbqDesc', color: '#8B5CF6' },
  hvac: { name: 'CMMTQ', descKey: 'tradePageHvacDesc', color: '#F59E0B' },
  mvl: { name: 'CCQ', descKey: 'tradePageMvlDesc', color: '#10B981' },
  'securite-incendie': { name: 'RBQ', descKey: 'tradePageIncendieDesc', color: '#EF4444', faqTrade: 'INCENDIE' },
  ferblantier: { name: 'CCQ', descKey: 'tradePageFerblantierDesc', color: '#8B5CF6', faqTrade: 'FERBLAN' },
  briqueteur: { name: 'CCQ', descKey: 'tradePageBriqueteurDesc', color: '#F59E0B', faqTrade: 'BRIQUE' },
  'operateur-equipement-lourd': { name: 'CCQ', descKey: 'tradePageOpEquipDesc', color: '#06B6D4', faqTrade: 'OPEQUIP' },
  gaz: { name: 'RBQ', descKey: 'tradePageGazDesc', color: '#F59E0B' },
  ascenseurs: { name: 'RBQ', descKey: 'tradePageAscenseursDesc', color: '#10B981', faqTrade: 'ASCEN' },
  refrigeration: { name: 'RBQ', descKey: 'tradePageRefrigDesc', color: '#0E7490', faqTrade: 'REFRIG' },
  constructeur: { name: 'RBQ', descKey: 'tradePageConstrDesc', color: '#7C3AED', faqTrade: 'CONSTR' },
  'entrepreneur-general': { name: 'RBQ', descKey: 'tradePageEntgenDesc', color: '#4F46E5', faqTrade: 'ENTGEN' },
  inspecteur: { name: 'RBQ', descKey: 'tradePageInspectDesc', color: '#0E7490', faqTrade: 'INSPECT' },
  'coordonnateur-sst': { name: 'ASP Const.', descKey: 'tradePageSstDesc', color: '#DC2626', faqTrade: 'SST' },
};

export default function TradePillarPage() {
  const { t, locale } = useLocale();
  const params = useParams();
  const slug = params?.slug as string;
  const tradeRaw = TRADES[slug];
  const trade = tradeRaw ? { ...tradeRaw, desc: t(tradeRaw.descKey) } : undefined;
  const [faqEntries, setFaqEntries] = useState<any[]>([]);

  useEffect(() => {
    if (slug) {
      const currentLocale = locale || 'fr';
      fetch('/faq-data.json')
        .then(r => r.json())
        .then((data: any[]) => setFaqEntries(data.filter(e => {
          const faqTrade = e.trade?.toLowerCase();
          const targetTrade = (trade?.faqTrade || slug).toLowerCase();
          return faqTrade === targetTrade && (!e.locale || e.locale === currentLocale);
        })))
        .catch(() => {});
    }
  }, [slug, locale]);

  if (!trade) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
        <p className="text-[#94A3B8]">{t('tradePageNotFound')}</p>
      </div>
    );
  }

  const categories = [...new Set(faqEntries.map((e: any) => e.category))];
  const faqByCat = categories.reduce((acc, cat) => {
    acc[cat] = faqEntries.filter((e: any) => e.category === cat);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <Script id="pillar-schema" type="application/ld+json" strategy="afterInteractive">{`
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "${trade.name} — Metierium",
          "description": "${t('tradePageSchemaDesc', { name: trade.name })}",
          "about": { "@type": "Course", "name": "${t('tradePageSchemaAbout', { name: trade.name })}" }
        }
      `}</Script>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-xs text-[#64748B] mb-6">
          <Link href="/" className="hover:text-[#3B82F6]">{t('faqHome')}</Link>
          <ChevronRight size={12} />
          <span className="text-[#94A3B8]">{trade.name}</span>
        </nav>

        {/* Hero */}
        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${trade.color}20` }}>
              <Zap size={20} style={{ color: trade.color }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#F8FAFC]">{trade.name}</h1>
              <p className="text-sm text-[#94A3B8]">{trade.desc}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <Link href="/exams" className="bg-[#111827] rounded-lg p-3 text-center hover:border-[#3B82F6]/30 border border-[#2D3A52]">
              <BookOpen size={18} className="mx-auto mb-1" style={{ color: trade.color }} />
              <p className="text-xs text-[#F8FAFC] font-medium">{t('exams')}</p>
              <p className="text-[10px] text-[#64748B]">{t('tradePageExamsSubtitle')}</p>
            </Link>
            <Link href="/theory" className="bg-[#111827] rounded-lg p-3 text-center hover:border-[#3B82F6]/30 border border-[#2D3A52]">
              <FileText size={18} className="mx-auto mb-1" style={{ color: trade.color }} />
              <p className="text-xs text-[#F8FAFC] font-medium">{t('theory')}</p>
              <p className="text-[10px] text-[#64748B]">{t('tradePageTheorySubtitle')}</p>
            </Link>
            <Link href={`/faq?trade=${trade.name}`} className="bg-[#111827] rounded-lg p-3 text-center hover:border-[#3B82F6]/30 border border-[#2D3A52]">
              <HelpCircle size={18} className="mx-auto mb-1" style={{ color: trade.color }} />
              <p className="text-xs text-[#F8FAFC] font-medium">{t('faqLabel')}</p>
              <p className="text-[10px] text-[#64748B]">{t('tradePageFaqSubtitle', { count: faqEntries.length })}</p>
            </Link>
          </div>
        </div>

        {/* FAQ by category */}
        {Object.entries(faqByCat).map(([cat, items]) => (
          <div key={cat} className="mb-6">
            <h2 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">{cat}</h2>
            <div className="space-y-2">
              {items.map((item: any) => (
                <Link
                  key={item.slug}
                  href={`/faq/${item.slug}`}
                  className="block bg-[#1A2035] border border-[#2D3A52] rounded-xl p-3 hover:border-[#3B82F6]/30 transition-all"
                >
                  <p className="text-sm text-[#F8FAFC]">{item.question}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#3B82F6]/10 to-[#06B6D4]/10 border border-[#3B82F6]/20 rounded-xl p-6 text-center mt-8">
          <h2 className="text-lg font-semibold text-[#F8FAFC] mb-2">{t('tradePageCtaTitle', { name: trade.name })}</h2>
          <p className="text-sm text-[#94A3B8] mb-4">{t('tradePageCtaDesc')}</p>
          <Link href="/exams" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] rounded-lg text-white font-medium">
            {t('tradePageCtaButton')} <ArrowLeft size={14} className="rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
