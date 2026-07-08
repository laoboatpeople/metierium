'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Briefcase,
  BookOpen,
  HelpCircle,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { authApi } from '@/lib/api';

interface Stats {
  totalUsers: number;
  totalTrades: number;
  totalChapters: number;
  totalQuestions: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const data = await authApi('/api/admin/stats');
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-[#3B82F6]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg text-sm text-[#EF4444]">
        {error}
      </div>
    );
  }

  const cards = [
    { label: 'Utilisateurs', value: stats?.totalUsers ?? 0, icon: Users, color: 'from-[#3B82F6] to-[#06B6D4]' },
    { label: 'Métiers', value: stats?.totalTrades ?? 0, icon: Briefcase, color: 'from-[#10B981] to-[#059669]' },
    { label: 'Chapitres', value: stats?.totalChapters ?? 0, icon: BookOpen, color: 'from-[#8B5CF6] to-[#7C3AED]' },
    { label: 'Questions', value: stats?.totalQuestions ?? 0, icon: HelpCircle, color: 'from-[#F59E0B] to-[#D97706]' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp size={24} className="text-[#3B82F6]" />
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Tableau de bord</h1>
        </div>
        <p className="text-sm text-[#94A3B8]">Aperçu général de la plateforme</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6 hover:border-[#3B82F6]/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  <Icon size={20} className="text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-[#F8FAFC] mb-1">{card.value}</p>
              <p className="text-sm text-[#94A3B8]">{card.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
