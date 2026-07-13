'use client';

import { useState, useEffect } from 'react';
import { Play, CheckCircle2 } from 'lucide-react';

interface Chapter {
  time: string;
  label: string;
}

const chapters: Chapter[] = [
  { time: '0:00', label: 'Introduction' },
  { time: '0:15', label: 'Échec à l\'examen' },
  { time: '0:45', label: 'Découverte de Metierium' },
  { time: '1:30', label: 'Réussite !' },
];

const STORY = {
  name: 'Marc C.',
  trade: 'Électricien CMEQ',
  age: 47,
  before: "J'avais échoué mon examen CMEQ deux fois. À 47 ans, avec une famille et une hypothèque, je ne pouvais pas me permettre de perdre encore 6 mois. Les cours du soir ne m'aidaient pas — c'était trop théorique, pas assez pratique.",
  after: "Avec Metierium, j'ai fait 3 semaines de simulations d'examen, 45 minutes par soir. La théorie était expliquée clairement avec des exemples concrets du Code de construction du Québec. J'ai passé mon CMEQ avec 78%. Mon salaire a augmenté de 15% le mois suivant.",
  result: '+15% de salaire',
  resultSub: 'Certifié en 3 semaines',
  stat1: '78%',
  stat1Label: 'Note à l\'examen',
  stat2: '3 sem.',
  stat2Label: 'Temps de préparation',
};

