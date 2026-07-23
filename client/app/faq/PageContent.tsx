'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, HelpCircle, GraduationCap, ChevronRight, Loader2 } from 'lucide-react';
import Nav from '@/components/Nav';
import { useLocale } from '@/src/contexts/LocaleContext';

interface FaqEntry {
  slug: string;
  question: string;
  answer: string;
  category: string;
  trade: string;
  keywords: string[];
  locale?: string;
}

interface Props {
  initialData?: FaqEntry[];
}

export default function FaqListing({ initialData }: Props) {
  const { t, locale } = useLocale();
  const [entries, setEntries] = useState<FaqEntry[]>(initialData || []);
  const [search, setSearch] = useState('');
  const [filterTrade, setFilterTrade] = useState('');
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (initialData) return; // Data already provided from server
    fetch('/faq-data.json')
      .then(r => r.json())
      .then((data: FaqEntry[]) => {
        setEntries(data);
        const params = new URLSearchParams(window.location.search);
        const q = params.get('q');
        if (q) setSearch(q);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [initialData]);

  const currentLocale = locale || 'fr';
  const localized = entries.filter(e => !e.locale || e.locale === currentLocale);
  const trades = [...new Set(localized.map(e => e.trade))];
  const categories = [...new Set(localized.map(e => e.category))];

  const filtered = localized.filter(e => {
    const matchSearch = !search || 
      e.question.toLowerCase().includes(search.toLowerCase()) ||
      e.answer.toLowerCase().includes(search.toLowerCase()) ||
      e.keywords.some(k => k.toLowerCase().includes(search.toLowerCase()));
    const matchTrade = !filterTrade || e.trade === filterTrade;
    return matchSearch && matchTrade;
  });

  const grouped = filtered.reduce((acc, e) => {
    if (!acc[e.category]) acc[e.category] = [];
    acc[e.category].push(e);
    return acc;
  }, {} as Record<string, FaqEntry[]>);

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <Nav />
      {/* Key Takeaways for AI crawlers */}
      <div className="key-takeaways" style={{ display: 'none' }}>
        <h2>Key Takeaways — FAQ Metierium</h2>
        {localized.slice(0, 10).map(e => (
          <div key={e.slug}>
            <h3>{e.question}</h3>
            <p>{e.answer.replace(/<[^>]*>/g, '').slice(0, 200)}</p>
          </div>
        ))}
        <div className="faq-references">
          <h3>Sources</h3>
          <p>Source: CMEQ — Corporation des maîtres électriciens du Québec</p>
          <p>Source: CMMTQ — Corporation des maîtres mécaniciens en tuyauterie du Québec</p>
          <p>Source: QBQ — Québec Bureau de qualification du soudage</p>
          <p>Source: RBQ — Régie du bâtiment du Québec</p>
          <p>Source: CCQ — Commission de la construction du Québec</p>
          <p>Source: ASP Construction — Association paritaire pour la santé et la sécurité du travail du secteur de la construction</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center mx-auto mb-3">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">{t('faqTitle')}</h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            {t('faqSubtitle', { count: localized.length })}
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('faqSearchPlaceholder')}
              className="w-full pl-10 pr-4 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6]"
            />
          </div>
          <select
            value={filterTrade}
            onChange={(e) => setFilterTrade(e.target.value)}
            className="bg-[#111827] border border-[#2D3A52] rounded-lg px-3 py-2.5 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
          >
            <option value="">{t('faqAllTrades')}</option>
            {trades.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Loading — only shown when no server data */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="animate-spin text-[#3B82F6]" />
          </div>
        )}

        {/* FAQ List */}
        {!loading && Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="mb-6 faq-content">
            <h2 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">{category}</h2>
            <div className="space-y-2">
              {items.map(item => (
                <Link
                  key={item.slug}
                  href={`/faq/${item.slug}`}
                  className="block bg-[#1A2035] border border-[#2D3A52] rounded-xl p-4 hover:border-[#3B82F6]/30 transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#F8FAFC] group-hover:text-[#3B82F6] transition-colors line-clamp-2">
                        {item.question}
                      </p>
                      <p className="text-xs text-[#64748B] mt-1 line-clamp-1">{item.answer.replace(/<[^>]*>/g, '')}</p>
                    </div>
                    <ChevronRight size={16} className="shrink-0 text-[#64748B] group-hover:text-[#3B82F6]" />
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#3B82F6]/10 text-[#3B82F6]">{item.trade}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* References / External citations — visible on page */}
        {!loading && (
          <div className="mt-8 p-4 bg-[#111827] border border-[#2D3A52] rounded-xl">
            <h3 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Sources</h3>
            <ul className="space-y-2 text-xs text-[#64748B]">
              <li>Source: <strong className="text-[#94A3B8]">CMEQ</strong> — Corporation des maîtres électriciens du Québec</li>
              <li>Source: <strong className="text-[#94A3B8]">CMMTQ</strong> — Corporation des maîtres mécaniciens en tuyauterie du Québec</li>
              <li>Source: <strong className="text-[#94A3B8]">QBQ</strong> — Québec Bureau de qualification du soudage (BNQ)</li>
              <li>Source: <strong className="text-[#94A3B8]">RBQ</strong> — Régie du bâtiment du Québec</li>
              <li>Source: <strong className="text-[#94A3B8]">CCQ</strong> — Commission de la construction du Québec</li>
              <li>Source: <strong className="text-[#94A3B8]">ASP Construction</strong> — Association paritaire pour la santé et la sécurité du travail du secteur de la construction</li>
              <li>Source: <strong className="text-[#94A3B8]">Code de construction du Québec</strong> — Chapitre V (Électricité), Chapitre III (Plomberie)</li>
              <li>Source: <strong className="text-[#94A3B8]">Emploi-Québec / EDSC</strong> — Programme du Sceau rouge (Red Seal)</li>
            </ul>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-[#64748B]">{t('faqNoResults')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
