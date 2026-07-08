'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Award,
  Brain,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Loader2,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react';
import { getExamHistory, getTradeStats, clearExamHistory, ExamRecord } from '@/lib/examStorage';

const PASS_THRESHOLD = 70;

export default function StatsPage() {
  const [history, setHistory] = useState<ExamRecord[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<string>('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const h = getExamHistory();
    setHistory(h);
    if (h.length > 0) setSelectedTrade(h[0].tradeId);
    setLoaded(true);
  }, []);

  const tradeIds = [...new Set(history.map(r => r.tradeId))];
  const filteredHistory = selectedTrade ? history.filter(r => r.tradeId === selectedTrade) : history;
  const stats = selectedTrade ? getTradeStats(selectedTrade) : null;
  const tradeName = history.find(r => r.tradeId === selectedTrade)?.tradeName || '';

  const handleClear = () => {
    clearExamHistory();
    setHistory([]);
    setShowClearConfirm(false);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-[#3B82F6]" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <BarChart3 size={28} className="text-[#3B82F6]" />
          <div>
            <h1 className="text-2xl font-bold text-[#F8FAFC]">Statistiques</h1>
            <p className="text-sm text-[#94A3B8]">Votre progression dans les examens</p>
          </div>
        </div>
        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-8 text-center">
          <BarChart3 size={48} className="mx-auto text-[#2D3A52] mb-3" />
          <h2 className="text-lg font-semibold text-[#F8FAFC] mb-1">Aucun examen complété</h2>
          <p className="text-sm text-[#94A3B8] mb-4">Pratiquez un examen pour voir vos statistiques apparaître ici.</p>
          <Link
            href="/exams"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] rounded-xl text-white font-medium hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          >
            <BookOpen size={16} /> Commencer un examen
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 size={28} className="text-[#3B82F6]" />
          <div>
            <h1 className="text-2xl font-bold text-[#F8FAFC]">Statistiques</h1>
            <p className="text-sm text-[#94A3B8]">{history.length} examen(s) complété(s)</p>
          </div>
        </div>
        <button
          onClick={() => setShowClearConfirm(true)}
          className="text-xs text-[#EF4444] hover:text-[#DC2626] px-3 py-1.5 rounded-lg border border-[#EF4444]/20 hover:bg-[#EF4444]/10 transition-colors"
        >
          Effacer l'historique
        </button>
      </div>

      {/* Trade selector */}
      {tradeIds.length > 1 && (
        <div className="flex gap-2">
          {tradeIds.map(tid => {
            const name = history.find(r => r.tradeId === tid)?.tradeName || tid;
            return (
              <button
                key={tid}
                onClick={() => setSelectedTrade(tid)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  selectedTrade === tid
                    ? 'border-[#3B82F6] bg-[#3B82F6]/10 text-[#3B82F6]'
                    : 'border-[#2D3A52] text-[#94A3B8] hover:border-[#3B82F6]/40'
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      )}

      {stats && (
        <>
          {/* Overall stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award size={16} className="text-[#F59E0B]" />
                <span className="text-xs text-[#94A3B8]">Moyenne</span>
              </div>
              <p className="text-2xl font-bold text-[#F8FAFC]">{stats.averageScore}%</p>
              <div className="mt-2 w-full h-1.5 bg-[#111827] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${stats.averageScore >= 70 ? 'bg-[#22C55E]' : 'bg-[#EF4444]'}`}
                  style={{ width: `${stats.averageScore}%` }}
                />
              </div>
            </div>

            <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target size={16} className="text-[#06B6D4]" />
                <span className="text-xs text-[#94A3B8]">Taux de réussite</span>
              </div>
              <p className="text-2xl font-bold text-[#F8FAFC]">{stats.passRate}%</p>
              <p className="text-xs text-[#94A3B8] mt-1">{stats.passed}/{stats.totalExams} examens</p>
            </div>

            <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={16} className="text-[#F59E0B]" />
                <span className="text-xs text-[#94A3B8]">Meilleur score</span>
              </div>
              <p className="text-2xl font-bold text-[#22C55E]">{stats.bestScore}%</p>
              {stats.scoreTrend !== 0 && (
                <p className={`text-xs mt-1 flex items-center gap-1 ${stats.scoreTrend > 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                  {stats.scoreTrend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {stats.scoreTrend > 0 ? '+' : ''}{stats.scoreTrend}% récent
                </p>
              )}
            </div>

            <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-[#8B5CF6]" />
                <span className="text-xs text-[#94A3B8]">Temps total</span>
              </div>
              <p className="text-2xl font-bold text-[#F8FAFC] text-lg">{formatTime(stats.totalTime)}</p>
              <p className="text-xs text-[#94A3B8] mt-1">{stats.totalQuestions} questions</p>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={16} className="text-[#22C55E]" />
                <h2 className="font-semibold text-[#F8FAFC]">Points forts</h2>
              </div>
              {stats.strengths.length > 0 ? (
                <div className="space-y-2">
                  {stats.strengths.map(s => (
                    <div key={s.chapterNumber}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-[#94A3B8]">Chapitre {s.chapterNumber}: {s.chapterName}</span>
                        <span className="text-[#22C55E] font-medium">{s.percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-[#111827] rounded-full overflow-hidden">
                        <div className="h-full bg-[#22C55E] rounded-full" style={{ width: `${s.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#64748B]">Pas assez de données. Continuez à pratiquer !</p>
              )}
            </div>

            <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={16} className="text-[#EF4444]" />
                <h2 className="font-semibold text-[#F8FAFC]">Points à améliorer</h2>
              </div>
              {stats.weaknesses.length > 0 ? (
                <div className="space-y-2">
                  {stats.weaknesses.map(s => (
                    <div key={s.chapterNumber}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-[#94A3B8]">Chapitre {s.chapterNumber}: {s.chapterName}</span>
                        <span className="text-[#EF4444] font-medium">{s.percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-[#111827] rounded-full overflow-hidden">
                        <div className="h-full bg-[#EF4444] rounded-full" style={{ width: `${s.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#64748B]">Pas assez de données ou tout est maîtrisé ! 🔥</p>
              )}

              {stats.needsReview.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#2D3A52]">
                  <p className="text-xs text-[#94A3B8] mb-1">Chapitres à réviser :</p>
                  <div className="flex flex-wrap gap-1.5">
                    {stats.needsReview.map(ch => (
                      <Link
                        key={ch}
                        href="/theory"
                        className="text-xs bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] px-2 py-0.5 rounded-full hover:bg-[#EF4444]/20"
                      >
                        {ch}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* All chapters performance */}
          <div>
            <h2 className="text-lg font-semibold text-[#F8FAFC] mb-3 flex items-center gap-2">
              <Brain size={18} className="text-[#8B5CF6]" />
              Performance par chapitre
            </h2>
            <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-5 space-y-3">
              {stats.chapterPerformance.length > 0 ? (
                stats.chapterPerformance.map(ch => {
                  const color = ch.percentage >= 70 ? '#22C55E' : ch.percentage >= 50 ? '#F59E0B' : '#EF4444';
                  return (
                    <div key={ch.chapterNumber}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#F8FAFC] font-medium">
                          Ch. {ch.chapterNumber}: {ch.chapterName}
                        </span>
                        <span className="font-medium" style={{ color }}>{ch.percentage}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2.5 bg-[#111827] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${ch.percentage}%`, backgroundColor: color }}
                          />
                        </div>
                        <span className="text-[10px] text-[#64748B] w-12 text-right">{ch.correct}/{ch.total}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-[#64748B]">Aucune donnée par chapitre pour le moment.</p>
              )}
            </div>
          </div>

          {/* Recent history */}
          <div>
            <h2 className="text-lg font-semibold text-[#F8FAFC] mb-3 flex items-center gap-2">
              <Clock size={18} className="text-[#3B82F6]" />
              Examens récents
            </h2>
            <div className="space-y-2">
              {stats.recentHistory.map(record => (
                <div
                  key={record.id}
                  className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      record.passed ? 'bg-[#22C55E]/10' : 'bg-[#EF4444]/10'
                    }`}>
                      {record.passed
                        ? <CheckCircle size={18} className="text-[#22C55E]" />
                        : <AlertTriangle size={18} className="text-[#EF4444]" />
                      }
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#F8FAFC]">
                        {record.passed ? 'Réussi' : 'Échec'} — {record.totalQuestions} questions
                      </p>
                      <p className="text-xs text-[#64748B]">
                        {new Date(record.date).toLocaleDateString('fr-CA', {
                          year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                        {' · '} {formatTime(record.timeSpent)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${record.passed ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                      {record.score}%
                    </p>
                    <p className="text-xs text-[#64748B]">{record.correct}/{record.totalQuestions}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-3">
            <Link
              href="/exams"
              className="flex-1 py-3 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] rounded-xl font-medium text-white text-center hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            >
              Nouvel examen
            </Link>
            <Link
              href="/theory"
              className="flex-1 py-3 border border-[#2D3A52] rounded-xl font-medium text-[#94A3B8] text-center hover:border-[#3B82F6]/40 hover:text-[#F8FAFC]"
            >
              Réviser la théorie
            </Link>
          </div>
        </>
      )}

      {/* Clear confirm modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2">Effacer l'historique ?</h3>
            <p className="text-sm text-[#94A3B8] mb-4">
              Toutes vos statistiques d'examens seront définitivement supprimées. Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 border border-[#2D3A52] rounded-lg text-sm text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                Annuler
              </button>
              <button
                onClick={handleClear}
                className="flex-1 py-2.5 bg-[#EF4444] rounded-lg text-sm text-white font-medium hover:bg-[#DC2626]"
              >
                Effacer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
