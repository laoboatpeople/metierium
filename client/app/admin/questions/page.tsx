'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, Check, AlertCircle, HelpCircle } from 'lucide-react';
import { useLocale } from '@/src/contexts/LocaleContext';
import { authApi } from '@/lib/api';

interface Trade {
  id: string;
  name: string;
}

interface Chapter {
  id: string;
  title: string;
  tradeId: string;
}

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  tradeId: string;
  chapterId: string;
  chapter?: { title: string };
}

export default function AdminQuestions() {
  const { t, locale } = useLocale();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterTrade, setFilterTrade] = useState('');
  const [filterChapter, setFilterChapter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Question | null>(null);
  const [formData, setFormData] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    tradeId: '',
    chapterId: '',
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchQuestions(), fetchTrades(), fetchChapters()]);
  }, []);

  async function fetchQuestions() {
    try {
      const data = await authApi('/api/admin/questions');
      setQuestions(data.questions ?? data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('adminQuestionsLoadError'));
    } finally {
      setLoading(false);
    }
  }

  async function fetchTrades() {
    try {
      const data = await authApi('/api/admin/trades');
      setTrades(data.trades ?? data);
    } catch { /* silent */ }
  }

  async function fetchChapters() {
    try {
      const data = await authApi('/api/admin/chapters');
      setChapters(data.chapters ?? data);
    } catch { /* silent */ }
  }

  const availableChapters = filterTrade
    ? chapters.filter((ch) => ch.tradeId === filterTrade)
    : chapters;

  const filteredQuestions = questions.filter((q) => {
    if (filterTrade && q.tradeId !== filterTrade) return false;
    if (filterChapter && q.chapterId !== filterChapter) return false;
    return true;
  });

  function openCreate() {
    setEditing(null);
    setFormData({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      tradeId: trades[0]?.id || '',
      chapterId: '',
    });
    setFormError(null);
    setShowForm(true);
  }

  function openEdit(question: Question) {
    const opts = question.options.length >= 4 ? question.options : [...question.options, '', '', '', ''];
    setEditing(question);
    setFormData({
      text: question.text,
      options: opts.slice(0, 4),
      correctAnswer: question.correctAnswer,
      tradeId: question.tradeId,
      chapterId: question.chapterId,
    });
    setFormError(null);
    setShowForm(true);
  }

  function updateOption(index: number, value: string) {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.text.trim()) {
      setFormError(t('adminQuestionsTextRequired'));
      return;
    }
    if (formData.options.some((o) => !o.trim())) {
      setFormError(t('adminQuestionsOptionsRequired'));
      return;
    }
    if (!formData.chapterId) {
      setFormError(t('adminQuestionsSelectChapter'));
      return;
    }

    setSaving(true);
    setFormError(null);
    try {
      const payload = {
        text: formData.text,
        options: formData.options,
        correctAnswer: formData.correctAnswer,
        tradeId: formData.tradeId,
        chapterId: formData.chapterId,
      };
      if (editing) {
        await authApi(`/api/admin/questions/${editing.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await authApi('/api/admin/questions', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setShowForm(false);
      await fetchQuestions();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : t('adminQuestionsSaveError'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t('adminQuestionsConfirmDeleteQuestion'))) return;
    try {
      await authApi(`/api/admin/questions/${id}`, { method: 'DELETE' });
      await fetchQuestions();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('adminQuestionsDeleteError'));
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
            <HelpCircle size={24} className="text-[#3B82F6]" />
            <h1 className="text-2xl font-bold text-[#F8FAFC]">{t('adminQuestions')}</h1>
          </div>
          <p className="text-sm text-[#94A3B8]">{t('adminQuestionsDesc')}</p>
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

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={filterTrade}
          onChange={(e) => {
            setFilterTrade(e.target.value);
            setFilterChapter('');
            if (!showForm) {
              setFormData({ ...formData, tradeId: e.target.value, chapterId: '' });
            }
          }}
          className="px-4 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
        >
          <option value="">{t('adminQuestionsAllTrades')}</option>
          {trades.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        <select
          value={filterChapter}
          onChange={(e) => setFilterChapter(e.target.value)}
          className="px-4 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
        >
          <option value="">{t('adminQuestionsAllChapters')}</option>
          {availableChapters.map((ch) => (
            <option key={ch.id} value={ch.id}>{ch.title}</option>
          ))}
        </select>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A2035] border border-[#2D3A52] rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#F8FAFC]">
                {editing ? t('adminQuestionsEditTitle') : t('adminQuestionsAddTitle')}
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
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">{t('adminQuestionsQuestionLabel')}</label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder={t('adminQuestionsTextPlaceholder')}
                  rows={3}
                  required
                  className="w-full px-4 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">{t('adminQuestionsTrade')}</label>
                  <select
                    value={formData.tradeId}
                    onChange={(e) => setFormData({ ...formData, tradeId: e.target.value, chapterId: '' })}
                    className="w-full px-4 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
                  >
                    {trades.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">{t('adminQuestionsChapter')}</label>
                  <select
                    value={formData.chapterId}
                    onChange={(e) => setFormData({ ...formData, chapterId: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
                  >
                    <option value="">{t('adminQuestionsSelect')}</option>
                    {availableChapters.map((ch) => (
                      <option key={ch.id} value={ch.id}>{ch.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">{t('adminQuestionsOptions')}</label>
                {formData.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-3 mb-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, correctAnswer: i })}
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-bold transition-colors ${
                        formData.correctAnswer === i
                          ? 'bg-[#10B981] border-[#10B981] text-white'
                          : 'bg-[#111827] border-[#2D3A52] text-[#64748B] hover:border-[#10B981]'
                      }`}
                    >
                      {formData.correctAnswer === i ? <Check size={14} /> : i + 1}
                    </button>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(i, e.target.value)}
                      placeholder={t('adminQuestionsOptionNumber', { number: i + 1 })}
                      className="flex-1 px-4 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6]"
                    />
                  </div>
                ))}
                <p className="text-xs text-[#64748B] mt-1">
                  {t('adminQuestionsOptionsHint')}
                </p>
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
                  {saving ? t('adminQuestionsSaving') : t('adminSave')}
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
                <th className="text-left px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">{t('adminQuestionsColQuestion')}</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">{t('adminQuestionsColChapter')}</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">{t('adminQuestionsColOptions')}</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">{t('adminQuestionsColActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D3A52]">
              {filteredQuestions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#64748B] text-sm">
                    {t('adminNoQuestions')}
                  </td>
                </tr>
              ) : (
                filteredQuestions.map((q) => (
                  <tr key={q.id} className="hover:bg-[#243047]/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-[#F8FAFC] max-w-md truncate">{q.text}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-[#8B5CF6]/10 text-[#8B5CF6] text-xs rounded border border-[#8B5CF6]/20">
                        {q.chapter?.title || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#94A3B8]">
                      {t('adminQuestionsCount', { count: q.options.length })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(q)}
                          className="p-2 text-[#94A3B8] hover:text-[#3B82F6] hover:bg-[#3B82F6]/10 rounded-lg transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
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
