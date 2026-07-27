'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, Check, AlertCircle, Briefcase, Layers } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useLocale } from '@/src/contexts/LocaleContext';

interface Trade {
  id: string;
  code: string;
  name: string;
  nameFr: string;
  description: string | null;
  _count?: { chapters: number };
}

export default function AdminTrades() {
  const { t, locale } = useLocale();
  const isFr = locale === 'fr';
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Trade | null>(null);
  const [formData, setFormData] = useState({ code: '', name: '', nameFr: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchTrades();
  }, []);

  async function fetchTrades() {
    try {
      const data = await authApi('/api/admin/trades');
      // API returns { data: Trade[] }
      setTrades(Array.isArray(data.data) ? data.data : Array.isArray(data.trades) ? data.trades : Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('adminLoadError'));
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setFormData({ code: '', name: '', nameFr: '', description: '' });
    setFormError(null);
    setShowForm(true);
  }

  function openEdit(trade: Trade) {
    setEditing(trade);
    setFormData({
      code: trade.code,
      name: trade.name,
      nameFr: trade.nameFr,
      description: trade.description ?? '',
    });
    setFormError(null);
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.code.trim() || !formData.name.trim() || !formData.nameFr.trim()) {
      setFormError(isFr ? 'Code, nom (EN) et nom (FR) sont requis' : 'Code, name (EN) and name (FR) are required');
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const body = JSON.stringify({
        code: formData.code.trim(),
        name: formData.name.trim(),
        nameFr: formData.nameFr.trim(),
        description: formData.description.trim() || undefined,
      });
      if (editing) {
        await authApi(`/api/admin/trades/${editing.id}`, { method: 'PUT', body });
      } else {
        await authApi('/api/admin/trades', { method: 'POST', body });
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
    if (!confirm(isFr ? 'Supprimer ce métier ? Cette action est irréversible.' : 'Delete this trade? This action is irreversible.')) return;
    setDeleting(id);
    try {
      await authApi(`/api/admin/trades/${id}`, { method: 'DELETE' });
      await fetchTrades();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('adminDeleteError'));
    } finally {
      setDeleting(null);
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
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="ELEC"
                  required
                  disabled={!!editing}
                  className="w-full px-4 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] disabled:opacity-50"
                />
                <p className="text-[11px] text-[#64748B] mt-1">
                  {isFr ? 'Identifiant unique (ex: ELEC, PLOMB, SOUD)' : 'Unique identifier (e.g. ELEC, PLOMB, SOUD)'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">{isFr ? 'Nom (EN)' : 'Name (EN)'}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Electrician"
                  required
                  className="w-full px-4 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">{isFr ? 'Nom (FR)' : 'Name (FR)'}</label>
                <input
                  type="text"
                  value={formData.nameFr}
                  onChange={(e) => setFormData({ ...formData, nameFr: e.target.value })}
                  placeholder="Électricien"
                  required
                  className="w-full px-4 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">{t('adminDescription')}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={isFr ? 'Description du métier...' : 'Trade description...'}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] resize-none"
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
                <th className="text-left px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Code</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">{isFr ? 'Nom (FR)' : 'Name (FR)'}</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">{isFr ? 'Nom (EN)' : 'Name (EN)'}</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">{isFr ? 'Chapitres' : 'Chapters'}</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">{t('adminActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D3A52]">
              {trades.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#64748B] text-sm">
                    {t('adminNoTrades')}
                  </td>
                </tr>
              ) : (
                trades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-[#243047]/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-[#3B82F6]/10 text-[#3B82F6] text-xs font-mono rounded border border-[#3B82F6]/20">
                        {trade.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-[#F8FAFC]">{trade.nameFr}</td>
                    <td className="px-6 py-4 text-sm text-[#94A3B8]">{trade.name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-xs text-[#64748B]">
                        <Layers size={12} />
                        {trade._count?.chapters ?? 0}
                      </span>
                    </td>
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
                          disabled={deleting === trade.id}
                          className="p-2 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deleting === trade.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
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
