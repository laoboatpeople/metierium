'use client';

import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare, Send, Bot, User, Loader2, Sparkles,
  AlertCircle, ArrowLeft, Plus, ChevronRight, Trash2,
} from 'lucide-react';
import { useLocale } from '@/src/contexts/LocaleContext';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatHistory {
  id: string;
  title: string;
  messages: ChatMessage[];
  timestamp: number;
}

const STORAGE_KEY = 'tutorChatHistories';

// ── Simple LaTeX + Markdown renderer for AI responses ──
function renderAIResponse(content: string): string {
  let html = content
    // Bold markers
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Horizontal rules
    .replace(/^---+/gm, '<hr class="border-[#2D3A52] my-2" />')
    // Lines starting with - as list items
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-[#94A3B8]">$1</li>');

  // Display math \[ ... \]
  html = html.replace(/\\\[([\s\S]*?)\\\]/g, (_m, math: string) => {
    const cleaned = cleanLatex(math);
    return `<pre class="bg-[#1A2332] border border-[#2D3A52] p-3 rounded-lg my-2 text-sm font-mono overflow-x-auto text-[#F8FAFC]">${cleaned}</pre>`;
  });

  // Inline math \( ... \)
  html = html.replace(/\\\(([\s\S]*?)\\\)/g, (_m, math: string) => {
    const cleaned = cleanLatex(math);
    return `<code class="bg-[#1A2332] px-1.5 py-0.5 rounded text-xs font-mono text-[#E2E8F0]">${cleaned}</code>`;
  });

  return html;
}

function cleanLatex(math: string): string {
  return math
    .replace(/\\text\{([^}]*)\}/g, '$1')
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1) / ($2)')
    .replace(/\\dfrac\{([^}]*)\}\{([^}]*)\}/g, '($1) / ($2)')
    .replace(/\\times/g, '×')
    .replace(/\\,/g, ' ')
    .replace(/\\%/g, '%')
    .replace(/\\displaystyle/g, '')
    .replace(/\\left/g, '')
    .replace(/\\right/g, '')
    .replace(/\\(?:mathrm|mathbf|mathit)\{([^}]*)\}/g, '$1')
    .replace(/\\\{/g, '{')
    .replace(/\\\}/g, '}')
    .replace(/\s+/g, ' ')
    .trim();
}

const SUGGESTED_FR = [
  "Explique-moi la loi d'Ohm simplement",
  "Quels sont les types de câbles résidentiels au Québec ?",
  "Comment calculer la charge d'un panneau électrique ?",
  "C'est quoi la différence entre DDFT et DFARC ?",
  "Donne-moi un exemple de calcul de chute de tension",
];

