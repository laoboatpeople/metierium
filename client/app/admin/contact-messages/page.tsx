'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  MessageSquare,
  Loader2,
  Search,
  Trash2,
  Send,
  ChevronLeft,
  User,
  CheckCheck,
} from 'lucide-react';
import { authApi } from '@/lib/api';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  direction?: string;
  status: string;
  replyText?: string | null;
  repliedAt?: string | null;
  repliedBy?: string | null;
  createdAt: string;
}

interface Conversation {
  email: string;
  name: string;
  messageCount: number;
  pendingCount: number;
  lastActivityAt: string;
  messages: ContactMessage[];
}

export default function AdminContactMessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyStatus, setReplyStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [replyMsg, setReplyMsg] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingConv, setDeletingConv] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalConvs, setTotalConvs] = useState(0);
  const limit = 20;
  const threadEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = useCallback(async () => {
    try {
      const data = await authApi(`/api/admin/contact-messages/conversations?page=${page}&limit=${limit}`);
      setConversations(data.conversations || []);
      setTotalPages(data.totalPages || 1);
      setTotalConvs(data.total || 0);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, [router, page]);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  useEffect(() => {
    if (selectedConv && threadEndRef.current) {
      threadEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConv]);

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Supprimer ce message ?')) return;
    setDeletingId(id);
    try {
      await authApi(`/api/admin/contact-messages/${id}`, { method: 'DELETE' });
      fetchConversations();
      if (selectedConv) {
        const stillHasMessages = selectedConv.messages.some(m => m.id !== id);
        if (!stillHasMessages) setSelectedConv(null);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteConversation = async (email: string) => {
    if (!confirm(`Supprimer toute la conversation avec ${email} ?`)) return;
    setDeletingConv(true);
    try {
      await authApi(`/api/admin/contact-messages/conversation/${encodeURIComponent(email)}`, { method: 'DELETE' });
      setSelectedConv(null);
      fetchConversations();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete conversation');
    } finally {
      setDeletingConv(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConv || !replyText.trim()) return;

    const targetMsg = selectedConv.messages
      .filter(m => m.status === 'pending')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    if (!targetMsg) {
      setReplyMsg('Aucun message en attente de réponse.');
      setReplyStatus('error');
      return;
    }

    setReplyStatus('loading');
    setReplyMsg('');
    try {
      await authApi(`/api/admin/contact-messages/${targetMsg.id}/reply`, {
        method: 'PATCH',
        body: JSON.stringify({ replyText: replyText.trim() }),
      });
      setReplyStatus('success');
      setReplyMsg('Réponse envoyée avec succès !');
      setReplyText('');
      fetchConversations();
      setTimeout(() => {
        setReplyStatus('idle');
        setReplyMsg('');
      }, 2000);
    } catch (err: unknown) {
      setReplyStatus('error');
      setReplyMsg(err instanceof Error ? err.message : 'Failed to send reply');
    }
  };

  const filtered = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(search.toLowerCase()) ||
    conv.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPending = conversations.reduce((sum, c) => sum + c.pendingCount, 0);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('fr-FR', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-[#3B82F6]" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <MessageSquare size={24} className="text-[#3B82F6]" />
            <h1 className="text-2xl font-bold text-[#F8FAFC]">Messages de contact</h1>
          </div>
          <p className="text-sm text-[#94A3B8] ml-11">
            {totalPending} en attente &middot; {totalConvs} conversations
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg text-sm text-[#EF4444] flex-shrink-0">
          {error}
        </div>
      )}

      {/* Two-panel layout */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Left panel — conversation list */}
        <div className={`flex flex-col w-full ${selectedConv ? 'hidden lg:flex lg:w-2/5' : ''} bg-[#1A2035] rounded-xl border border-[#2D3A52] overflow-hidden flex-shrink-0`}>
          {/* Search */}
          <div className="p-3 border-b border-[#2D3A52]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0A0E1A] border border-[#2D3A52] text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#3B82F6]/50"
              />
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#64748B]">
                {search ? 'Aucune conversation ne correspond à votre recherche.' : 'Aucune conversation pour le moment.'}
              </div>
            ) : (
              filtered.map((conv) => (
                <button
                  key={conv.email}
                  onClick={() => setSelectedConv(conv)}
                  className={`w-full text-left px-4 py-3 border-b border-[#2D3A52] hover:bg-[#243047] transition-colors ${
                    selectedConv?.email === conv.email ? 'bg-[#3B82F6]/5 border-l-2 border-l-[#3B82F6]' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#F8FAFC] truncate">{conv.name}</span>
                        {conv.pendingCount > 0 && (
                          <span className="flex-shrink-0 px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-[10px] font-medium">
                            {conv.pendingCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5 truncate">{conv.email}</p>
                      <p className="text-xs text-[#94A3B8] mt-1 truncate">
                        {conv.messages[conv.messages.length - 1]?.message.substring(0, 80) || ''}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-[10px] text-[#64748B] whitespace-nowrap">
                        {formatDate(conv.lastActivityAt)}
                      </p>
                      <p className="text-[10px] text-[#64748B] mt-1">
                        {conv.messageCount} msg{conv.messageCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#2D3A52] bg-[#0A0E1A] flex-shrink-0">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1A2035] border border-[#2D3A52] text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← Précédent
              </button>
              <span className="text-xs text-[#64748B]">
                Page {page} sur {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1A2035] border border-[#2D3A52] text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Suivant →
              </button>
            </div>
          )}
        </div>

        {/* Right panel — thread view */}
        <div className={`flex-1 flex flex-col ${!selectedConv ? 'hidden lg:flex lg:items-center lg:justify-center' : ''} bg-[#1A2035] rounded-xl border border-[#2D3A52] overflow-hidden`}>
          {!selectedConv ? (
            <div className="text-center p-8">
              <MessageSquare size={48} className="text-[#64748B] mx-auto mb-3 opacity-50" />
              <p className="text-sm text-[#64748B]">Sélectionnez une conversation pour voir les messages</p>
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#2D3A52] bg-[#0A0E1A] flex-shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => setSelectedConv(null)}
                    className="lg:hidden p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#243047]"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-[#F8FAFC] truncate">{selectedConv.name}</h2>
                    <p className="text-xs text-[#64748B] truncate">{selectedConv.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleDeleteConversation(selectedConv.email)}
                    disabled={deletingConv}
                    className="p-1.5 rounded-lg text-[#64748B] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                    title="Supprimer toute la conversation"
                  >
                    {deletingConv ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                  <span className="text-[10px] text-[#64748B]">
                    {selectedConv.messageCount} message{selectedConv.messageCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Messages thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConv.messages.map((msg) => (
                  <div key={msg.id}>
                    {/* Outbound message (sent by admin) */}
                    {msg.direction === 'outbound' ? (
                      <div className="flex items-start gap-3 ml-11 group">
                        <div className="w-7 h-7 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                          <CheckCheck size={14} className="text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-green-400">Vous avez répondu</span>
                            <span className="text-[10px] text-[#64748B]">{formatDate(msg.createdAt)}</span>
                          </div>
                          <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20 text-sm text-[#F8FAFC] whitespace-pre-wrap">
                            {msg.message}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          disabled={deletingId === msg.id}
                          className="p-1 rounded text-[#64748B] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                          title="Supprimer"
                        >
                          {deletingId === msg.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Inbound message */}
                        <div className="flex items-start gap-3 group">
                          <div className="w-8 h-8 rounded-full bg-[#3B82F6]/10 flex items-center justify-center flex-shrink-0">
                            <User size={16} className="text-[#3B82F6]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-[#F8FAFC]">{msg.name}</span>
                              <span className="text-[10px] text-[#64748B]">{formatDate(msg.createdAt)}</span>
                            </div>
                            <div className="p-3 rounded-lg bg-[#0A0E1A] border border-[#2D3A52] text-sm text-[#F8FAFC] whitespace-pre-wrap">
                              {msg.message}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            disabled={deletingId === msg.id}
                            className="p-1 rounded text-[#64748B] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                            title="Supprimer"
                          >
                            {deletingId === msg.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </button>
                        </div>

                        {/* Reply via admin panel */}
                        {msg.replyText && (
                          <div className="flex items-start gap-3 mt-3 ml-11">
                            <div className="w-7 h-7 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                              <CheckCheck size={14} className="text-green-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-green-400">Votre réponse</span>
                                {msg.repliedAt && (
                                  <span className="text-[10px] text-[#64748B]">{formatDate(msg.repliedAt)}</span>
                                )}
                              </div>
                              <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20 text-sm text-[#F8FAFC] whitespace-pre-wrap">
                                {msg.replyText}
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
                <div ref={threadEndRef} />
              </div>

              {/* Reply box */}
              <div className="p-4 border-t border-[#2D3A52] bg-[#0A0E1A] flex-shrink-0">
                <form onSubmit={handleReply} className="flex gap-3">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Tapez votre réponse..."
                    className="flex-1 px-4 py-2.5 rounded-lg bg-[#1A2035] border border-[#2D3A52] text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#3B82F6]/50"
                  />
                  <button
                    type="submit"
                    disabled={replyStatus === 'loading' || !replyText.trim()}
                    className="px-4 py-2.5 rounded-lg bg-[#3B82F6] text-white text-sm font-medium hover:bg-[#2563EB] disabled:opacity-50 transition-colors flex items-center gap-2 flex-shrink-0"
                  >
                    {replyStatus === 'loading' ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    Envoyer
                  </button>
                </form>
                {replyMsg && (
                  <p className={`mt-2 text-xs ${replyStatus === 'success' ? 'text-green-400' : 'text-[#EF4444]'}`}>
                    {replyMsg}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
