'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Calendar,
  Shield,
  CreditCard,
  Clock,
  MessageSquare,
  AlertCircle,
  Loader2,
  User,
  BarChart3,
  CheckCircle2,
  XCircle,
  Send,
  Inbox,
  GraduationCap,
  Target,
  Trophy,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Bot,
  Activity,
  Flame,
  Brain,
  AlertTriangle,
  CheckCircle,
  X,
  ChevronRight,
  LogIn,
} from 'lucide-react';
import { authApi } from '@/lib/api';
import { useLocale } from '@/src/contexts/LocaleContext';
import { renderAIResponse } from '@/lib/ai-markdown';

// ─── Types ──────────────────────────────────────────────────

interface SubscriptionDetail {
  id: string;
  plan: string;
  status: string;
  stripeSubId: string | null;
  currentPeriod: string | null;
  createdAt: string;
  updatedAt: string;
  tradeId: string | null;
  trade: { id: string; code: string; name: string; nameFr: string } | null;
}

interface ContactMsg {
  id: string;
  name: string;
  message: string;
  direction: string;
  status: string;
  createdAt: string;
}

interface UserDetail {
  id: string;
  email: string;
  name: string | null;
  role: string;
  plan: string;
  subStatus: string | null;
  stripeId: string | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  subscriptions: SubscriptionDetail[];
  contactMessages: ContactMsg[];
  examStats: {
    totalAttempts: number;
    averageScore: number;
    bestScore: number;
    passedCount: number;
    passRate: number;
    totalQuestionsAnswered: number;
    totalCorrect: number;
    accuracy: number;
    totalTimeSpent: number;
    studyStreak: number;
    momentum: number;
    firstAttemptAt: string | null;
    lastAttemptAt: string | null;
    tradesStudied: number;
  };
  byTrade: {
    tradeId: string;
    code: string;
    name: string;
    nameFr: string;
    attempts: number;
    averageScore: number;
    bestScore: number;
    lastScore: number;
    passed: number;
    passRate: number;
    trending: boolean;
  }[];
  recentAttempts: {
    id: string;
    score: number;
    totalQuestions: number;
    correctCount: number;
    timeSpent: number;
    difficulty: string | null;
    reviewMode: boolean;
    passed: boolean;
    completedAt: string;
    trade: { code: string; name: string; nameFr: string } | null;
  }[];
  chapterPerformance: {
    chapterId: string;
    tradeId: string;
    chapterNumber: number;
    chapterName: string;
    chapterNameFr: string;
    tradeCode: string;
    tradeName: string;
    tradeNameFr: string;
    correct: number;
    total: number;
    percentage: number;
  }[];
  strengths: { chapterId: string; tradeId: string; chapterName: string; chapterNameFr: string; tradeName: string; tradeNameFr: string; percentage: number; correct: number; total: number }[];
  weaknesses: { chapterId: string; tradeId: string; chapterName: string; chapterNameFr: string; tradeName: string; tradeNameFr: string; percentage: number; correct: number; total: number }[];
  needsReview: { chapterId: string; tradeId: string; chapterName: string; chapterNameFr: string; tradeName: string; tradeNameFr: string; percentage: number; correct: number; total: number }[];
  tutorStats: {
    sessions: number;
    messages: number;
    lastActivityAt: string | null;
    lastTopic: string | null;
  };
  chatSessions: {
    id: string;
    topic: string | null;
    updatedAt: string;
    messageCount: number;
  }[];
  recentActivity: {
    id: string;
    action: string;
    details: Record<string, unknown> | null;
    createdAt: string;
  }[];
  stats: {
    totalSubscriptions: number;
    activeSubscriptions: number;
    contactMessageCount: number;
    accountAgeDays: number;
  };
}

// ─── Helpers ────────────────────────────────────────────────

