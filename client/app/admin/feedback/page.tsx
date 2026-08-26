'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ThumbsUp, ThumbsDown, Loader2, MessageSquare, BookMarked, Clock, RefreshCw, Trash2 } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useLocale } from '@/src/contexts/LocaleContext';

interface TutorFeedbackItem {
  id: string;
  rating: string;
  comment: string | null;
  createdAt: string;
  source: string;
  user: { id: string; name: string | null; email: string };
  message: {
    id: string;
    content: string;
    createdAt: string;
    session: { id: string; topic: string | null };
  } | null;
  chapter: {
    id: string;
    number: number;
    name: string;
    nameFr: string;
    trade: { code: string; name: string; nameFr: string };
  } | null;
}

function messagePreview(content: string): string {
  // Compact plain-text preview: strip SVG diagrams + markdown syntax
  const noSvg = content.replace(/<svg[\s\S]*?<\/svg>/gi, '[diagram]');
  const plain = noSvg
    .replace(/[#>*`_[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > 180 ? plain.slice(0, 180) + '…' : plain;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('fr-CA', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function AdminFeedbackPage() {
  const { locale } = useLocale();
  const [feedbacks, setFeedbacks] = useState<TutorFeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFeedbacks = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      setError('');
      try {
        // authApi returns the parsed JSON body (NOT a Response) — see lib/api.ts handleResponse
        const data = await authApi('/api/admin/tutor-feedback');
        setFeedbacks(data.data ?? []);
      } catch (err) {
        setError(err instanceof Error && err.message.includes('401')
          ? 'Unauthorized — admin access required'
          : 'Failed to load feedback');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  // Refetch silently when the tab regains focus (e.g. coming back from /theory or /tutor)
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') fetchFeedbacks(true);
    };
    window.addEventListener('focus', onVisible);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('focus', onVisible);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [fetchFeedbacks]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!window.confirm('Delete this feedback?')) return;
      try {
        await authApi(`/api/admin/tutor-feedback/${id}`, { method: 'DELETE' });
        fetchFeedbacks(true);
      } catch {
        setError('Failed to delete feedback');
      }
    },
    [fetchFeedbacks]
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#F8FAFC]">Feedback</h1>
          <p className="text-xs text-[#64748B] mt-1">
            Thumbs up/down from theories and AI tutor
          </p>
        </div>
        {!loading && !error && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#64748B]">
              {feedbacks.length} feedback{feedbacks.length === 1 ? '' : 's'}
            </span>
            <button
              onClick={() => fetchFeedbacks()}
              className="inline-flex items-center gap-1.5 text-xs text-[#3B82F6] hover:underline"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="text-[#3B82F6] animate-spin" />
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-[#EF4444]">{error}</p>
        </div>
      )}

      {!loading && !error && feedbacks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-[#64748B]">
          <ThumbsUp size={28} className="mb-2" />
          <p className="text-sm">No feedback yet</p>
        </div>
      )}

      {!loading && !error && feedbacks.length > 0 && (
        <div className="space-y-3">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="bg-[#0D1117] border border-[#1E2D45] rounded-xl p-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      fb.rating === 'up'
                        ? 'bg-green/15 text-green'
                        : 'bg-red/15 text-red'
                    }`}
                  >
                    {fb.rating === 'up' ? <ThumbsUp size={12} /> : <ThumbsDown size={12} />}
                    {fb.rating === 'up' ? 'Helpful' : 'Not helpful'}
                  </span>
                  <Link
                    href={`/admin/users/${fb.user.id}`}
                    className="text-sm font-medium text-[#3B82F6] hover:underline"
                  >
                    {fb.user.name || fb.user.email}
                  </Link>
                  <span className="text-xs text-[#64748B]">{fb.user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs text-[#64748B]">
                    <Clock size={12} />
                    {formatDate(fb.createdAt)}
                  </span>
                  {fb.source === 'theory' && fb.chapter ? (
                    <Link
                      href={`/theory?chapterId=${fb.chapter.id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-xs text-[#06B6D4] hover:underline"
                    >
                      <BookMarked size={12} />
                      View theory section
                    </Link>
                  ) : fb.message ? (
                    <Link
                      href={`/admin/users/${fb.user.id}?chat=${fb.message.session.id}`}
                      className="inline-flex items-center gap-1.5 text-xs text-[#06B6D4] hover:underline"
                    >
                      <MessageSquare size={12} />
                      View conversation
                    </Link>
                  ) : null}
                  <button
                    onClick={() => handleDelete(fb.id)}
                    className="inline-flex items-center gap-1 text-xs text-[#EF4444] hover:underline"
                    title="Delete feedback"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>

              {fb.comment && (
                <p className="mt-3 text-sm text-[#F8FAFC] bg-[#111827] border border-[#2D3A52] rounded-lg px-3 py-2">
                  “{fb.comment}”
                </p>
              )}

              {fb.source === 'theory' && fb.chapter ? (
                <p className="mt-2 text-xs text-[#64748B] leading-relaxed">
                  {fb.chapter.trade.code} — {fb.chapter.number}. {fb.chapter.name}
                  {locale === 'fr' && fb.chapter.nameFr && fb.chapter.nameFr !== fb.chapter.name
                    ? ` · ${fb.chapter.nameFr}`
                    : ''}
                </p>
              ) : fb.message ? (
                <p className="mt-2 text-xs text-[#64748B] leading-relaxed">
                  {messagePreview(fb.message.content)}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