const SUGGESTED_EN = [
  "Explain Ohm's law simply",
  "What are the types of residential cables in Quebec?",
  "How do you calculate an electrical panel load?",
  "What is the difference between GFCI and AFCI?",
  "Give me an example of voltage drop calculation",
];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default function TutorPage() {
  const { t, locale } = useLocale();
  const isEn = locale === 'en';
  const initialMessage: ChatMessage = {
    role: 'assistant',
    content: t('tutorWelcomePrompt'),
  };
  const [messages, setMessages] = useState<ChatMessage[]>([{ ...initialMessage }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [returnUrl, setReturnUrl] = useState<string | null>(null);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isRestoringRef = useRef(false);

  // ── Load chat histories from localStorage ──
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ChatHistory[];
        setChatHistories(parsed);
      }
    } catch {
      /* localStorage unavailable */
    }
  }, []);

  // ── Persist chat histories to localStorage ──
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistories));
    } catch {
      /* localStorage unavailable */
    }
  }, [chatHistories]);

  // ── Scroll to bottom on new messages ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Read return URL from localStorage ──
  useEffect(() => {
    try {
      const url = localStorage.getItem('tutorReturnUrl');
      if (url) setReturnUrl(url);
    } catch {
      /* localStorage unavailable */
    }
  }, []);

  // ── Listen for exam context (from "Expliquer avec le tuteur IA" button) ──
  useEffect(() => {
    try {
      const stored = localStorage.getItem('tutorContext');
      if (stored) {
        const ctx = JSON.parse(stored);
        localStorage.removeItem('tutorContext');
        if (ctx.question) {
          const prompt = ctx.question;
          setTimeout(() => sendMessage(prompt), 500);
        }
      }
    } catch {
      /* localStorage unavailable */
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Save current messages to chat history (when not restoring) ──
  useEffect(() => {
    if (isRestoringRef.current) return;
    if (loading) return;
    if (messages.length <= 1) return;

    const timer = setTimeout(() => {
      saveCurrentChat(messages);
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  // ────────────────────────────────────────────
  //  HELPERS
  // ────────────────────────────────────────────

  const saveCurrentChat = (msgs: ChatMessage[]) => {
    setChatHistories((prev) => {
      const id = currentChatId || generateId();
      if (!currentChatId) setCurrentChatId(id);
      const firstUser = msgs.find((m) => m.role === 'user');
      const title = firstUser
        ? firstUser.content.slice(0, 60)
        : t('tutorNewConversation');
      const entry: ChatHistory = {
        id,
        title: title.length > 40 ? title + '…' : title,
        messages: msgs,
        timestamp: Date.now(),
      };
      const filtered = prev.filter((c) => c.id !== id);
      return [entry, ...filtered];
    });
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setError(null);

    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/tutor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) throw new Error(t('tutorServerError'));
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.response || data.message || t('tutorNoResponse') },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('tutorConnectionError'));
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: t('tutorSorryMessage') },
      ]);
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggested = (q: string) => {
    sendMessage(q);
  };

  // ── New Chat ──
  const handleNewChat = () => {
    setMessages([{ ...initialMessage }]);
    setCurrentChatId(null);
    setError(null);
    setInput('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // ── Select a chat from history ──
  const handleSelectChat = (chat: ChatHistory) => {
    isRestoringRef.current = true;
    setMessages(chat.messages);
    setCurrentChatId(chat.id);
    setError(null);
    setInput('');
    // Re-enable saving after a tick
    setTimeout(() => {
      isRestoringRef.current = false;
    }, 0);
  };

  // ── Delete a chat from history ──
  const handleDeleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setChatHistories((prev) => prev.filter((c) => c.id !== id));
    if (currentChatId === id) {
      handleNewChat();
    }
  };

  // ── Go back ──
  const handleGoBack = () => {
    localStorage.removeItem('tutorReturnUrl');
    localStorage.removeItem('tutorContext');
    window.close();
    setTimeout(() => {
      window.history.back();
    }, 200);
  };

  // ────────────────────────────────────────────
  //  RENDER
  // ────────────────────────────────────────────

  return (
    <div className="flex h-[calc(100vh-4rem)] relative">
      {/* ── Left Sidebar (overlay on mobile, inline on desktop) ── */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:relative md:translate-x-0 z-20 w-[240px] min-w-[240px] bg-[#0D1117] border-r border-[#1E2D45] flex flex-col transition-all duration-200 h-[calc(100vh-4rem)]`}
      >
        {/* Mobile close button */}
        <div className="md:hidden flex items-center justify-between p-3 border-b border-[#1E2D45]">
          <span className="text-xs font-semibold text-[#94A3B8] uppercase">Menu</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg hover:bg-[#1E2D45] text-[#94A3B8] hover:text-[#F8FAFC] transition-all"
          >
            <ArrowLeft size={16} />
          </button>
        </div>

        {/* New Chat button */}
        <div className="p-3 border-b border-[#1E2D45]">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={16} />
            {t('tutorNewChat')}
          </button>
        </div>

        {/* Chat History list */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          {chatHistories.length > 0 && (
            <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-[#64748B] mb-2">
              {t('tutorChatHistory')}
            </p>
          )}
          {chatHistories.map((chat) => {
            const isActive = chat.id === currentChatId;
            return (
              <button
                key={chat.id}
                onClick={() => { handleSelectChat(chat); setSidebarOpen(false); }}
                className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-all group relative ${
                  isActive
                    ? 'bg-[#1A2332] border border-[#3B82F6]/40 text-[#F8FAFC]'
                    : 'text-[#94A3B8] hover:bg-[#111827] hover:text-[#F8FAFC]'
                }`}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare
                    size={14}
                    className={`mt-0.5 flex-shrink-0 ${
                      isActive ? 'text-[#3B82F6]' : 'text-[#64748B]'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{chat.title}</p>
                    <p className="text-[10px] text-[#64748B] mt-0.5">messages</p>
                  </div>
                  {isActive && (
                    <ChevronRight
                      size={14}
                      className="text-[#3B82F6] flex-shrink-0 mt-1"
                    />
                  )}
                  <button
                    onClick={(e) => handleDeleteChat(e, chat.id)}
                    className="opacity-0 group-hover:opacity-100 absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-[#2D3A52] text-[#64748B] hover:text-[#EF4444] transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </button>
            );
          })}
          {chatHistories.length === 0 && (
            <p className="px-2 text-xs text-[#64748B] py-4 text-center italic">
              {t('tutorNoHistory')}
            </p>
          )}
        </div>

        {/* Back to Results — only show when coming from exam results */}
        {returnUrl && (
        <div className="p-3 border-t border-[#1E2D45]">
          <button
            onClick={handleGoBack}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#94A3B8] border border-[#2D3A52] rounded-lg hover:border-[#3B82F6]/40 hover:text-[#F8FAFC] transition-all"
          >
            <ArrowLeft size={14} />
            {t('tutorBackToResults')}
          </button>
        </div>
        )}
      </aside>

      {/* ── Mobile overlay backdrop ── */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-10 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Toggle sidebar button (mobile always visible, desktop when closed) ── */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-3 left-3 z-30 p-2 rounded-lg bg-[#111827] border border-[#2D3A52] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#3B82F6]/40 transition-all md:static md:ml-2 md:mt-2"
      >
        <MessageSquare size={16} />
      </button>

      {/* ── Main Chat Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-[#1E2D45]">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center flex-shrink-0">
            <Bot size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#F8FAFC]">{t('tutorHeaderTitle')}</h1>
            <p className="text-[11px] text-[#94A3B8]">
              {t('tutorHeaderDesc')}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'user' ? (
                /* ── User bubble: right-aligned, blue ── */
                <div className="flex items-end gap-2 max-w-[80%] flex-row-reverse">
                  <div className="w-7 h-7 rounded-full bg-[#3B82F6]/20 flex items-center justify-center flex-shrink-0">
                    <User size={14} className="text-[#3B82F6]" />
                  </div>
                  <div className="bg-[#3B82F6] text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-sm leading-relaxed">
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              ) : (
                /* ── AI panel: left-aligned, dark with border ── */
                <div className="flex items-start gap-2 max-w-[85%]">
                  <div className="w-7 h-7 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={14} className="text-[#8B5CF6]" />
                  </div>
                  <div className="bg-[#0D1117] border border-[#2D3A52] rounded-xl px-4 py-2.5 text-sm leading-relaxed text-[#F8FAFC]">
                    <div dangerouslySetInnerHTML={{ __html: renderAIResponse(msg.content) }} />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2 max-w-[85%]">
                <div className="w-7 h-7 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot size={14} className="text-[#8B5CF6]" />
                </div>
                <div className="bg-[#0D1117] border border-[#2D3A52] rounded-xl px-4 py-3">
                  <Loader2 size={16} className="animate-spin text-[#8B5CF6]" />
                </div>
              </div>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg text-sm text-[#EF4444]">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested questions (only on initial state) */}
        {messages.length === 1 && messages[0].role === 'assistant' && (
          <div className="px-4 pb-2">
            <p className="text-xs text-[#64748B] mb-2 flex items-center gap-1">
              <Sparkles size={12} className="text-[#F59E0B]" />
              {t('tutorSuggestions')}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(isEn ? SUGGESTED_EN : SUGGESTED_FR).map((q) => (
                <button
                  key={q}
                  onClick={() => handleSuggested(q)}
                  className="text-xs text-[#94A3B8] bg-[#111827] border border-[#2D3A52] px-2.5 py-1.5 rounded-lg hover:border-[#3B82F6]/40 hover:text-[#F8FAFC] transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input bar */}
        <form
          onSubmit={handleSubmit}
          className="px-4 py-3 border-t border-[#1E2D45]"
        >
          <div className="flex gap-2 items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('tutorInputPlaceholder')}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-10 h-10 flex items-center justify-center bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
