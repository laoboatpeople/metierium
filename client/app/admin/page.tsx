'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  Briefcase,
  BookOpen,
  HelpCircle,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Loader2,
  ArrowRight,
  UserPlus,
  UserCheck,
  MessageSquare,
  PlusCircle,
  Mail,
  ClipboardCheck,
  Target,
  CheckCircle2,
  XCircle,
  ListChecks,
  X,
} from 'lucide-react';
import { authApi } from '@/lib/api';
import { useLocale } from '@/src/contexts/LocaleContext';

// ─── Types ───────────────────────────────────────────────────

interface DashboardData {
  totalUsers: number;
  totalTrades: number;
  totalChapters: number;
  totalQuestions: number;
  activeSubscriptions: number;
  newUsersThisPeriod: number;
  totalRevenue: number;
  activeUsersToday: number;
  totalExamsTaken: number;
  overallPassRate: number;
  recentAttempts: Array<{
    id: string;
    score: number;
    totalQuestions: number;
    correctCount: number;
    completedAt: string;
    user: { id: string; name: string | null; email: string };
    trade: { code: string; name: string; nameFr: string };
  }>;
  recentAnswers: Array<{
    id: string;
    userAnswer: string;
    isCorrect: boolean;
    question: { id: string; text: string; difficulty: string };
    user: { id: string; name: string | null; email: string } | null;
    completedAt: string;
  }>;
  topFailedQuestions: Array<{
    id: string;
    question: string;
    difficulty: string;
    passRate: number;
    totalAttempts: number;
  }>;
  recentChats: Array<{
    id: string;
    topic: string;
    user: { name: string; email: string } | null;
    messageCount: number;
    updatedAt: string;
  }>;
  planDistribution: Record<string, number>;
  userGrowth: Array<{ date: string; count: number }>;
  revenueByMonth: Array<{ month: string; amount: number }>;
  questionsByDifficulty: Record<string, number>;
  questionsByTrade: Array<{ code: string; name: string; nameFr: string; count: number }>;
  questionsByLocale: Record<string, number>;
  recentActivity: Array<{
    id: string;
    action: string;
    createdAt: string;
    user?: { name: string; email: string };
    details?: Record<string, unknown>;
  }>;
  recentSubscriptions: Array<{
    id: string;
    plan: string;
    status: string;
    createdAt: string;
    user: { id: string; name: string | null; email: string; plan: string };
  }>;
  recentContactMessages: Array<{
    id: string;
    name: string;
    email: string;
    message: string;
    direction: string;
    status: string;
    createdAt: string;
  }>;
  recentQuestionsAdded: Array<{
    id: string;
    question: string;
    difficulty: string;
    locale: string;
    createdAt: string;
    chapter: { name: string; nameFr: string; tradeCode: string } | null;
  }>;
  lastRegisteredUsers: Array<{
    id: string;
    name: string | null;
    email: string;
    plan: string;
    role: string;
    createdAt: string;
  }>;
}

const DATE_RANGES = [
  { labelKey: 'adminLast7Days', value: 7 },
  { labelKey: 'adminLast30Days', value: 30 },
  { labelKey: 'adminLast90Days', value: 90 },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  EASY: '#10B981',
  MEDIUM: '#F59E0B',
  HARD: '#EF4444',
};

const DIFFICULTY_LABELS: Record<string, { fr: string; en: string }> = {
  EASY: { fr: 'Facile', en: 'Easy' },
  MEDIUM: { fr: 'Moyen', en: 'Medium' },
  HARD: { fr: 'Difficile', en: 'Hard' },
};

const PLAN_COLORS: Record<string, string> = {
  FREE: '#64748B',
  MONTHLY: '#3B82F6',
  LIFETIME: '#10B981',
};

const PLAN_LABELS: Record<string, { fr: string; en: string }> = {
  FREE: { fr: 'Gratuit', en: 'Free' },
  MONTHLY: { fr: 'Mensuel', en: 'Monthly' },
  LIFETIME: { fr: 'À vie', en: 'Lifetime' },
};

