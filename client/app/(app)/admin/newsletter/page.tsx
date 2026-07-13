'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Loader2, Search, Plus, Trash2, X, Check } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  status: string;
  subscribedAt: string;
}

export default function AdminNewsletterPage() {
  const router = useRouter();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [addStatus, setAddStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [addMsg, setAddMsg] = useState('');

  const getToken = useCallback(() => localStorage.getItem('token'), []);

  const fetchSubscribers = useCallback(async () => {
    const token = getToken();
    if (!token) { router.replace('/auth/login'); return; }
    try {
      const res = await fetch('/api/admin/newsletter/subscribers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { localStorage.removeItem('token'); router.push('/auth/login'); return; }
      if (!res.ok) throw new Error('Failed to load subscribers');
      const data = await res.json();
      setSubscribers(data.subscribers || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getToken, router]);

  useEffect(() => { fetchSubscribers(); }, [fetchSubscribers]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddStatus('loading');
    setAddMsg('');
    const token = getToken();
    try {
      const res = await fetch('/api/admin/newsletter/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: newEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add');
      setAddStatus('success');
      setAddMsg('Subscriber added successfully!');
      setNewEmail('');
      fetchSubscribers();
      setTimeout(() => { setShowAdd(false); setAddStatus('idle'); }, 1500);
    } catch (err: any) {
      setAddStatus('error');
      setAddMsg(err.message);
    }
  };

  const handleToggleStatus = async (sub: Subscriber) => {
    const token = getToken();
    const newStatus = sub.status === 'ACTIVE' ? 'UNSUBSCRIBED' : 'ACTIVE';
    try {
      const res = await fetch(`/api/admin/newsletter/subscribers/${sub.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update');
      fetchSubscribers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this subscriber?')) return;
    const token = getToken();
    try {
      const res = await fetch(`/api/admin/newsletter/subscribers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete');
      fetchSubscribers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-[#3B82F6]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Mail size={24} className="text-[#3B82F6]" />
            <h1 className="text-2xl font-bold text-[#F8FAFC]">Newsletter</h1>
          </div>
          <p className="text-sm text-[#94A3B8]">
            {subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => { setShowAdd(true); setAddStatus('idle'); setAddMsg(''); setNewEmail(''); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#3B82F6] text-white text-sm font-medium hover:bg-[#3B82F6]/90 transition-colors"
        >
          <Plus size={16} />
          Add Subscriber
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#0A0E1A] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#3B82F6]/50"
        />
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 text-sm text-[#EF4444]">
          {error}
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#0A0E1A] border border-[#2D3A52] rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#F8FAFC]">Add Subscriber</h2>
              <button onClick={() => setShowAdd(false)} className="text-[#94A3B8] hover:text-[#F8FAFC]">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="w-full px-4 py-2.5 bg-[#0A0E1A] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#3B82F6]/50"
              />
              {addMsg && (
                <p className={`text-sm ${addStatus === 'success' ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                  {addMsg}
                </p>
              )}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2 rounded-lg border border-[#2D3A52] text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addStatus === 'loading'}
                  className="px-4 py-2 rounded-lg bg-[#3B82F6] text-white text-sm font-medium hover:bg-[#3B82F6]/90 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {addStatus === 'loading' ? <Loader2 size={14} className="animate-spin" /> : null}
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2D3A52]">
                <th className="text-left px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Subscribed</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D3A52]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-[#64748B]">
                    {search ? 'No subscribers match your search.' : 'No subscribers yet.'}
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#243047] transition-colors">
                    <td className="px-6 py-4 text-sm text-[#F8FAFC]">{sub.email}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(sub)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          sub.status === 'ACTIVE'
                            ? 'bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20'
                            : 'bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20'
                        }`}
                        title={sub.status === 'ACTIVE' ? 'Click to unsubscribe' : 'Click to reactivate'}
                      >
                        {sub.status === 'ACTIVE' ? <Check size={12} /> : <X size={12} />}
                        {sub.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#94A3B8]">
                      {new Date(sub.subscribedAt).toLocaleDateString('en-CA', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="p-1.5 rounded-lg text-[#64748B] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                        title="Delete subscriber"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
