'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  DollarSign,
  RefreshCw,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  Check,
} from 'lucide-react';

interface SubscriptionUser {
  name: string;
  email: string;
}

interface Subscription {
  id: string;
  userId: string;
  user: SubscriptionUser;
  plan: 'FREE' | 'MONTHLY' | 'LIFETIME';
  status: string;
  startedAt: string;
  renewsAt: string;
  amount: number;
  cancelAtPeriodEnd: boolean;
  stripeSubId: string | null;
  stripeCustomerId: string | null;
}

interface SubscriptionsData {
  totalActive: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  churnRate: number;
  subscriptions: Subscription[];
  totalCount: number;
  page: number;
  totalPages: number;
}

const PLAN_COLORS: Record<string, string> = {
  FREE: 'bg-[#64748B]',
  MONTHLY: 'bg-[#3B82F6]',
  LIFETIME: 'bg-[#06B6D4]',
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
  PAST_DUE: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  CANCELLED: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
};

const PLAN_FEATURES: Record<string, string[]> = {
  FREE: ['1 trade category', 'Basic statistics', 'Standard explanations'],
  MONTHLY: ['Unlimited questions', 'All trade categories', 'Progress tracking', 'Full AI tutor access', 'Unlimited exams', 'Detailed explanations'],
  LIFETIME: ['Unlimited questions', 'All trade categories', 'Progress tracking', 'Full AI tutor access', 'Unlimited exams', 'Detailed explanations'],
};

function PlanBadge({ plan }: { plan: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium text-white ${PLAN_COLORS[plan] ?? 'bg-[#64748B]'}`}
    >
      {plan}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${STATUS_COLORS[status] ?? 'bg-[#64748B]/10 text-[#64748B] border-[#64748B]/20'}`}
    >
      {status === 'ACTIVE' ? <Check size={10} className="mr-1" /> : null}
      {status.replace('_', ' ')}
    </span>
  );
}