const PLAN_COLORS: Record<string, string> = {
  FREE: 'bg-[#64748B]/15 text-[#64748B]',
  MONTHLY: 'bg-[#3B82F6]/15 text-[#3B82F6]',
  YEARLY: 'bg-[#8B5CF6]/15 text-[#8B5CF6]',
  LIFETIME: 'bg-[#10B981]/15 text-[#10B981]',
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-[#10B981]/15 text-[#10B981]',
  PAST_DUE: 'bg-[#F59E0B]/15 text-[#F59E0B]',
  CANCELLED: 'bg-[#EF4444]/15 text-[#EF4444]',
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `il y a ${diffMins} min`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `il y a ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  return `il y a ${diffDays}j`;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins < 60) return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return remMins > 0 ? `${hours}h ${remMins}m` : `${hours}h`;
}

function scoreColor(score: number): string {
  if (score >= 60) return 'text-[#10B981]';
  if (score >= 50) return 'text-[#F59E0B]';
  return 'text-[#EF4444]';
}

function Avatar({ name, size = 'xl' }: { name: string; size?: 'md' | 'lg' | 'xl' }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const sizeClass =
    size === 'md' ? 'w-9 h-9 text-xs' :
    size === 'lg' ? 'w-14 h-14 text-xl' :
    'w-20 h-20 text-2xl';
  const colors = [
    'bg-[#3B82F6]/20 text-[#3B82F6]',
    'bg-[#06B6D4]/20 text-[#06B6D4]',
    'bg-[#8B5CF6]/20 text-[#8B5CF6]',
    'bg-[#10B981]/20 text-[#10B981]',
    'bg-[#F59E0B]/20 text-[#F59E0B]',
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div className={`${sizeClass} rounded-full flex items-center justify-center font-bold ${colors[idx]}`}>
      {initials}
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const { locale } = useLocale();

  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Tutor chat viewer modal ──
  const [selectedChat, setSelectedChat] = useState<{
    id: string;
    topic: string | null;
    user: { id: string; name: string | null; email: string } | null;
    messages: { id: string; role: string; content: string; createdAt: string }[];
  } | null>(null);
  const [chatLoading, setChatLoading] = useState(false);

  // ── Email modal ──
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailResult, setEmailResult] = useState<{ ok: boolean; msg: string } | null>(null);

  function openEmailModal() {
    setEmailSubject('');
    setEmailBody('');
    setEmailResult(null);
    setEmailOpen(true);
  }

  async function handleSendEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !emailSubject.trim() || !emailBody.trim()) return;
    setEmailSending(true);
    setEmailResult(null);
    try {
      const res = await authApi('/api/admin/contact-messages/send', {
        method: 'POST',
        body: JSON.stringify({
          to: user.email,
          toName: user.name || '',
          subject: emailSubject.trim(),
          body: emailBody.trim(),
        }),
      });
      if (res.emailSent) {
        setEmailResult({ ok: true, msg: locale === 'fr' ? 'Email envoyé' : 'Email sent' });
        setEmailSubject('');
        setEmailBody('');
        setTimeout(() => setEmailOpen(false), 1500);
      } else {
        setEmailResult({ ok: false, msg: locale === 'fr' ? "Échec de l'envoi" : 'Failed to send' });
      }
    } catch (err) {
      setEmailResult({ ok: false, msg: err instanceof Error ? err.message : (locale === 'fr' ? "Échec de l'envoi" : 'Failed to send') });
    } finally {
      setEmailSending(false);
    }
  }

  const openChat = useCallback(async (id: string) => {
    setChatLoading(true);
    setSelectedChat({ id, topic: null, user: null, messages: [] });
    try {
      const json = await authApi(`/api/admin/chat-sessions/${id}`);
      setSelectedChat(json);
    } catch {
      setSelectedChat(null);
    } finally {
      setChatLoading(false);
    }
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authApi(`/api/admin/users/${userId}`);
      setUser(data);
    } catch (err) {
      if (err instanceof Error && err.message.includes('401')) {
        localStorage.removeItem('token');
        router.push('/admin/login');
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to load user');
    } finally {
      setLoading(false);
    }
  }, [userId, router]);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  // ─── Loading ───
  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="w-32 h-5 bg-[#1A2035] rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-48 bg-[#1A2035] rounded-xl animate-pulse" />
            <div className="h-64 bg-[#1A2035] rounded-xl animate-pulse" />
          </div>
          <div className="h-48 bg-[#1A2035] rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  // ─── Error ───
  if (error || !user) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="p-2 rounded-lg text-[#64748B] hover:text-[#F8FAFC] hover:bg-[#1A2035] transition-colors">
            <ArrowLeft size={18} />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-[#EF4444]/10 flex items-center justify-center mb-4">
            <AlertCircle size={24} className="text-[#EF4444]" />
          </div>
          <h2 className="text-lg font-medium text-[#F8FAFC] mb-1">
            {locale === 'fr' ? 'Utilisateur non trouvé' : 'User not found'}
          </h2>
          <p className="text-sm text-[#64748B]">{error}</p>
          <Link
            href="/admin/users"
            className="mt-4 px-4 py-2 bg-[#3B82F6] text-white rounded-lg text-sm font-medium hover:bg-[#2563EB] transition-colors"
          >
            {locale === 'fr' ? 'Retour aux utilisateurs' : 'Back to users'}
          </Link>
        </div>
      </div>
    );
  }

  const displayName = user.name ?? user.email;
  const { stats } = user;

  const statCards = [
    {
      label: locale === 'fr' ? 'Abonnements' : 'Subscriptions',
      value: stats.totalSubscriptions,
      icon: CreditCard,
      color: 'text-[#3B82F6]',
    },
    {
      label: locale === 'fr' ? 'Abonnements actifs' : 'Active subs',
      value: stats.activeSubscriptions,
      icon: CheckCircle2,
      color: 'text-[#10B981]',
    },
    {
      label: locale === 'fr' ? 'Messages contact' : 'Contact msgs',
      value: stats.contactMessageCount,
      icon: MessageSquare,
      color: 'text-[#8B5CF6]',
    },
    {
      label: locale === 'fr' ? 'Âge du compte' : 'Account age',
      value: `${stats.accountAgeDays}j`,
      icon: Calendar,
      color: 'text-[#F59E0B]',
    },
  ];

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/admin/users" className="text-[#64748B] hover:text-[#F8FAFC] transition-colors">
          {locale === 'fr' ? 'Utilisateurs' : 'Users'}
        </Link>
        <span className="text-[#64748B]">/</span>
        <span className="text-[#F8FAFC] font-medium">{displayName}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <Avatar name={displayName} size="xl" />
          <div>
            <h1 className="text-2xl font-semibold text-[#F8FAFC]">{displayName}</h1>
            <p className="text-sm text-[#64748B] mt-0.5">{user.email}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                user.role === 'ADMIN' ? 'bg-[#8B5CF6]/15 text-[#8B5CF6]' : 'bg-[#3B82F6]/15 text-[#3B82F6]'
              }`}>
                {user.role}
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${PLAN_COLORS[user.plan] ?? PLAN_COLORS.FREE}`}>
                {user.plan}
              </span>
              {user.subStatus && (
                <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${STATUS_COLORS[user.subStatus] ?? STATUS_COLORS.ACTIVE}`}>
                  {user.subStatus}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {statCards.map((card) => (
              <div key={card.label} className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <card.icon size={14} className={card.color} />
                  <p className="text-[10px] font-medium text-[#64748B] uppercase tracking-wide">{card.label}</p>
                </div>
                <p className="text-2xl font-bold text-[#F8FAFC]">{card.value}</p>
              </div>
            ))}
          </div>

          {/* ── Learning performance (mirrors student dashboard) ──── */}
          <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#2D3A52] flex items-center gap-2">
              <GraduationCap size={15} className="text-[#06B6D4]" />
              <h2 className="text-base font-semibold text-[#F8FAFC]">
                {locale === 'fr' ? "Performance d'apprentissage" : 'Learning performance'}
              </h2>
            </div>

            {user.examStats.totalAttempts > 0 ? (
              <div className="p-6 space-y-6">
                {/* ── Stat cards (5) ── */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  <div className="bg-[#0F1424] border border-[#2D3A52] rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <BookOpen size={12} className="text-[#3B82F6]" />
                      <p className="text-[9px] font-medium text-[#64748B] uppercase tracking-wide">
                        {locale === 'fr' ? 'Examens' : 'Exams'}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-[#F8FAFC]">{user.examStats.totalAttempts}</p>
                    <p className="text-[10px] text-[#64748B]">
                      {user.examStats.tradesStudied} {locale === 'fr' ? 'métier(s)' : 'trade(s)'}
                    </p>
                  </div>
                  <div className="bg-[#0F1424] border border-[#2D3A52] rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Target size={12} className="text-[#F59E0B]" />
                      <p className="text-[9px] font-medium text-[#64748B] uppercase tracking-wide">
                        {locale === 'fr' ? 'Moyenne' : 'Average'}
                      </p>
                    </div>
                    <p className={`text-xl font-bold ${scoreColor(user.examStats.averageScore)}`}>
                      {user.examStats.averageScore}%
                    </p>
                    <p className="text-[10px] text-[#64748B]">
                      {locale === 'fr' ? 'meilleur' : 'best'} {user.examStats.bestScore}%
                    </p>
                  </div>
                  <div className="bg-[#0F1424] border border-[#2D3A52] rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Trophy size={12} className="text-[#10B981]" />
                      <p className="text-[9px] font-medium text-[#64748B] uppercase tracking-wide">
                        {locale === 'fr' ? 'Réussite' : 'Pass rate'}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-[#F8FAFC]">{user.examStats.passRate}%</p>
                    <p className="text-[10px] text-[#64748B]">
                      {user.examStats.passedCount}/{user.examStats.totalAttempts} {locale === 'fr' ? 'réussis' : 'passed'}
                    </p>
                  </div>
                  <div className="bg-[#0F1424] border border-[#2D3A52] rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <TrendingUp size={12} className="text-[#8B5CF6]" />
                      <p className="text-[9px] font-medium text-[#64748B] uppercase tracking-wide">
                        {locale === 'fr' ? 'Précision' : 'Accuracy'}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-[#F8FAFC]">{user.examStats.accuracy}%</p>
                    <p className="text-[10px] text-[#64748B]">
                      {user.examStats.totalCorrect}/{user.examStats.totalQuestionsAnswered} {locale === 'fr' ? 'bonnes' : 'correct'}
                    </p>
                  </div>
                  <div className="bg-[#0F1424] border border-[#2D3A52] rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Flame size={12} className="text-[#EF4444]" />
                      <p className="text-[9px] font-medium text-[#64748B] uppercase tracking-wide">
                        {locale === 'fr' ? 'Série' : 'Streak'}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-[#F8FAFC]">{user.examStats.studyStreak}</p>
                    <p className="text-[10px] text-[#64748B]">
                      {locale === 'fr' ? 'jour(s)' : 'day(s)'}
                    </p>
                  </div>
                </div>

                {/* ── Insights row (5) ── */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="bg-[#0F1424] border border-[#2D3A52] rounded-lg p-3 text-center">
                    <p className="text-[9px] font-medium text-[#64748B] uppercase tracking-wide mb-1">
                      {locale === 'fr' ? 'Record perso' : 'Personal best'}
                    </p>
                    <p className="text-lg font-bold text-[#10B981]">{user.examStats.bestScore}%</p>
                  </div>
                  <div className="bg-[#0F1424] border border-[#2D3A52] rounded-lg p-3 text-center">
                    <p className="text-[9px] font-medium text-[#64748B] uppercase tracking-wide mb-1">
                      {locale === 'fr' ? 'Taux réussite' : 'Success rate'}
                    </p>
                    <p className="text-lg font-bold text-[#F8FAFC]">{user.examStats.passRate}%</p>
                  </div>
                  <div className="bg-[#0F1424] border border-[#2D3A52] rounded-lg p-3 text-center">
                    <p className="text-[9px] font-medium text-[#64748B] uppercase tracking-wide mb-1">
                      {locale === 'fr' ? 'Questions' : 'Questions'}
                    </p>
                    <p className="text-lg font-bold text-[#F8FAFC]">{user.examStats.totalQuestionsAnswered}</p>
                    <p className="text-[10px] text-[#64748B]">{user.examStats.accuracy}% {locale === 'fr' ? 'précision' : 'accuracy'}</p>
                  </div>
                  <div className="bg-[#0F1424] border border-[#2D3A52] rounded-lg p-3 text-center">
                    <p className="text-[9px] font-medium text-[#64748B] uppercase tracking-wide mb-1">
                      {locale === 'fr' ? 'Momentum' : 'Momentum'}
                    </p>
                    <p className={`text-lg font-bold ${user.examStats.momentum >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                      {user.examStats.momentum >= 0 ? '+' : ''}{user.examStats.momentum}%
                    </p>
                  </div>
                  <div className="bg-[#0F1424] border border-[#2D3A52] rounded-lg p-3 text-center">
                    <p className="text-[9px] font-medium text-[#64748B] uppercase tracking-wide mb-1">
                      {locale === 'fr' ? 'Dernière activité' : 'Last activity'}
                    </p>
                    <p className="text-sm font-bold text-[#F8FAFC]">
                      {user.examStats.lastAttemptAt ? formatRelativeTime(user.examStats.lastAttemptAt) : '—'}
                    </p>
                  </div>
                </div>

                {/* ── Strength / Weakness cards ── */}
                {user.byTrade.length >= 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Strength */}
                    {(() => {
                      const strongest = [...user.byTrade].sort((a, b) => b.averageScore - a.averageScore)[0];
                      return strongest ? (
                        <div className="bg-[#0F1424] border border-[#10B981]/30 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Trophy size={16} className="text-[#10B981]" />
                            <p className="text-xs font-semibold text-[#10B981] uppercase tracking-wide">
                              {locale === 'fr' ? 'Force' : 'Strength'}
                            </p>
                          </div>
                          <p className="text-sm font-medium text-[#F8FAFC]">
                            {locale === 'fr' ? strongest.nameFr : strongest.name}
                          </p>
                          <p className="text-2xl font-bold text-[#10B981] mt-1">{strongest.averageScore}%</p>
                          <p className="text-[10px] text-[#64748B]">
                            {strongest.attempts} {locale === 'fr' ? 'essai(s)' : 'attempt(s)'} · {locale === 'fr' ? 'meilleur' : 'best'} {strongest.bestScore}%
                          </p>
                        </div>
                      ) : null;
                    })()}
                    {/* Weakness */}
                    {(() => {
                      const weakest = [...user.byTrade].filter(t => t.averageScore < 70).sort((a, b) => a.averageScore - b.averageScore)[0];
                      return weakest ? (
                        <div className="bg-[#EF4444]/5 border border-[#EF4444]/30 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle size={16} className="text-[#EF4444]" />
                            <p className="text-xs font-semibold text-[#EF4444] uppercase tracking-wide">
                              {locale === 'fr' ? 'Faiblesse' : 'Weakness'}
                            </p>
                          </div>
                          <p className="text-sm font-medium text-[#F8FAFC]">
                            {locale === 'fr' ? weakest.nameFr : weakest.name}
                          </p>
                          <p className="text-2xl font-bold text-[#EF4444] mt-1">{weakest.averageScore}%</p>
                          <p className="text-[10px] text-[#64748B]">
                            {weakest.attempts} {locale === 'fr' ? 'essai(s)' : 'attempt(s)'} · {locale === 'fr' ? 'meilleur' : 'best'} {weakest.bestScore}%
                          </p>
                        </div>
                      ) : (
                        <div className="bg-[#0F1424] border border-[#2D3A52] rounded-xl p-4 flex items-center justify-center">
                          <p className="text-sm text-[#64748B]">
                            {locale === 'fr' ? 'Tous les examens au-dessus de 60%' : 'All exams above 60%'}
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* ── Exam Performance table (by trade) ── */}
                {user.byTrade.length > 0 && (
                  <div>
                    <h3 className="text-base font-semibold text-[#F8FAFC] mb-3 flex items-center gap-2">
                      <BarChart3 size={18} className="text-[#3B82F6]" />
                      {locale === 'fr' ? 'Performance par métier' : 'Exam performance'}
                    </h3>
                    <div className="bg-[#0F1424] border border-[#2D3A52] rounded-xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-[#2D3A52] text-[10px] text-[#64748B] uppercase tracking-wide">
                            <th className="text-left px-4 py-2.5 font-medium">{locale === 'fr' ? 'Métier' : 'Trade'}</th>
                            <th className="text-center px-3 py-2.5 font-medium">{locale === 'fr' ? 'Dernier' : 'Last'}</th>
                            <th className="text-center px-3 py-2.5 font-medium">{locale === 'fr' ? 'Moyenne' : 'Avg'}</th>
                            <th className="text-center px-3 py-2.5 font-medium">{locale === 'fr' ? 'Meilleur' : 'Best'}</th>
                            <th className="text-center px-3 py-2.5 font-medium">{locale === 'fr' ? 'Essais' : 'Attempts'}</th>
                            <th className="text-center px-3 py-2.5 font-medium">{locale === 'fr' ? 'Tendance' : 'Trend'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2D3A52]/50">
                          {user.byTrade.map((t) => (
                            <tr key={t.tradeId} className="hover:bg-[#1A2035]/50 transition-colors">
                              <td className="px-4 py-2.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#3B82F6]/10 text-[#3B82F6] font-mono">
                                    {t.code}
                                  </span>
                                  <span className="text-[#F8FAFC] font-medium">
                                    {locale === 'fr' ? t.nameFr : t.name}
                                  </span>
                                </div>
                              </td>
                              <td className={`text-center px-3 py-2.5 font-mono font-medium ${scoreColor(t.lastScore)}`}>
                                {t.lastScore}%
                              </td>
                              <td className={`text-center px-3 py-2.5 font-mono font-medium ${scoreColor(t.averageScore)}`}>
                                {t.averageScore}%
                              </td>
                              <td className="text-center px-3 py-2.5 font-mono text-[#F8FAFC]">
                                {t.bestScore}%
                              </td>
                              <td className="text-center px-3 py-2.5 text-[#94A3B8]">
                                {t.attempts}
                              </td>
                              <td className="text-center px-3 py-2.5">
                                {t.trending
                                  ? <TrendingUp size={14} className="text-[#10B981] inline" />
                                  : <TrendingDown size={14} className="text-[#EF4444] inline" />
                                }
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ── Chapter-level strengths / weaknesses / needs review ── */}
                {(user.strengths.length > 0 || user.weaknesses.length > 0 || user.needsReview.length > 0) && (
                  <div>
                    <h3 className="text-base font-semibold text-[#F8FAFC] mb-3 flex items-center gap-2">
                      <Brain size={18} className="text-[#8B5CF6]" />
                      {locale === 'fr' ? 'Analyse par chapitre' : 'Chapter analysis'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Strengths */}
                      <div className="bg-[#0F1424] border border-[#10B981]/20 rounded-xl p-4">
                        <p className="text-xs font-semibold text-[#10B981] uppercase tracking-wide mb-3">
                          {locale === 'fr' ? 'Points forts' : 'Strengths'}
                        </p>
                        {user.strengths.length > 0 ? (
                          <div className="space-y-2">
                            {user.strengths.map((s) => (
                              <div key={s.chapterId} className="flex items-center justify-between">
                                <span className="text-xs text-[#F8FAFC] truncate flex-1 mr-2">
                                  {locale === 'fr' ? s.chapterNameFr : s.chapterName}
                                </span>
                                <span className="text-xs font-mono font-medium text-[#10B981]">{s.percentage}%</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-[#64748B]">{locale === 'fr' ? 'Aucune donnée' : 'No data'}</p>
                        )}
                      </div>
                      {/* Weaknesses */}
                      <div className="bg-[#0F1424] border border-[#EF4444]/20 rounded-xl p-4">
                        <p className="text-xs font-semibold text-[#EF4444] uppercase tracking-wide mb-3">
                          {locale === 'fr' ? 'Points à améliorer' : 'Areas to Improve'}
                        </p>
                        {user.weaknesses.length > 0 ? (
                          <div className="space-y-2">
                            {user.weaknesses.map((w) => (
                              <div key={w.chapterId} className="flex items-center justify-between">
                                <span className="text-xs text-[#F8FAFC] truncate flex-1 mr-2">
                                  {locale === 'fr' ? w.chapterNameFr : w.chapterName}
                                </span>
                                <span className="text-xs font-mono font-medium text-[#EF4444]">{w.percentage}%</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-[#64748B]">{locale === 'fr' ? 'Aucune donnée' : 'No data'}</p>
                        )}
                      </div>
                      {/* Needs review */}
                      <div className="bg-[#0F1424] border border-[#F59E0B]/20 rounded-xl p-4">
                        <p className="text-xs font-semibold text-[#F59E0B] uppercase tracking-wide mb-3">
                          {locale === 'fr' ? 'À réviser' : 'Needs review'}
                        </p>
                        {user.needsReview.length > 0 ? (
                          <div className="space-y-2">
                            {user.needsReview.map((n) => (
                              <div key={n.chapterId} className="flex items-center justify-between">
                                <span className="text-xs text-[#F8FAFC] truncate flex-1 mr-2">
                                  {locale === 'fr' ? n.chapterNameFr : n.chapterName}
                                </span>
                                <span className="text-xs font-mono font-medium text-[#F59E0B]">{n.percentage}%</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-[#64748B]">{locale === 'fr' ? 'Aucune donnée' : 'No data'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Chapter Performance bars ── */}
                {user.chapterPerformance.length > 0 && (
                  <div>
                    <h3 className="text-base font-semibold text-[#F8FAFC] mb-3 flex items-center gap-2">
                      <Brain size={18} className="text-[#8B5CF6]" />
                      {locale === 'fr' ? 'Performance par chapitre' : 'Chapter performance'}
                    </h3>
                    <div className="bg-[#0F1424] border border-[#2D3A52] rounded-xl p-5 space-y-3">
                      {user.chapterPerformance.map((ch) => {
                        const color = ch.percentage >= 60 ? '#22C55E' : ch.percentage >= 50 ? '#F59E0B' : '#EF4444';
                        return (
                          <div key={ch.chapterId}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-[#F8FAFC] font-medium">
                                {locale === 'fr' ? ch.tradeNameFr : ch.tradeName} &gt; {locale === 'fr' ? ch.chapterNameFr : ch.chapterName}
                              </span>
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
                      })}
                    </div>
                  </div>
                )}

                {/* ── Recent exams ── */}
                {user.recentAttempts.length > 0 && (
                  <div>
                    <h3 className="text-base font-semibold text-[#F8FAFC] mb-3 flex items-center gap-2">
                      <Clock size={18} className="text-[#3B82F6]" />
                      {locale === 'fr' ? 'Examens récents' : 'Recent exams'}
                    </h3>
                    <div className="space-y-2">
                      {user.recentAttempts.map((a) => (
                        <div
                          key={a.id}
                          className="bg-[#0F1424] border border-[#2D3A52] rounded-xl p-4 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                              a.passed ? 'bg-[#22C55E]/10' : 'bg-[#EF4444]/10'
                            }`}>
                              {a.passed
                                ? <CheckCircle size={18} className="text-[#22C55E]" />
                                : <AlertTriangle size={18} className="text-[#EF4444]" />
                              }
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#F8FAFC]">
                                {a.trade ? (locale === 'fr' ? a.trade.nameFr : a.trade.name) : '—'} — {a.correctCount}/{a.totalQuestions}
                              </p>
                              <p className="text-xs text-[#64748B]">
                                {new Date(a.completedAt).toLocaleDateString(locale === 'fr' ? 'fr-CA' : 'en-CA', {
                                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                                {' · '}
                                {formatDuration(a.timeSpent)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-lg font-bold ${a.passed ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                              {a.score}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <GraduationCap size={24} className="text-[#64748B] mb-2" />
                <p className="text-sm text-[#64748B]">
                  {locale === 'fr' ? "Aucun examen complété" : 'No exams completed'}
                </p>
              </div>
            )}
          </div>

          {/* ── Tutor + activity ─────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tutor */}
            <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-[#2D3A52] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot size={14} className="text-[#8B5CF6]" />
                  <h3 className="text-sm font-semibold text-[#F8FAFC]">
                    {locale === 'fr' ? 'Tuteur IA' : 'AI Tutor'}
                  </h3>
                </div>
                <span className="text-[10px] text-[#64748B]">
                  {user.tutorStats.sessions} {locale === 'fr' ? 'sessions' : 'sessions'} · {user.tutorStats.messages} {locale === 'fr' ? 'messages' : 'messages'}
                </span>
              </div>
              {user.chatSessions.length > 0 ? (
                <div className="p-2 max-h-64 overflow-y-auto">
                  {user.chatSessions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => openChat(s.id)}
                      className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#0F1525] transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/15 border border-[#8B5CF6]/20 flex items-center justify-center flex-shrink-0">
                        <MessageSquare size={13} className="text-[#8B5CF6]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#F8FAFC] truncate group-hover:text-[#8B5CF6] transition-colors">
                          {s.topic || (locale === 'fr' ? 'Sans sujet' : 'No topic')}
                        </p>
                        <p className="text-[10px] text-[#64748B]">
                          {s.messageCount} {locale === 'fr' ? 'messages' : 'messages'} · {formatRelativeTime(s.updatedAt)}
                        </p>
                      </div>
                      <ChevronRight size={14} className="text-[#64748B] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <Bot size={20} className="text-[#64748B] mb-2" />
                  <p className="text-xs text-[#64748B]">
                    {locale === 'fr' ? 'Aucune conversation' : 'No conversations'}
                  </p>
                </div>
              )}
            </div>

            {/* Recent activity log */}
            <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-[#2D3A52] flex items-center gap-2">
                <Activity size={14} className="text-[#06B6D4]" />
                <h3 className="text-sm font-semibold text-[#F8FAFC]">
                  {locale === 'fr' ? 'Activité récente' : 'Recent activity'}
                </h3>
              </div>
              {user.recentActivity.length > 0 ? (
                <div className="p-5 space-y-2.5 max-h-52 overflow-y-auto">
                  {user.recentActivity.map((act) => (
                    <div key={act.id} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] mt-1.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-[#F8FAFC] font-mono">{act.action}</p>
                        <p className="text-[10px] text-[#64748B]">{formatRelativeTime(act.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <p className="text-xs text-[#64748B]">
                    {locale === 'fr' ? 'Aucune activité enregistrée' : 'No activity logged'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Subscriptions */}
          <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#2D3A52] flex items-center gap-2">
              <CreditCard size={15} className="text-[#3B82F6]" />
              <h2 className="text-base font-semibold text-[#F8FAFC]">
                {locale === 'fr' ? 'Abonnements' : 'Subscriptions'}
              </h2>
            </div>
            {user.subscriptions.length > 0 ? (
              <div className="divide-y divide-[#2D3A52]">
                {user.subscriptions.map((sub) => (
                  <div key={sub.id} className="flex items-center gap-4 px-6 py-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      sub.status === 'ACTIVE' ? 'bg-[#10B981]/10' : 'bg-[#64748B]/10'
                    }`}>
                      {sub.status === 'ACTIVE'
                        ? <CheckCircle2 size={14} className="text-[#10B981]" />
                        : <XCircle size={14} className="text-[#64748B]" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${PLAN_COLORS[sub.plan] ?? PLAN_COLORS.FREE}`}>
                          {sub.plan}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${STATUS_COLORS[sub.status] ?? STATUS_COLORS.ACTIVE}`}>
                          {sub.status}
                        </span>
                        {sub.trade && (
                          <span className="text-[11px] text-[#64748B]">
                            {locale === 'fr' ? sub.trade.nameFr : sub.trade.name} ({sub.trade.code})
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-1">
                        {locale === 'fr' ? 'Créé' : 'Created'}: {formatDate(sub.createdAt)}
                        {sub.currentPeriod && ` · ${locale === 'fr' ? 'Période' : 'Period'}: ${formatDate(sub.currentPeriod)}`}
                      </p>
                    </div>
                    <span className="text-[10px] text-[#64748B] flex-shrink-0">
                      {formatRelativeTime(sub.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <CreditCard size={24} className="text-[#64748B] mb-2" />
                <p className="text-sm text-[#64748B]">
                  {locale === 'fr' ? 'Aucun abonnement' : 'No subscriptions'}
                </p>
              </div>
            )}
          </div>

          {/* Contact Messages */}
          <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#2D3A52] flex items-center gap-2">
              <MessageSquare size={15} className="text-[#8B5CF6]" />
              <h2 className="text-base font-semibold text-[#F8FAFC]">
                {locale === 'fr' ? 'Messages de contact' : 'Contact messages'}
              </h2>
            </div>
            {user.contactMessages.length > 0 ? (
              <div className="divide-y divide-[#2D3A52]">
                {user.contactMessages.map((msg) => (
                  <div key={msg.id} className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        msg.direction === 'outbound' ? 'bg-[#3B82F6]/10' : 'bg-[#8B5CF6]/10'
                      }`}>
                        {msg.direction === 'outbound'
                          ? <Send size={12} className="text-[#3B82F6]" />
                          : <Inbox size={12} className="text-[#8B5CF6]" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-[#F8FAFC]">{msg.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                            msg.status === 'replied'
                              ? 'bg-[#10B981]/15 text-[#10B981]'
                              : 'bg-[#F59E0B]/15 text-[#F59E0B]'
                          }`}>
                            {msg.status === 'replied'
                              ? (locale === 'fr' ? 'Répondu' : 'Replied')
                              : (locale === 'fr' ? 'En attente' : 'Pending')
                            }
                          </span>
                          <span className="text-[9px] text-[#64748B]">
                            {msg.direction === 'outbound'
                              ? (locale === 'fr' ? 'Sortant' : 'Outbound')
                              : (locale === 'fr' ? 'Entrant' : 'Inbound')
                            }
                          </span>
                        </div>
                        <p className="text-sm text-[#94A3B8] leading-snug">{msg.message}</p>
                        <p className="text-[10px] text-[#64748B] mt-1">{formatDateTime(msg.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <MessageSquare size={24} className="text-[#64748B] mb-2" />
                <p className="text-sm text-[#64748B]">
                  {locale === 'fr' ? 'Aucun message de contact' : 'No contact messages'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Profile info */}
          <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#2D3A52] flex items-center gap-2">
              <User size={15} className="text-[#3B82F6]" />
              <h2 className="text-base font-semibold text-[#F8FAFC]">
                {locale === 'fr' ? 'Profil' : 'Profile'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Mail size={14} className="text-[#64748B]" />
                <div>
                  <p className="text-[10px] text-[#64748B] uppercase tracking-wide">Email</p>
                  <p className="text-sm text-[#F8FAFC]">{user.email}</p>
                </div>
                <button
                  onClick={openEmailModal}
                  title={locale === 'fr' ? 'Envoyer un email' : 'Send email'}
                  aria-label={locale === 'fr' ? 'Envoyer un email' : 'Send email'}
                  className="ml-auto p-2 rounded-lg border border-[#2D3A52] bg-[#0F1525] text-[#94A3B8] hover:text-[#06B6D4] hover:border-[#06B6D4]/50 hover:bg-[#06B6D4]/10 transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <Shield size={14} className="text-[#64748B]" />
                <div>
                  <p className="text-[10px] text-[#64748B] uppercase tracking-wide">
                    {locale === 'fr' ? 'Rôle' : 'Role'}
                  </p>
                  <p className="text-sm text-[#F8FAFC]">{user.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={14} className="text-[#64748B]" />
                <div>
                  <p className="text-[10px] text-[#64748B] uppercase tracking-wide">
                    {locale === 'fr' ? 'Inscrit' : 'Registered'}
                  </p>
                  <p className="text-sm text-[#F8FAFC]">{formatDate(user.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <LogIn size={14} className="text-[#64748B]" />
                <div>
                  <p className="text-[10px] text-[#64748B] uppercase tracking-wide">
                    {locale === 'fr' ? 'Dernière connexion' : 'Last login'}
                  </p>
                  <p className="text-sm text-[#F8FAFC]">
                    {user.lastLoginAt ? formatRelativeTime(user.lastLoginAt) : (locale === 'fr' ? 'Jamais' : 'Never')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={14} className="text-[#64748B]" />
                <div>
                  <p className="text-[10px] text-[#64748B] uppercase tracking-wide">
                    {locale === 'fr' ? 'Dernière mise à jour' : 'Last updated'}
                  </p>
                  <p className="text-sm text-[#F8FAFC]">{formatRelativeTime(user.updatedAt)}</p>
                </div>
              </div>
              {user.stripeId && (
                <div className="flex items-center gap-3">
                  <CreditCard size={14} className="text-[#64748B]" />
                  <div>
                    <p className="text-[10px] text-[#64748B] uppercase tracking-wide">Stripe ID</p>
                    <p className="text-sm text-[#F8FAFC] font-mono text-xs">{user.stripeId}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick stats summary */}
          <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#2D3A52] flex items-center gap-2">
              <BarChart3 size={15} className="text-[#10B981]" />
              <h2 className="text-base font-semibold text-[#F8FAFC]">
                {locale === 'fr' ? 'Résumé' : 'Summary'}
              </h2>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#64748B]">
                  {locale === 'fr' ? 'Plan actuel' : 'Current plan'}
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${PLAN_COLORS[user.plan] ?? PLAN_COLORS.FREE}`}>
                  {user.plan}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#64748B]">
                  {locale === 'fr' ? 'Statut abonnement' : 'Sub status'}
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${STATUS_COLORS[user.subStatus ?? 'ACTIVE'] ?? STATUS_COLORS.ACTIVE}`}>
                  {user.subStatus ?? 'ACTIVE'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#64748B]">
                  {locale === 'fr' ? 'Total abonnements' : 'Total subs'}
                </span>
                <span className="text-sm font-medium text-[#F8FAFC]">{stats.totalSubscriptions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#64748B]">
                  {locale === 'fr' ? 'Messages envoyés' : 'Messages sent'}
                </span>
                <span className="text-sm font-medium text-[#F8FAFC]">{stats.contactMessageCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tutor conversation viewer modal ─────────────────────── */}
      {selectedChat && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedChat(null)}
        >
          <div
            className="bg-[#1A2035] border border-[#2D3A52] rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#2D3A52] flex items-center justify-between flex-shrink-0">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-[#F8FAFC] truncate">
                  {selectedChat.topic || (locale === 'fr' ? 'Conversation tuteur' : 'Tutor conversation')}
                </h3>
                <p className="text-[11px] text-[#64748B] truncate">
                  {selectedChat.user?.name || selectedChat.user?.email || (locale === 'fr' ? 'Utilisateur' : 'User')}
                  {' · '}
                  {selectedChat.messages.length} {locale === 'fr' ? 'messages' : 'messages'}
                </p>
              </div>
              <button
                onClick={() => setSelectedChat(null)}
                className="p-1.5 rounded-lg hover:bg-[#0F1525] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {chatLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 size={20} className="animate-spin text-[#8B5CF6]" />
                </div>
              ) : (
                selectedChat.messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] rounded-xl px-4 py-2.5 ${
                          isUser
                            ? 'bg-[#3B82F6] text-white rounded-br-sm'
                            : 'bg-[#0F1525] border border-[#2D3A52] text-[#E2E8F0] rounded-bl-sm'
                        }`}
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-wider mb-1 opacity-60">
                          {isUser
                            ? selectedChat.user?.name || selectedChat.user?.email || (locale === 'fr' ? 'Étudiant' : 'Student')
                            : locale === 'fr' ? 'Tuteur IA' : 'AI Tutor'}
                          {' · '}
                          {new Date(msg.createdAt).toLocaleString(locale === 'fr' ? 'fr-CA' : 'en-CA', {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                          })}
                        </p>
                        {isUser ? (
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        ) : (
                          <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: renderAIResponse(msg.content) }} />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {emailOpen && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEmailOpen(false)} />
          <div className="relative w-full max-w-lg mx-4 bg-[#1A2035] border border-[#2D3A52] rounded-xl shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D3A52]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#06B6D4]/10 flex items-center justify-center">
                  <Mail size={16} className="text-[#06B6D4]" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[#F8FAFC]">{locale === 'fr' ? 'Envoyer un email' : 'Send email'}</h2>
                  <p className="text-xs text-[#64748B]">{user.name ?? user.email} &middot; {user.email}</p>
                </div>
              </div>
              <button onClick={() => setEmailOpen(false)} className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#2D3A52] transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSendEmail} className="px-6 py-5 space-y-4">
              {emailResult && (
                <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm border ${
                  emailResult.ok
                    ? 'bg-[#10B981]/10 border-[#10B981]/20 text-[#10B981]'
                    : 'bg-[#EF4444]/10 border-[#EF4444]/20 text-[#EF4444]'
                }`}>
                  {emailResult.ok ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                  {emailResult.msg}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">{locale === 'fr' ? 'Sujet' : 'Subject'} *</label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#0A0E1A] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/50 focus:border-[#06B6D4]"
                  placeholder={locale === 'fr' ? 'Sujet' : 'Subject'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">{locale === 'fr' ? 'Message' : 'Message'} *</label>
                <textarea
                  required
                  rows={7}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#0A0E1A] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/50 focus:border-[#06B6D4] resize-none"
                  placeholder={locale === 'fr' ? 'Message' : 'Message'}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEmailOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] border border-[#2D3A52] rounded-lg hover:bg-[#2D3A52]/50 transition-colors"
                >
                  {locale === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={emailSending || !emailSubject.trim() || !emailBody.trim()}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#06B6D4] hover:bg-[#0891B2] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {emailSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  {locale === 'fr' ? 'Envoyer' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
