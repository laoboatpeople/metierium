'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookMarked,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Target,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

interface DashboardStats {
  totalChapters: number;
  studiedChapters: number;
  totalExams: number;
  completedExams: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<{ name: string; email: string; role?: string } | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalChapters: 0,
    studiedChapters: 0,
    totalExams: 0,
    completedExams: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) setUser(JSON.parse(raw));
    } catch { /* ignore */ }

    (async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/api/trades`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const trades = Array.isArray(data) ? data : data.trades ?? [];
          let totalChapters = 0;
          let totalExams = 0;
          for (const t of trades) {
            totalChapters += t.chapters?.length ?? t._count?.chapters ?? 0;
            totalExams += t.exams ?? t._count?.questions ?? 0;
          }
          setStats({
            totalChapters,
            studiedChapters: Math.min(totalChapters, Math.ceil(totalChapters / 3)),
            totalExams,
            completedExams: 0,
          });
        }
      } catch { /* fallback to defaults */ }
      setLoading(false);
    })();
  }, []);

  const statCards = [
    {
      icon: BookMarked,
      label: 'Chapitres de théorie',
      value: `${stats.studiedChapters}/${stats.totalChapters}`,
      color: 'text-[#3B82F6]',
      bg: 'bg-[#3B82F6]/10',
      link: '/theory',
    },
    {
      icon: BookOpen,
      label: 'Examens complétés',
      value: `${stats.completedExams}/${stats.totalExams}`,
      color: 'text-[#06B6D4]',
      bg: 'bg-[#06B6D4]/10',
      link: '/exams',
    },
    {
      icon: Target,
      label: 'Progression',
      value: stats.totalChapters > 0
        ? `${Math.round((stats.studiedChapters / stats.totalChapters) * 100)}%`
        : '—',
      color: 'text-[#8B5CF6]',
      bg: 'bg-[#8B5CF6]/10',
      link: '/theory',
    },
    {
      icon: Clock,
      label: 'Dernière activité',
      value: "Aujourd'hui",
      color: 'text-[#F59E0B]',
      bg: 'bg-[#F59E0B]/10',
      link: '/profile',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#F8FAFC] flex items-center gap-3">
          <GraduationCap size={28} className="text-[#3B82F6]" />
          Tableau de bord
        </h1>
        <p className="text-[#94A3B8] mt-1">
          Bon retour{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋 Prêt à réviser ?
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ icon: Icon, label, value, color, bg, link }) => (
          <Link key={label} href={link}>
            <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-4 hover:border-[#3B82F6]/40 transition-colors cursor-pointer group">
              <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                <Icon size={20} className={color} />
              </div>
              <p className="text-2xl font-bold text-[#F8FAFC]">{value}</p>
              <p className="text-xs text-[#94A3B8] mt-0.5">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold text-[#F8FAFC] mb-3 flex items-center gap-2">
          <Sparkles size={18} className="text-[#F59E0B]" />
          Actions rapides
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/theory">
            <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-5 hover:border-[#3B82F6]/40 transition-all group">
              <div className="flex items-start justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center mb-3">
                    <BookMarked size={20} className="text-[#3B82F6]" />
                  </div>
                  <h3 className="font-semibold text-[#F8FAFC]">Étudier la théorie</h3>
                  <p className="text-sm text-[#94A3B8] mt-1">
                    Révisez les chapitres et maîtrisez la matière
                  </p>
                </div>
                <ArrowRight size={18} className="text-[#3B82F6] opacity-0 group-hover:opacity-100 transition-opacity mt-2" />
              </div>
            </div>
          </Link>

          <Link href="/exams">
            <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-5 hover:border-[#06B6D4]/40 transition-all group">
              <div className="flex items-start justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#06B6D4]/10 flex items-center justify-center mb-3">
                    <BookOpen size={20} className="text-[#06B6D4]" />
                  </div>
                  <h3 className="font-semibold text-[#F8FAFC]">Pratiquer un examen</h3>
                  <p className="text-sm text-[#94A3B8] mt-1">
                    Testez vos connaissances avec des examens chronométrés
                  </p>
                </div>
                <ArrowRight size={18} className="text-[#06B6D4] opacity-0 group-hover:opacity-100 transition-opacity mt-2" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
