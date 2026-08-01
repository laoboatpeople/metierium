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
  SearchX,
  X,
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

const inline = (s: string) =>
  s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');

function TheoryRenderer({ content, color }: { content: string; color: SectionColor }) {
  const segments = useMemo(() => {
    const lines = content.split('\n');
    const result: { type: string; content: string; level?: number; table?: { header: string[]; body: string[][] } }[] = [];

    let svgBuffer: string[] | null = null;
    let codeBuffer: string[] | null = null;
    let tableBuffer: string[] | null = null;

    const flushTable = () => {
      if (tableBuffer && tableBuffer.length > 0) {
        const rows = tableBuffer
          .map(r => r.trim())
          .filter(r => r.startsWith('|'))
          .map(r => r.replace(/^\|/, '').replace(/\|\s*$/, '').split('|').map(c => c.trim()));
        const sepIdx = rows.findIndex(r => r.length > 0 && r.every(c => /^:?-{2,}:?$/.test(c)));
        if (sepIdx > 0) {
          result.push({
            type: 'table',
            content: '',
            table: { header: rows[sepIdx - 1], body: rows.slice(sepIdx + 1) },
          });
        } else if (rows.length > 0) {
          // Malformed table (no separator) — fall back to paragraphs
          rows.forEach(r => result.push({ type: 'paragraph', content: inline(r.join(' | ')) }));
        }
      }
      tableBuffer = null;
    };

    for (const line of lines) {
      const trimmed = line.trim();

      // Table row accumulation (consecutive | ... | lines)
      const isTableRow = trimmed.startsWith('|');
      if (tableBuffer !== null) {
        if (isTableRow) {
          tableBuffer.push(trimmed);
          continue;
        }
        flushTable();
        // fall through to process the current non-table line
      }
      if (isTableRow) {
        tableBuffer = [trimmed];
        continue;
      }

      // Fenced code block accumulation (``` ... ```)
      if (codeBuffer !== null) {
        if (trimmed.startsWith('```')) {
          result.push({ type: 'code', content: codeBuffer.join('\n') });
          codeBuffer = null;
        } else {
          codeBuffer.push(line);
        }
        continue;
      }
      if (trimmed.startsWith('```')) {
        codeBuffer = [];
        continue;
      }

      // SVG block accumulation (multi-line <svg>...</svg>)
      if (svgBuffer !== null) {
        svgBuffer.push(line);
        if (trimmed.includes('</svg>')) {
          result.push({ type: 'svg', content: svgBuffer.join('\n') });
          svgBuffer = null;
        }
        continue;
      }
      if (trimmed.startsWith('<svg')) {
        svgBuffer = [line];
        if (trimmed.includes('</svg>')) {
          result.push({ type: 'svg', content: svgBuffer.join('\n') });
          svgBuffer = null;
        }
        continue;
      }

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
    flushTable();
    return result;
  }, [content]);

  return (
    <div className="prose prose-sm prose-invert max-w-none">
      {segments.map((seg, i) => {
        if (seg.type === 'svg') {
          return (
            <div key={i} className="my-4 overflow-x-auto rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="mx-auto max-w-full [&_svg]:h-auto [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: seg.content }} />
            </div>
          );
        }
        if (seg.type === 'code') {
          return (
            <pre key={i} className="my-3 overflow-x-auto rounded-lg border border-[#2D3A52] bg-[#111827] px-4 py-3 text-xs leading-relaxed text-[#E2E8F0]">
              <code className="font-mono">{seg.content}</code>
            </pre>
          );
        }
        if (seg.type === 'table' && seg.table) {
          const { header, body } = seg.table;
          return (
            <div key={i} className="my-4 overflow-x-auto rounded-xl border border-[#2D3A52] bg-[#111827]">
              <table className="w-full min-w-max border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#2D3A52] bg-[#1A2035]">
                    {header.map((h, j) => (
                      <th key={j} className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#F8FAFC]">
                        <span dangerouslySetInnerHTML={{ __html: inline(h) }} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {body.map((row, j) => (
                    <tr key={j} className="border-b border-[#2D3A52]/50 last:border-b-0 transition-colors hover:bg-[#1A2035]/60">
                      {row.map((cell, k) => (
                        <td key={k} className="px-4 py-2 text-[#94A3B8]">
                          <span dangerouslySetInnerHTML={{ __html: inline(cell) }} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
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

function ChapterSection({ chapter, color, preselected, onContentLoaded }: {
  chapter: TheoryChapter;
  color: SectionColor;
  preselected?: boolean;
  /** Called once the chapter's theory content has been loaded (feeds the search index). */
  onContentLoaded?: (chapterId: string, content: string) => void;
}) {
  const [expanded, setExpanded] = useState(() => {
    if (preselected) return true;
    try {
      return typeof window !== 'undefined' &&
        localStorage.getItem('lastTheoryChapter') === chapter.id;
    } catch { return false; }
  });
  const { locale } = useLocale();
  // Lazy-loaded theory content. Starts from whatever the parent already has
  // (usually null after the lightweight outline load) and is fetched on
  // demand the first time the chapter is expanded.
  const [content, setContent] = useState<string | null>(chapter.theoryContent);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState(false);
  const [retryNonce, setRetryNonce] = useState(0);
  const headerRef = useRef<HTMLButtonElement>(null);
  // Refs mirror content/contentLoading so the lazy-load effect can guard
  // against re-entry WITHOUT listing them as dependencies (which would
  // re-trigger the effect and cancel the in-flight fetch via cleanup).
  const contentRef = useRef<string | null>(chapter.theoryContent);
  const loadingRef = useRef(false);
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

  // ── Lazy on-demand load of the theory content ───────────
  // Fires the first time the chapter is expanded and its content isn't
  // already in memory. Cached in local state so re-expanding is instant.
  //
  // IMPORTANT: the guard reads contentRef/loadingRef (refs), NOT the state
  // values, and the dependency array deliberately EXCLUDES content and
  // contentLoading. If they were dependencies, setting contentLoading=true
  // would re-run this effect, its cleanup would set cancelled=true and KILL
  // the in-flight fetch, leaving the spinner spinning forever.
  useEffect(() => {
    if (!expanded || !chapter.hasTheory) return;
    if (contentRef.current !== null || loadingRef.current) return;
    let cancelled = false;
    loadingRef.current = true;
    setContentLoading(true);
    setContentError(false);
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(`${API_BASE}/api/theory/${chapter.id}/content?locale=${locale}`, { headers });
        if (!res.ok) throw new Error('Failed to load chapter');
        const json = await res.json();
        const text: string | null = json?.data?.theoryContent ?? null;
        if (cancelled) return;
        contentRef.current = text;
        setContent(text);
        if (text) onContentLoaded?.(chapter.id, text);
      } catch {
        if (!cancelled) setContentError(true);
      } finally {
        loadingRef.current = false;
        if (!cancelled) setContentLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [expanded, chapter.hasTheory, chapter.id, locale, onContentLoaded, retryNonce]);

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

      {/* Loading spinner while the chapter content is fetched on demand */}
      <AnimatePresence>
        {expanded && chapter.hasTheory && contentLoading && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-5 py-8 flex flex-col items-center justify-center gap-2">
              <Loader2 size={22} className="animate-spin text-blue" />
              <p className="text-xs text-text-tertiary">{t('theoryLoading')}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state with retry */}
      <AnimatePresence>
        {expanded && chapter.hasTheory && !contentLoading && contentError && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-5 py-6 flex flex-col items-center justify-center gap-2">
              <AlertCircle size={20} className="text-red" />
              <p className="text-xs text-text-secondary">{t('theoryLoadError')}</p>
              <button
                onClick={() => { setContent(null); setContentError(false); setRetryNonce(n => n + 1); }}
                className="flex items-center gap-1.5 text-xs font-medium text-blue hover:text-blue/80 transition-colors px-3 py-1.5 rounded-lg bg-blue/10 hover:bg-blue/20"
              >
                <RefreshCw size={12} />
                {t('retry')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {expanded && chapter.hasTheory && !contentLoading && !contentError && content && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-5 py-5">
              <TheoryRenderer content={content} color={color} />
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

function CategoryCard({ category, preselectedChapterId, preselectedTradeCode, onChapterContentLoaded }: { category: TheoryCategory; preselectedChapterId?: string; preselectedTradeCode?: string | null; onChapterContentLoaded?: (chapterId: string, content: string) => void }) {
  const color = getSectionColor(category.code);
  const colors = SECTION_STYLES[color];
  const chaptersWithTheory = category.chapters.filter(ch => ch.hasTheory).length;
  const chaptersWithQuestions = category.chapters.filter(ch => ch.questionCount > 0).length;
  const { t } = useLocale();
  const chFromUrl = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('chapterId') || undefined
    : undefined;
  const effectiveChId = chFromUrl || preselectedChapterId;
  const hasPreselected = category.chapters.some(ch => ch.id === effectiveChId) || category.code === preselectedTradeCode;
  const [expanded, setExpanded] = useState(hasPreselected);

  const shareCategory = useCallback((cat: TheoryCategory) => {
    const slugMap: Record<string, string> = {
      CMEQ:'cmeq', CMMTQ:'cmmtq', QBQ:'qbq', HVAC:'hvac',
      MVL:'mvl', INCENDIE:'securite-incendie', FERBLAN:'ferblantier',
      BRIQUE:'briqueteur', OPEQUIP:'operateur-equipement-lourd',
      GAZ:'gaz', ASCEN:'ascenseurs', REFRIG:'refrigeration',
      CONSTR:'constructeur', ENTGEN:'entrepreneur-general',
      INSPECT:'inspecteur', SST:'coordonnateur-sst',
      GESTRAV:'gestion-travaux',
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
                    <ChapterSection key={ch.id} chapter={ch} color={color} preselected={ch.id === effectiveChId} onContentLoaded={onChapterContentLoaded} />
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

// ─── Full-text search ─────────────────────────────────────

/** Lowercase + strip accents so "generatrice" matches "génératrice". */
function normalizeText(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

interface SearchResult {
  chapter: TheoryChapter;
  category: TheoryCategory;
  score: number;
  /** Raw snippet around the first content match (null for name-only matches). */
  snippet: string | null;
  snippetStart: number;
}

/**
 * Build a ~120-char window around the FIRST occurrence of `normQuery`
 * inside the normalized content, snapped to word boundaries.
 */
function extractSnippet(normContent: string, rawContent: string, normQuery: string): { snippet: string; start: number } | null {
  const idx = normContent.indexOf(normQuery);
  if (idx === -1) return null;
  const matchEnd = idx + normQuery.length;
  let start = Math.max(0, idx - 45);
  let end = Math.min(rawContent.length, matchEnd + 75);
  // Snap to word boundaries for cleaner snippets
  if (start > 0) {
    while (start < idx && !/\s/.test(rawContent[start])) start++;
    while (start < idx && /\s/.test(rawContent[start])) start++;
  } else {
    start = 0;
  }
  while (end < rawContent.length && !/\s/.test(rawContent[end - 1])) end++;
  return { snippet: rawContent.slice(start, end).replace(/\s+/g, ' ').trim(), start };
}

/**
 * Client-side full-text search over every chapter of every category.
 * Ranking: chapter name > category name/code > theory content.
 * `contentIndex` maps chapterId -> theoryContent (loaded on demand).
 */
function searchTheory(categories: TheoryCategory[], query: string, contentIndex: Map<string, string>): SearchResult[] {
  const normQuery = normalizeText(query.trim());
  if (normQuery.length < 2) return [];
  const results: SearchResult[] = [];
  for (const category of categories) {
    const normCatName = normalizeText(category.name);
    const normCatCode = normalizeText(category.code);
    for (const chapter of category.chapters) {
      if (chapter.questionCount === 0 && !chapter.hasTheory) continue;
      const normChName = normalizeText(chapter.name);
      let score = 0;
      if (normChName.includes(normQuery)) {
        score = normChName.startsWith(normQuery) ? 100 : 90; // chapter name match
      } else if (normCatName.includes(normQuery) || normCatCode === normQuery) {
        score = 60; // category match
      } else {
        const theoryContent = contentIndex.get(chapter.id);
        if (theoryContent) {
          const normContent = normalizeText(theoryContent);
          const hit = extractSnippet(normContent, theoryContent, normQuery);
          if (hit) score = 30; // content match
          if (score > 0) {
            results.push({ chapter, category, score, snippet: hit!.snippet, snippetStart: hit!.start });
            continue;
          }
        }
      }
      if (score > 0) {
        results.push({ chapter, category, score, snippet: null, snippetStart: 0 });
      }
    }
  }
  return results.sort((a, b) => b.score - a.score || a.chapter.number - b.chapter.number);
}

/** Snippet text with every occurrence of the query highlighted (accent-insensitive). */
function HighlightedSnippet({ text, query }: { text: string; query: string }) {
  const parts = useMemo(() => {
    const normText = normalizeText(text);
    const normQuery = normalizeText(query.trim());
    if (!normQuery) return [{ text, hit: false }];
    const out: { text: string; hit: boolean }[] = [];
    let cursor = 0;
    let idx = normText.indexOf(normQuery);
    while (idx !== -1) {
      if (idx > cursor) out.push({ text: text.slice(cursor, idx), hit: false });
      out.push({ text: text.slice(idx, idx + normQuery.length), hit: true });
      cursor = idx + normQuery.length;
      idx = normText.indexOf(normQuery, cursor);
    }
    if (cursor < text.length) out.push({ text: text.slice(cursor), hit: false });
    return out.length > 0 ? out : [{ text, hit: false }];
  }, [text, query]);

  return (
    <>
      {parts.map((p, i) =>
        p.hit ? (
          <mark key={i} className="bg-amber/20 text-amber rounded px-0.5 font-medium">
            {p.text}
          </mark>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────

export default function TheoryPage() {
  const { t, locale } = useLocale();
  const [preselectedChapterId, setPreselectedChapterId] = useState<string | null>(null);
  const [preselectedTradeCode, setPreselectedTradeCode] = useState<string | null>(null);
  const [categories, setCategories] = useState<TheoryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Read chapterId from URL first, fall back to localStorage.
  // URL = direct links (Discord, share). localStorage = dashboard navigation.
  // [] deps — runs once on mount after hydration
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const chId = params.get('chapterId');
      if (chId) {
        setPreselectedChapterId(chId);
        localStorage.setItem('lastTheoryChapter', chId);
      } else {
        const saved = localStorage.getItem('lastTheoryChapter');
        if (saved) setPreselectedChapterId(saved);
      }
    } catch {}
  }, []);

  // Map trade page slugs to trade codes
  const TRADE_SLUG_TO_CODE: Record<string, string> = {
    cmeq: 'CMEQ', cmmtq: 'CMMTQ', qbq: 'QBQ', hvac: 'HVAC',
    mvl: 'MVL', 'securite-incendie': 'INCENDIE', ferblantier: 'FERBLAN',
    briqueteur: 'BRIQUE', 'operateur-equipement-lourd': 'OPEQUIP',
    gaz: 'GAZ', ascenseurs: 'ASCEN', refrigeration: 'REFRIG',
    constructeur: 'CONSTR', 'entrepreneur-general': 'ENTGEN',
    inspecteur: 'INSPECT', 'coordonnateur-sst': 'SST',
    'gestion-travaux': 'GESTRAV', gestrav: 'GESTRAV',
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
    GESTRAV: 'Construction project management — RBQ exam covering estimation, planning, workforce, legal framework, OHS, contracts, finances and project closeout.',
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

  // ─── Full-text search state ─────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ─── On-demand search index ─────────────────────────────
  // The heavy theory content is NOT loaded with the page anymore. When the
  // user starts typing a search, we fetch all content once and build an
  // index (chapterId -> content). Chapters expanded by the user also feed
  // this index incrementally via onChapterContentLoaded.
  const searchActive = debouncedQuery.trim().length >= 2;

  const [contentIndex, setContentIndex] = useState<Map<string, string>>(() => new Map());
  const [searchIndexLoading, setSearchIndexLoading] = useState(false);
  const searchIndexLoadedRef = useRef(false);

  // Feed the index whenever a chapter's content is lazy-loaded by expansion.
  const handleChapterContentLoaded = useCallback((chapterId: string, content: string) => {
    setContentIndex(prev => {
      if (prev.has(chapterId)) return prev;
      const next = new Map(prev);
      next.set(chapterId, content);
      return next;
    });
  }, []);

  // Load the full content index the first time a search query becomes active.
  useEffect(() => {
    if (!searchActive || searchIndexLoadedRef.current || searchIndexLoading) return;
    let cancelled = false;
    setSearchIndexLoading(true);
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(`${API_BASE}/api/theory/all-content?locale=${locale}`, { headers });
        if (!res.ok) throw new Error('Failed to load search index');
        const json = await res.json();
        const rows: any[] = json?.data || [];
        if (cancelled) return;
        setContentIndex(prev => {
          const next = new Map(prev);
          for (const row of rows) {
            if (row.theoryContent && !next.has(row.id)) next.set(row.id, row.theoryContent);
          }
          return next;
        });
        searchIndexLoadedRef.current = true;
      } catch {
        // Index load failed — name/category search still works.
      } finally {
        if (!cancelled) setSearchIndexLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [searchActive, searchIndexLoading, locale]);

  // Debounce input ~200ms before running the search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // "/" anywhere on the page focuses the search (unless already typing)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      e.preventDefault();
      searchInputRef.current?.focus();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const searchResults = useMemo(
    () => (searchActive ? searchTheory(categories, debouncedQuery, contentIndex) : []),
    [categories, debouncedQuery, searchActive, contentIndex]
  );

  // Jump from a search result to its chapter: clear search, expand the
  // category + chapter, scroll to it — reuses the preselectedChapterId
  // mechanism (the effect at lines ~566 clicks [data-chapter-id]).
  const jumpToResult = useCallback((result: SearchResult) => {
    setSearchQuery('');
    setDebouncedQuery('');
    setPreselectedTradeCode(null);
    setPreselectedChapterId(result.chapter.id);
    try { localStorage.setItem('lastTheoryChapter', result.chapter.id); } catch {}
    // Categories re-render after the state update; give the DOM a tick
    // before looking up the chapter element to expand + scroll.
    setTimeout(() => {
      const el = document.querySelector(`[data-chapter-id="${result.chapter.id}"]`) as HTMLElement | null;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (el.getAttribute('aria-expanded') !== 'true') {
          el.click();
        }
      }
    }, 150);
  }, []);

  async function fetchTheory() {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // First, load all trades (lightweight metadata)
      const tradesRes = await fetch(`${API_BASE}/api/trades?locale=${locale}`, { headers });
      if (!tradesRes.ok) throw new Error('Failed to load trades');
      const tradesData = await tradesRes.json();
      const trades = Array.isArray(tradesData) ? tradesData : tradesData.data ?? [];

      // Then load the chapter OUTLINE (metadata only — NO theory content).
      // The heavy theoryContent is fetched per-chapter on demand when the
      // user expands a chapter, keeping the initial page load fast.
      const outlineRes = await fetch(`${API_BASE}/api/theory/outline?locale=${locale}`, { headers });
      if (!outlineRes.ok) throw new Error('Failed to load theory outline');
      const outlineData = await outlineRes.json();
      const outlineChapters: any[] = outlineData.data || [];
      const byTrade = new Map<string, any[]>();
      for (const ch of outlineChapters) {
        if (!byTrade.has(ch.tradeId)) byTrade.set(ch.tradeId, []);
        byTrade.get(ch.tradeId)!.push(ch);
      }

      // Group chapters by trade/category
      const allCategories: TheoryCategory[] = [];
      for (const trade of trades) {
        const rawChapters = byTrade.get(trade.id) || [];
        const chapters: TheoryChapter[] = rawChapters.map((ch: any) => ({
          id: ch.id,
          number: ch.number,
          name: ch.name,
          questionCount: ch.questionCount || 0,
          theoryContent: null, // lazy — loaded on demand via /:chapterId/content
          hasTheory: !!ch.hasTheory,
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

      {/* Full-text search bar */}
      {!loading && categories.length > 0 && (
        <div className="relative group">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none transition-colors group-focus-within:text-blue"
          />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setSearchQuery('');
                (e.target as HTMLInputElement).blur();
              }
            }}
            placeholder={t('theoryFullSearchPlaceholder')}
            aria-label={t('theoryFullSearchPlaceholder')}
            className="w-full bg-card border border-border focus:border-blue/50 focus:ring-2 focus:ring-blue/15 rounded-xl pl-11 pr-12 py-3 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200"
          />
          {searchQuery ? (
            <button
              onClick={() => {
                setSearchQuery('');
                searchInputRef.current?.focus();
              }}
              aria-label={t('theoryClearSearch')}
              title={t('theoryClearSearch')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-hover/60 transition-colors"
            >
              <X size={15} />
            </button>
          ) : (
            !searchFocused && (
              <kbd
                aria-hidden="true"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center h-6 w-6 rounded-md border border-border bg-primary/40 text-[11px] font-mono text-text-tertiary pointer-events-none"
              >
                /
              </kbd>
            )
          )}
        </div>
      )}

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

      {/* Search results — replaces the category cards while a query is active */}
      {!loading && searchActive && (
        <div>
          {searchResults.length > 0 ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <p className="text-sm text-text-secondary">
                  {t('theorySearchResultsCount', { count: searchResults.length, query: debouncedQuery.trim() })}
                </p>
                {searchIndexLoading && (
                  <span className="flex items-center gap-1.5 text-xs text-text-tertiary">
                    <Loader2 size={12} className="animate-spin text-blue" />
                    {t('theoryIndexing')}
                  </span>
                )}
              </div>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.035 } } }}
                className="space-y-2"
              >
                {searchResults.map((result) => {
                  const color = getSectionColor(result.category.code);
                  const colors = SECTION_STYLES[color];
                  return (
                    <motion.button
                      key={result.chapter.id}
                      variants={{
                        hidden: { opacity: 0, y: 8 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.22 } },
                      }}
                      onClick={() => jumpToResult(result)}
                      className="w-full text-left bg-card border border-border rounded-card px-4 py-3.5 hover:border-blue/40 hover:bg-hover/30 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className={`h-7 w-7 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
                          <Layers size={13} className={colors.text} />
                        </span>
                        <p className="text-sm font-semibold text-text-primary group-hover:text-blue transition-colors min-w-0">
                          {result.chapter.number}. {result.chapter.name}
                        </p>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border text-text-tertiary">
                          {result.category.code}
                        </span>
                        <span className="ml-auto text-xs text-text-tertiary shrink-0">
                          {result.chapter.questionCount} {result.chapter.questionCount > 1 ? t('questions') : t('question')}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary mt-2 line-clamp-2 leading-relaxed pl-[38px]">
                        {result.snippet ? (
                          <>
                            {result.snippetStart > 0 && <span className="text-text-tertiary">…</span>}
                            <HighlightedSnippet text={result.snippet} query={debouncedQuery} />
                            <span className="text-text-tertiary">…</span>
                          </>
                        ) : (
                          <span className="text-text-tertiary italic">{result.category.name}</span>
                        )}
                      </p>
                    </motion.button>
                  );
                })}
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <div className="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center mb-4">
                <SearchX size={22} className="text-text-tertiary" />
              </div>
              <h2 className="text-base font-medium text-text-primary mb-1">
                {t('theorySearchNoResults', { query: debouncedQuery.trim() })}
              </h2>
              <p className="text-sm text-text-secondary max-w-sm text-center">
                {t('theorySearchNoResultsDesc')}
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* Sections */}
      {!loading && !searchActive && categories.length > 0 && (
        <div className="space-y-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} preselectedChapterId={preselectedChapterId || undefined} preselectedTradeCode={preselectedTradeCode} onChapterContentLoaded={handleChapterContentLoaded} />
          ))}
        </div>
      )}
    </div>
  );
}
