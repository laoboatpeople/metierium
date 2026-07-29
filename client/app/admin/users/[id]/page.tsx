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
  BookOpen,
  Bot,
  Activity,
} from 'lucide-react';
import { authApi } from '@/lib/api';
import { useLocale } from '@/src/contexts/LocaleContext';

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
    passed: number;
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
  tutorStats: {
    sessions: number;
    messages: number;
    lastActivityAt: string | null;
    lastTopic: string | null;
  };
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
  if (score >= 70) return 'text-[#10B981]';
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

          {/* ── Learning performance ─────────────────────────────── */}
          <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#2D3A52] flex items-center gap-2">
              <GraduationCap size={15} className="text-[#06B6D4]" />
              <h2 className="text-base font-semibold text-[#F8FAFC]">
                {locale === 'fr' ? "Performance d'apprentissage" : 'Learning performance'}
              </h2>
            </div>

            {user.examStats.totalAttempts > 0 ? (
              <div className="p-6 space-y-6">
                {/* Key metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
                </div>

                {/* Time + last activity */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#64748B]">
                  <span>
                    ⏱ {locale === 'fr' ? 'Temps total' : 'Total time'}:{' '}
                    <span className="text-[#F8FAFC] font-medium">{formatDuration(user.examStats.totalTimeSpent)}</span>
                  </span>
                  {user.examStats.lastAttemptAt && (
                    <span>
                      {locale === 'fr' ? 'Dernier examen' : 'Last exam'}:{' '}
                      <span className="text-[#F8FAFC] font-medium">{formatRelativeTime(user.examStats.lastAttemptAt)}</span>
                    </span>
                  )}
                </div>

                {/* Per-trade breakdown */}
                {user.byTrade.length > 0 && (
                  <div>
                    <p className="text-[10px] font-medium text-[#64748B] uppercase tracking-wide mb-2">
                      {locale === 'fr' ? 'Par métier' : 'By trade'}
                    </p>
                    <div className="space-y-2">
                      {user.byTrade.map((t) => (
                        <div key={t.tradeId} className="flex items-center gap-3">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#3B82F6]/10 text-[#3B82F6] font-mono flex-shrink-0">
                            {t.code}
                          </span>
                          <span className="text-sm text-[#F8FAFC] flex-1 truncate">
                            {locale === 'fr' ? t.nameFr : t.name}
                          </span>
                          <span className="text-[11px] text-[#64748B] flex-shrink-0">
                            {t.attempts} {locale === 'fr' ? 'essai(s)' : 'attempt(s)'}
                          </span>
                          <div className="w-24 h-1.5 bg-[#0F1424] rounded-full overflow-hidden flex-shrink-0">
                            <div
                              className={`h-full rounded-full ${t.averageScore >= 70 ? 'bg-[#10B981]' : t.averageScore >= 50 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`}
                              style={{ width: `${t.averageScore}%` }}
                            />
                          </div>
                          <span className={`text-sm font-mono font-medium w-10 text-right flex-shrink-0 ${scoreColor(t.averageScore)}`}>
                            {t.averageScore}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent attempts */}
                {user.recentAttempts.length > 0 && (
                  <div>
                    <p className="text-[10px] font-medium text-[#64748B] uppercase tracking-wide mb-2">
                      {locale === 'fr' ? 'Examens récents' : 'Recent exams'}
                    </p>
                    <div className="space-y-1.5">
                      {user.recentAttempts.map((a) => (
                        <div key={a.id} className="flex items-center gap-3 bg-[#0F1424] border border-[#2D3A52]/50 rounded-lg px-3 py-2">
                          <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${a.passed ? 'bg-[#10B981]/10' : 'bg-[#EF4444]/10'}`}>
                            {a.passed ? <CheckCircle2 size={13} className="text-[#10B981]" /> : <XCircle size={13} className="text-[#EF4444]" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-[#F8FAFC] truncate">
                              {a.trade ? (locale === 'fr' ? a.trade.nameFr : a.trade.name) : '—'}
                            </p>
                            <p className="text-[10px] text-[#64748B]">
                              {a.correctCount}/{a.totalQuestions} · {formatDuration(a.timeSpent)} · {formatRelativeTime(a.completedAt)}
                            </p>
                          </div>
                          <span className={`text-sm font-mono font-bold flex-shrink-0 ${scoreColor(a.score)}`}>{a.score}%</span>
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
              <div className="px-5 py-3 border-b border-[#2D3A52] flex items-center gap-2">
                <Bot size={14} className="text-[#8B5CF6]" />
                <h3 className="text-sm font-semibold text-[#F8FAFC]">
                  {locale === 'fr' ? 'Tuteur IA' : 'AI Tutor'}
                </h3>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#64748B]">{locale === 'fr' ? 'Sessions' : 'Sessions'}</span>
                  <span className="text-sm font-medium text-[#F8FAFC]">{user.tutorStats.sessions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#64748B]">{locale === 'fr' ? 'Messages' : 'Messages'}</span>
                  <span className="text-sm font-medium text-[#F8FAFC]">{user.tutorStats.messages}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#64748B]">{locale === 'fr' ? 'Dernière activité' : 'Last activity'}</span>
                  <span className="text-sm font-medium text-[#F8FAFC]">
                    {user.tutorStats.lastActivityAt ? formatRelativeTime(user.tutorStats.lastActivityAt) : '—'}
                  </span>
                </div>
                {user.tutorStats.lastTopic && (
                  <p className="text-[11px] text-[#64748B] pt-1 border-t border-[#2D3A52] line-clamp-2">
                    💬 {user.tutorStats.lastTopic}
                  </p>
                )}
              </div>
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
    </div>
  );
}
