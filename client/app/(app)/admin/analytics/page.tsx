'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
  CreditCard,
  FileText,
  TrendingUp,
  TrendingDown,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  activeSubscriptions: number;
  overallPassRate: number;
  userGrowth: number;
  userGrowthData: Array<{ date: string; count: number }>;
  revenueByMonth: Array<{ month: string; amount: number }>;
  questionsByDifficulty: { EASY: number; MEDIUM: number; HARD: number };
  passRateByExam: Array<{ examCode: string; passRate: number; totalAttempts: number }>;
  recentActivity: Array<{
    id: string;
    action: string;
    createdAt: string;
    user?: { name: string; email: string };
  }>;
}

const DATE_RANGES = [
  { label: '7 days', value: 7 },
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  EASY: '#10B981',
  MEDIUM: '#F59E0B',
  HARD: '#EF4444',
};

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function formatMonthLabel(monthStr: string): string {
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString('en', { month: 'short', year: '2-digit' });
}

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState(30);

  const fetchAnalytics = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/analytics/dashboard?days=${dateRange}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/auth/login');
        return;
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();

      // Compute userGrowth % vs previous period
      const currentPeriodUsers = json.totalUsers;
      const halfPoint = Math.floor((json.userGrowth?.length || 0) / 2);
      const prevPeriodUsers = (json.userGrowth || [])
        .slice(0, halfPoint)
        .reduce((sum: number, g: { count: number }) => sum + (g.count || 0), 0);
      const userGrowth = prevPeriodUsers > 0
        ? Math.round(((currentPeriodUsers - prevPeriodUsers) / prevPeriodUsers) * 100)
        : 0;

      setData({
        ...json,
        userGrowth,
        userGrowthData: json.userGrowth ?? [],
        questionsByDifficulty: json.questionsByDifficulty ?? { EASY: 0, MEDIUM: 0, HARD: 0 },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [dateRange, router]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const stats = [
    {
      label: 'Total Users',
      value: data?.totalUsers ?? '—',
      trend: data ? `${data.userGrowth >= 0 ? '+' : ''}${data.userGrowth}%` : null,
      up: data ? data.userGrowth >= 0 : true,
      icon: Users,
      color: 'text-[#3B82F6]',
    },
    {
      label: 'Active Subscriptions',
      value: data?.activeSubscriptions ?? '—',
      trend: null,
      up: true,
      icon: CreditCard,
      color: 'text-[#10B981]',
    },
    {
      label: 'Exam Attempts',
      value: 'N/A',
      trend: null,
      up: true,
      icon: FileText,
      color: 'text-[#06B6D4]',
    },
    {
      label: 'Overall Pass Rate',
      value: data ? `${data.overallPassRate}%` : '—%',
      trend: null,
      up: data ? data.overallPassRate >= 70 : true,
      icon: TrendingUp,
      color: 'text-[#F59E0B]',
    },
  ];

  const difficultyData = data && data.questionsByDifficulty
    ? Object.entries(data.questionsByDifficulty).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
        value,
        fill: DIFFICULTY_COLORS[key] || '#64748B',
      }))
    : [];

  const revenueData = (data?.revenueByMonth ?? []).map((r) => ({
    ...r,
    month: formatMonthLabel(r.month),
  }));

  const userGrowthData = (data?.userGrowthData ?? []).map((g: { date: string; count: number }) => ({
    ...g,
    date: new Date(g.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
  }));

  if (loading && data === null) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="text-[#3B82F6] animate-spin" />
          <p className="text-sm text-[#94A3B8]">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Analytics</h1>
          <p className="text-sm text-[#94A3B8] mt-1">Platform performance overview</p>
        </div>

        {/* Date range selector */}
        <div className="flex items-center gap-2 bg-[#1A2035] border border-[#2D3A52] rounded-lg p-1">
          {DATE_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => setDateRange(range.value)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                dateRange === range.value
                  ? 'bg-[#3B82F6] text-white'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg text-sm text-[#EF4444]">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-[#2D3A52] rounded w-28 mb-3" />
                <div className="h-9 bg-[#2D3A52] rounded w-20 mb-2" />
                <div className="h-3 bg-[#2D3A52] rounded w-16" />
              </div>
            ))
          : stats.map(({ label, value, trend, up, icon: Icon, color }) => (
              <div key={label} className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[#94A3B8] text-sm">{label}</p>
                    <p className={`text-3xl font-bold text-[#F8FAFC] mt-2 ${color}`}>{value}</p>
                    {trend !== null && (
                      <p className={`text-xs mt-1 flex items-center gap-1 ${up ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                        {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {trend} vs previous period
                      </p>
                    )}
                  </div>
                  <Icon size={20} className={color} strokeWidth={1.75} />
                </div>
              </div>
            ))}
      </div>

      {/* Charts 2x2 grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* User Growth — Line Chart */}
        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[#F8FAFC] mb-4">User Growth</h3>
          {loading ? (
            <div className="h-48 bg-[#2D3A52] rounded animate-pulse" />
          ) : userGrowthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={192}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3A52" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#64748B', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#2D3A52' }}
                />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A2035',
                    border: '1px solid #2D3A52',
                    borderRadius: 8,
                    color: '#F8FAFC',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-[#64748B] text-sm">
              No data available
            </div>
          )}
        </div>

        {/* Revenue by Month — Bar Chart */}
        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[#F8FAFC] mb-4">Revenue by Month</h3>
          {loading ? (
            <div className="h-48 bg-[#2D3A52] rounded animate-pulse" />
          ) : revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={192}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3A52" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#64748B', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#2D3A52' }}
                />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A2035',
                    border: '1px solid #2D3A52',
                    borderRadius: 8,
                    color: '#F8FAFC',
                  }}
                />\n                <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-[#64748B] text-sm">
              No data available
            </div>
          )}
        </div>

        {/* Questions by Difficulty — Donut Chart */}
        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[#F8FAFC] mb-4">Questions by Difficulty</h3>
          {loading ? (
            <div className="h-48 bg-[#2D3A52] rounded animate-pulse" />
          ) : difficultyData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    dataKey="value"
                    strokeWidth={0}
                  >
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
            <div className="h-48 flex items-center justify-center text-[#64748B] text-sm">
              No data available
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[#F8FAFC] mb-4">Recent Activity</h3>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-[#2D3A52] last:border-0 animate-pulse">
                  <div className="h-2 w-2 bg-[#2D3A52] rounded-full" />
                  <div className="h-3 bg-[#2D3A52] rounded w-40" />
                </div>
              ))}
            </div>
          ) : data?.recentActivity && data.recentActivity.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {data.recentActivity.slice(0, 20).map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 py-2 border-b border-[#2D3A52] last:border-0"
                >
                  <div className="w-2 h-2 rounded-full bg-[#06B6D4] mt-1.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[#94A3B8] leading-snug">
                      <span className="text-[#F8FAFC] font-medium">
                        {log.user?.name ?? 'System'}
                      </span>{' '}
                      — {log.action.replace(/_/g, ' ').toLowerCase()}
                    </p>
                    <p className="text-[10px] text-[#64748B] mt-0.5">
                      {formatRelativeTime(log.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-[#64748B] text-sm">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