export default function AdminSubscriptionsPage() {
  const router = useRouter();
  const [data, setData] = useState<SubscriptionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPlan, setFilterPlan] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchSubscriptions = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '10',
      });
      if (filterStatus) params.set('status', filterStatus);
      if (filterPlan) params.set('plan', filterPlan);

      const res = await fetch(`/api/admin/subscriptions?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/auth/login');
        return;
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus, filterPlan, router]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const handleCancel = async (sub: Subscription) => {
    if (!confirm(`Cancel subscription for ${sub.user.name}?`)) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/admin/subscriptions/${sub.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      fetchSubscriptions();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Cancel failed');
    }
  };

  const filteredSubs = (data?.subscriptions ?? []).filter((sub) => {
    if (search) {
      const q = search.toLowerCase();
      if (!sub.user.name.toLowerCase().includes(q) && !sub.user.email.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const stats = [
    {
      label: 'Total Active',
      value: data?.totalActive ?? '—',
      icon: Users,
      color: 'text-[#3B82F6]',
    },
    {
      label: 'Monthly Revenue',
      value: data ? `$${data.monthlyRevenue.toFixed(2)}` : '—',
      icon: DollarSign,
      color: 'text-[#10B981]',
    },
    {
      label: 'Lifetime Revenue',
      value: data ? `$${data.yearlyRevenue.toFixed(2)}` : '—',
      icon: RefreshCw,
      color: 'text-[#06B6D4]',
    },
    {
      label: 'Churn Rate',
      value: data ? `${data.churnRate}%` : '—',
      icon: AlertCircle,
      color: 'text-[#F59E0B]',
    },
  ];

  const isLoading = loading && data === null;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#F8FAFC]">Subscriptions</h1>
        <p className="text-sm text-[#94A3B8] mt-1">Manage subscription plans and billing</p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg text-sm text-[#EF4444]">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-[#2D3A52] rounded w-24 mb-3" />
                <div className="h-8 bg-[#2D3A52] rounded w-20 mb-2" />
                <div className="h-3 bg-[#2D3A52] rounded w-16" />
              </div>
            ))
          : stats.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[#94A3B8] text-sm">{label}</p>
                    <p className={`text-3xl font-bold text-[#F8FAFC] mt-2 ${color}`}>{value}</p>
                  </div>
                  <Icon size={20} className={color} strokeWidth={1.75} />
                </div>
              </div>
            ))}
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { plan: 'FREE', label: 'Free', price: '$0', period: '', features: PLAN_FEATURES.FREE },
          { plan: 'MONTHLY', label: 'Monthly', price: '$29.99', period: '/mo', features: PLAN_FEATURES.MONTHLY },
          { plan: 'LIFETIME', label: 'Lifetime', price: '$199', period: ' once', features: PLAN_FEATURES.LIFETIME },
        ].map(({ plan, label, price, period, features }) => (
          <div
            key={plan}
            className={`bg-[#1A2035] border rounded-xl p-6 ${
              plan === 'LIFETIME' ? 'border-[#06B6D4]/40' : 'border-[#2D3A52]'
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <PlanBadge plan={label} />
              {plan === 'LIFETIME' && (
                <span className="text-[10px] px-1.5 py-0.5 bg-[#06B6D4]/20 text-[#06B6D4] rounded">Best value</span>
              )}
            </div>
            <p className="text-3xl font-bold text-[#F8FAFC]">
              {price}
              <span className="text-sm font-normal text-[#94A3B8]">{period}</span>
            </p>
            <ul className="mt-4 space-y-2">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <Check size={13} className="text-[#10B981] flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Active Subscriptions Table */}
      <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl overflow-hidden mb-8">
        <div className="p-6 border-b border-[#2D3A52]">
          <h2 className="text-base font-semibold text-[#F8FAFC]">Active Subscriptions</h2>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-[#2D3A52] flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#0A0E1A] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#3B82F6]"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-[#0A0E1A] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
          >
            <option value="" className="bg-[#0A0E1A]">All Statuses</option>
            <option value="ACTIVE" className="bg-[#0A0E1A]">Active</option>
            <option value="PAST_DUE" className="bg-[#0A0E1A]">Past Due</option>
            <option value="CANCELLED" className="bg-[#0A0E1A]">Cancelled</option>
          </select>

          <select
            value={filterPlan}
            onChange={(e) => { setFilterPlan(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-[#0A0E1A] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
          >
            <option value="" className="bg-[#0A0E1A]">All Plans</option>
            <option value="FREE" className="bg-[#0A0E1A]">Free</option>
            <option value="MONTHLY" className="bg-[#0A0E1A]">Monthly</option>
            <option value="LIFETIME" className="bg-[#0A0E1A]">Lifetime</option>
          </select>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-[#2D3A52] last:border-0 animate-pulse">
                <div className="h-3 bg-[#2D3A52] rounded w-40" />
                <div className="h-3 bg-[#2D3A52] rounded w-16" />
                <div className="h-3 bg-[#2D3A52] rounded w-20" />
                <div className="h-3 bg-[#2D3A52] rounded w-20" />
                <div className="h-3 bg-[#2D3A52] rounded w-12" />
              </div>
            ))}
          </div>
        ) : filteredSubs.length === 0 ? (
          <div className="py-12 text-center text-[#64748B] text-sm">No subscriptions found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2D3A52] text-left">
                    <th className="px-6 py-3 text-xs font-medium text-[#94A3B8]">User</th>
                    <th className="px-6 py-3 text-xs font-medium text-[#94A3B8]">Plan</th>
                    <th className="px-6 py-3 text-xs font-medium text-[#94A3B8]">Status</th>
                    <th className="px-6 py-3 text-xs font-medium text-[#94A3B8]">Started</th>
                    <th className="px-6 py-3 text-xs font-medium text-[#94A3B8]">Renewal</th>
                    <th className="px-6 py-3 text-xs font-medium text-[#94A3B8]">Amount</th>
                    <th className="px-6 py-3 text-xs font-medium text-[#94A3B8]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubs.map((sub) => (
                    <tr key={sub.id} className="border-b border-[#2D3A52] hover:bg-[#243047] transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-[#F8FAFC] font-medium">{sub.user.name}</p>
                          <p className="text-[#64748B] text-xs">{sub.user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <PlanBadge plan={sub.plan} />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={sub.status} />
                      </td>
                      <td className="px-6 py-4 text-[#94A3B8]">
                        {new Date(sub.startedAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-[#94A3B8]">
                        {new Date(sub.renewsAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-[#94A3B8]">
                        {sub.amount === 0 ? '—' : `$${sub.amount.toFixed(2)}`}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleCancel(sub)}
                          className="text-xs text-[#EF4444] hover:text-[#EF4444]/80 transition-colors"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data && (
              <div className="p-4 border-t border-[#2D3A52] flex items-center justify-between">
                <p className="text-xs text-[#64748B]">
                  Page {data.page} of {data.totalPages} · {data.totalCount} total
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={data.page <= 1}
                    className="p-2 rounded-lg border border-[#2D3A52] text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                    disabled={data.page >= data.totalPages}
                    className="p-2 rounded-lg border border-[#2D3A52] text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
