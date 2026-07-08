'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
} from 'lucide-react';
import { saveExamResult, ExamRecord, ChapterResult } from '@/lib/examStorage';
import Script from 'next/script';
import Link from 'next/link';

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

function getTradeName(tradeId: string, trades: Trade[]): string {
  const t = trades.find((tr) => tr.id === tradeId);
  if (t) return t.name || t.nameFr;
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

export default function ExamsPage() {
  const [phase, setPhase] = useState<ExamPhase>('setup');
  const [trades, setTrades] = useState<Trade[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [examTime, setExamTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [questionCount, setQuestionCount] = useState(20);
  const [difficulty, setDifficulty] = useState<string>('');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<Set<string>>(new Set());
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const EXAM_DURATION = 60 * 60; // 60 minutes in seconds

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/api/trades`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.trades ?? [];
          const frList = list.map((t: any) => ({
            id: t.id,
            code: t.code,
            name: t.nameFr || t.name,
            nameFr: t.nameFr || t.name,
          }));
          setTrades(frList);
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
        const res = await fetch(`${API_BASE}/api/theory?tradeId=${selectedTrade}&locale=fr`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const list: Chapter[] = (data.data || []).sort(
            (a: Chapter, b: Chapter) => a.number - b.number
          );
          setChapters(list);
        }
      } catch { /* ignore */ }
      setChaptersLoading(false);
    })();
  }, [selectedTrade]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => setExamTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const toggleChapter = (chapterId: string) => {
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

          let url = `${API_BASE}/api/questions?tradeId=${selectedTrade}&chapterId=${ch.id}&limit=${count}`;
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
        const url = `${API_BASE}/api/questions?tradeId=${selectedTrade}&limit=${questionCount}${difficulty ? `&difficulty=${difficulty}` : ''}`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch questions');
        const data = await res.json();
        qs = data.data || [];
      }

      qs = weightedShuffle(qs);

      if (qs.length === 0) {
        alert('Aucune question disponible pour ce métier pour le moment.');
        setStarting(false);
        return;
      }
      setQuestions(qs);
      setPhase('exam');
      setCurrentIndex(0);
      setAnswers({});
      setSubmittedQuestions(new Set());
      setExamResult(null);
      setExamTime(0);
      setSaved(false);
      setTimerActive(!reviewMode);
    } catch (err) {
      alert('Erreur lors du chargement des questions.');
    }
    setStarting(false);
  };

  const selectAnswer = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const submitAnswer = () => {
    const q = questions[currentIndex];
    if (!answers[q.id]) return;
    setSubmittedQuestions((prev) => new Set(prev).add(q.id));
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
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
      const isCorrect = selected === q.answer;
      if (isCorrect) correct++;
      resultAnswers.push({ questionId: q.id, selected, correct: isCorrect, chapterId: q.chapterId });

      // Track per-chapter
      const chId = q.chapterId || 'none';
      if (!chapterMap.has(chId)) {
        const ch = chapters.find((c) => c.id === chId);
        chapterMap.set(chId, { correct: 0, total: 0, name: ch ? `Ch. ${ch.number} — ${ch.name}` : 'Général' });
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
        tradeName: getTradeName(selectedTrade, trades),
        totalQuestions: questions.length,
        correct,
        incorrect: questions.length - correct,
        score,
        timeSpent: examTime,
        chapterResults: chapterBreakdown.map((cb) => ({
          chapterNumber: parseInt(cb.chapterId, 10) || 0,
          chapterName: cb.chapterName,
          correct: cb.correct,
          total: cb.total,
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
    setSubmittedQuestions(new Set());
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
      <div className="max-w-3xl mx-auto space-y-6">
        {/* JSON-LD HowTo Schema */}
        <Script id="howto-jsonld" type="application/ld+json" strategy="afterInteractive">{`
          {
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
          }
        `}</Script>
        <div className="flex items-center gap-3">
          <BookOpen size={28} className="text-[#06B6D4]" />
          <div>
            <h1 className="text-2xl font-bold text-[#F8FAFC]">Examens blancs</h1>
            <p className="text-sm text-[#94A3B8]">Simulez les conditions réelles de l'examen de certification</p>
          </div>
        </div>

        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6 space-y-5">
          {/* Trade selector */}
          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Métier</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {trades.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTrade(t.id)}
                  className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                    selectedTrade === t.id
                      ? 'border-[#06B6D4] bg-[#06B6D4]/10 text-[#06B6D4]'
                      : 'border-[#2D3A52] bg-[#111827] text-[#94A3B8] hover:border-[#3B82F6]/40'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Question count */}
          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Nombre de questions</label>
            <div className="flex gap-2">
              {[10, 20, 30, 50].map((n) => (
                <button
                  key={n}
                  onClick={() => setQuestionCount(n)}
                  className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                    questionCount === n
                      ? 'border-[#3B82F6] bg-[#3B82F6]/10 text-[#3B82F6]'
                      : 'border-[#2D3A52] bg-[#111827] text-[#94A3B8] hover:border-[#3B82F6]/40'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Difficulté</label>
            <div className="flex gap-2">
              {[
                { value: '', label: 'Toutes' },
                { value: 'EASY', label: 'Facile' },
                { value: 'MEDIUM', label: 'Moyen' },
                { value: 'HARD', label: 'Difficile' },
              ].map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDifficulty(d.value)}
                  className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                    difficulty === d.value
                      ? 'border-[#3B82F6] bg-[#3B82F6]/10 text-[#3B82F6]'
                      : 'border-[#2D3A52] bg-[#111827] text-[#94A3B8] hover:border-[#3B82F6]/40'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chapter filter */}
          {selectedTrade && (
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">
                Chapitres à étudier
                <span className="text-xs text-[#64748B] ml-2">(optionnel — laissez vide pour tous)</span>
              </label>
              {chaptersLoading ? (
                <div className="flex items-center gap-2 text-sm text-[#64748B] py-2">
                  <Loader2 size={14} className="animate-spin" />
                  Chargement des chapitres...
                </div>
              ) : chapters.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {chapters.map((ch) => (
                    <label
                      key={ch.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm transition-all ${
                        selectedChapters.has(ch.id)
                          ? 'border-[#06B6D4] bg-[#06B6D4]/10 text-[#06B6D4]'
                          : 'border-[#2D3A52] bg-[#111827] text-[#94A3B8] hover:border-[#3B82F6]/40'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedChapters.has(ch.id)}
                        onChange={() => toggleChapter(ch.id)}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                          selectedChapters.has(ch.id)
                            ? 'bg-[#06B6D4] border-[#06B6D4]'
                            : 'border-[#2D3A52] bg-transparent'
                        }`}
                      >
                        {selectedChapters.has(ch.id) && (
                          <CheckCircle size={12} className="text-white" />
                        )}
                      </div>
                      <span>Ch. {ch.number} — {ch.name}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#64748B]">Aucun chapitre disponible</p>
              )}
            </div>
          )}

          {/* Review mode toggle */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-[#94A3B8]">Mode révision</label>
                <div className="relative group">
                  <Info size={14} className="text-[#64748B] cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-xs text-[#94A3B8] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    Pas de minuterie — révisez à votre rythme
                  </div>
                </div>
              </div>
              <button
                onClick={() => setReviewMode(!reviewMode)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  reviewMode ? 'bg-[#06B6D4]' : 'bg-[#2D3A52]'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    reviewMode ? 'translate-x-[22px]' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Pass threshold info */}
          <div className="flex items-center gap-2 text-sm text-[#94A3B8] bg-[#111827] rounded-lg px-4 py-2.5 border border-[#2D3A52]">
            <Info size={16} className="text-[#3B82F6] flex-shrink-0" />
            <span>
              Seuil de réussite : <span className="text-[#F8FAFC] font-semibold">{PASS_THRESHOLD}%</span> requis pour la certification
            </span>
          </div>

          <button
            onClick={startExam}
            disabled={!selectedTrade || starting}
            className="w-full py-3 bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] rounded-xl font-semibold text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {starting ? <Loader2 size={18} className="animate-spin" /> : <Target size={18} />}
            {starting ? 'Préparation...' : "Commencer l'examen"}
          </button>
        </div>
      </div>
    );
  }

  // ─── EXAM PHASE ──────────────────────────────────────────
  if (phase === 'exam') {
    const q = questions[currentIndex];
    const isSubmitted = submittedQuestions.has(q.id);
    const selectedAnswer = answers[q.id];
    const isCorrect = isSubmitted && selectedAnswer === q.answer;
    const isWrong = isSubmitted && selectedAnswer !== q.answer;
    const answeredCount = Object.keys(answers).length;
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
                Question <span className="text-[#F8FAFC] font-semibold">{currentIndex + 1}</span>/{questions.length}
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
                  Mode révision
                </span>
              )}
              <span className="text-xs text-[#94A3B8]">{answeredCount}/{questions.length} répondues</span>
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6 space-y-4"
          >
            <div className="flex items-start gap-2">
              <span className="text-xs font-medium text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-0.5 rounded-full whitespace-nowrap mt-0.5">
                {q.difficulty === 'EASY' ? 'Facile' : q.difficulty === 'HARD' ? 'Difficile' : 'Moyen'}
              </span>
              <p className="text-[#F8FAFC] font-medium">{q.question}</p>
            </div>

            <div className="space-y-2">
              {(q.options || []).map((opt, idx) => {
                const letter = String.fromCharCode(65 + idx);
                let borderColor = 'border-[#2D3A52] hover:border-[#3B82F6]/40';
                let bgColor = 'bg-[#111827]';
                let textColor = 'text-[#94A3B8]';

                if (isSubmitted) {
                  if (opt === q.answer) {
                    borderColor = 'border-[#22C55E]';
                    bgColor = 'bg-[#22C55E]/10';
                    textColor = 'text-[#22C55E]';
                  } else if (opt === selectedAnswer && isWrong) {
                    borderColor = 'border-[#EF4444]';
                    bgColor = 'bg-[#EF4444]/10';
                    textColor = 'text-[#EF4444]';
                  } else {
                    borderColor = 'border-[#2D3A52] opacity-50';
                    textColor = 'text-[#64748B]';
                  }
                } else if (selectedAnswer === opt) {
                  borderColor = 'border-[#3B82F6]';
                  bgColor = 'bg-[#3B82F6]/10';
                  textColor = 'text-[#3B82F6]';
                }

                return (
                  <button
                    key={opt}
                    onClick={() => !isSubmitted && selectAnswer(q.id, opt)}
                    disabled={isSubmitted}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border ${borderColor} ${bgColor} transition-all`}
                  >
                    <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-medium ${textColor} ${
                      isSubmitted ? (opt === q.answer || opt === selectedAnswer ? borderColor : 'border-[#2D3A52]') : 'border-[#2D3A52]'
                    }`}>
                      {isSubmitted && opt === q.answer ? (
                        <CheckCircle size={14} className="text-[#22C55E]" />
                      ) : isSubmitted && opt === selectedAnswer && isWrong ? (
                        <XCircle size={14} className="text-[#EF4444]" />
                      ) : (
                        letter
                      )}
                    </span>
                    <span className={`text-sm ${textColor}`}>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Submit / Feedback */}
            {!isSubmitted ? (
              <button
                onClick={submitAnswer}
                disabled={!selectedAnswer}
                className="w-full py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] rounded-lg font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmer la réponse
              </button>
            ) : (
              <div className={`p-4 rounded-lg ${isCorrect ? 'bg-[#22C55E]/10 border border-[#22C55E]/20' : 'bg-[#EF4444]/10 border border-[#EF4444]/20'}`}>
                <div className="flex items-center gap-2 mb-1">
                  {isCorrect ? (
                    <CheckCircle size={16} className="text-[#22C55E]" />
                  ) : (
                    <XCircle size={16} className="text-[#EF4444]" />
                  )}
                  <span className={`text-sm font-medium ${isCorrect ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                    {isCorrect ? 'Bonne réponse !' : 'Mauvaise réponse'}
                  </span>
                </div>
                {q.explanation && (
                  <p className="text-sm text-[#94A3B8] mt-1">{q.explanation}</p>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={prevQuestion}
                disabled={currentIndex === 0}
                className="flex items-center gap-1 text-sm text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} /> Précédente
              </button>

              {currentIndex === questions.length - 1 ? (
                <button
                  onClick={finishExam}
                  className="px-4 py-2 bg-gradient-to-r from-[#22C55E] to-[#16A34A] rounded-lg font-medium text-white text-sm hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                >
                  Terminer l'examen
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="flex items-center gap-1 text-sm text-[#94A3B8] hover:text-[#F8FAFC]"
                >
                  Suivante <ChevronRight size={16} />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Question dots */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          {questions.map((question, idx) => {
            const isAns = !!answers[question.id];
            const isSub = submittedQuestions.has(question.id);
            const isCur = idx === currentIndex;
            const ansCorrect = isSub && answers[question.id] === question.answer;
            const ansWrong = isSub && answers[question.id] !== question.answer;
            let color = 'bg-[#2D3A52]';
            if (isCur) color = 'bg-[#3B82F6]';
            else if (ansCorrect) color = 'bg-[#22C55E]';
            else if (ansWrong) color = 'bg-[#EF4444]';
            else if (isAns) color = 'bg-[#3B82F6]/60';
            return (
              <button
                key={question.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all ${color} ${isCur ? 'ring-2 ring-[#3B82F6]/50' : ''}`}
              />
            );
          })}
        </div>
      </div>
    );
  }

  // ─── RESULT PHASE ────────────────────────────────────────
  if (phase === 'result' && examResult) {
    const passed = examResult.score >= PASS_THRESHOLD;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Résultat de l'examen</h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Temps: {formatTime(examResult.timeSpent)}
            {reviewMode && (
              <span className="ml-2 text-[#06B6D4]">(Mode révision)</span>
            )}
          </p>
        </div>

        {/* Score card with Pass/Fail badge */}
        <div className={`bg-[#1A2035] border rounded-2xl p-8 text-center ${
          passed ? 'border-[#22C55E]/20' : 'border-[#EF4444]/20'
        }`}>
          {/* Pass/Fail badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-4 ${
            passed
              ? 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30'
              : 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30'
          }`}>
            {passed ? (
              <>
                <Trophy size={16} /> RÉUSSI
              </>
            ) : (
              <>
                <XCircle size={16} /> ÉCHEC
              </>
            )}
          </div>

          <div className={`text-6xl font-bold mb-1 ${passed ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
            {examResult.score}%
          </div>
          <p className={`text-sm mb-4 ${passed ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
            {PASS_THRESHOLD}% requis pour la certification
          </p>

          <div className="flex justify-center gap-6 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#22C55E]">{examResult.correct}</p>
              <p className="text-xs text-[#94A3B8]">Bonnes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#EF4444]">{examResult.incorrect}</p>
              <p className="text-xs text-[#94A3B8]">Mauvaises</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#F8FAFC]">{examResult.total}</p>
              <p className="text-xs text-[#94A3B8]">Total</p>
            </div>
          </div>

          {saved && (
            <p className="text-xs text-[#22C55E] mt-3 flex items-center justify-center gap-1">
              <CheckCircle size={12} /> Résultat enregistré
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={resetExam}
            className="flex-1 py-3 bg-[#3B82F6] rounded-xl font-medium text-white hover:bg-[#2563EB] transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} /> Nouvel examen
          </button>
          <Link
            href="/stats"
            className="flex-1 py-3 bg-[#1A2035] border border-[#2D3A52] rounded-xl font-medium text-[#F8FAFC] hover:bg-[#2D3A52] transition-colors flex items-center justify-center gap-2"
          >
            <BarChart3 size={18} /> Voir les statistiques
          </Link>
        </div>

        {/* Per-chapter breakdown */}
        {examResult.chapterBreakdown.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-[#F8FAFC] mb-3 flex items-center gap-2">
              <GraduationCap size={18} className="text-[#06B6D4]" />
              Résultats par chapitre
            </h2>
            <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-4 space-y-3">
              {examResult.chapterBreakdown.map((cb) => {
                const chPercent = cb.total > 0 ? Math.round((cb.correct / cb.total) * 100) : 0;
                return (
                  <div key={cb.chapterId}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-[#94A3B8]">{cb.chapterName}</span>
                      <span className={`font-medium ${
                        chPercent >= PASS_THRESHOLD ? 'text-[#22C55E]' : 'text-[#EF4444]'
                      }`}>
                        {cb.correct}/{cb.total} ({chPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#111827] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          chPercent >= PASS_THRESHOLD ? 'bg-[#22C55E]' : 'bg-[#EF4444]'
                        }`}
                        style={{ width: `${chPercent}%` }}
                      />
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
            Révision des questions
          </h2>
          <div className="space-y-3">
            {questions.map((q, idx) => {
              const ans = examResult.answers.find((a) => a.questionId === q.id);
              const isCorrect = ans?.correct;
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
                    <p className="text-[#94A3B8]">Votre réponse: <span className={isCorrect ? 'text-[#22C55E]' : 'text-[#EF4444]'}>{ans?.selected || '—'}</span></p>
                    {!isCorrect && (
                      <p className="text-[#22C55E]">Bonne réponse: {q.answer}</p>
                    )}
                    {q.explanation && (
                      <p className="text-[#64748B] text-xs mt-1">{q.explanation}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
