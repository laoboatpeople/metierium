'use client';

import { useState, useEffect } from 'react';
import { Play, CheckCircle2 } from 'lucide-react';
import { useLocale } from '@/src/contexts/LocaleContext';

interface Chapter {
  time: string;
  labelKey: string;
}

const CHAPTER_DEFS: Chapter[] = [
  { time: '0:00', labelKey: 'demoChapterIntro' },
  { time: '0:15', labelKey: 'demoChapterFail' },
  { time: '0:45', labelKey: 'demoChapterDiscovery' },
  { time: '1:30', labelKey: 'demoChapterSuccess' },
];

export default function VideoDemoSection() {
  const { t } = useLocale();
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
        const chIdx = CHAPTER_DEFS.map((ch) => {
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
    const [m, s] = CHAPTER_DEFS[idx].time.split(':').map(Number);
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
            <span className="text-sm text-[#94A3B8]">{t('demoBadge')}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#F59E0B] to-[#F97316] bg-clip-text text-transparent">
              {t('demoTitle')}
            </span>
          </h2>
          <p className="text-[#94A3B8] max-w-xl mx-auto">
            {t('demoSubtitle')}
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
                      <p className="text-white font-medium text-lg">{t('demoCh0Title')}</p>
                      <p className="text-[#94A3B8] text-sm">{t('demoCh0Desc')}</p>
                    </div>
                  )}
                  {activeChapter === 1 && (
                    <div className="space-y-3">
                      <span className="text-5xl">😰</span>
                      <p className="text-white font-medium text-lg">{t('demoCh1Title')}</p>
                      <p className="text-[#94A3B8] text-sm">{t('demoCh1Desc')}</p>
                    </div>
                  )}
                  {activeChapter === 2 && (
                    <div className="space-y-3">
                      <span className="text-5xl">💡</span>
                      <p className="text-white font-medium text-lg">{t('demoCh2Title')}</p>
                      <p className="text-[#94A3B8] text-sm">{t('demoCh2Desc')}</p>
                    </div>
                  )}
                  {activeChapter === 3 && (
                    <div className="space-y-3">
                      <span className="text-5xl">🏆</span>
                      <p className="text-white font-medium text-lg">{t('demoCh3Title')}</p>
                      <div className="flex justify-center gap-6 mt-2">
                        <div>
                          <p className="text-2xl font-bold text-[#10B981]">+15%</p>
                          <p className="text-[10px] text-[#64748B]">{t('demoCh3SalaryLabel')}</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-[#3B82F6]">{t('demoStat2')}</p>
                          <p className="text-[10px] text-[#64748B]">{t('demoCh3PrepLabel')}</p>
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
                  <p className="text-sm font-semibold text-[#F8FAFC]">{t('demoName')}</p>
                  <p className="text-[11px] text-[#3B82F6]">{t('demoTrade')} · {t('demoAge', { age: 47 })}</p>
                </div>
              </div>

              {/* Before/After */}
              <div className="space-y-3">
                <div className="bg-red/5 border border-red/10 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-red mb-1">{t('demoCardBefore')}</p>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">{t('demoBefore')}</p>
                </div>
                <div className="bg-[#10B981]/5 border border-[#10B981]/10 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-[#10B981] mb-1">{t('demoCardAfter')}</p>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">{t('demoAfter')}</p>
                </div>
              </div>

              {/* Result highlight */}
              <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span className="text-xs font-medium text-[#F8FAFC]">{t('demoResult')}</span>
                <span className="text-[10px] text-[#94A3B8]">· {t('demoResultSub')}</span>
              </div>
            </div>

            {/* Chapter navigation */}
            <div className="bg-gradient-to-br from-[#1A2035] to-[#0D1225] rounded-2xl border border-[#2D3A52] p-4">
              <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-3">{t('demoChaptersTitle')}</p>
              <div className="space-y-1">
                {CHAPTER_DEFS.map((ch, i) => (
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
                      {t(ch.labelKey)}
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
