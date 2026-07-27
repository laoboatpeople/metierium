'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, Check, AlertCircle, HelpCircle, Filter } from 'lucide-react';
import { useLocale } from '@/src/contexts/LocaleContext';
import { authApi } from '@/lib/api';

/* ── Interfaces alignées sur le schema Prisma réel ── */

interface Trade {
  id: string;
  code: string;
  name: string;
  nameFr: string;
  description?: string | null;
  _count?: { chapters: number };
}

interface Chapter {
  id: string;
  number: number;
  name: string;
  nameFr: string;
  tradeId: string;
  theoryContent?: string | null;
  trade?: { code: string; name: string; nameFr: string };
  _count?: { questions: number };
}

interface Question {
  id: string;
  tradeId: string;
  chapterId?: string | null;
  type: string;
  difficulty: string;
  question: string;
  options: string[] | null;
  answer: string;
  explanation?: string | null;
  locale: string;
  createdAt: string;
  chapter?: { id: string; name: string; nameFr: string; number: number } | null;
  trade?: { id: string; code: string; name: string; nameFr: string } | null;
}

/* ── Helpers ── */

function parseOptions(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch { /* not JSON */ }
  }
  return [];
}

function answerLabel(answer: string, options: string[]): string {
  const letter = answer.startsWith('Option ') ? answer.slice(-1) : answer;
  const idx = letter.charCodeAt(0) - 65; // A=0, B=1...
  if (idx >= 0 && idx < options.length) return `${letter}. ${options[idx]}`;
  return answer;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  EASY: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
  MEDIUM: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  HARD: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
};

