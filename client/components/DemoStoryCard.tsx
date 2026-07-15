'use client';

import { useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { useLocale } from '@/src/contexts/LocaleContext';

export default function DemoStoryCard() {
  const { t } = useLocale();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const demoSlides = [
    {
      title: t('demoSlide1Title'),
      subtitle: t('demoSlide1Subtitle'),
      desc: t('demoSlide1Desc'),
      icon: '😰',
      stat: t('demoSlide1Stat'),
      statLabel: t('demoSlide1StatLabel'),
    },
    {
      title: t('demoSlide2Title'),
      subtitle: t('demoSlide2Subtitle'),
      desc: t('demoSlide2Desc'),
      icon: '💡',
      stat: t('demoSlide2Stat'),
      statLabel: t('demoSlide2StatLabel'),
    },
    {
      title: t('demoSlide3Title'),
      subtitle: t('demoSlide3Subtitle'),
      desc: t('demoSlide3Desc'),
      icon: '🏆',
      stat: t('demoSlide3Stat'),
      statLabel: t('demoSlide3StatLabel'),
    },
  ];

  // Auto-advance
  useState(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % demoSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  });

  const slide = demoSlides[activeSlide];

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Gemini-style hero image — CSS-only illustration */}
      <div className="relative h-48 rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-[#1A2035] to-[#0D1225] border border-[#2D3A52] flex items-center justify-center">
        {/* Glowing banana gradient — the "gemini nano banana" reference */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F59E0B]/20 via-transparent to-[#3B82F6]/20" />
        
        {/* Phone mockup */}
        <div className="relative w-20 h-36 bg-[#0A0E1A] rounded-xl border-2 border-[#3B82F6]/30 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-6 h-1.5 bg-[#2D3A52] rounded-full" />
          <div className="px-1.5 py-3">
            <div className="w-full h-2 bg-[#3B82F6]/30 rounded mb-1" />
            <div className="w-3/4 h-1.5 bg-[#10B981]/30 rounded mb-2" />
            <div className="space-y-1">
              {[75, 85, 60].map((w, i) => (
                <div key={i} className={`h-1.5 rounded ${i === 1 ? 'bg-[#10B981]/50 w-[85%]' : 'bg-[#2D3A52]/50 w-[${w}%]'}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Floating banana icon */}
        <div className="absolute -top-2 right-6 text-4xl animate-bounce" style={{ animationDuration: '3s' }}>
          🍌
        </div>

        {/* Stat badge floating */}
        <div className="absolute bottom-3 left-4 bg-[#1A2035]/90 backdrop-blur-sm border border-[#F59E0B]/30 rounded-xl px-3 py-1.5">
          <span className="text-xs font-bold text-[#F59E0B]">{slide.stat}</span>
          <span className="text-[10px] text-[#94A3B8] ml-1">{slide.statLabel}</span>
        </div>
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#3B82F6]/80 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-[#3B82F6] transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
          </div>
        </div>

        {/* Gemini nano banana style scale indicators */}
        <div className="absolute top-3 left-3 flex items-center gap-1 opacity-40">
          <span className="text-[8px] text-[#94A3B8]">🍌 scale</span>
        </div>
      </div>

      {/* Story content */}
      <div className="bg-gradient-to-br from-[#1A2035] to-[#0D1225] rounded-2xl border border-[#2D3A52] p-5">
        <div className="flex items-center gap-1 mb-3">
          {demoSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setActiveSlide(i); setIsPlaying(false); }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeSlide ? 'w-8 bg-[#3B82F6]' : 'w-3 bg-[#2D3A52] hover:bg-[#3B82F6]/50'
              }`}
            />
          ))}
          <span className="ml-auto text-[10px] text-[#64748B] font-mono">
            {activeSlide + 1}/{demoSlides.length}
          </span>
        </div>

        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl">{slide.icon}</span>
          <div>
            <h4 className="text-sm font-bold text-[#F8FAFC]">{slide.title}</h4>
            <p className="text-xs text-[#3B82F6] font-medium">{slide.subtitle}</p>
          </div>
        </div>

        <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
          {slide.desc}
        </p>

        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] border-2 border-[#0A0E1A] flex items-center justify-center text-[8px] font-bold text-white">
                {['MC', 'JL', 'SP'][i - 1]}
              </div>
            ))}
          </div>
          <span className="text-[10px] text-[#64748B]">
            {t('demoSlideSimilar', { count: 152 + activeSlide * 47 })}
          </span>
        </div>
      </div>
    </div>
  );
}
