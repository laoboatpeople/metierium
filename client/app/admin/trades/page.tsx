'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, Check, AlertCircle, Briefcase } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useLocale } from '@/src/contexts/LocaleContext';

interface Trade {
  id: string;
  name: string;
  description: string;
  category: string;
}

export default function AdminTrades() {
  const { t, locale } = useLocale();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Trade | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', category: '' });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrades();
  }, []);

  async function fetchTrades() {
    try {
      const data = await authApi('/api/admin/trades');
      setTrades(data.trades ?? data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('adminLoadError'));
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setFormData({ name: '', description: '', category: 'common' });
    setFormError(null);
    setShowForm(true);
  }

  function openEdit(trade: Trade) {
    setEditing(trade);
    setFormData({ name: trade.name, description: trade.description, category: trade.category });
    setFormError(null);
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError(t('adminFormNameRequired'));
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      if (editing) {
        await authApi(`/api/admin/trades/${editing.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
      } else {
        await authApi('/api/admin/trades', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
      }
      setShowForm(false);
      setEditing(null);
      await fetchTrades();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : t('adminSaveError'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t('adminConfirmDeleteTrade'))) return;
    try {
      await authApi(`/api/admin/trades/${id}`, { method: 'DELETE' });
      await fetchTrades();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('adminDeleteError'));
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
            <Briefcase size={24} className="text-[#3B82F6]" />
            <h1 className="text-2xl font-bold text-[#F8FAFC]">{t('adminTrades')}</h1>
          </div>
          <p className="text-sm text-[#94A3B8]">{t('adminTradesDesc')}</p>
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

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A2035] border border-[#2D3A52] rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#F8FAFC]">
                {editing ? t('adminEditTrade') : t('adminAddTrade')}
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
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">{t('adminName')}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('adminFormNamePlaceholder')}
                  required
                  className="w-full px-4 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">{t('adminDescription')}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t('adminFormDescriptionPlaceholder')}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">{t('adminCategory')}</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
                >
                  <option value="common">{t('adminFormCategoryCommon')}</option>
                  <option value="m">{t('adminFormCategoryM')}</option>
                  <option value="e">{t('adminFormCategoryE')}</option>
                  <option value="s">{t('adminFormCategoryS')}</option>
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
                  {saving ? t('adminFormSaving') : t('adminSave')}
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
                <th className="text-left px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">{t('adminName')}</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">{t('adminCategory')}</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">{t('adminDescription')}</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">{t('adminActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D3A52]">
              {trades.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#64748B] text-sm">
                    {t('adminNoTrades')}
                  </td>
                </tr>
              ) : (
                trades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-[#243047]/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-[#F8FAFC]">{trade.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-[#3B82F6]/10 text-[#3B82F6] text-xs rounded border border-[#3B82F6]/20">
                        {trade.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#94A3B8] max-w-xs truncate">{trade.description}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(trade)}
                          className="p-2 text-[#94A3B8] hover:text-[#3B82F6] hover:bg-[#3B82F6]/10 rounded-lg transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(trade.id)}
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
