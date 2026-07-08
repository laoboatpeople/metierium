'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Loader2, Sparkles, AlertCircle } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "Explique-moi la loi d'Ohm simplement",
  "Quels sont les types de câbles résidentiels au Québec ?",
  "Comment calculer la charge d'un panneau électrique ?",
  "C'est quoi la différence entre DDFT et DFARC ?",
  "Donne-moi un exemple de calcul de chute de tension",
];

export default function TutorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Bonjour ! Je suis votre tuteur IA spécialisé dans les métiers de la construction au Québec. Posez-moi une question sur la théorie, le Code de construction, ou les examens de certification.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

      if (!res.ok) throw new Error('Erreur de communication avec le serveur');
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.response || data.message || 'Je n\'ai pas de réponse pour le moment.' },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Désolé, je n\'ai pas pu traiter votre demande. Veuillez réessayer.' },
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

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center">
          <Bot size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-[#F8FAFC]">Tuteur IA</h1>
          <p className="text-xs text-[#94A3B8]">Posez vos questions sur la théorie et les examens</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                msg.role === 'user' ? 'bg-[#3B82F6]/20' : 'bg-[#8B5CF6]/20'
              }`}>
                {msg.role === 'user' ? (
                  <User size={14} className="text-[#3B82F6]" />
                ) : (
                  <Bot size={14} className="text-[#8B5CF6]" />
                )}
              </div>
              <div className={`rounded-xl px-4 py-2.5 text-sm ${
                msg.role === 'user'
                  ? 'bg-[#3B82F6] text-white'
                  : 'bg-[#1A2035] border border-[#2D3A52] text-[#F8FAFC]'
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-2 max-w-[85%]">
              <div className="w-7 h-7 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={14} className="text-[#8B5CF6]" />
              </div>
              <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl px-4 py-3">
                <Loader2 size={16} className="animate-spin text-[#8B5CF6]" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg text-sm text-[#EF4444]">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions */}
      {messages.length === 1 && (
        <div className="mb-3">
          <p className="text-xs text-[#64748B] mb-2 flex items-center gap-1">
            <Sparkles size={12} className="text-[#F59E0B]" />
            Suggestions
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_QUESTIONS.map((q) => (
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

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Posez votre question..."
          disabled={loading}
          className="flex-1 px-4 py-2.5 bg-[#111827] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-4 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
