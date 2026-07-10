'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  Target,
  BarChart3,
  Award,
  XCircle,
  Trophy,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Brain,
  RefreshCw,
} from 'lucide-react';
import { getExamHistory, getTradeStats, clearExamHistory, ExamRecord } from '@/lib/examStorage';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

// ─── Types ──────────────────────────────────────────────

interface ExamPerformance {
  examId: string;
  examCode: string;
  examName: string;
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  lastScore: number;
  passedCount: number;
  passRate: number;
}

interface DashboardStats {
  totalExams: number;
  totalAttempts: number;
  averageScore: number;
  passRate: number;
  studyStreak: number;
  byExam: ExamPerformance[];
}

// ─── Skeleton ───────────────────────────────────────────

function StatCardSkeleton() {
  return (
    <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-5 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 w-24 bg-[#2D3A52] rounded" />
        <div className="h-8 w-8 rounded-lg bg-[#2D3A52]" />
      </div>
      <div className="h-7 w-16 bg-[#2D3A52] rounded mt-1" />
      <div className="h-3 w-20 bg-[#2D3A52] rounded mt-2" />
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-5 animate-pulse">
      <div className="h-4 w-32 bg-[#2D3A52] rounded mb-4" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-4 w-40 bg-[#2D3A52] rounded flex-1" />
            <div className="h-4 w-12 bg-[#2D3A52] rounded" />
            <div className="h-4 w-16 bg-[#2D3A52] rounded" />
            <div className="h-4 w-24 bg-[#2D3A52] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Stat Card ──────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  href?: string;
  color: 'blue' | 'green' | 'amber' | 'purple';
}

const colorMap: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-[#3B82F6]/10', text: 'text-[#3B82F6]' },
  green: { bg: 'bg-[#22C55E]/10', text: 'text-[#22C55E]' },
  amber: { bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]' },
  purple: { bg: 'bg-[#8B5CF6]/10', text: 'text-[#8B5CF6]' },
};

function StatCardS({ title, value, icon, subtitle, href, color }: StatCardProps) {
  const c = colorMap[color];
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-5 hover:border-[#3B82F6]/30 transition-all group"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">{title}</span>
        <div className={`h-8 w-8 rounded-lg ${c.bg} flex items-center justify-center`}>
          <div className={c.text}>{icon}</div>
        </div>
      </div>
      <p className={`text-2xl font-bold ${c.text}`}>{value}</p>
      {subtitle && (
        <p className="text-xs text-[#94A3B8] mt-1">{subtitle}</p>
      )}
    </motion.div>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
}

// ─── Error State ────────────────────────────────────────

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5">
      <div className="h-16 w-16 rounded-full bg-[#EF4444]/10 flex items-center justify-center">
        <XCircle size={32} className="text-[#EF4444]" />
      </div>
      <div className="text-center">
        <h3 className="text-base font-semibold text-[#F8FAFC]">Something went wrong</h3>
        <p className="text-sm text-[#94A3B8] mt-1 max-w-sm">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="px-5 py-2.5 rounded-xl bg-[#1A2035] border border-[#2D3A52] text-[#F8FAFC] text-sm font-medium hover:bg-[#243047] transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

// ─── Main Dashboard ─────────────────────────────────────

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [examHistory, setExamHistoryState] = useState<ExamRecord[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<string>('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  function loadStats() {
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('metierium_exam_history') : null;
        let results: any[] = [];
        if (stored) {
          try { results = JSON.parse(stored); } catch {}
        }
        if (!Array.isArray(results)) results = [];

        // Group by trade
        const examMap = new Map<string, {
          examCode: string;
          examName: string;
          scores: number[];
          passedCount: number;
        }>();

        for (const r of results) {
          const key = r.tradeId || 'general';
          if (!examMap.has(key)) {
            examMap.set(key, {
              examCode: (r.tradeCode || r.tradeId || 'GEN').substring(0, 10).toUpperCase(),
              examName: r.tradeName || 'General',
              scores: [],
              passedCount: 0,
            });
          }
          const entry = examMap.get(key)!;
          entry.scores.push(r.score || 0);
          if ((r.score || 0) >= 70) entry.passedCount++;
        }

        const byExam: ExamPerformance[] = [];
        let totalAttempts = 0;
        let totalScoreSum = 0;
        let totalPassed = 0;
        let totalExams = examMap.size;

        for (const [, entry] of examMap) {
          const scores = entry.scores;
          const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
          const best = Math.max(...scores);
          const last = scores[scores.length - 1];
          totalAttempts += scores.length;
          totalScoreSum += entry.passedCount * 70 + (avg < 70 ? avg : 70);
          totalPassed += entry.passedCount;

          byExam.push({
            examId: entry.examCode,
            examCode: entry.examCode,
            examName: entry.examName,
            totalAttempts: scores.length,
            averageScore: avg,
            bestScore: best,
            lastScore: last,
            passedCount: entry.passedCount,
            passRate: Math.round((entry.passedCount / scores.length) * 100),
          });
        }

        // Sort: most attempted first
        byExam.sort((a, b) => b.totalAttempts - a.totalAttempts);

        const averageScore = totalAttempts > 0
          ? Math.round(results.reduce((sum, r) => sum + (r.score || 0), 0) / totalAttempts)
          : 0;
        const passRate = totalAttempts > 0
          ? Math.round((totalPassed / totalAttempts) * 100)
          : 0;

        // Study streak: count consecutive days with exams
        let streak = 0;
        if (results.length > 0) {
          const dates = results
            .map(r => new Date(r.date).toISOString().split('T')[0])
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
          const uniqueDays = [...new Set(dates)];
          const today = new Date().toISOString().split('T')[0];
          // Simple streak: count days with activity
          streak = Math.max(1, Math.min(uniqueDays.length, 7));
        } else {
          streak = 1;
        }

        setStats({
          totalExams,
          totalAttempts,
          averageScore,
          passRate,
          studyStreak: streak,
          byExam,
        });
      } catch (err: any) {
        setError(err?.message || 'Failed to load dashboard');
      }
      setLoading(false);
    })();
  }

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const h = getExamHistory();
    setExamHistoryState(h);
    if (h.length > 0) setSelectedTrade(h[0].tradeId);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  // ── Loading state ──────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#F8FAFC]">Dashboard</h1>
            <p className="text-sm text-[#94A3B8] mt-0.5">Your study overview</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <TableSkeleton />
      </div>
    );
  }

  // ── Error state ────────────────────────────────────
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#F8FAFC]">Dashboard</h1>
            <p className="text-sm text-[#94A3B8] mt-0.5">Your study overview</p>
          </div>
        </div>
        <ErrorState message={error} onRetry={loadStats} />
      </div>
    );
  }

  // ── Loaded state ───────────────────────────────────
  const { totalExams, totalAttempts, averageScore, passRate, studyStreak, byExam } = stats!;
  const totalPassed = byExam.reduce((sum, e) => sum + e.passedCount, 0);

  const sorted = [...byExam].sort((a, b) => b.averageScore - a.averageScore);
  const strongest = sorted.length > 0 && sorted[sorted.length - 1].averageScore > 0 ? sorted[0] : null;
  const weakest = sorted.find(e => e.averageScore < 70 && e.totalAttempts >= 2) || null;
  const tradeIds = [...new Set(examHistory.map(r => r.tradeId))];
  const statsData = selectedTrade ? getTradeStats(selectedTrade) : null;

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl font-bold text-[#F8FAFC]">Dashboard</h1>
          <p className="text-sm text-[#94A3B8] mt-0.5">Your study overview</p>
        </div>
      </motion.div>

      {/* Stat cards — 5 across */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Link href="/exams">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-5 hover:border-[#3B82F6]/30 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">Exams Available</span>
              <div className="h-8 w-8 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
                <BookOpen size={16} className="text-[#3B82F6]" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#3B82F6]">{totalExams}</p>
            <p className="text-xs text-[#94A3B8] mt-1">{byExam.length} of {totalExams} practiced</p>
          </motion.div>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">Total Attempts</span>
            <div className="h-8 w-8 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center">
              <Zap size={16} className="text-[#8B5CF6]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#8B5CF6]">{totalAttempts}</p>
          <p className="text-xs text-[#94A3B8] mt-1">All-time attempts</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">Average Score</span>
            <div className="h-8 w-8 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
              <TrendingUp size={16} className={`${averageScore >= 70 ? 'text-[#22C55E]' : 'text-[#F59E0B]'}`} />
            </div>
          </div>
          <p className={`text-2xl font-bold ${averageScore >= 70 ? 'text-[#22C55E]' : 'text-[#F59E0B]'}`}>
            {totalAttempts > 0 ? `${averageScore}%` : '—'}
          </p>
          <p className="text-xs text-[#94A3B8] mt-1">
            {totalAttempts > 0
              ? `Based on ${totalAttempts} attempt${totalAttempts > 1 ? 's' : ''}`
              : 'No attempts yet'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">Pass Rate</span>
            <div className="h-8 w-8 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
              <Target size={16} className={passRate >= 70 ? 'text-[#22C55E]' : 'text-[#F59E0B]'} />
            </div>
          </div>
          <p className={`text-2xl font-bold ${passRate >= 70 ? 'text-[#22C55E]' : 'text-[#F59E0B]'}`}>
            {totalAttempts > 0 ? `${passRate}%` : '—'}
          </p>
          <p className="text-xs text-[#94A3B8] mt-1">
            {totalAttempts > 0 ? `${totalPassed} / ${totalAttempts} ≥70%` : 'No attempts yet'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">Study Streak</span>
            <div className="h-8 w-8 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
              <Clock size={16} className="text-[#F59E0B]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#F59E0B]">
            {studyStreak === 1 ? '1 day' : `${studyStreak} days`}
          </p>
          <p className="text-xs text-[#94A3B8] mt-1">Keep it going!</p>
        </motion.div>
      </div>

      {/* Strength / Weakness */}
      {(strongest || weakest) && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {strongest && (
            <div
              className="bg-[#1A2035] border border-[#22C55E]/20 rounded-xl p-4 cursor-pointer hover:bg-[#243047]/30 transition-colors"
              onClick={() => window.location.href = `/exams`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Award size={14} className="text-[#22C55E]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#22C55E]">STRENGTH</span>
              </div>
              <p className="text-sm font-medium text-[#F8FAFC] truncate">{strongest.examCode} — {strongest.examName}</p>
              <div className="flex gap-4 mt-2 text-xs text-[#94A3B8]">
                <span>Avg. <span className="text-[#22C55E] font-semibold">{strongest.averageScore}%</span></span>
                <span>Best <span className="text-[#22C55E] font-semibold">{strongest.bestScore}%</span></span>
                <span>{strongest.totalAttempts} att.</span>
              </div>
            </div>
          )}
          {weakest && (
            <div
              className="bg-[#1A2035] border border-[#EF4444]/20 rounded-xl p-4 cursor-pointer hover:bg-[#243047]/30 transition-colors"
              onClick={() => window.location.href = `/exams`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Target size={14} className="text-[#EF4444]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#EF4444]">WEAKNESS</span>
              </div>
              <p className="text-sm font-medium text-[#F8FAFC] truncate">{weakest.examCode} — {weakest.examName}</p>
              <div className="flex gap-4 mt-2 text-xs text-[#94A3B8]">
                <span>Avg. <span className="text-[#EF4444] font-semibold">{weakest.averageScore}%</span></span>
                <span>Best <span className="text-[#F59E0B] font-semibold">{weakest.bestScore}%</span></span>
                <span>{weakest.totalAttempts} att.</span>
              </div>
            </div>
          )}
          {!strongest && <div />}
          {!weakest && <div />}
        </motion.div>
      )}

      {/* Exam Performance table */}
      {byExam.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[#1A2035] border border-[#2D3A52] rounded-xl overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-[#2D3A52]">
            <h2 className="text-sm font-semibold text-[#F8FAFC] flex items-center gap-2">
              <BarChart3 size={16} className="text-[#64748B]" />
              Exam Performance
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2D3A52]">
                  <th className="text-left px-5 py-3 text-[11px] font-medium text-[#64748B] uppercase tracking-wider">EXAMS</th>
                  <th className="text-right px-5 py-3 text-[11px] font-medium text-[#64748B] uppercase tracking-wider">ATTEMPTS</th>
                  <th className="text-right px-5 py-3 text-[11px] font-medium text-[#64748B] uppercase tracking-wider">AVG SCORE</th>
                  <th className="text-right px-5 py-3 text-[11px] font-medium text-[#64748B] uppercase tracking-wider">BEST</th>
                  <th className="text-right px-5 py-3 text-[11px] font-medium text-[#64748B] uppercase tracking-wider">LAST</th>
                  <th className="text-center px-5 py-3 text-[11px] font-medium text-[#64748B] uppercase tracking-wider">TRENDING</th>
                  <th className="text-right px-5 py-3 text-[11px] font-medium text-[#64748B] uppercase tracking-wider">PASS RATE</th>
                </tr>
              </thead>
              <tbody>
                {byExam.map((exam, i) => {
                  const trending = exam.lastScore >= exam.averageScore;
                  return (
                    <motion.tr
                      key={exam.examId}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.04 }}
                      className="border-b border-[#2D3A52]/50 last:border-b-0 hover:bg-[#243047]/30 transition-colors cursor-pointer"
                      onClick={() => window.location.href = `/exams`}
                    >
                      <td className="px-5 py-3 text-[#F8FAFC] font-medium">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#3B82F6]/10 text-[#3B82F6] font-mono">{exam.examCode}</span>
                          <span>{exam.examName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right text-[#F8FAFC] font-mono tabular-nums">{exam.totalAttempts}</td>
                      <td className={`px-5 py-3 text-right font-mono tabular-nums ${exam.averageScore >= 70 ? 'text-[#22C55E]' : 'text-[#F59E0B]'}`}>
                        {exam.averageScore}%
                      </td>
                      <td className="px-5 py-3 text-right font-mono tabular-nums text-[#22C55E]">{exam.bestScore}%</td>
                      <td className={`px-5 py-3 text-right font-mono tabular-nums ${exam.lastScore >= 70 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                        {exam.lastScore}%
                      </td>
                      <td className="px-5 py-3 text-center">
                        {trending
                          ? <TrendingUp size={16} className="text-[#22C55E] mx-auto" />
                          : <TrendingDown size={16} className="text-[#EF4444] mx-auto" />}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className={`text-xs font-medium ${exam.passRate >= 70 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                          {exam.passedCount}/{exam.totalAttempts}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {byExam.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-[#94A3B8]">
              Complete your first exam to see performance data
            </div>
          )}
        </motion.div>
      )}

      {/* Empty state if no exams */}
      {byExam.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-10 text-center"
        >
          <div className="w-14 h-14 rounded-full bg-[#3B82F6]/10 flex items-center justify-center mx-auto mb-4">
            <BookOpen size={24} className="text-[#3B82F6]" />
          </div>
          <h3 className="text-base font-semibold text-[#F8FAFC]">No exams yet</h3>
          <p className="text-sm text-[#94A3B8] mt-1 max-w-sm mx-auto">
            Start practicing to track your performance across all trades
          </p>
          <Link
            href="/exams"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] rounded-xl font-medium text-white text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
          >
            <Sparkles size={16} />
            Start your first exam
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      )}

      {/* ── Exam History Section — merged from /stats ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        id="exam-history"
        className="space-y-4 pt-2"
      >
        {/* Section header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#F8FAFC] flex items-center gap-2">
            <BarChart3 size={20} className="text-[#3B82F6]" />
            Statistiques par métier
          </h2>
          {examHistory.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-xs text-[#EF4444] hover:text-[#DC2626] px-3 py-1.5 rounded-lg border border-[#EF4444]/20 hover:bg-[#EF4444]/10 transition-colors"
            >
              Effacer l'historique
            </button>
          )}
        </div>

        {examHistory.length === 0 ? (
          <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-8 text-center">
            <BarChart3 size={48} className="mx-auto text-[#2D3A52] mb-3" />
            <p className="text-sm text-[#94A3B8]">Aucun examen complété pour le moment.</p>
          </div>
        ) : (
          <>
            {/* Trade selector */}
            {tradeIds.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {tradeIds.map(tid => {
                  const name = examHistory.find(r => r.tradeId === tid)?.tradeName || tid;
                  return (
                    <button
                      key={tid}
                      onClick={() => setSelectedTrade(tid)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                        selectedTrade === tid
                          ? 'border-[#3B82F6] bg-[#3B82F6]/10 text-[#3B82F6]'
                          : 'border-[#2D3A52] text-[#94A3B8] hover:border-[#3B82F6]/40'
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            )}

            {statsData && (
              <>
                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award size={16} className="text-[#F59E0B]" />
                      <span className="text-xs text-[#94A3B8]">Moyenne</span>
                    </div>
                    <p className="text-2xl font-bold text-[#F8FAFC]">{statsData.averageScore}%</p>
                    <div className="mt-2 w-full h-1.5 bg-[#111827] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${statsData.averageScore >= 70 ? 'bg-[#22C55E]' : 'bg-[#EF4444]'}`}
                        style={{ width: `${statsData.averageScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target size={16} className="text-[#06B6D4]" />
                      <span className="text-xs text-[#94A3B8]">Taux de réussite</span>
                    </div>
                    <p className="text-2xl font-bold text-[#F8FAFC]">{statsData.passRate}%</p>
                    <p className="text-xs text-[#94A3B8] mt-1">{statsData.passed} / {statsData.totalExams} réussis</p>
                  </div>

                  <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy size={16} className="text-[#F59E0B]" />
                      <span className="text-xs text-[#94A3B8]">Meilleur score</span>
                    </div>
                    <p className="text-2xl font-bold text-[#22C55E]">{statsData.bestScore}%</p>
                    {statsData.scoreTrend !== 0 && (
                      <p className={`text-xs mt-1 flex items-center gap-1 ${statsData.scoreTrend > 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                        {statsData.scoreTrend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {statsData.scoreTrend > 0 ? '+' : ''}{statsData.scoreTrend}% récent
                      </p>
                    )}
                  </div>

                  <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={16} className="text-[#8B5CF6]" />
                      <span className="text-xs text-[#94A3B8]">Temps total</span>
                    </div>
                    <p className="text-2xl font-bold text-[#F8FAFC] text-lg">{formatTime(statsData.totalTime)}</p>
                    <p className="text-xs text-[#94A3B8] mt-1">{statsData.totalQuestions} questions</p>
                  </div>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap size={16} className="text-[#22C55E]" />
                      <h3 className="font-semibold text-[#F8FAFC]">Points forts</h3>
                    </div>
                    {statsData.strengths.length > 0 ? (
                      <div className="space-y-2">
                        {statsData.strengths.map(s => (
                          <div key={s.chapterNumber}>
                            <div className="flex justify-between text-xs mb-0.5">
                              <span className="text-[#94A3B8]">{s.tradeName ? `${s.tradeName} > ` : ''}{s.chapterName}</span>
                              <span className="text-[#22C55E] font-medium">{s.percentage}%</span>
                            </div>
                            <div className="w-full h-2 bg-[#111827] rounded-full overflow-hidden">
                              <div className="h-full bg-[#22C55E] rounded-full" style={{ width: `${s.percentage}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[#64748B]">Pas assez de données pour déterminer les points forts.</p>
                    )}
                  </div>

                  <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle size={16} className="text-[#EF4444]" />
                      <h3 className="font-semibold text-[#F8FAFC]">Points à améliorer</h3>
                    </div>
                    {statsData.weaknesses.length > 0 ? (
                      <div className="space-y-2">
                        {statsData.weaknesses.map(s => (
                          <div key={s.chapterNumber}>
                            <div className="flex justify-between text-xs mb-0.5">
                              <span className="text-[#94A3B8]">{s.tradeName ? `${s.tradeName} > ` : ''}{s.chapterName}</span>
                              <span className="text-[#EF4444] font-medium">{s.percentage}%</span>
                            </div>
                            <div className="w-full h-2 bg-[#111827] rounded-full overflow-hidden">
                              <div className="h-full bg-[#EF4444] rounded-full" style={{ width: `${s.percentage}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[#64748B]">Pas assez de données pour déterminer les points faibles.</p>
                    )}

                    {statsData.needsReview.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[#2D3A52]">
                        <p className="text-xs text-[#94A3B8] mb-1">Chapitres à réviser</p>
                        <div className="flex flex-wrap gap-1.5">
                          {statsData.needsReview.map((ch, i) => (
                            <Link
                              key={ch.chapterName || i}
                              href={`/theory?tradeId=${ch.tradeId || ''}&chapterId=${ch.chapterId || ''}`}
                              className="text-xs bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] px-2 py-0.5 rounded-full hover:bg-[#EF4444]/20 transition-colors"
                            >
                              {ch.tradeName ? `${ch.tradeName} > ${ch.chapterName}` : ch.chapterName}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Chapter Performance */}
                <div>
                  <h3 className="text-base font-semibold text-[#F8FAFC] mb-3 flex items-center gap-2">
                    <Brain size={18} className="text-[#8B5CF6]" />
                    Performance par chapitre
                  </h3>
                  <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-5 space-y-3">
                    {statsData.chapterPerformance.length > 0 ? (
                      statsData.chapterPerformance.map(ch => {
                        const color = ch.percentage >= 70 ? '#22C55E' : ch.percentage >= 50 ? '#F59E0B' : '#EF4444';
                        return (
                          <div key={ch.chapterNumber}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-[#F8FAFC] font-medium">{ch.tradeName ? `${ch.tradeName} > ` : ''}{ch.chapterName}</span>
                              <span className="font-medium" style={{ color }}>{ch.percentage}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2.5 bg-[#111827] rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all"
                                  style={{ width: `${ch.percentage}%`, backgroundColor: color }}
                                />
                              </div>
                              <span className="text-[10px] text-[#64748B] w-12 text-right">{ch.correct}/{ch.total}</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-[#64748B]">Aucune donnée par chapitre pour le moment.</p>
                    )}
                  </div>
                </div>

                {/* Recent history */}
                <div>
                  <h3 className="text-base font-semibold text-[#F8FAFC] mb-3 flex items-center gap-2">
                    <Clock size={18} className="text-[#3B82F6]" />
                    Examens récents
                  </h3>
                  <div className="space-y-2">
                    {statsData.recentHistory.map(record => (
                      <div
                        key={record.id}
                        className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                            record.passed ? 'bg-[#22C55E]/10' : 'bg-[#EF4444]/10'
                          }`}>
                            {record.passed
                              ? <CheckCircle size={18} className="text-[#22C55E]" />
                              : <AlertTriangle size={18} className="text-[#EF4444]" />
                            }
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#F8FAFC]">
                              {record.tradeName ? `${record.tradeName} > ` : ''}{record.passed ? 'Réussi' : 'Échec'} — {record.totalQuestions} questions
                            </p>
                            <p className="text-xs text-[#64748B]">
                              {new Date(record.date).toLocaleDateString('fr-CA', {
                                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                              })}
                              {' · '} {formatTime(record.timeSpent)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${record.passed ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                            {record.score}%
                          </p>
                          <p className="text-xs text-[#64748B]">{record.correct}/{record.totalQuestions}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex gap-3">
                  <Link
                    href="/exams"
                    className="flex-1 py-3 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] rounded-xl font-medium text-white text-center hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  >
                    Nouvel examen
                  </Link>
                  <Link
                    href="/theory"
                    className="flex-1 py-3 border border-[#2D3A52] rounded-xl font-medium text-[#94A3B8] text-center hover:border-[#3B82F6]/40 hover:text-[#F8FAFC]"
                  >
                    Réviser la théorie
                  </Link>
                </div>
              </>
            )}
          </>
        )}
      </motion.div>

      {/* Clear confirm modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2">Effacer l'historique</h3>
            <p className="text-sm text-[#94A3B8] mb-4">
              Toutes vos statistiques d'examens seront définitivement supprimées. Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 border border-[#2D3A52] rounded-lg text-sm text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  clearExamHistory();
                  setExamHistoryState([]);
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-2.5 bg-[#EF4444] rounded-lg text-sm text-white font-medium hover:bg-[#DC2626]"
              >
                Effacer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
