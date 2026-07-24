'use client';

import { useState, useEffect } from 'react';
import { Bell, Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminNotificationsPage() {
  const [adminNotificationEmail, setAdminNotificationEmail] = useState('');
  const [adminNewUserAlert, setAdminNewUserAlert] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/settings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch settings');
      const json = await res.json();
      setAdminNotificationEmail(json.data.adminNotificationEmail || '');
      setAdminNewUserAlert(json.data.adminNewUserAlert !== false);
    } catch (err) {
      console.error('[Notifications] Fetch error:', err);
      setMessage({ type: 'error', text: 'Impossible de charger les paramètres.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminNotificationEmail,
          adminNewUserAlert,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to save settings');
      }

      setMessage({ type: 'success', text: 'Paramètres enregistrés avec succès.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Erreur lors de la sauvegarde.' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="text-[#3B82F6] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
          <Bell size={18} className="text-[#3B82F6]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#F8FAFC]">Notifications</h1>
          <p className="text-sm text-[#94A3B8]">Gérer les alertes d&apos;inscription</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Toggle */}
        <div className="bg-[#0F1525] border border-[#2D3A52] rounded-lg p-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-[#F8FAFC]">Alerte nouvelle inscription</p>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Envoyer un courriel à l&apos;admin lors d&apos;une nouvelle inscription
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={adminNewUserAlert}
              onClick={() => setAdminNewUserAlert(!adminNewUserAlert)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                adminNewUserAlert ? 'bg-[#3B82F6]' : 'bg-[#2D3A52]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  adminNewUserAlert ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
        </div>

        {/* Email input */}
        <div className="bg-[#0F1525] border border-[#2D3A52] rounded-lg p-4">
          <label htmlFor="adminEmail" className="block text-sm font-medium text-[#F8FAFC] mb-1.5">
            Courriel de notification
          </label>
          <p className="text-xs text-[#94A3B8] mb-3">
            Les alertes d&apos;inscription seront envoyées à cette adresse.
          </p>
          <input
            id="adminEmail"
            type="email"
            value={adminNotificationEmail}
            onChange={(e) => setAdminNotificationEmail(e.target.value)}
            placeholder="admin@example.com"
            className="w-full px-3 py-2 bg-[#1A2337] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] transition-colors"
          />
        </div>

        {/* Message */}
        {message && (
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-green-900/20 text-green-400 border border-green-800/30'
                : 'bg-red-900/20 text-red-400 border border-red-800/30'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle size={16} className="shrink-0" />
            ) : (
              <AlertCircle size={16} className="shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Save button */}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </div>
  );
}
