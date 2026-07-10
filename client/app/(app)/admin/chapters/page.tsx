'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, Check, AlertCircle, BookOpen } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useLocale } from '@/src/contexts/LocaleContext';

interface Trade {
  id: string;
  name: string;
}

interface Chapter {
  id: string;
  title: string;
  tradeId: string;
  theoryContent: string;
  order: number;
  trade?: { name: string };
}

export default function AdminChapters() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterTrade, setFilterTrade] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Chapter | null>(null);
  const [formData, setFormData] = useState({ title: '', tradeId: '', theoryContent: '', order: 0 });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { t, locale } = useLocale();

  useEffect(() => {
    Promise.all([fetchChapters(), fetchTrades()]);
  }, []);

  async function fetchChapters() {
    try {
      const data = await authApi('/api/admin/chapters');
      setChapters(data.chapters ?? data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('adminChaptersErrorLoading'));
    } finally {
      setLoading(false);
    }
  }

  async function fetchTrades() {
    try {
      const data = await authApi('/api/admin/trades');
      setTrades(data.trades ?? data);
    } catch {
      // Silently fail
    }
  }

  const filteredChapters = filterTrade
    ? chapters.filter((ch) => ch.tradeId === filterTrade)
    : chapters;

  function openCreate() {
    setEditing(null);
    setFormData({ title: '', tradeId: trades[0]?.id || '', theoryContent: '', order: 1 });
    setFormError(null);
    setShowForm(true);
  }

  function openEdit(chapter: Chapter) {
    setEditing(chapter);
    setFormData({
      title: chapter.title,
      tradeId: chapter.tradeId,
      theoryContent: chapter.theoryContent || '',
      order: chapter.order,
    });
    setFormError(null);
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError(t('adminChaptersTitleRequired'));
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      if (editing) {
        await authApi(`/api/admin/chapters/${editing.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
      } else {
        await authApi('/api/admin/chapters', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
      }
      setShowForm(false);
      setEditing(null);
      await fetchChapters();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : t('adminChaptersSaveError'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t('adminChaptersDeleteConfirm'))) return;
    try {
      await authApi(`/api/admin/chapters/${id}`, { method: 'DELETE' });
      await fetchChapters();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('adminChaptersDeleteError'));
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-[#3B82F6]" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen size={24} className="text-[#3B82F6]" />
            <h1 className="text-2xl font-bold text-[#F8FAFC]">{t('adminChapters')}</h1>
          </div>
          <p className="text-sm text-[#94A3B8]">{t('adminChaptersDesc')}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-lg text-sm font-semibold hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all"
        >
          <Plus size={16} />
          {t('adminAdd')}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 mb-6 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg text-sm text-[#EF4444]">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Filter */}
      <div className="mb-6">
        <select
          value={filterTrade}
          onChange={(e) => setFilterTrade(e.target.value)}
          className="px-4 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
        >
          <option value="">{t('adminChaptersFilterAll')}</option>
          {trades.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A2035] border border-[#2D3A52] rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#F8FAFC]">
                {editing ? t('adminChaptersEditTitle') : t('adminChaptersAddTitle')}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-[#94A3B8] hover:text-[#F8FAFC]">
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="flex items-center gap-2 px-4 py-3 mb-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg text-sm text-[#EF4444]">
                <AlertCircle size={16} />
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">{t('adminChaptersLabelTitle')}</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder={t('adminChaptersPlaceholderTitle')}
                    required
                    className="w-full px-4 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">{t('adminChaptersLabelTrade')}</label>
                  <select
                    value={formData.tradeId}
                    onChange={(e) => setFormData({ ...formData, tradeId: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
                  >
                    {trades.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">{t('adminChaptersLabelOrder')}</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  min={1}
                  className="w-32 px-4 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">{t('adminChaptersLabelTheory')}</label>
                <textarea
                  value={formData.theoryContent}
                  onChange={(e) => setFormData({ ...formData, theoryContent: e.target.value })}
                  placeholder={t('adminChaptersPlaceholderTheory')}
                  rows={12}
                  className="w-full px-4 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] resize-none font-mono"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 bg-[#2D3A52] text-[#94A3B8] rounded-lg text-sm font-medium hover:text-[#F8FAFC] transition-colors"
                >
                  {t('adminCancel')}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-lg text-sm font-semibold disabled:opacity-50 transition-all"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  {saving ? t('adminChaptersSaving') : t('adminSave')}
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
                <th className="text-left px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">{t('adminChaptersTableOrder')}</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">{t('adminChaptersTableTitle')}</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">{t('adminChaptersTableTrade')}</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">{t('adminChaptersTableTheory')}</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">{t('adminChaptersTableActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D3A52]">
              {filteredChapters.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#64748B] text-sm">
                    {t('adminNoChapters')}
                  </td>
                </tr>
              ) : (
                filteredChapters.map((chapter) => (
                  <tr key={chapter.id} className="hover:bg-[#243047]/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-[#94A3B8]">{chapter.order}</td>
                    <td className="px-6 py-4 text-sm font-medium text-[#F8FAFC]">{chapter.title}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-[#3B82F6]/10 text-[#3B82F6] text-xs rounded border border-[#3B82F6]/20">
                        {chapter.trade?.name || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {chapter.theoryContent ? (
                        <span className="px-2 py-0.5 bg-[#10B981]/10 text-[#10B981] text-xs rounded border border-[#10B981]/20">
                          {t('adminChaptersPublished')}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-[#64748B]/10 text-[#64748B] text-xs rounded border border-[#64748B]/20">
                          {t('adminChaptersEmpty')}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(chapter)}
                          className="p-2 text-[#94A3B8] hover:text-[#3B82F6] hover:bg-[#3B82F6]/10 rounded-lg transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(chapter.id)}
                          className="p-2 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
