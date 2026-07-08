'use client';

import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentCancelContent() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center p-4">
      <div className="bg-[#1A2035] border border-[#2D3A52] rounded-2xl p-8 max-w-md w-full text-center">
        <XCircle size={48} className="text-[#EF4444] mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#F8FAFC] mb-2">Paiement annulé</h1>
        <p className="text-[#94A3B8] mb-6">
          Aucun montant n&apos;a été débité. Vous pouvez réessayer quand vous voulez.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/pricing"
            className="px-6 py-3 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-semibold text-center hover:shadow-lg hover:shadow-[#3B82F6]/20 transition-all"
          >
            Voir les forfaits
          </Link>
          <Link
            href="/app"
            className="px-6 py-3 rounded-xl border border-[#2D3A52] text-[#94A3B8] text-sm font-medium text-center hover:border-[#3B82F6]/30 transition-colors"
          >
            Retourner au tableau de bord
          </Link>
        </div>
      </div>
    </div>
  );
}
