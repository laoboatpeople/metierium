'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState(30);

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
      sub: data ? `${data.newUsersThisPeriod} ${t('adminNewUsers').toLowerCase()}` : undefined,
    },
    {
      label: t('adminActiveSubscriptions'),
      value: data?.activeSubscriptions ?? 0,
      icon: CreditCard,
      color: 'from-[#10B981] to-[#059669]',
      href: '/admin/users',
      sub: undefined,
    },
    {
      label: t('adminTotalRevenue'),
      value: formatCurrency(data?.totalRevenue ?? 0),
      icon: DollarSign,
      color: 'from-[#F59E0B] to-[#D97706]',
      href: null,
      sub: undefined,
    },
    {
      label: t('adminTotalTrades'),
      value: data?.totalTrades ?? 0,
      icon: Briefcase,
      color: 'from-[#8B5CF6] to-[#7C3AED]',
      href: '/admin/trades',
      sub: undefined,
    },
    {
      label: t('adminTotalChapters'),
      value: data?.totalChapters ?? 0,
      icon: BookOpen,
      color: 'from-[#EC4899] to-[#DB2777]',
      href: '/admin/chapters',
      sub: undefined,
    },
    {
      label: t('adminTotalQuestions'),
      value: data?.totalQuestions ?? 0,
      icon: HelpCircle,
      color: 'from-[#F59E0B] to-[#D97706]',
      href: '/admin/questions',
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
                {card.href && (
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
            <div key={card.label} className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-5">
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

      {/* Questions by Trade — Horizontal bar */}
      <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6 mb-8">
        <h3 className="text-sm font-semibold text-[#F8FAFC] mb-4">{t('adminQuestionsByTrade')}</h3>
        {loading ? (
          <div className="h-48 bg-[#0F1525] rounded-lg animate-pulse" />
        ) : tradeData.length > 0 ? (
          <ResponsiveContainer width="100%" height={Math.max(120, tradeData.length * 36)}>
            <BarChart data={tradeData} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3A52" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748B', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#2D3A52' }} allowDecimals={false} />
              <YAxis type="category" dataKey="code" tick={{ fill: '#94A3B8', fontSize: 12 }} tickLine={false} axisLine={false} width={56} />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={((value: number, _name: string, props: { payload?: { name?: string } }) => [
                  `${value} questions`,
                  props?.payload?.name ?? '',
                ]) as never}
              />
              <Bar dataKey="count" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-32 flex items-center justify-center text-[#64748B] text-sm">{t('adminNoData')}</div>
        )}
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
              <div
                key={user.id}
                className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-[#0F1525] transition-colors"
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
              </div>
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
    </div>
  );
}
