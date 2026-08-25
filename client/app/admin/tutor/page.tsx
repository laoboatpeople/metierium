'use client';

import { useEffect, useState, useCallback } from 'react';
import { Loader2, RefreshCw, ThumbsUp, ThumbsDown, Trash2, MessageSquare } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useLocale } from '@/src/contexts/LocaleContext';

interface TutorFeedbackItem {
  id: string;
  rating: string;
  comment: string | null;
  createdAt: string;
  user: { id: string; name: string | null; email: string };
  message: {
    id: string;
    content: string;
    createdAt: string;
    session: { id: string; topic: string | null };
  };
}

const stripForPreview = (content: string): string => {
  return content
    .replace(/<svg[\s\S]*?<\/svg>/gi, '[diagram]')
    .replace(/[#>*`_[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export default function AdminTutorFeedbackPage() {
  const { t } = useLocale();
  const [feedbacks, setFeedbacks] = useState<TutorFeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const fetchFeedbacks = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const res = await authApi('/api/admin/tutor-feedback');
        if (res.status === 401 || res.status === 403) {
          setError('Unauthorized');
          return;
        }
        const data = await res.json();
        setFeedbacks(data.data ?? []);
        setError('');
      } catch {
        if (!silent) setError('Failed to load feedback');
      } finally {
        if (!silent) setLoading(false);
      }
    },
    []
  );

  // Initial load + silent refetch on focus/visibilitychange (PITFALL: stale admin pages)
  useEffect(() => {
    fetchFeedbacks();
    const onFocus = () => fetchFeedbacks(true);
    const onVisible = () => {
      if (document.visibilityState === 'visible') fetchFeedbacks(true);
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [fetchFeedbacks]);

  const handleDelete = async (id: string) => {
    if (confirmId !== id) {
      setConfirmId(id);
      return;
    }
    setConfirmId(null);
    setDeletingId(id);
    try {
      const res = await authApi(`/api/admin/tutor-feedback/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('delete failed');
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    } catch {
      setError('Failed to delete feedback');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#F8FAFC]">Tutor Feedback</h1>
          <p className="text-xs text-[#64748B] mt-1">
            Thumbs up/down + comments from the AI tutor
          </p>
        </div>
        <button
          onClick={() => fetchFeedbacks(true)}
          className="flex items-center gap-2 px-3 py-2 text-xs bg-[#111827] border border-[#2D3A52] rounded-lg text-[#94A3B8] hover:border-[#3B82F6]/40 hover:text-[#F8FAFC] transition-all"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-2.5 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg text-sm text-[#EF4444]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-[#3B82F6]" />
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center py-20 text-sm text-[#64748B] border border-dashed border-[#2D3A52] rounded-xl">
          No tutor feedback yet
        </div>
      ) : (
        <div className="space-y-3">
          {feedbacks.map((f) => (
            <div
              key={f.id}
              className="bg-[#0D1117] border border-[#1E2D45] rounded-xl p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {f.rating === 'up' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-green/15 text-green">
                      <ThumbsUp size={12} /> Up
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-red/15 text-red">
                      <ThumbsDown size={12} /> Down
                    </span>
                  )}
                  <span className="text-sm font-medium text-[#F8FAFC]">
                    {f.user.name || f.user.email}
                  </span>
                  <span className="text-xs text-[#64748B]">
                    {new Date(f.createdAt).toLocaleString('fr-CA')}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(f.id)}
                  disabled={deletingId === f.id}
                  className={`p-1.5 rounded-lg transition-all ${
                    confirmId === f.id
                      ? 'bg-[#EF4444] text-white'
                      : 'text-[#64748B] hover:text-[#EF4444] hover:bg-[#1E2D45]'
                  }`}
                  title={confirmId === f.id ? 'Confirm delete' : 'Delete'}
                >
                  {deletingId === f.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>

              {f.comment && (
                <p className="mt-2 text-sm text-[#F8FAFC] bg-[#111827] border border-[#2D3A52] rounded-lg px-3 py-2">
                  {f.comment}
                </p>
              )}

              <div className="mt-2 flex items-start gap-2 text-xs text-[#94A3B8]">
                <MessageSquare size={12} className="mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">
                  {f.message.session.topic && (
                    <span className="text-[#64748B] mr-1">[{f.message.session.topic}]</span>
                  )}
                  {stripForPreview(f.message.content)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
