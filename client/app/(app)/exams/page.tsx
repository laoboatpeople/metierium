'use client';

import { useEffect, useState, useRef, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/src/contexts/LocaleContext';
import {
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  BarChart3,
  Target,
  GraduationCap,
  Loader2,
  Info,
  Trophy,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { saveExamResult, ExamRecord, ChapterResult } from '@/lib/examStorage';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string | null;
  difficulty: string;
  type: string;
  chapterId: string | null;
}

interface Chapter {
  id: string;
  number: number;
  name: string;
  theoryContent: string;
  tradeId: string;
}

interface Trade {
  id: string;
  code: string;
  name: string;
  nameFr: string;
}

interface ExamResult {
  total: number;
  correct: number;
  incorrect: number;
  score: number;
  answers: { questionId: string; selected: string; correct: boolean; chapterId: string | null }[];
  timeSpent: number;
  chapterBreakdown: { chapterId: string | null; chapterName: string; correct: number; total: number }[];
}

type ExamPhase = 'setup' | 'exam' | 'result';

const TRADE_NAME_MAP: Record<string, string> = {
  electrician: 'Électricien',
  plumber: 'Plombier',
  welder: 'Soudeur',
};

function getTradeName(tradeId: string, trades: Trade[], locale?: string): string {
  const t = trades.find((tr) => tr.id === tradeId);
  if (t) return locale === 'fr' ? (t.nameFr || t.name) : (t.name || t.nameFr);
  return TRADE_NAME_MAP[tradeId] || tradeId;
}

function weightedShuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const PASS_THRESHOLD = 70;

export default function ExamsPageWrapper() {
  return (
    <Suspense fallback={<div className="animate-fade-in space-y-8 p-8"><div className="skeleton h-8 w-64 rounded mb-2" /><div className="skeleton h-4 w-96 rounded mb-6" /></div>}>
      <ExamsPage />
    </Suspense>
  );
}

function ExamsPage() {
  const [phase, setPhase] = useState<ExamPhase>('setup');
  const [trades, setTrades] = useState<Trade[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [examTime, setExamTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [questionCount, setQuestionCount] = useState(50);
  const [difficulty, setDifficulty] = useState<string>('');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<Set<string>>(new Set());
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [userPlan, setUserPlan] = useState<string>('FREE');
  const [skipped, setSkipped] = useState<Set<number>>(new Set());
  const [reviewMode, setReviewMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { t, locale } = useLocale();
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const questionCountRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const EXAM_DURATION = 180 * 60; // 180 minutes (3h — real exam duration for most trades)

  // Pre-select trade and chapter from URL params (e.g. from theory page "Test my knowledge" button)
  useEffect(() => {
    const tradeParam = searchParams.get('tradeId');
    const chapterParam = searchParams.get('chapterId');
    if (tradeParam) setSelectedTrade(tradeParam);
    if (chapterParam) {
      setSelectedChapters(new Set([chapterParam]));
      setQuestionCount(50);
    }
  }, [searchParams]);

  // Auto-select chapter from URL param once chapters are loaded
  useEffect(() => {
    const chapterParam = searchParams.get('chapterId');
    if (chapterParam && chapters.length > 0) {
      const chapterExists = chapters.some((ch) => ch.id === chapterParam);
      if (chapterExists) {
        setSelectedChapters(new Set([chapterParam]));
      }
    }
  }, [chapters, searchParams]);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(`${API_BASE}/api/trades`, { headers });
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.data ?? [];
          const tradeList = list.map((t: any) => ({
            id: t.id,
            code: t.code,
            name: t.name,
            nameFr: t.nameFr || t.name,
          }));
          setTrades(tradeList);
        }
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, []);

  // Fetch chapters when trade changes
  useEffect(() => {
    if (!selectedTrade) {
      setChapters([]);
      setSelectedChapters(new Set());
      return;
    }
    (async () => {
      setChaptersLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(`${API_BASE}/api/theory?tradeId=${selectedTrade}&locale=${locale}`, { headers });
        if (res.ok) {
          const data = await res.json();
          const plan = data.plan || 'FREE';
          setUserPlan(plan);
          const list: Chapter[] = (data.data || []).sort(
            (a: Chapter, b: Chapter) => a.number - b.number
          );
          setChapters(list);
          // FREE plan: auto-select chapter 1 only, 50 questions max
          if (plan === 'FREE' && list.length > 0) {
            setSelectedChapters(new Set([list[0].id]));
            setQuestionCount(50);
          }
        }
      } catch { /* ignore */ }
      setChaptersLoading(false);
      // Auto-scroll to question count after trade + chapters loaded
      setTimeout(() => {
        questionCountRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    })();
  }, [selectedTrade, locale]); // eslint-disable-line react-hooks/exhaustive-deps

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => setExamTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  // Clear auto-advance on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const toggleChapter = (chapterId: string) => {
    if (userPlan === 'FREE') {
      // Find the chapter number
      const ch = chapters.find(c => c.id === chapterId);
      if (ch && ch.number > 1) return; // Free users can't toggle chapters > 1
    }
    setSelectedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  };

  const startExam = async () => {
    if (!selectedTrade) return;
    setStarting(true);
    try {
      const token = localStorage.getItem('token');
      const hasChapterFilter = selectedChapters.size > 0;
      let qs: Question[] = [];

      if (hasChapterFilter) {
        // Weighted distribution across selected chapters
        const selectedChapterList = chapters.filter((c) => selectedChapters.has(c.id));
        const totalWeight = selectedChapterList.length;
        let allocated = 0;
        const fetchPromises = selectedChapterList.map((ch, idx) => {
          // Distribute proportionally, last chapter gets remainder
          let count: number;
          if (idx < selectedChapterList.length - 1) {
            count = Math.round((questionCount / totalWeight));
          } else {
            count = questionCount - allocated;
          }
          allocated += count;
          if (count < 1) return null;

          let url = `${API_BASE}/api/questions?tradeId=${selectedTrade}&chapterId=${ch.id}&limit=${count}&locale=${locale}`;
          if (difficulty) url += `&difficulty=${difficulty}`;
          return fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((r) => (r.ok ? r.json() : { data: [] }));
        });

        const results = await Promise.all(fetchPromises.filter(Boolean));
        for (const res of results) {
          const chapterQs = (res.data || []).map((q: Question) => ({
            ...q,
          }));
          qs.push(...chapterQs);
        }
      } else {
        const url = `${API_BASE}/api/questions?tradeId=${selectedTrade}&limit=${questionCount}&locale=${locale}${difficulty ? `&difficulty=${difficulty}` : ''}`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch questions');
        const data = await res.json();
        qs = data.data || [];
      }

      qs = weightedShuffle(qs);

      if (qs.length === 0) {
        alert(t('examsNoQuestionsAlert'));
        setStarting(false);
        return;
      }
      setQuestions(qs);
      setPhase('exam');
      setCurrentIndex(0);
      setAnswers({});
      setExamResult(null);
      setExamTime(0);
      setSaved(false);
      setTimerActive(!reviewMode);
    } catch (err) {
      alert(t('examsLoadError'));
    }
    setStarting(false);
  };

  const selectAnswer = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
    // Remove from skipped if was skipped
    setSkipped((prev) => {
      const next = new Set(prev);
      next.delete(currentIndex);
      return next;
    });
    // Auto-advance to next question (clear any pending advance first)
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    if (currentIndex < questions.length - 1) {
      autoAdvanceRef.current = setTimeout(() => setCurrentIndex((i) => i + 1), 300);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
      if (!answers[questions[currentIndex]?.id]) {
        setSkipped((prev) => new Set(prev).add(currentIndex));
      }
      setCurrentIndex((i) => i + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
      setCurrentIndex((i) => i - 1);
    }
  };

  const finishExam = () => {
    setTimerActive(false);
    let correct = 0;
    const resultAnswers: ExamResult['answers'] = [];
    const chapterMap = new Map<string, { correct: number; total: number; name: string }>();

    for (const q of questions) {
      const selected = answers[q.id] || '';
      const answerIdx = q.answer ? q.answer.charCodeAt(0) - 65 : -1;
      const answerLetter = q.answer && q.answer.startsWith('Option ') ? q.answer.slice(-1) : q.answer;
      const answerIdx2 = answerLetter ? answerLetter.charCodeAt(0) - 65 : -1;
      const correctText = (answerIdx2 >= 0 && q.options && q.options[answerIdx2]) ? q.options[answerIdx2] : q.answer;
      const isCorrect = selected === correctText;
      if (isCorrect) correct++;
      resultAnswers.push({ questionId: q.id, selected, correct: isCorrect, chapterId: q.chapterId });

      // Track per-chapter
      const chId = q.chapterId || 'none';
      if (!chapterMap.has(chId)) {
        const ch = chapters.find((c) => c.id === chId);
        chapterMap.set(chId, { correct: 0, total: 0, name: ch ? ch.name : t('examsGeneral') });
      }
      const entry = chapterMap.get(chId)!;
      entry.total++;
      if (isCorrect) entry.correct++;
    }

    const chapterBreakdown = Array.from(chapterMap.entries()).map(([chapterId, data]) => ({
      chapterId,
      chapterName: data.name,
      correct: data.correct,
      total: data.total,
    }));

    const score = Math.round((correct / questions.length) * 100);
    const result: ExamResult = {
      total: questions.length,
      correct,
      incorrect: questions.length - correct,
      score,
      answers: resultAnswers,
      timeSpent: examTime,
      chapterBreakdown,
    };
    setExamResult(result);
    setPhase('result');

    // Save result
    try {
      const record: ExamRecord = {
        id: `exam_${Date.now()}`,
        date: new Date().toISOString(),
        tradeId: selectedTrade,
        tradeName: getTradeName(selectedTrade, trades, locale),
        totalQuestions: questions.length,
        correct,
        incorrect: questions.length - correct,
        score,
        timeSpent: examTime,
        chapterResults: chapterBreakdown.map((cb) => ({
          chapterNumber: (cb.chapterId ? parseInt(cb.chapterId.split('_').pop() || '0', 10) : 0),
          chapterName: cb.chapterName,
          correct: cb.correct,
          total: cb.total,
          tradeName: getTradeName(selectedTrade, trades, locale),
          chapterId: cb.chapterId || undefined,
        })),
        difficulty,
        passed: score >= PASS_THRESHOLD,
        reviewMode,
      };
      saveExamResult(record);
      setSaved(true);
    } catch { /* ignore */ }
  };

  const resetExam = () => {
    setPhase('setup');
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers({});
    setExamResult(null);
    setExamTime(0);
    setTimerActive(false);
    setSaved(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-[#3B82F6]" />
      </div>
    );
  }

  // ─── SETUP PHASE ────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-8">
        {/* JSON-LD HowTo Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HowTo",
              "name": "Comment réussir un examen blanc de certification",
              "description": "Préparez-vous à l'examen de métier du Québec avec notre simulateur d'examen blanc",
              "step": [
                { "@type": "HowToStep", "position": 1, "name": "Choisissez votre métier", "text": "Sélectionnez CMEQ (Électricien), CMMTQ (Plombier) ou QBQ (Soudeur)" },
                { "@type": "HowToStep", "position": 2, "name": "Sélectionnez les chapitres et le nombre de questions", "text": "Choisissez les chapitres à réviser et le nombre de questions pour l'examen" },
                { "@type": "HowToStep", "position": 3, "name": "Répondez aux questions", "text": "Chaque question est à choix multiples avec correction et explication détaillée" },
                { "@type": "HowToStep", "position": 4, "name": "Consultez vos résultats", "text": "Obtenez votre score, le détail par chapitre et vos statistiques de progression" }
              ],
              "tool": { "@type": "Thing", "name": "Ordinateur ou appareil mobile avec connexion internet" },
              "timeRequired": "PT60M",
              "totalTime": "PT60M"
            })
          }}
        />

        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#06B6D4] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-[#06B6D4]/20">
            <BookOpen size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#F8FAFC]">{t('examsHeaderTitle')}</h1>
            <p className="text-sm text-[#94A3B8]">{t('examsHeaderDesc')}</p>
          </div>
        </div>

        <div className="grid gap-5">
          {/* Étape 1: Métier — cartes */}
          <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center text-xs font-bold text-white">1</div>
              <div>
                <h2 className="text-sm font-semibold text-[#F8FAFC]">{t('examsTrade')}</h2>
                <p className="text-xs text-[#64748B]">{t('examsTradeSubtitle')}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {trades.map((tr) => {
                const isSelected = selectedTrade === tr.id;
                return (
                  <button
                    key={tr.id}
                    onClick={() => setSelectedTrade(tr.id)}
                    className={`
                      relative flex items-center gap-3 px-4 py-3.5 rounded-xl border text-sm font-medium transition-all duration-200 text-left
                      ${isSelected
                        ? 'bg-[#3B82F6]/10 border-[#3B82F6] text-[#3B82F6] shadow-lg shadow-[#3B82F6]/5'
                        : 'bg-[#111827]/50 border-[#2D3A52] text-[#94A3B8] hover:border-[#3B82F6]/30 hover:text-[#F8FAFC]'
                      }
                    `}
                  >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center flex-shrink-0 shadow-sm">
                      <GraduationCap size={16} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold truncate text-[#F8FAFC]">{locale === 'fr' ? tr.nameFr : tr.name}</span>
                      <span className={`block text-[11px] ${isSelected ? 'text-[#3B82F6]/70' : 'text-[#64748B]'}`}>
                        {t('examsQuestions')}
                      </span>
                    </div>
                    {isSelected && (
                      <CheckCircle size={16} className="shrink-0 text-[#3B82F6]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Étape 2: Configuration */}
          <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-xs font-bold text-white">2</div>
              <div>
                <h2 className="text-sm font-semibold text-[#F8FAFC]">{t('examsConfig')}</h2>
                <p className="text-xs text-[#64748B]">{t('examsConfigSubtitle')}</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Question count */}
              <div ref={questionCountRef} className="bg-[#111827]/60 rounded-lg p-3.5 border border-[#2D3A52]/50">
                <label className="block text-xs font-medium text-[#94A3B8] mb-2.5 flex items-center gap-1.5">
                  <BarChart3 size={14} className="text-[#3B82F6]" />
                  {t('examsQuestionCount')}
                </label>
                <div className="flex gap-1.5 flex-wrap">
                  {[10, 20, 30, 50, 100, 150].map((n) => {
                    const isLockedCount = userPlan === 'FREE' && n > 50;
                    return (
                      <button
                        key={n}
                        onClick={() => isLockedCount ? router.push('/pricing') : setQuestionCount(n)}
                        className={`flex-1 min-w-[40px] py-2 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-1 ${
                          isLockedCount
                            ? 'border-[#2D3A52]/40 bg-transparent text-[#64748B]/50 cursor-pointer hover:border-[#3B82F6]/20'
                            : questionCount === n
                              ? 'border-[#3B82F6] bg-[#3B82F6]/10 text-[#3B82F6]'
                              : 'border-[#2D3A52] bg-transparent text-[#94A3B8] hover:border-[#3B82F6]/30 hover:text-[#F8FAFC]'
                        }`}
                      >
                        {n}
                        {isLockedCount && <Lock size={10} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty */}
              <div className="bg-[#111827]/60 rounded-lg p-3.5 border border-[#2D3A52]/50">
                <label className="block text-xs font-medium text-[#94A3B8] mb-2.5 flex items-center gap-1.5">
                  <Target size={14} className="text-[#F59E0B]" />
                  {t('examsDifficulty')}
                </label>
                <div className="flex gap-1.5">
                  {[
                    { value: '', label: t('examsDifficultyAll') },
                    { value: 'EASY', label: t('examsDifficultyEasy') },
                    { value: 'MEDIUM', label: t('examsDifficultyMedium') },
                    { value: 'HARD', label: t('examsDifficultyHard') },
                  ].map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setDifficulty(d.value)}
                      className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                        difficulty === d.value
                          ? 'border-[#F59E0B] bg-[#F59E0B]/10 text-[#F59E0B]'
                          : 'border-[#2D3A52] bg-transparent text-[#94A3B8] hover:border-[#F59E0B]/30 hover:text-[#F8FAFC]'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chapter filter */}
            {selectedTrade && (
              <div className="bg-[#111827]/60 rounded-lg p-3.5 border border-[#2D3A52]/50">
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-medium text-[#94A3B8] flex items-center gap-1.5">
                    <BookOpen size={14} className="text-[#06B6D4]" />
                    {t('examsChaptersToStudy')}
                  </label>
                  <span className="text-[10px] text-[#64748B]">{t('examsChaptersOptional')}</span>
                </div>
                {chaptersLoading ? (
                  <div className="flex items-center gap-2 text-sm text-[#64748B] py-2">
                    <Loader2 size={14} className="animate-spin" />
                    {t('examsChaptersLoading')}
                  </div>
                ) : chapters.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
                    {chapters.map((ch) => {
                      const isChSelected = selectedChapters.has(ch.id);
                      const isLocked = userPlan === 'FREE' && ch.number > 1;
                      return (
                        <label
                          key={ch.id}
                          onClick={() => isLocked ? router.push('/pricing') : toggleChapter(ch.id)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border cursor-pointer text-sm transition-all ${
                            isLocked
                              ? 'border-[#2D3A52]/50 bg-transparent text-[#64748B]/50 cursor-pointer hover:border-[#06B6D4]/20'
                              : isChSelected
                                ? 'border-[#06B6D4] bg-[#06B6D4]/8 text-[#06B6D4]'
                                : 'border-[#2D3A52] bg-transparent text-[#94A3B8] hover:border-[#06B6D4]/30'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all ${
                            isLocked ? 'border border-[#2D3A52]/30'
                              : isChSelected
                                ? 'bg-[#06B6D4]'
                                : 'border border-[#2D3A52]'
                          }`}>
                            {isChSelected && <CheckCircle size={10} className="text-white" />}
                          </div>
                          <span className={`truncate ${isLocked ? 'text-[#64748B]/50' : ''}`}>Ch. {ch.number} — {ch.name}</span>
                          {isLocked && <Lock size={12} className="shrink-0 text-[#64748B]/40 ml-auto" />}
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-[#64748B]">{t('examsNoChapters')}</p>
                )}
              </div>
            )}
          </div>

          {/* Étape 3: Mode & Infos */}
          <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center text-xs font-bold text-white">3</div>
              <div>
                <h2 className="text-sm font-semibold text-[#F8FAFC]">{t('examsMode')}</h2>
                <p className="text-xs text-[#64748B]">{t('examsModeSubtitle')}</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {/* Normal mode */}
              <button
                onClick={() => setReviewMode(false)}
                className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  !reviewMode
                    ? 'border-[#3B82F6] bg-[#3B82F6]/8'
                    : 'border-[#2D3A52] bg-[#111827]/50 hover:border-[#3B82F6]/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    !reviewMode ? 'bg-[#3B82F6]/15' : 'bg-[#2D3A52]/50'
                  }`}>
                    <Clock size={18} className={!reviewMode ? 'text-[#3B82F6]' : 'text-[#64748B]'} />
                  </div>
                  <div>
                    <span className={`block text-sm font-semibold ${!reviewMode ? 'text-[#F8FAFC]' : 'text-[#94A3B8]'}`}>{t('examsTimed')}</span>
                    <span className="text-xs text-[#64748B] mt-0.5 block">{t('examsTimedDesc')}</span>
                  </div>
                </div>
                {!reviewMode && (
                  <CheckCircle size={14} className="absolute top-2.5 right-2.5 text-[#3B82F6]" />
                )}
              </button>

              {/* Review mode */}
              <button
                onClick={() => setReviewMode(true)}
                className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  reviewMode
                    ? 'border-[#06B6D4] bg-[#06B6D4]/8'
                    : 'border-[#2D3A52] bg-[#111827]/50 hover:border-[#06B6D4]/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    reviewMode ? 'bg-[#06B6D4]/15' : 'bg-[#2D3A52]/50'
                  }`}>
                    <BookOpen size={18} className={reviewMode ? 'text-[#06B6D4]' : 'text-[#64748B]'} />
                  </div>
                  <div>
                    <span className={`block text-sm font-semibold ${reviewMode ? 'text-[#F8FAFC]' : 'text-[#94A3B8]'}`}>{t('examsReview')}</span>
                    <span className="text-xs text-[#64748B] mt-0.5 block">{t('examsReviewDesc')}</span>
                  </div>
                </div>
                {reviewMode && (
                  <CheckCircle size={14} className="absolute top-2.5 right-2.5 text-[#06B6D4]" />
                )}
              </button>
            </div>
          </div>

          {/* Pass threshold + CTA */}
          <div className="bg-gradient-to-r from-[#06B6D4]/5 via-[#3B82F6]/5 to-transparent border border-[#2D3A52] rounded-xl p-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center">
                  <Trophy size={18} className="text-[#F59E0B]" />
                </div>
                <div>
                  <p className="text-sm text-[#94A3B8]">
                    {t('examsPassThreshold', { threshold: PASS_THRESHOLD })}
                  </p>
                  <p className="text-xs text-[#64748B]">{questions.length === 0 ? t('examsQuestionsRandom', { count: questionCount }) : t('examsQuestionsPrepared', { count: questions.length })}</p>
                </div>
              </div>
              <button
                onClick={startExam}
                disabled={!selectedTrade || starting}
                className="px-8 py-3 bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] rounded-xl font-semibold text-white hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
              >
                {starting ? <Loader2 size={18} className="animate-spin" /> : <Target size={18} />}
                {starting ? t('examsPreparing') : t('examsStartExam')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── EXAM PHASE
  if (phase === 'exam') {
    const q = questions[currentIndex];
    const selectedAnswer = answers[q.id];
    const answeredCount = Object.keys(answers).length;
    const allAnswered = answeredCount === questions.length;
    const progress = ((currentIndex + 1) / questions.length) * 100;

    // Visual timer bar
    const timeRemaining = Math.max(0, EXAM_DURATION - examTime);
    const timerPercent = (examTime / EXAM_DURATION) * 100;
    let timerBarColor = 'bg-[#22C55E]';
    if (timerPercent > 50) timerBarColor = 'bg-[#F59E0B]';
    if (timerPercent > 75) timerBarColor = 'bg-[#EF4444]';

    // Current chapter name
    const currentChapter = chapters.find((c) => c.id === q.chapterId);
    const currentChapterName = currentChapter ? `Ch. ${currentChapter.number} — ${currentChapter.name}` : null;

    return (
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Header bar */}
        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#94A3B8]">
                {t('examsQuestionLabel', { current: currentIndex + 1, total: questions.length })}
              </span>
              {!reviewMode && (
                <span className={`text-sm flex items-center gap-1.5 font-medium ${
                  timerPercent > 75 ? 'text-[#EF4444]' : timerPercent > 50 ? 'text-[#F59E0B]' : 'text-[#94A3B8]'
                }`}>
                  <Clock size={14} />
                  {formatTime(examTime)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {reviewMode && (
                <span className="text-xs text-[#06B6D4] bg-[#06B6D4]/10 px-2 py-0.5 rounded-full font-medium">
                  {t('examsReview')}
                </span>
              )}
              <span className="text-xs text-[#94A3B8]">{t('examsAnsweredCountShort', { answered: answeredCount, total: questions.length })}</span>
              <div className="w-20 h-1.5 bg-[#111827] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#06B6D4] rounded-full transition-all"
                  style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Visual timer bar (only in normal mode) */}
          {!reviewMode && (
            <div className="w-full h-2 bg-[#111827] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${timerBarColor}`}
                style={{ width: `${Math.min(timerPercent, 100)}%` }}
              />
            </div>
          )}
        </div>

        {/* Chapter name below header */}
        {currentChapterName && (
          <div className="text-xs text-[#06B6D4] bg-[#06B6D4]/5 px-3 py-1.5 rounded-lg border border-[#06B6D4]/10 inline-block">
            {currentChapterName}
          </div>
        )}

        {/* Progress bar */}
        <div className="w-full h-1 bg-[#111827] rounded-full overflow-hidden">
          <div className="h-full bg-[#3B82F6] transition-all" style={{ width: `${progress}%` }} />
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#1A2035] border border-[#2D3A52] rounded-xl overflow-hidden"
          >
            {/* Question header */}
            <div className="flex items-center justify-between px-6 py-3 bg-[#111827]/50 border-b border-[#2D3A52]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center text-xs font-bold text-white">
                  {currentIndex + 1}
                </div>
                <span className="text-sm text-[#94A3B8]">{t('examsOf', { total: questions.length })}</span>
                {currentChapterName && (
                  <span className="ml-2 text-xs text-[#06B6D4]/70 bg-[#06B6D4]/8 px-2 py-0.5 rounded-full">
                    {currentChapterName}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                  q.difficulty === 'EASY' ? 'bg-[#22C55E]/10 text-[#22C55E]' :
                  q.difficulty === 'HARD' ? 'bg-[#EF4444]/10 text-[#EF4444]' :
                  'bg-[#F59E0B]/10 text-[#F59E0B]'
                }`}>
                  {q.difficulty === 'EASY' ? t('examsDifficultyEasy') : q.difficulty === 'HARD' ? t('examsDifficultyHard') : t('examsDifficultyMedium')}
                </span>
              </div>
            </div>

            {/* Question body */}
            <div className="p-6 space-y-5">
              <p className="text-[#F8FAFC] font-medium leading-relaxed">{q.question}</p>

              <div className="space-y-2.5">
                {(q.options || []).map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isSelected = selectedAnswer === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => selectAnswer(q.id, opt)}
                      className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl border transition-all duration-150 cursor-pointer hover:shadow-lg hover:shadow-black/10 ${
                        isSelected
                          ? 'border-2 border-[#3B82F6] bg-[#3B82F6]/8 text-[#3B82F6]'
                          : 'border border-[#2D3A52]/70 bg-[#1E293B] text-[#94A3B8] hover:border-[#3B82F6]/40'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                        isSelected
                          ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                          : 'bg-transparent text-[#64748B]/60 border-[#2D3A52]/50'
                      }`}>
                        {letter}
                      </span>
                      <span className={`text-sm leading-relaxed ${isSelected ? 'text-[#3B82F6]' : 'text-[#94A3B8]'}`}>{opt}</span>
                    </button>
                  );
                })}
              </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-2 border-t border-[#2D3A52]/50 mt-2">
              <button
                onClick={prevQuestion}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111827] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} /> {t('examsPrev')}
              </button>
              <button
                onClick={nextQuestion}
                disabled={currentIndex === questions.length - 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111827] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                {t('examsNext')} <ChevronRight size={16} />
              </button>
            </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Question dots */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          {questions.map((question, idx) => {
            const isAns = !!answers[question.id];
            const isCur = idx === currentIndex;
            let color = 'bg-[#64748B]'; // gray = unanswered
            if (isAns) color = 'bg-[#22C55E]'; // green = answered
            if (!isAns && skipped.has(idx)) color = 'bg-[#EF4444]'; // red = skipped
            if (isCur) color = 'bg-[#3B82F6]'; // blue = current
            return (
              <button
                key={question.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all ${color} ${isCur ? 'ring-2 ring-[#3B82F6]/50 scale-125' : 'opacity-80 hover:opacity-100'}`}
              />
            );
          })}
        </div>

        {/* Submit bar */}
        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl overflow-hidden sticky bottom-0">
          <div className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#94A3B8]">
                  {t('examsAnsweredCount', { answered: answeredCount, total: questions.length })}
                </span>
                  {allAnswered && (
                    <CheckCircle size={16} className="text-[#22C55E]" />
                  )}
                </div>
                <div className="w-32 h-1.5 bg-[#111827] rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] rounded-full transition-all"
                    style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <button
              onClick={() => allAnswered ? finishExam() : setShowConfirm(true)}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                allAnswered
                  ? 'bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                  : 'bg-[#F59E0B] text-white hover:bg-[#D97706]'
              }`}
            >
              <Trophy size={16} />
              {allAnswered ? t('examsSubmit') : t('examsSubmitPartial', { answered: answeredCount, total: questions.length })}
            </button>
          </div>
        </div>

        {/* Confirm modal for incomplete submission */}
        <AnimatePresence>
          {showConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={() => setShowConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#1A2035] border border-[#2D3A52] rounded-2xl p-6 max-w-md w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col items-center text-center mb-5">
                  <div className="w-14 h-14 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center mb-4">
                    <AlertCircle size={28} className="text-[#F59E0B]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#F8FAFC]">{t('examsUnansweredTitle')}</h3>
                  <p className="text-sm text-[#94A3B8] mt-1">
                    {t('examsUnansweredDesc', { count: questions.length - answeredCount })}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 justify-center mb-5">
                  {questions.map((q, idx) => {
                    const isAnswered = !!answers[q.id];
                    return (
                      <button
                        key={q.id}
                        onClick={() => { setShowConfirm(false); setCurrentIndex(idx); }}
                        className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                          isAnswered
                            ? 'bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30'
                            : 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 animate-pulse'
                        }`}
                        title={isAnswered ? t('examsAnsweredTooltip') : t('examsUnansweredTooltip')}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-xl text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-all"
                  >
                    {t('examsBack')}
                  </button>
                  <button
                    onClick={() => { setShowConfirm(false); finishExam(); }}
                    className="flex-1 py-2.5 bg-gradient-to-r from-[#F59E0B] to-[#D97706] rounded-xl text-sm font-semibold text-white hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all"
                  >
                    {t('examsSubmitAnyway')}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ─── RESULT PHASE ────────────────────────────────────────
  if (phase === 'result' && examResult) {
    const passed = examResult.score >= PASS_THRESHOLD;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#F8FAFC]">{t('examsResultTitle')}</h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            {t('examsTime', { time: formatTime(examResult.timeSpent) })}
            {reviewMode && (
              <span className="ml-2 text-[#06B6D4]">{t('examsReviewLabel')}</span>
            )}
          </p>
        </div>

        {/* Score card with circular progress */}
        <div className={`bg-[#1A2035] border rounded-2xl p-8 text-center ${passed ? 'border-[#22C55E]/20' : 'border-[#EF4444]/20'}`}>
          {/* Circular score */}
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="56" fill="none" stroke="#2D3A52" strokeWidth="8" />
              <circle
                cx="64" cy="64" r="56"
                fill="none"
                stroke={passed ? '#22C55E' : '#EF4444'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(examResult.score / 100) * 351.86} 351.86`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${passed ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>{examResult.score}%</span>
              <span className="text-[11px] text-[#64748B] mt-0.5">{t('examsRequired', { threshold: PASS_THRESHOLD })}</span>
            </div>
          </div>

          {/* Pass/Fail badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-5 ${
            passed
              ? 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30'
              : 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30'
          }`}>
            {passed ? (
              <><Trophy size={16} /> {t('examsPassed')}</>
            ) : (
              <><XCircle size={16} /> {t('examsFailed')}</>
            )}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
            <div className="bg-[#111827]/60 rounded-xl p-3">
              <p className="text-xl font-bold text-[#22C55E]">{examResult.correct}</p>
              <p className="text-[11px] text-[#64748B] mt-0.5">{t('examsCorrect')}</p>
            </div>
            <div className="bg-[#111827]/60 rounded-xl p-3">
              <p className="text-xl font-bold text-[#EF4444]">{examResult.incorrect}</p>
              <p className="text-[11px] text-[#64748B] mt-0.5">{t('examsWrong')}</p>
            </div>
            <div className="bg-[#111827]/60 rounded-xl p-3">
              <p className="text-xl font-bold text-[#F8FAFC]">{examResult.total}</p>
              <p className="text-[11px] text-[#64748B] mt-0.5">{t('examsTotal')}</p>
            </div>
          </div>

          {saved && (
            <p className="text-xs text-[#22C55E] mt-4 flex items-center justify-center gap-1">
              <CheckCircle size={12} /> {t('examsResultSaved')}
            </p>
          )}
        </div>

        {/* Share Your Score */}
        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-5 text-center">
          <p className="text-sm font-medium text-[#F8FAFC] mb-3">{t('examsShareYourScore')}</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                const text = encodeURIComponent(
                  (passed ? t('examsShareScorePassed', { score: examResult.score }) : t('examsShareScore', { score: examResult.score }))
                  + ' ' + t('examsShareDesc') + ' 👉 https://metierium.com'
                );
                window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'noopener');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              {t('examsShareTwitter')}
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                const siteUrl = 'https://metierium.com';
                const text = encodeURIComponent(
                  (passed ? t('examsShareScorePassed', { score: examResult.score }) : t('examsShareScore', { score: examResult.score }))
                  + ' ' + t('examsShareDesc')
                );
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl)}&title=${encodeURIComponent(t('examsShareYourScore'))}&summary=${text}`, '_blank', 'noopener');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              {t('examsShareLinkedIn')}
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={resetExam}
            className="flex-1 py-3 bg-[#3B82F6] rounded-xl font-medium text-white hover:bg-[#2563EB] transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} /> {t('examsNewExam')}
          </button>
          <Link
            href="/app#exam-history"
            className="flex-1 py-3 bg-[#1A2035] border border-[#2D3A52] rounded-xl font-medium text-[#F8FAFC] hover:bg-[#2D3A52] transition-colors flex items-center justify-center gap-2"
          >
            <BarChart3 size={18} /> {t('examsViewStats')}
          </Link>
        </div>

        {/* Per-chapter breakdown */}
        {examResult.chapterBreakdown.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-[#F8FAFC] mb-3 flex items-center gap-2">
              <GraduationCap size={18} className="text-[#06B6D4]" />
              {t('examsChapterResults')}
            </h2>
            <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-4 space-y-3">
              {examResult.chapterBreakdown.map((cb) => {
                const chPercent = cb.total > 0 ? Math.round((cb.correct / cb.total) * 100) : 0;
                const chPassed = chPercent >= PASS_THRESHOLD;
                return (
                  <div key={cb.chapterId} className="bg-[#111827]/40 rounded-lg p-3.5 border border-[#2D3A52]/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#F8FAFC] font-medium">{cb.chapterName}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        chPassed ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#EF4444]/10 text-[#EF4444]'
                      }`}>
                        {cb.correct}/{cb.total}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#2D3A52]/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${chPassed ? 'bg-[#22C55E]' : 'bg-[#EF4444]'}`}
                        style={{ width: `${chPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[11px] text-[#64748B]">{t('examsChapterPercent', { percent: chPercent })}</span>
                      {chPassed
                        ? <span className="text-[11px] text-[#22C55E]">{t('examsChapterPassed')}</span>
                        : <span className="text-[11px] text-[#EF4444]">{t('examsChapterFailed')}</span>
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Question review */}
        <div>
          <h2 className="text-lg font-semibold text-[#F8FAFC] mb-3 flex items-center gap-2">
            <BarChart3 size={18} className="text-[#3B82F6]" />
            {t('examsReviewQuestions')}
          </h2>
          <div className="space-y-3">
            {questions.map((q, idx) => {
              const ans = examResult.answers.find((a) => a.questionId === q.id);
              const isCorrect = ans?.correct;
              const answerIdx = q.answer ? q.answer.charCodeAt(0) - 65 : -1;
              const answerLetter = q.answer && q.answer.startsWith('Option ') ? q.answer.slice(-1) : q.answer;
      const answerIdx2 = answerLetter ? answerLetter.charCodeAt(0) - 65 : -1;
      const correctText = (answerIdx2 >= 0 && q.options && q.options[answerIdx2]) ? q.options[answerIdx2] : q.answer;
              return (
                <div key={q.id} className={`bg-[#1A2035] border ${isCorrect ? 'border-[#22C55E]/20' : 'border-[#EF4444]/20'} rounded-xl p-4`}>
                  <div className="flex items-start gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle size={16} className="text-[#22C55E] mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle size={16} className="text-[#EF4444] mt-0.5 flex-shrink-0" />
                    )}
                    <p className="text-sm text-[#F8FAFC] font-medium">Q{idx + 1}. {q.question}</p>
                  </div>
                  <div className="ml-6 space-y-1 text-sm">
                    <p className="text-[#94A3B8]">{t('examsYourAnswer')} <span className={isCorrect ? 'text-[#22C55E]' : 'text-[#EF4444]'}>{ans?.selected || '—'}</span></p>
                    {!isCorrect && (
                      <p className="text-[#22C55E]">{t('examsCorrectAnswer')} {correctText}</p>
                    )}
                    {q.explanation && (
                      <p className="text-[#64748B] text-xs mt-1">{q.explanation}</p>
                    )}
                    <button
                      onClick={() => {
                        // Save context to localStorage for the tutor page to read
                        try {
                          localStorage.setItem('tutorContext', JSON.stringify({
                            question: q.question,
                            tradeId: selectedTrade,
                            chapterId: q.chapterId,
                          }));
                          localStorage.setItem('tutorReturnUrl', window.location.href);
                        } catch {}
                        window.open('/tutor', '_blank');
                      }}
                      className="mt-2 text-xs text-[#3B82F6] hover:text-[#06B6D4] flex items-center gap-1 transition-colors"
                    >
                      🤖 {t('examsAskAiTutor')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom actions — Nouvel Examen / Voir Stats */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={resetExam}
            className="flex-1 py-3 bg-[#3B82F6] rounded-xl font-medium text-white hover:bg-[#2563EB] transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} /> {t('examsNewExam')}
          </button>
          <Link
            href="/app#exam-history"
            className="flex-1 py-3 bg-[#1A2035] border border-[#2D3A52] rounded-xl font-medium text-[#F8FAFC] hover:bg-[#2D3A52] transition-colors flex items-center justify-center gap-2"
          >
            <BarChart3 size={18} /> {t('examsViewStats')}
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
