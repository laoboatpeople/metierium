'use client';

import { useState } from 'react';
import Nav from '@/components/Nav';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useLocale } from '@/src/contexts/LocaleContext';

export default function ContactPage() {
  const { t } = useLocale();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('error');
      setStatusMsg(t('contactValidationError'));
      return;
    }

    setStatus('loading');
    setStatusMsg('');

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ''}/api/contact`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            message: message.trim(),
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || t('contactGenericError'));
      }

      setStatus('success');
      setStatusMsg(t('contactSuccessDesc'));
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: unknown) {
      setStatus('error');
      setStatusMsg(err instanceof Error ? err.message : t('contactGenericError'));
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <Nav />

      <main className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#F8FAFC] mb-4">
            {t('contactTitle')}
          </h1>
          <p className="text-[#94A3B8] text-lg">
            {t('contactDesc')}
          </p>
        </div>

        {/* Contact form */}
        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-8">
          {status === 'success' ? (
            <div className="text-center py-8">
              <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
              <p className="text-[#F8FAFC] text-lg font-medium mb-2">{t('contactSuccessTitle')}</p>
              <p className="text-[#94A3B8] text-sm">{statusMsg}</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-6 px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg text-sm font-medium text-white transition-colors"
              >
                {t('contactSendAnother')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#F8FAFC] mb-1.5">
                  {t('contactNameLabel')}
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('contactNamePlaceholder')}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0A0E1A] border border-[#2D3A52] text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#3B82F6]/50"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#F8FAFC] mb-1.5">
                  {t('contactEmailLabel')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('contactEmailPlaceholder')}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0A0E1A] border border-[#2D3A52] text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#3B82F6]/50"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#F8FAFC] mb-1.5">
                  {t('contactMessageLabel')}
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('contactMessagePlaceholder')}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0A0E1A] border border-[#2D3A52] text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#3B82F6]/50 resize-y"
                />
              </div>

              {/* Status message */}
              {status === 'error' && statusMsg && (
                <div className="flex items-center gap-2 px-4 py-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg text-sm text-[#EF4444]">
                  <AlertCircle size={16} />
                  {statusMsg}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full px-6 py-3 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 rounded-xl text-sm font-medium text-white transition-colors flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {t('contactSending')}
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    {t('contactSubmit')}
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </main>
    </div>
  );
}
