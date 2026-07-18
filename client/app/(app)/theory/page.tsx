'use client';

import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Script from 'next/script';
import {
  BookMarked,
  BookOpen,
  Layers,
  HelpCircle,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  Wrench,
  Cpu,
  Shield,
  FileText,
  Sparkles,
  GraduationCap,
  CheckCircle2,
  ArrowUp,
  XCircle,
  Search,
  Clock,
  CheckCircle,
  Loader2,
  Share2,
} from 'lucide-react';
import { useLocale } from '@/src/contexts/LocaleContext';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

// ─── Types ────────────────────────────────────────────────

interface TheoryChapter {
  id: string;
  number: number;
  name: string;
  questionCount: number;
  theoryContent: string | null;
  hasTheory: boolean;
  tradeId: string;
}

interface TheoryCategory {
  id: string;
  code: string;
  name: string;
  description: string | null;
  country: string;
  licenseType: string;
  chapterCount: number;
  questionCount: number;
  chapters: TheoryChapter[];
}

type SectionColor = 'blue' | 'amber' | 'cyan' | 'purple';

const SECTION_STYLES: Record<SectionColor, { bg: string; border: string; text: string; bar: string; icon: React.ReactNode }> = {
  blue: {
    bg: 'bg-blue/10', border: 'border-blue/20', text: 'text-blue', bar: 'bg-blue',
    icon: <BookOpen size={20} />,
  },
  amber: {
    bg: 'bg-amber/10', border: 'border-amber/20', text: 'text-amber', bar: 'bg-amber',
    icon: <Wrench size={20} />,
  },
  cyan: {
    bg: 'bg-cyan/10', border: 'border-cyan/20', text: 'text-cyan', bar: 'bg-cyan',
    icon: <Cpu size={20} />,
  },
  purple: {
    bg: 'bg-purple/10', border: 'border-purple/20', text: 'text-purple', bar: 'bg-purple',
    icon: <Shield size={20} />,
  },
};

const COLOR_MAP: Record<SectionColor, string> = {
  blue: 'blue',
  amber: 'amber',
  cyan: 'cyan',
  purple: 'purple',
};

// ─── Simple Markdown Renderer ─────────────────────────────