/* ── Component ── */

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
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    tradeId: '',
    chapterId: '',
    type: 'MCQ',
    difficulty: 'MEDIUM',
    explanation: '',
    locale: 'fr',
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 50;

  useEffect(() => {
    Promise.all([fetchQuestions(), fetchTrades(), fetchChapters()]);
  }, []);

  async function fetchQuestions() {
    try {
      const data = await authApi('/api/admin/questions');
      setQuestions(Array.isArray(data) ? data : data.data ?? data.questions ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('adminQuestionsLoadError'));
    } finally {
      setLoading(false);
    }
  }

  async function fetchTrades() {
    try {
      const data = await authApi('/api/admin/trades');
      setTrades(Array.isArray(data) ? data : data.data ?? data.trades ?? []);
    } catch { /* silent */ }
  }

  async function fetchChapters() {
    try {
      const data = await authApi('/api/admin/chapters');
      setChapters(Array.isArray(data) ? data : data.data ?? data.chapters ?? []);
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

  const totalPages = Math.ceil(filteredQuestions.length / PAGE_SIZE);
  const pagedQuestions = filteredQuestions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function chapterLabel(ch: Question['chapter']): string {
    if (!ch) return '—';
    const name = locale === 'fr' ? (ch.nameFr || ch.name) : ch.name;
    return `Ch. ${ch.number} — ${name}`;
  }

  function tradeLabel(tr: Question['trade']): string {
    if (!tr) return '—';
    return locale === 'fr' ? (tr.nameFr || tr.name) : tr.name;
  }

  function openCreate() {
    setEditing(null);
    setFormData({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      tradeId: filterTrade || trades[0]?.id || '',
      chapterId: '',
      type: 'MCQ',
      difficulty: 'MEDIUM',
      explanation: '',
      locale: 'fr',
    });
    setFormError(null);
    setShowForm(true);
  }

  function openEdit(q: Question) {
    const opts = parseOptions(q.options);
    const padded = [...opts];
    while (padded.length < 4) padded.push('');
    const letter = q.answer.startsWith('Option ') ? q.answer.slice(-1) : q.answer;
    const idx = Math.max(0, letter.charCodeAt(0) - 65);

    setEditing(q);
    setFormData({
      question: q.question,
      options: padded.slice(0, 4),
      correctAnswer: idx >= 0 && idx < 4 ? idx : 0,
      tradeId: q.tradeId,
      chapterId: q.chapterId || '',
      type: q.type,
      difficulty: q.difficulty,
      explanation: q.explanation || '',
      locale: q.locale,
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
    if (!formData.question.trim()) {
      setFormError(t('adminQuestionsTextRequired'));
      return;
    }
    if (formData.options.some((o) => !o.trim())) {
      setFormError(t('adminQuestionsOptionsRequired'));
      return;
    }
    if (!formData.tradeId) {
      setFormError(t('adminQuestionsSelectChapter'));
      return;
    }

    setSaving(true);
    setFormError(null);
    try {
      const answerLetter = String.fromCharCode(65 + formData.correctAnswer); // 0→A, 1→B...
      const payload = {
        tradeId: formData.tradeId,
        chapterId: formData.chapterId || null,
        type: formData.type,
        difficulty: formData.difficulty,
        question: formData.question,
        options: formData.options,
        answer: answerLetter,
        explanation: formData.explanation || null,
        locale: formData.locale,
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
            <span className="px-2.5 py-0.5 bg-[#3B82F6]/10 text-[#3B82F6] text-xs font-semibold rounded-full border border-[#3B82F6]/20">
              {filteredQuestions.length}
            </span>
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
      <div className="flex items-center gap-4 mb-6">
        <Filter size={16} className="text-[#64748B]" />
        <select
          value={filterTrade}
          onChange={(e) => {
            setFilterTrade(e.target.value);
            setFilterChapter('');
            setPage(0);
          }}
          className="px-4 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
        >
          <option value="">{t('adminQuestionsAllTrades')}</option>
          {trades.map((tr) => (
            <option key={tr.id} value={tr.id}>
              {tr.code} — {locale === 'fr' ? (tr.nameFr || tr.name) : tr.name}
            </option>
          ))}
        </select>
        <select
          value={filterChapter}
          onChange={(e) => { setFilterChapter(e.target.value); setPage(0); }}
          className="px-4 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
        >
          <option value="">{t('adminQuestionsAllChapters')}</option>
          {availableChapters.map((ch) => (
            <option key={ch.id} value={ch.id}>
              Ch. {ch.number} — {locale === 'fr' ? (ch.nameFr || ch.name) : ch.name}
            </option>
          ))}
        </select>
        {(filterTrade || filterChapter) && (
          <button
            onClick={() => { setFilterTrade(''); setFilterChapter(''); setPage(0); }}
            className="text-xs text-[#64748B] hover:text-[#F8FAFC] underline transition-colors"
          >
            {t('adminCancel')}
          </button>
        )}
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
              {/* Question text */}
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">{t('adminQuestionsQuestionLabel')}</label>
                <textarea
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder={t('adminQuestionsTextPlaceholder')}
                  rows={3}
                  required
                  className="w-full px-4 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] resize-none"
                />
              </div>

              {/* Trade + Chapter + Type + Difficulty */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">{t('adminQuestionsTrade')}</label>
                  <select
                    value={formData.tradeId}
                    onChange={(e) => setFormData({ ...formData, tradeId: e.target.value, chapterId: '' })}
                    className="w-full px-4 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
                  >
                    {trades.map((tr) => (
                      <option key={tr.id} value={tr.id}>
                        {tr.code} — {locale === 'fr' ? (tr.nameFr || tr.name) : tr.name}
                      </option>
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
                    {chapters
                      .filter((ch) => !formData.tradeId || ch.tradeId === formData.tradeId)
                      .map((ch) => (
                        <option key={ch.id} value={ch.id}>
                          Ch. {ch.number} — {locale === 'fr' ? (ch.nameFr || ch.name) : ch.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
                  >
                    <option value="MCQ">MCQ</option>
                    <option value="TRUE_FALSE">True / False</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Difficulté</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
                  >
                    <option value="EASY">Facile</option>
                    <option value="MEDIUM">Moyen</option>
                    <option value="HARD">Difficile</option>
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
                      {formData.correctAnswer === i ? <Check size={14} /> : String.fromCharCode(65 + i)}
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
                <p className="text-xs text-[#64748B] mt-1">{t('adminQuestionsOptionsHint')}</p>
              </div>

              {/* Explanation */}
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Explication (optionnel)</label>
                <textarea
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Pourquoi cette réponse est correcte..."
                  rows={2}
                  className="w-full px-4 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] resize-none"
                />
              </div>

              {/* Locale */}
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Langue</label>
                <select
                  value={formData.locale}
                  onChange={(e) => setFormData({ ...formData, locale: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
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
                <th className="text-left px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Métier</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">{t('adminQuestionsColChapter')}</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Rép.</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Diff.</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">{t('adminQuestionsColActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D3A52]">
              {pagedQuestions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#64748B] text-sm">
                    {t('adminNoQuestions')}
                  </td>
                </tr>
              ) : (
                pagedQuestions.map((q) => {
                  const opts = parseOptions(q.options);
                  return (
                    <tr key={q.id} className="hover:bg-[#243047]/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-[#F8FAFC] max-w-md">
                        <span className="line-clamp-2">{q.question}</span>
                        {q.locale !== 'fr' && (
                          <span className="ml-2 px-1.5 py-0.5 bg-[#64748B]/10 text-[#64748B] text-[10px] rounded uppercase">{q.locale}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-[#3B82F6]/10 text-[#3B82F6] text-xs rounded border border-[#3B82F6]/20 font-mono">
                          {q.trade?.code || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-[#8B5CF6]/10 text-[#8B5CF6] text-xs rounded border border-[#8B5CF6]/20">
                          {chapterLabel(q.chapter)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-[#10B981]/10 text-[#10B981] text-xs font-bold rounded border border-[#10B981]/20">
                          {q.answer.startsWith('Option ') ? q.answer.slice(-1) : q.answer}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 text-xs rounded border ${DIFFICULTY_COLORS[q.difficulty] || 'bg-[#64748B]/10 text-[#64748B] border-[#64748B]/20'}`}>
                          {q.difficulty}
                        </span>
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#2D3A52]">
            <span className="text-xs text-[#64748B]">
              {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filteredQuestions.length)} / {filteredQuestions.length}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-xs text-[#F8FAFC] disabled:opacity-30 hover:border-[#3B82F6] transition-colors"
              >
                ←
              </button>
              <span className="px-3 py-1.5 text-xs text-[#94A3B8]">{page + 1} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-xs text-[#F8FAFC] disabled:opacity-30 hover:border-[#3B82F6] transition-colors"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