const TOOLTIP_STYLE = {
  backgroundColor: '#1A2035',
  border: '1px solid #2D3A52',
  borderRadius: 8,
  color: '#F8FAFC',
  fontSize: 12,
};

// ─── Helpers ─────────────────────────────────────────────────

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toLocaleString('fr-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "à l'instant";
  if (diffMins < 60) return `${diffMins} min`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}j`;
}

function formatMonthLabel(monthStr: string): string {
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString('fr', { month: 'short', year: '2-digit' });
}

// ─── Main component ──────────────────────────────────────────

export default function AdminDashboard() {
  const { t, locale } = useLocale();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState(30);

  // ── Tutor chat viewer modal ──
  const [selectedChat, setSelectedChat] = useState<{
    id: string;
    topic: string | null;
    user: { id: string; name: string | null; email: string } | null;
    messages: { id: string; role: string; content: string; createdAt: string }[];
  } | null>(null);
  const [chatLoading, setChatLoading] = useState(false);

  // ── Active today modal ──
  const [activeToday, setActiveToday] = useState<Array<{
    id: string; name: string | null; email: string; activity: string; lastActive: string;
  }> | null>(null);
  const [activeTodayLoading, setActiveTodayLoading] = useState(false);

  const openActiveToday = useCallback(async () => {
    setActiveTodayLoading(true);
    setActiveToday([]);
    try {
      const json = await authApi('/api/admin/analytics/active-today');
      setActiveToday(json.data ?? []);
    } catch {
      setActiveToday([]);
    } finally {
      setActiveTodayLoading(false);
    }
  }, []);

  const openChat = useCallback(async (id: string) => {
    setChatLoading(true);
    try {
      const json = await authApi(`/api/admin/chat-sessions/${id}`);
      setSelectedChat(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('somethingWentWrong'));
    } finally {
      setChatLoading(false);
    }
  }, [t]);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const json = await authApi(`/api/admin/analytics/dashboard?days=${dateRange}`);
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  }, [dateRange, t]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // ─── Loading state ───────────────────────────────────────

  if (loading && data === null) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-[#3B82F6]" />
      </div>
    );
  }

  // ─── Error state ─────────────────────────────────────────

  if (error && data === null) {
    return (
      <div className="px-4 py-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg text-sm text-[#EF4444]">
        {error}
      </div>
    );
  }

  // ─── Stat cards ──────────────────────────────────────────

  const statCards = [
    {
      label: t('adminTotalUsers'),
      value: data?.totalUsers ?? 0,
      icon: Users,
      color: 'from-[#3B82F6] to-[#06B6D4]',
      href: '/admin/users',
      onClick: undefined,
      sub: data ? `${data.newUsersThisPeriod} ${t('adminNewUsers').toLowerCase()}` : undefined,
    },
    {
      label: t('adminActiveSubscriptions'),
      value: data?.activeSubscriptions ?? 0,
      icon: CreditCard,
      color: 'from-[#10B981] to-[#059669]',
      href: '/admin/users',
      onClick: undefined,
      sub: undefined,
    },
    {
      label: t('adminTotalRevenue'),
      value: formatCurrency(data?.totalRevenue ?? 0),
      icon: DollarSign,
      color: 'from-[#F59E0B] to-[#D97706]',
      href: null,
      onClick: undefined,
      sub: undefined,
    },
    {
      label: t('adminTotalTrades'),
      value: data?.totalTrades ?? 0,
      icon: Briefcase,
      color: 'from-[#8B5CF6] to-[#7C3AED]',
      href: '/admin/trades',
      onClick: undefined,
      sub: undefined,
    },
    {
      label: t('adminTotalChapters'),
      value: data?.totalChapters ?? 0,
      icon: BookOpen,
      color: 'from-[#EC4899] to-[#DB2777]',
      href: '/admin/chapters',
      onClick: undefined,
      sub: undefined,
    },
    {
      label: t('adminTotalQuestions'),
      value: data?.totalQuestions ?? 0,
      icon: HelpCircle,
      color: 'from-[#F59E0B] to-[#D97706]',
      href: '/admin/questions',
      onClick: undefined,
      sub: data
        ? `${data.questionsByLocale?.fr ?? 0} FR / ${data.questionsByLocale?.en ?? 0} EN`
        : undefined,
    },
    {
      label: t('adminActiveToday'),
      value: data?.activeUsersToday ?? 0,
      icon: UserCheck,
      color: 'from-[#06B6D4] to-[#0891B2]',
      href: null,
      onClick: openActiveToday,
      sub: undefined,
    },
    {
      label: t('adminExamsTaken'),
      value: data?.totalExamsTaken ?? 0,
      icon: ClipboardCheck,
      color: 'from-[#3B82F6] to-[#2563EB]',
      href: null,
      onClick: undefined,
      sub: undefined,
    },
    {
      label: t('adminPassRate'),
      value: `${data?.overallPassRate ?? 0}%`,
      icon: Target,
      color: 'from-[#10B981] to-[#059669]',
      href: null,
      onClick: undefined,
      sub: undefined,
    },
  ];

  // ─── Chart data ──────────────────────────────────────────

  const userGrowthData = (data?.userGrowth ?? []).map((g) => ({
    ...g,
    date: new Date(g.date).toLocaleDateString(locale === 'fr' ? 'fr' : 'en', {
      month: 'short',
      day: 'numeric',
    }),
  }));

  const revenueData = (data?.revenueByMonth ?? []).map((r) => ({
    ...r,
    month: formatMonthLabel(r.month),
    dollars: Math.round(r.amount / 100),
  }));

  const difficultyData = data
    ? Object.entries(data.questionsByDifficulty)
        .filter(([, v]) => v > 0)
        .map(([key, value]) => ({
          name: DIFFICULTY_LABELS[key]?.[locale] ?? key,
          value,
          fill: DIFFICULTY_COLORS[key] ?? '#64748B',
        }))
    : [];

  const planData = data
    ? Object.entries(data.planDistribution)
        .filter(([, v]) => v > 0)
        .map(([key, value]) => ({
          name: PLAN_LABELS[key]?.[locale] ?? key,
          value,
          fill: PLAN_COLORS[key] ?? '#64748B',
        }))
    : [];

  const tradeData = (data?.questionsByTrade ?? []).map((tr) => ({
    code: tr.code,
    name: locale === 'fr' ? tr.nameFr : tr.name,
    count: tr.count,
  }));

  return (
    <div>
      {/* Header + date range */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <TrendingUp size={24} className="text-[#3B82F6]" />
          <div>
            <h1 className="text-2xl font-bold text-[#F8FAFC]">{t('adminDashboard')}</h1>
            <p className="text-sm text-[#94A3B8]">{t('adminDashboardDesc')}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-[#1A2035] border border-[#2D3A52] rounded-lg p-1">
          {DATE_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => setDateRange(range.value)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                dateRange === range.value
                  ? 'bg-[#3B82F6] text-white'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              {t(range.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Error banner */}
      {error && data !== null && (
        <div className="mb-6 px-4 py-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg text-sm text-[#EF4444]">
          {error}
        </div>
      )}

      {/* Stat cards — 6 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          const inner = (
            <>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  <Icon size={17} className="text-white" />
                </div>
                {(card.href || card.onClick) && (
                  <ArrowRight size={14} className="text-[#64748B] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                )}
              </div>
              <p className="text-2xl font-bold text-[#F8FAFC] mb-0.5">{card.value}</p>
              <p className="text-xs text-[#94A3B8] group-hover:text-[#CBD5E1] transition-colors">{card.label}</p>
              {card.sub && <p className="text-[10px] text-[#64748B] mt-1">{card.sub}</p>}
            </>
          );
          return card.href ? (
            <Link
              key={card.label}
              href={card.href}
              className="group bg-[#1A2035] border border-[#2D3A52] rounded-xl p-5 hover:border-[#3B82F6]/50 hover:-translate-y-0.5 transition-all duration-200"
            >
              {inner}
            </Link>
          ) : (
            <div
              key={card.label}
              onClick={card.onClick}
              className={`bg-[#1A2035] border border-[#2D3A52] rounded-xl p-5 ${
                card.onClick
                  ? 'group cursor-pointer hover:border-[#06B6D4]/50 hover:-translate-y-0.5 transition-all duration-200'
                  : ''
              }`}
            >
              {inner}
            </div>
          );
        })}
      </div>

      {/* Charts 2x2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* User Growth */}
        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[#F8FAFC] mb-4">{t('adminUserGrowth')}</h3>
          {loading ? (
            <div className="h-48 bg-[#0F1525] rounded-lg animate-pulse" />
          ) : userGrowthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={192}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3A52" />
                <XAxis dataKey="date" tick={{ fill: '#64748B', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#2D3A52' }} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} name={t('adminNewUsers')} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-[#64748B] text-sm">{t('adminNoData')}</div>
          )}
        </div>

        {/* Revenue by Month */}
        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[#F8FAFC] mb-4">{t('adminRevenueByMonth')}</h3>
          {loading ? (
            <div className="h-48 bg-[#0F1525] rounded-lg animate-pulse" />
          ) : revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={192}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3A52" />
                <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#2D3A52' }} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={((value: number) => [`$${value}`, t('adminTotalRevenue')]) as never} />
                <Bar dataKey="dollars" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-[#64748B] text-sm">{t('adminNoData')}</div>
          )}
        </div>

        {/* Questions by Difficulty — Donut */}
        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[#F8FAFC] mb-4">{t('adminQuestionsByDifficulty')}</h3>
          {loading ? (
            <div className="h-48 bg-[#0F1525] rounded-lg animate-pulse" />
          ) : difficultyData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={difficultyData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" strokeWidth={0}>
                    {difficultyData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2">
                {difficultyData.map(({ name, value, fill }) => (
                  <div key={name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: fill }} />
                    <span className="text-sm text-[#94A3B8]">
                      {name}: <span className="text-[#F8FAFC] font-medium">{value}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-[#64748B] text-sm">{t('adminNoData')}</div>
          )}
        </div>

        {/* Plan Distribution — Donut */}
        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[#F8FAFC] mb-4">{t('adminPlanDistribution')}</h3>
          {loading ? (
            <div className="h-48 bg-[#0F1525] rounded-lg animate-pulse" />
          ) : planData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={planData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" strokeWidth={0}>
                    {planData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2">
                {planData.map(({ name, value, fill }) => (
                  <div key={name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: fill }} />
                    <span className="text-sm text-[#94A3B8]">
                      {name}: <span className="text-[#F8FAFC] font-medium">{value}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-[#64748B] text-sm">{t('adminNoData')}</div>
          )}
        </div>
      </div>

      {/* Recent registrations */}
      <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-[#F8FAFC] mb-4">{t('adminRecentRegistrations')}</h3>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 bg-[#0F1525] rounded animate-pulse" />
            ))}
          </div>
        ) : data?.lastRegisteredUsers && data.lastRegisteredUsers.length > 0 ? (
          <div className="space-y-1">
            {data.lastRegisteredUsers.map((user) => (
              <Link
                key={user.id}
                href={`/admin/users/${user.id}`}
                className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-[#0F1525] transition-colors cursor-pointer"
              >
                <UserPlus size={14} className="text-[#64748B] flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[#F8FAFC] truncate">
                    {user.name ?? user.email}
                  </p>
                  <p className="text-[10px] text-[#64748B]">{user.email}</p>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    user.plan === 'LIFETIME'
                      ? 'bg-[#10B981]/15 text-[#10B981]'
                      : user.plan === 'MONTHLY'
                      ? 'bg-[#3B82F6]/15 text-[#3B82F6]'
                      : 'bg-[#64748B]/15 text-[#64748B]'
                  }`}
                >
                  {PLAN_LABELS[user.plan]?.[locale] ?? user.plan}
                </span>
                <span className="text-[10px] text-[#64748B] flex-shrink-0">
                  {formatRelativeTime(user.createdAt)}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-[#64748B]">{t('adminNoData')}</div>
        )}
      </div>

      {/* Activity monitoring — 3 columns */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        {/* Recent Subscriptions */}
        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[#F8FAFC] mb-4">{t('adminRecentSubscriptions')}</h3>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-[#0F1525] rounded animate-pulse" />
              ))}
            </div>
          ) : data?.recentSubscriptions && data.recentSubscriptions.length > 0 ? (
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {data.recentSubscriptions.map((s) => (
                <div key={s.id} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-[#0F1525] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#10B981]/15 flex items-center justify-center flex-shrink-0">
                    <CreditCard size={14} className="text-[#10B981]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[#F8FAFC] truncate">{s.user.name ?? s.user.email}</p>
                    <p className="text-[10px] text-[#64748B]">
                      {PLAN_LABELS[s.plan]?.[locale] ?? s.plan} · {s.status}
                    </p>
                  </div>
                  <span className="text-[10px] text-[#64748B] flex-shrink-0">{formatRelativeTime(s.createdAt)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-[#64748B]">{t('adminNoData')}</div>
          )}
        </div>

        {/* Recent Contact Messages */}
        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[#F8FAFC] mb-4">{t('adminRecentMessages')}</h3>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-[#0F1525] rounded animate-pulse" />
              ))}
            </div>
          ) : data?.recentContactMessages && data.recentContactMessages.length > 0 ? (
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {data.recentContactMessages.map((m) => (
                <div key={m.id} className="flex items-start gap-3 py-2.5 px-3 rounded-lg hover:bg-[#0F1525] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#3B82F6]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail size={14} className="text-[#3B82F6]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[#F8FAFC] truncate">{m.name}</p>
                    <p className="text-[10px] text-[#64748B] line-clamp-2">{m.message}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                        m.status === 'replied'
                          ? 'bg-[#10B981]/15 text-[#10B981]'
                          : 'bg-[#F59E0B]/15 text-[#F59E0B]'
                      }`}
                    >
                      {m.status === 'replied' ? (locale === 'fr' ? 'Répondu' : 'Replied') : (locale === 'fr' ? 'En attente' : 'Pending')}
                    </span>
                    <span className="text-[10px] text-[#64748B]">{formatRelativeTime(m.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-[#64748B]">{t('adminNoData')}</div>
          )}
        </div>

        {/* Recent Questions Added */}
        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[#F8FAFC] mb-4">{t('adminRecentQuestions')}</h3>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-[#0F1525] rounded animate-pulse" />
              ))}
            </div>
          ) : data?.recentQuestionsAdded && data.recentQuestionsAdded.length > 0 ? (
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {data.recentQuestionsAdded.map((q) => (
                <div key={q.id} className="flex items-start gap-3 py-2.5 px-3 rounded-lg hover:bg-[#0F1525] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <PlusCircle size={14} className="text-[#8B5CF6]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[#94A3B8] leading-snug line-clamp-2">{q.question}</p>
                    <p className="text-[10px] text-[#64748B] mt-0.5">
                      {q.chapter ? `${q.chapter.tradeCode} · ${locale === 'fr' ? q.chapter.nameFr : q.chapter.name}` : '—'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded text-white"
                      style={{ backgroundColor: DIFFICULTY_COLORS[q.difficulty] ?? '#64748B' }}
                    >
                      {DIFFICULTY_LABELS[q.difficulty]?.[locale] ?? q.difficulty}
                    </span>
                    <span className="text-[10px] text-[#64748B]">{formatRelativeTime(q.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-[#64748B]">{t('adminNoData')}</div>
          )}
        </div>
      </div>

      {/* Learning pulse — 2x2 grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        {/* Recent Exam Attempts */}
        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[#F8FAFC] mb-4">{t('adminRecentAttempts')}</h3>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-[#0F1525] rounded animate-pulse" />
              ))}
            </div>
          ) : data?.recentAttempts && data.recentAttempts.length > 0 ? (
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {data.recentAttempts.map((a) => {
                const passed = a.score >= 60;
                return (
                  <div key={a.id} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-[#0F1525] transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${passed ? 'bg-[#10B981]/15' : 'bg-[#EF4444]/15'}`}>
                      {passed ? <CheckCircle2 size={14} className="text-[#10B981]" /> : <XCircle size={14} className="text-[#EF4444]" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-[#F8FAFC] truncate">{a.user.name ?? a.user.email}</p>
                      <p className="text-[10px] text-[#64748B]">
                        {locale === 'fr' ? a.trade.nameFr : a.trade.name} · {a.correctCount}/{a.totalQuestions}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${passed ? 'bg-[#10B981]/15 text-[#10B981]' : 'bg-[#EF4444]/15 text-[#EF4444]'}`}>
                        {Math.round(a.score)}%
                      </span>
                      <span className="text-[10px] text-[#64748B]">{formatRelativeTime(a.completedAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-[#64748B]">{t('adminNoData')}</div>
          )}
        </div>

        {/* Recent Answers */}
        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[#F8FAFC] mb-4">{t('adminRecentAnswers')}</h3>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-[#0F1525] rounded animate-pulse" />
              ))}
            </div>
          ) : data?.recentAnswers && data.recentAnswers.length > 0 ? (
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {data.recentAnswers.map((ans) => (
                <div key={ans.id} className="flex items-start gap-3 py-2.5 px-3 rounded-lg hover:bg-[#0F1525] transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${ans.isCorrect ? 'bg-[#10B981]/15' : 'bg-[#EF4444]/15'}`}>
                    {ans.isCorrect ? <CheckCircle2 size={14} className="text-[#10B981]" /> : <XCircle size={14} className="text-[#EF4444]" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[#94A3B8] leading-snug line-clamp-2">{ans.question.text}</p>
                    <p className="text-[10px] text-[#64748B] mt-0.5">
                      {ans.user ? (ans.user.name ?? ans.user.email) : '—'} · {ans.userAnswer}
                    </p>
                  </div>
                  <span className="text-[10px] text-[#64748B] flex-shrink-0">{formatRelativeTime(ans.completedAt)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-[#64748B]">{t('adminNoData')}</div>
          )}
        </div>

        {/* Top Failed Questions */}
        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[#F8FAFC] mb-4">{t('adminTopFailed')}</h3>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-[#0F1525] rounded animate-pulse" />
              ))}
            </div>
          ) : data?.topFailedQuestions && data.topFailedQuestions.length > 0 ? (
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {data.topFailedQuestions.map((q) => (
                <div key={q.id} className="flex items-start gap-3 py-2.5 px-3 rounded-lg hover:bg-[#0F1525] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#F59E0B]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ListChecks size={14} className="text-[#F59E0B]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[#94A3B8] leading-snug line-clamp-2">{q.question}</p>
                    <p className="text-[10px] text-[#64748B] mt-0.5">
                      {q.totalAttempts} {locale === 'fr' ? 'tentatives' : 'attempts'}
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-[#EF4444]/15 text-[#EF4444] flex-shrink-0">
                    {q.passRate}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-[#64748B]">{t('adminNoData')}</div>
          )}
        </div>

        {/* Recent Tutor Chats */}
        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[#F8FAFC] mb-4">{t('adminRecentChats')}</h3>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-[#0F1525] rounded animate-pulse" />
              ))}
            </div>
          ) : data?.recentChats && data.recentChats.length > 0 ? (
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {data.recentChats.map((cs) => (
                <button
                  key={cs.id}
                  onClick={() => openChat(cs.id)}
                  disabled={chatLoading}
                  className="w-full text-left flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-[#0F1525] transition-colors cursor-pointer disabled:opacity-50"
                >
                  <div className="w-8 h-8 rounded-full bg-[#3B82F6]/15 flex items-center justify-center flex-shrink-0">
                    <MessageSquare size={14} className="text-[#3B82F6]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[#F8FAFC] truncate">{cs.user?.name || cs.user?.email || (locale === 'fr' ? 'Utilisateur' : 'User')}</p>
                    <p className="text-[10px] text-[#64748B] truncate">{cs.topic}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[10px] text-[#94A3B8]">{cs.messageCount} {locale === 'fr' ? 'messages' : 'msgs'}</p>
                    <p className="text-[10px] text-[#64748B]">{formatRelativeTime(cs.updatedAt)}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-[#64748B]">{t('adminNoData')}</div>
          )}
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
              {selectedChat.messages.map((msg) => {
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
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Active today modal ─────────────────────────────────── */}
      {activeToday !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveToday(null)}
        >
          <div
            className="bg-[#1A2035] border border-[#2D3A52] rounded-xl w-full max-w-lg flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#2D3A52] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#06B6D4] to-[#0891B2] flex items-center justify-center flex-shrink-0">
                  <UserCheck size={15} className="text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-[#F8FAFC]">{t('adminActiveToday')}</h3>
                  <p className="text-[11px] text-[#64748B]">
                    {locale === 'fr' ? '10 derniers utilisateurs actifs' : 'Last 10 active users'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveToday(null)}
                className="p-1.5 rounded-lg hover:bg-[#0F1525] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* List */}
            <div className="p-3 max-h-[60vh] overflow-y-auto">
              {activeTodayLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={20} className="animate-spin text-[#06B6D4]" />
                </div>
              ) : activeToday.length === 0 ? (
                <div className="py-12 text-center text-sm text-[#64748B]">
                  {locale === 'fr' ? "Personne n'est actif aujourd'hui" : 'No one active today'}
                </div>
              ) : (
                <ul className="space-y-1">
                  {activeToday.map((u, i) => (
                    <li key={u.id}>
                      <button
                        onClick={() => { setActiveToday(null); router.push(`/admin/users/${u.id}`); }}
                        className="group/row w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#0F1525] transition-colors text-left"
                      >
                        <span className="text-[10px] font-bold text-[#64748B] w-4 flex-shrink-0">{i + 1}</span>
                        <div className="w-8 h-8 rounded-full bg-[#06B6D4]/15 border border-[#06B6D4]/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-[11px] font-bold text-[#06B6D4]">
                            {(u.name || u.email).charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#F8FAFC] truncate group-hover/row:text-[#06B6D4] transition-colors">{u.name || u.email}</p>
                          {u.name && <p className="text-[11px] text-[#64748B] truncate">{u.email}</p>}
                        </div>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-medium rounded border flex-shrink-0 ${
                            u.activity === 'exam'
                              ? 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20'
                              : 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20'
                          }`}
                        >
                          {u.activity === 'exam'
                            ? locale === 'fr' ? 'Examen' : 'Exam'
                            : locale === 'fr' ? 'Tuteur' : 'Tutor'}
                        </span>
                        <span className="text-[11px] text-[#64748B] flex-shrink-0 w-10 text-right">
                          {new Date(u.lastActive).toLocaleTimeString(locale === 'fr' ? 'fr-CA' : 'en-CA', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <ArrowRight size={13} className="text-[#64748B] opacity-0 -translate-x-1 group-hover/row:opacity-100 group-hover/row:translate-x-0 transition-all duration-200 flex-shrink-0" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
