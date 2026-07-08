'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CreditCard, Shield, CheckCircle, ArrowRight, Sparkles, Star, Lock, Zap, Infinity } from 'lucide-react';

const PLANS = [
  {
    name: 'GRATUIT',
    price: '0',
    period: '',
    description: 'Pour débuter votre préparation',
    color: 'text-[#94A3B8]',
    border: 'border-[#2D3A52]',
    features: [
      '1 métier au choix',
      'Contenu limité',
      'Changez de métier librement',
    ],
    cta: 'Commencer gratuitement',
    popular: false,
    href: '/auth/register',
  },
  {
    name: 'ESSENTIEL',
    price: '29',
    period: '/mois',
    description: 'L\'essentiel pour réussir',
    color: 'text-[#3B82F6]',
    border: 'border-[#3B82F6]/30',
    features: [
      '1 métier verrouillé',
      'Théorie complète',
      'Examens blancs illimités',
      'Suivi de progression',
    ],
    cta: 'Choisir ESSENTIEL',
    popular: true,
    href: '/pricing',
  },
  {
    name: 'PRO',
    price: '49',
    period: '/mois',
    description: 'Tous les métiers, sans limite',
    color: 'text-[#8B5CF6]',
    border: 'border-[#8B5CF6]/30',
    features: [
      'TOUS les métiers',
      'Théorie complète',
      'Examens blancs illimités',
      'Suivi de progression',
    ],
    cta: 'Choisir PRO',
    popular: false,
    href: '/pricing',
  },
  {
    name: 'À VIE TOUS',
    price: '249',
    period: ' unique',
    description: 'Accès à vie, tous les métiers',
    color: 'text-[#F59E0B]',
    border: 'border-[#F59E0B]/30',
    features: [
      'TOUS les métiers',
      'Théorie complète',
      'Examens blancs illimités',
      'Accès à vie',
      'Mises à jour incluses',
    ],
    cta: 'Acheter À VIE',
    popular: false,
    href: '/pricing',
  },
];

export default function SubscriptionPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <CreditCard size={28} className="text-[#F59E0B]" />
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Abonnement</h1>
        </div>
        <p className="text-sm text-[#94A3B8]">Choisissez le plan qui correspond à vos besoins</p>
      </div>

      {/* Plans grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`bg-[#1A2035] ${plan.border} rounded-xl p-5 flex flex-col relative ${
              plan.popular ? 'ring-1 ring-[#3B82F6]/50' : ''
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs font-medium text-[#3B82F6] bg-[#3B82F6]/10 border border-[#3B82F6]/30 px-3 py-0.5 rounded-full">
                Populaire
              </span>
            )}

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                {plan.name === 'GRATUIT' && <Star size={14} className="text-[#94A3B8]" />}
                {plan.name === 'ESSENTIEL' && <Lock size={14} className="text-[#3B82F6]" />}
                {plan.name === 'PRO' && <Zap size={14} className="text-[#8B5CF6]" />}
                {plan.name === 'À VIE TOUS' && <Infinity size={14} className="text-[#F59E0B]" />}
                <h3 className={`font-bold ${plan.color}`}>{plan.name}</h3>
              </div>
              <div className="flex items-baseline gap-0.5 mt-2">
                <span className="text-3xl font-bold text-[#F8FAFC]">{plan.price}</span>
                <span className="text-xs text-[#94A3B8]">$</span>
                {plan.period && <span className="text-xs text-[#94A3B8]">{plan.period}</span>}
              </div>
              <p className="text-xs text-[#64748B] mt-1">{plan.description}</p>
            </div>

            <div className="flex-1 space-y-2 mb-5">
              {plan.features.map((f) => (
                <div key={f} className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-[#22C55E] mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-[#94A3B8]">{f}</span>
                </div>
              ))}
            </div>

            <Link
              href={plan.href}
              className={`w-full py-2.5 rounded-lg text-sm font-medium text-center transition-all ${
                plan.popular
                  ? 'bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                  : 'border border-[#2D3A52] text-[#94A3B8] hover:border-[#3B82F6]/40 hover:text-[#F8FAFC]'
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Trust */}
      <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={16} className="text-[#22C55E]" />
          <span className="text-sm font-medium text-[#F8FAFC]">Paiement sécurisé</span>
        </div>
        <p className="text-xs text-[#94A3B8]">
          Tous les paiements sont traités par Stripe, leader mondial des paiements en ligne.
          Vos informations bancaires ne sont jamais stockées sur nos serveurs.
        </p>
      </div>
    </div>
  );
}
