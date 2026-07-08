'use client';

import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessContent() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center p-4">
      <div className="bg-[#1A2035] border border-[#2D3A52] rounded-2xl p-8 max-w-md w-full text-center">
        <CheckCircle size={48} className="text-[#10B981] mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#F8FAFC] mb-2">Paiement confirmé !</h1>
        <p className="text-[#94A3B8] mb-6">
          Votre abonnement est maintenant actif. Vous pouvez commencer à étudier.
        </p>
        <Link
          href="/app"
          className="inline-block px-6 py-3 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#3B82F6]/20 transition-all"
        >
          Accéder à mon tableau de bord
        </Link>
      </div>
    </div>
  );
}