export default function VideoDemoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState(0);
  const [showReplay, setShowReplay] = useState(false);

  // Simulate video progress for demo
  useEffect(() => {
    if (!isPlaying) return;
    const duration = 110; // 1:50 total
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;
        if (next >= duration) {
          setIsPlaying(false);
          setShowReplay(true);
          return duration;
        }
        // Update chapter indicator
        const chIdx = chapters.map((ch) => {
          const [m, s] = ch.time.split(':').map(Number);
          return m * 60 + s;
        }).reduce((acc, time, idx, arr) => {
          return time <= next ? idx : acc;
        }, 0);
        if (chIdx >= 0) setActiveChapter(chIdx);
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (showReplay) {
      setProgress(0);
      setActiveChapter(0);
      setShowReplay(false);
      setIsPlaying(true);
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const handleChapterClick = (idx: number) => {
    const [m, s] = chapters[idx].time.split(':').map(Number);
    setProgress(m * 60 + s);
    setActiveChapter(idx);
    setIsPlaying(true);
    setShowReplay(false);
  };

  const totalDuration = 110;

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F59E0B]/5 to-transparent" />
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-[#F59E0B]/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
            <Play className="w-4 h-4 text-[#F59E0B]" />
            <span className="text-sm text-[#94A3B8]">Voir Metierium en action</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#F59E0B] to-[#F97316] bg-clip-text text-transparent">
              De l&apos;échec à la certification
            </span>
          </h2>
          <p className="text-[#94A3B8] max-w-xl mx-auto">
            L&apos;histoire de Marc, électricien, qui a transformé sa carrière avec Metierium en 3 semaines.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Video Player */}
          <div className="lg:col-span-3">
            <div className="relative rounded-2xl overflow-hidden bg-[#0A0E1A] border border-[#2D3A52] shadow-[0_0_40px_rgba(245,158,11,0.1)]">
              {/* Video area (simulated) */}
              <div className="aspect-video bg-gradient-to-br from-[#1A2035] to-[#0D1225] relative flex items-center justify-center">
                {/* Gemini Nano Banana style floating elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 left-4 text-[10px] text-[#94A3B8] font-mono">🍌 scale: 1x</div>
                  <div className="absolute bottom-4 right-4 flex items-center gap-1 text-[10px] text-[#94A3B8]">
                    <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                    <span>Metierium OS</span>
                  </div>
                </div>

                {/* Content based on active chapter */}
                <div className="text-center relative z-10 px-8">
                  {activeChapter === 0 && (
                    <div className="space-y-3">
                      <span className="text-5xl">🎯</span>
                      <p className="text-white font-medium text-lg">Objectif : Certification CMEQ</p>
                      <p className="text-[#94A3B8] text-sm">47 ans, 15 ans d&apos;expérience, 2 échecs</p>
                    </div>
                  )}
                  {activeChapter === 1 && (
                    <div className="space-y-3">
                      <span className="text-5xl">😰</span>
                      <p className="text-white font-medium text-lg">Échec à l&apos;examen</p>
                      <p className="text-[#94A3B8] text-sm">Manque de pratique sur le format réel</p>
                    </div>
                  )}
                  {activeChapter === 2 && (
                    <div className="space-y-3">
                      <span className="text-5xl">💡</span>
                      <p className="text-white font-medium text-lg">Metierium — 45 min/soir</p>
                      <p className="text-[#94A3B8] text-sm">Théorie ciblée + simulations d&apos;examen</p>
                    </div>
                  )}
                  {activeChapter === 3 && (
                    <div className="space-y-3">
                      <span className="text-5xl">🏆</span>
                      <p className="text-white font-medium text-lg">Certifié à 78% !</p>
                      <div className="flex justify-center gap-6 mt-2">
                        <div>
                          <p className="text-2xl font-bold text-[#10B981]">+15%</p>
                          <p className="text-[10px] text-[#64748B]">augmentation salariale</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-[#3B82F6]">3 sem.</p>
                          <p className="text-[10px] text-[#64748B]">de préparation</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Center play/pause button */}
                <button
                  onClick={handlePlayPause}
                  className="absolute inset-0 flex items-center justify-center group cursor-pointer"
                >
                  {!isPlaying && !showReplay && (
                    <div className="w-16 h-16 rounded-full bg-[#3B82F6]/80 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#3B82F6] transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                      <Play className="w-7 h-7 text-white ml-1" />
                    </div>
                  )}
                  {showReplay && (
                    <div className="w-16 h-16 rounded-full bg-[#10B981]/80 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#10B981] transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                      <Play className="w-7 h-7 text-white ml-1" />
                    </div>
                  )}
                </button>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2D3A52]">
                  <div
                    className="h-full bg-gradient-to-r from-[#F59E0B] to-[#F97316] transition-all duration-200"
                    style={{ width: `${(progress / totalDuration) * 100}%` }}
                  />
                </div>

                {/* Time display */}
                <div className="absolute bottom-3 left-4 text-[11px] text-[#64748B] font-mono">
                  {formatTime(progress)} / {formatTime(totalDuration)}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar — Story + Chapters */}
          <div className="lg:col-span-2 space-y-4">
            {/* Story card */}
            <div className="bg-gradient-to-br from-[#1A2035] to-[#0D1225] rounded-2xl border border-[#2D3A52] p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#F97316] flex items-center justify-center text-sm font-bold text-white">
                  MC
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#F8FAFC]">{STORY.name}</p>
                  <p className="text-[11px] text-[#3B82F6]">{STORY.trade} · {STORY.age} ans</p>
                </div>
              </div>

              {/* Before/After */}
              <div className="space-y-3">
                <div className="bg-red/5 border border-red/10 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-red mb-1">AVANT</p>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">{STORY.before}</p>
                </div>
                <div className="bg-[#10B981]/5 border border-[#10B981]/10 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-[#10B981] mb-1">APRÈS</p>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">{STORY.after}</p>
                </div>
              </div>

              {/* Result highlight */}
              <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span className="text-xs font-medium text-[#F8FAFC]">{STORY.result}</span>
                <span className="text-[10px] text-[#94A3B8]">· {STORY.resultSub}</span>
              </div>
            </div>

            {/* Chapter navigation */}
            <div className="bg-gradient-to-br from-[#1A2035] to-[#0D1225] rounded-2xl border border-[#2D3A52] p-4">
              <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-3">Chapitres</p>
              <div className="space-y-1">
                {chapters.map((ch, i) => (
                  <button
                    key={i}
                    onClick={() => handleChapterClick(i)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
                      activeChapter === i
                        ? 'bg-[#F59E0B]/10 border border-[#F59E0B]/20'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <span className={`text-[11px] font-mono w-10 ${
                      activeChapter === i ? 'text-[#F59E0B]' : 'text-[#64748B]'
                    }`}>
                      {ch.time}
                    </span>
                    <span className={`text-xs ${
                      activeChapter === i ? 'text-[#F8FAFC] font-medium' : 'text-[#94A3B8]'
                    }`}>
                      {ch.label}
                    </span>
                    {activeChapter === i && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] ml-auto animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