function TheoryRenderer({ content, color }: { content: string; color: SectionColor }) {
  const segments = useMemo(() => {
    const lines = content.split('\n');
    const result: { type: string; content: string; level?: number }[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Headings
      const hMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
      if (hMatch) {
        result.push({ type: 'heading', level: hMatch[1].length, content: hMatch[2] });
        continue;
      }

      // Bullet points
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        result.push({ type: 'bullet', content: trimmed.slice(2).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') });
        continue;
      }

      // Numbered list
      if (trimmed.match(/^\d+\.\s+/)) {
        result.push({ type: 'numbered', content: trimmed.replace(/^\d+\.\s+/, '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') });
        continue;
      }

      // Regular paragraphs with inline formatting
      result.push({
        type: 'paragraph',
        content: trimmed
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.+?)\*/g, '<em>$1</em>'),
      });
    }
    return result;
  }, [content]);

  return (
    <div className="prose prose-sm max-w-none">
      {segments.map((seg, i) => {
        if (seg.type === 'heading') {
          const H = `h${Math.min(seg.level! + 1, 4)}` as keyof JSX.IntrinsicElements;
          const sizeClass = seg.level === 1 ? 'text-base font-bold mt-5 mb-2'
            : seg.level === 2 ? 'text-sm font-semibold mt-4 mb-2'
            : 'text-xs font-semibold mt-3 mb-1';
          return (
            <H key={i} className={`${sizeClass} text-text-primary`}>
              {seg.content}
            </H>
          );
        }
        if (seg.type === 'bullet') {
          return (
            <div key={i} className="flex items-start gap-2 text-sm text-text-secondary mb-1 ml-2">
              <span className={`w-1.5 h-1.5 rounded-full bg-${COLOR_MAP[color]}/50 shrink-0 mt-1.5`} />
              <span dangerouslySetInnerHTML={{ __html: seg.content }} />
            </div>
          );
        }
        if (seg.type === 'numbered') {
          return (
            <div key={i} className="flex items-start gap-2 text-sm text-text-secondary mb-1 ml-2">
              <span className={`text-xs font-medium text-${COLOR_MAP[color]} shrink-0 mt-0.5`}>{i + 1}.</span>
              <span dangerouslySetInnerHTML={{ __html: seg.content }} />
            </div>
          );
        }
        return (
          <p key={i} className="text-sm text-text-secondary leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: seg.content }} />
        );
      })}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────

function SkeletonPage() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="skeleton h-8 w-64 rounded mb-2" />
      <div className="skeleton h-4 w-96 rounded mb-6" />
      {[1, 2, 3].map((s) => (
        <div key={s} className="bg-card border border-border rounded-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="skeleton h-10 w-10 rounded-xl" />
            <div className="flex-1">
              <div className="skeleton h-5 w-48 rounded mb-1" />
              <div className="skeleton h-3 w-32 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3].map((c) => (
              <div key={c} className="skeleton h-20 rounded-card" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Chapter Section ──────────────────────────────────────

function ChapterSection({ chapter, color, preselected }: { chapter: TheoryChapter; color: SectionColor; preselected?: boolean }) {
  const [expanded, setExpanded] = useState(preselected || false);
  const headerRef = useRef<HTMLButtonElement>(null);
  const colors = SECTION_STYLES[color];
  const { t } = useLocale();
  const router = useRouter();

  const shareChapter = useCallback((ch: TheoryChapter) => {
    const url = `${window.location.origin}/theory?chapterId=${ch.id}`;
    const title = `${ch.number}. ${ch.name} | Metierium`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try { navigator.share({ title, url }); } catch {}
    } else {
      try { navigator.clipboard.writeText(url); } catch {}
    }
  }, []);

  // Ensure expanded opens when preselected — handles edge cases where useState
  // initial value might not pick up the prop due to timing
  useEffect(() => {
    if (preselected) {
      setExpanded(true);
    }
  }, [preselected]);

  useEffect(() => {
    if (preselected && headerRef.current) {
      setTimeout(() => {
        const rect = headerRef.current!.getBoundingClientRect();
        const navbarH = 64; // fixed navbar height
        window.scrollTo({ top: window.scrollY + rect.top - navbarH, behavior: 'smooth' });
      }, 600);
    }
  }, [preselected]);

  // Save expanded chapter to localStorage so we remember it on page return
  useEffect(() => {
    if (expanded) {
      try { localStorage.setItem('lastTheoryChapter', chapter.id); } catch {}
    } else {
      // Clear saved chapter when user closes it
      try {
        const saved = localStorage.getItem('lastTheoryChapter');
        if (saved === chapter.id) localStorage.removeItem('lastTheoryChapter');
      } catch {}
    }
  }, [expanded, chapter.id]);

  if (chapter.questionCount === 0 && !chapter.hasTheory) return null;

  return (
    <div className="bg-card border border-border rounded-card overflow-hidden">
      <button
        ref={headerRef}
        onClick={() => setExpanded(!expanded)}
        data-chapter-id={chapter.id}
        aria-expanded={expanded}
        className="w-full text-left px-4 py-3.5 flex items-center gap-3 hover:bg-hover/50 transition-colors"
      >
        <div className={`h-8 w-8 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
          <Layers size={14} className={colors.text} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary">
            {chapter.number}. {chapter.name}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-text-tertiary">
              {chapter.questionCount} {chapter.questionCount > 1 ? t('questions') : t('question')}
            </span>
            {chapter.hasTheory && (
              <>
                <span className="w-1 h-1 rounded-full bg-text-tertiary" />
                <span className="text-[10px] font-medium text-blue flex items-center gap-1">
                  <Sparkles size={10} />
                  {t('theoryAvailable')}
                </span>
              </>
            )}
          </div>
        </div>
        {expanded ? (
          <ChevronDown size={16} className="shrink-0 text-text-tertiary" />
        ) : (
          <ChevronRight size={16} className="shrink-0 text-text-tertiary" />
        )}
      </button>

      <AnimatePresence>
        {expanded && chapter.hasTheory && chapter.theoryContent && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-5 py-5">
              <TheoryRenderer content={chapter.theoryContent} color={color} />
              <div className="mt-4 flex items-center justify-start gap-2">
                <button
                  onClick={() => router.push(`/exams?tradeId=${chapter.tradeId}&chapterId=${chapter.id}`)}
                  className="flex items-center gap-1.5 text-xs font-medium text-green hover:text-green/80 transition-colors px-3 py-1.5 rounded-lg bg-green/10 hover:bg-green/20"
                >
                  <GraduationCap size={14} />
                  {t('testChapter')}
                </button>
                <button
                  onClick={() => shareChapter(chapter)}
                  className="flex items-center gap-1.5 text-xs font-medium text-blue hover:text-blue/80 transition-colors px-3 py-1.5 rounded-lg bg-blue/10 hover:bg-blue/20"
                >
                  <Share2 size={14} />
                  {t('share')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {expanded && !chapter.hasTheory && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-5 py-8 text-center">
              <FileText size={24} className="mx-auto text-text-tertiary mb-2" />
              <p className="text-sm text-text-secondary">
                {t('theoryInPreparation')}
              </p>
              <p className="text-xs text-text-tertiary mt-1">
                {t('theoryBasedOn', { count: chapter.questionCount })}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Category Card ────────────────────────────────────────

function CategoryCard({ category, preselectedChapterId, preselectedTradeCode }: { category: TheoryCategory; preselectedChapterId?: string; preselectedTradeCode?: string | null }) {
  const color = getSectionColor(category.code);
  const colors = SECTION_STYLES[color];
  const chaptersWithTheory = category.chapters.filter(ch => ch.hasTheory).length;
  const chaptersWithQuestions = category.chapters.filter(ch => ch.questionCount > 0).length;
  const { t } = useLocale();
  const hasPreselected = category.chapters.some(ch => ch.id === preselectedChapterId) || category.code === preselectedTradeCode;
  const [expanded, setExpanded] = useState(hasPreselected);

  const shareCategory = useCallback((cat: TheoryCategory) => {
    const slugMap: Record<string, string> = {
      CMEQ:'cmeq', CMMTQ:'cmmtq', QBQ:'qbq', HVAC:'hvac',
      MVL:'mvl', INCENDIE:'securite-incendie', FERBLAN:'ferblantier',
      BRIQUE:'briqueteur', OPEQUIP:'operateur-equipement-lourd',
      GAZ:'gaz', ASCEN:'ascenseurs', REFRIG:'refrigeration',
      CONSTR:'constructeur', ENTGEN:'entrepreneur-general',
      INSPECT:'inspecteur', SST:'coordonnateur-sst',
    };
    const slug = slugMap[cat.code] || cat.code.toLowerCase();
    const url = `${window.location.origin}/theory?trade=${slug}`;
    const title = `${cat.name} | Metierium`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try { navigator.share({ title, url }); } catch {}
    } else {
      try { navigator.clipboard.writeText(url); } catch {}
    }
  }, []);

  useEffect(() => {
    if (hasPreselected) {
      setExpanded(true);
      if (preselectedTradeCode && category.code === preselectedTradeCode) {
        setTimeout(() => {
          document.querySelector(`[data-category-id="${category.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
    }
  }, [hasPreselected]);

  return (
    <div
      data-category-id={category.id}
      className="bg-card border border-border rounded-card overflow-hidden transition-all duration-200 hover:border-blue/30">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5 flex items-start gap-4"
      >
        <div className={`h-10 w-10 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
          <span className={colors.text}>{colors.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-text-primary">{category.name}</h3>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border text-text-tertiary">
              {category.code}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); shareCategory(category); }}
              className="flex items-center gap-1 text-xs font-medium text-blue hover:text-blue/80 transition-colors px-2 py-1 rounded-lg bg-blue/10 hover:bg-blue/20 shrink-0 ml-auto"
              title={t('share')}
            >
              <Share2 size={12} />
              <span className="hidden sm:inline">{t('share')}</span>
            </button>
          </div>
          {category.description && (
            <p className="text-xs text-text-secondary line-clamp-1 mb-2">{category.description}</p>
          )}
          <div className="flex items-center gap-3 text-xs text-text-tertiary">
            <span className="flex items-center gap-1">
              <Layers size={12} className="text-amber" />
              {category.chapterCount} {category.chapterCount > 1 ? t('chapters') : t('chapter')}
            </span>
            {chaptersWithTheory > 0 && (
              <span className="flex items-center gap-1 text-blue">
                <Sparkles size={12} />
                {t('theoryProgress', { withTheory: chaptersWithTheory, total: chaptersWithQuestions })}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 mt-1" onClick={e => e.stopPropagation()}>
          {expanded ? (
            <ChevronDown size={18} className="shrink-0 text-text-tertiary" />
          ) : (
            <ChevronRight size={18} className="shrink-0 text-text-tertiary" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-5 py-4 space-y-3">
              {category.chapters.filter(ch => ch.questionCount > 0 || ch.hasTheory).length > 0 ? (
                category.chapters
                  .filter(ch => ch.questionCount > 0 || ch.hasTheory)
                  .map((ch) => (
                    <ChapterSection key={ch.id} chapter={ch} color={color} preselected={ch.id === preselectedChapterId} />
                  ))
              ) : (
                <div className="py-8 text-center">
                  <HelpCircle size={24} className="mx-auto text-text-tertiary mb-2" />
                  <p className="text-sm text-text-secondary">{t('noContent')}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getSectionColor(code: string): SectionColor {
  if (code.startsWith('M-')) return 'amber';
  if (code.startsWith('E-')) return 'cyan';
  if (code.startsWith('S-')) return 'purple';
  return 'blue';
}

// ─── Main Page ────────────────────────────────────────────

export default function TheoryPage() {
  const { t, locale } = useLocale();
  const [preselectedChapterId, setPreselectedChapterId] = useState<string | null>(null);
  const [preselectedTradeCode, setPreselectedTradeCode] = useState<string | null>(null);
  const [categories, setCategories] = useState<TheoryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔥 Read chapterId from URL in a useEffect that fires AFTER hydration.
  // This is the ONLY reliable way to get URL params in Next.js App Router:
  // - useState initializer is SSR'd → hydration ignores client initializer
  // - Module-level code runs once at import time, not on navigation
  // - useEffect fires after each render, so window.location.search is current
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chId = params.get('chapterId');
    if (chId) {
      setPreselectedChapterId(chId);
      // Also mirror to localStorage so the scroll/click backup can find it
      try { localStorage.setItem('lastTheoryChapter', chId); } catch {}
    }
  });

  // Map trade page slugs to trade codes
  const TRADE_SLUG_TO_CODE: Record<string, string> = {
    cmeq: 'CMEQ', cmmtq: 'CMMTQ', qbq: 'QBQ', hvac: 'HVAC',
    mvl: 'MVL', 'securite-incendie': 'INCENDIE', ferblantier: 'FERBLAN',
    briqueteur: 'BRIQUE', 'operateur-equipement-lourd': 'OPEQUIP',
    gaz: 'GAZ', ascenseurs: 'ASCEN', refrigeration: 'REFRIG',
    constructeur: 'CONSTR', 'entrepreneur-general': 'ENTGEN',
    inspecteur: 'INSPECT', 'coordonnateur-sst': 'SST',
  };

  const DESCRIPTION_EN: Record<string, string> = {
    CMEQ: 'Quebec Master Electricians Corporation — Certification exam preparation with full theory and practice exams.',
    CMMTQ: 'Quebec Plumbing Code and CSA B149 standards — Complete plumbing theory and exam prep.',
    QBQ: 'SMAW, GMAW, FCAW, GTAW welding — CSA W47.1 and W59 standards for Quebec certification.',
    HVAC: 'Heating, ventilation, and air conditioning — Quebec HVAC certification exam preparation.',
    MVL: 'Heavy vehicle mechanics — CCQ certification exam for trucks, buses and heavy machinery.',
    INCENDIE: 'Fire safety systems — RBQ certification exam preparation including alarms and sprinklers.',
    FERBLAN: 'Sheet metal work — CCQ certification with ductwork, roofing and architectural metal.',
    BRIQUE: 'Bricklaying and masonry — CCQ certification for brick, block, stone and mortar.',
    OPEQUIP: 'Heavy equipment operation — CCQ certification for excavators, bulldozers and graders.',
    GAZ: 'Gas fitting — RBQ certification for natural gas and propane installation and maintenance.',
    ASCEN: 'Elevator mechanics — RBQ certification with CSA elevator code and safety systems.',
    REFRIG: 'Refrigeration systems — RBQ certification for commercial and industrial refrigeration.',
    CONSTR: 'Builder-renovator — RBQ license preparation covering management, codes and safety.',
    ENTGEN: 'General contractor — RBQ certification exam for construction business management.',
    INSPECT: 'Building inspection — RBQ certification for building codes, structures and envelope inspection.',
    SST: 'Safety coordination — ASP Construction certification for workplace safety management.',
  };

  // Read chapterId from URL on every render — fires after hydration
  // and on every client-side navigation, always reading the current URL.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chId = params.get('chapterId');
    const tradeSlug = params.get('trade');
    const tradeIdRaw = params.get('tradeId');
    if (chId) {
      setPreselectedChapterId(chId);
      try { localStorage.setItem('lastTheoryChapter', chId); } catch {}
    } else if (!tradeSlug && !tradeIdRaw) {
      try {
        const saved = localStorage.getItem('lastTheoryChapter');
        if (saved) setPreselectedChapterId(saved);
      } catch {}
    } else {
      setPreselectedChapterId(null);
    }
    if (tradeSlug && TRADE_SLUG_TO_CODE[tradeSlug]) {
      setPreselectedTradeCode(TRADE_SLUG_TO_CODE[tradeSlug]);
    }
  });

  // Expand matching chapter via DOM click 500ms after data loads
  useEffect(() => {
    if (!preselectedChapterId || loading || categories.length === 0) return;
    for (const cat of categories) {
      const match = cat.chapters.find(ch => ch.id === preselectedChapterId);
      if (match) {
        setTimeout(() => {
          const el = document.querySelector(`[data-chapter-id="${preselectedChapterId}"]`) as HTMLElement | null;
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Only click if not already expanded (aria-expanded check)
            if (el.getAttribute('aria-expanded') !== 'true') {
              el.click();
            }
          }
        }, 500);
        break;
      }
    }
  }, [preselectedChapterId, loading, categories.length]);

  // Set page title
  useEffect(() => {
    document.title = `${t('theory')} | Metierium`;
  }, [t]);

  async function fetchTheory() {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // First, load all trades
      const tradesRes = await fetch(`${API_BASE}/api/trades?locale=${locale}`, { headers });
      if (!tradesRes.ok) throw new Error('Failed to load trades');
      const tradesData = await tradesRes.json();
      const trades = Array.isArray(tradesData) ? tradesData : tradesData.data ?? [];

      // Then load theory for each trade and group by category
      const allCategories: TheoryCategory[] = [];
      const seenCodes = new Set<string>();

      for (const trade of trades) {
        const theoryRes = await fetch(`${API_BASE}/api/theory?tradeId=${trade.id}&locale=${locale}`, { headers });
        if (!theoryRes.ok) continue;
        const theoryData = await theoryRes.json();
        const chapters: TheoryChapter[] = (theoryData.data || []).map((ch: any) => ({
          id: ch.id,
          number: ch.number,
          name: ch.name,
          questionCount: ch.questionCount || 0,
          theoryContent: ch.theoryContent || null,
          hasTheory: !!ch.theoryContent,
          tradeId: trade.id,
        }));

        if (chapters.length === 0) continue;

        allCategories.push({
          id: trade.id,
          code: trade.code,
          name: locale === 'fr' ? (trade.nameFr || trade.name) : trade.name,
          description: locale === 'fr' ? (trade.description || null) : (DESCRIPTION_EN[trade.code as keyof typeof DESCRIPTION_EN] || trade.description || null),
          country: 'CA',
          licenseType: trade.code,
          chapterCount: chapters.length,
          questionCount: chapters.reduce((s: number, ch: TheoryChapter) => s + ch.questionCount, 0),
          chapters,
        });
      }

      setCategories(allCategories);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTheory();
  }, [locale]); // eslint-disable-line react-hooks/exhaustive-deps

  const LICENSE_SECTIONS = [
    {
      key: 'common',
      title: t('licenseCommon'),
      subtitle: t('licenseCommonSub'),
      color: 'blue' as SectionColor,
      codeFilter: (code: string) => code.startsWith('TP14038E-'),
    },
    {
      key: 'm',
      title: t('licenseM'),
      subtitle: t('licenseMSub'),
      color: 'amber' as SectionColor,
      codeFilter: (code: string) => code.startsWith('M-'),
    },
    {
      key: 'e',
      title: t('licenseE'),
      subtitle: t('licenseESub'),
      color: 'cyan' as SectionColor,
      codeFilter: (code: string) => code.startsWith('E-'),
    },
    {
      key: 's',
      title: t('licenseS'),
      subtitle: t('licenseSSub'),
      color: 'purple' as SectionColor,
      codeFilter: (code: string) => code.startsWith('S-'),
    },
  ];

  const totalChapters = categories.reduce((sum, c) => sum + c.chapterCount, 0);

  return (
    <div className="animate-fade-in space-y-8">
      {/* JSON-LD Article Schema */}
      <Script id="theory-jsonld" type="application/ld+json" strategy="afterInteractive">{`
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Théorie — Metierium",
          "description": "Contenu théorique pour la préparation aux examens de métiers au Québec — CMEQ, CMMTQ, QBQ",
          "itemListElement": [
            {
              "@type": "Article",
              "name": "Préparation Examen CMEQ — Électricien",
              "description": "10 chapitres de théorie sur le Code de construction du Québec, chapitre V — Électricité",
              "author": { "@type": "Organization", "name": "Metierium" }
            },
            {
              "@type": "Article",
              "name": "Préparation Examen CMMTQ — Plombier",
              "description": "8 chapitres sur la plomberie, le Code de plomberie et les normes CSA B149",
              "author": { "@type": "Organization", "name": "Metierium" }
            },
            {
              "@type": "Article",
              "name": "Préparation Examen QBQ — Soudeur",
              "description": "8 chapitres sur le soudage SMAW, GMAW, FCAW, GTAW et les normes CSA",
              "author": { "@type": "Organization", "name": "Metierium" }
            }
          ]
        }
      `}</Script>
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue/20 to-purple/20 flex items-center justify-center">
            <GraduationCap size={22} className="text-blue" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">{t('theory')}</h1>
            <p className="text-sm text-text-secondary">
              {t('theorySubtitle')}
            </p>
          </div>
        </div>
        {!loading && categories.length > 0 && (
          <div className="flex items-center gap-4 mt-3 text-xs text-text-tertiary">
            <span>{categories.length} {t('categories')}</span>
            <span className="w-1 h-1 rounded-full bg-text-tertiary" />
            <span>{totalChapters} {t('chapters')}</span>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red/10 border border-red/20 rounded-card text-sm text-red">
          <AlertCircle size={16} />
          {error}
          <button onClick={fetchTheory} className="ml-auto underline hover:no-underline text-text-secondary hover:text-text-primary">
            <RefreshCw size={14} className="inline mr-1" />
            {t('retry')}
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && <SkeletonPage />}

      {/* Empty */}
      {!loading && !error && categories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center mb-4">
            <BookMarked size={24} className="text-text-tertiary" />
          </div>
          <h2 className="text-lg font-medium text-text-primary mb-1">{t('theoryEmptyTitle')}</h2>
          <p className="text-sm text-text-secondary max-w-sm text-center">
            {t('theoryEmptyDesc')}
          </p>
        </div>
      )}

      {/* Sections */}
      {!loading && categories.length > 0 && (
        <div className="space-y-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} preselectedChapterId={preselectedChapterId || undefined} preselectedTradeCode={preselectedTradeCode} />
          ))}
        </div>
      )}
    </div>
  );
}
