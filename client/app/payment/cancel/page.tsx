'use client';

import Link from 'next/link';
import { XCircle, ArrowLeft } from 'lucide-react';
import Nav from '@/components/Nav';

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <Nav />
      <div className="max-w-lg mx-auto px-4 pt-24">
        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-2xl p-8 text-center">
          <XCircle size={48} className="mx-auto mb-4 text-[#F59E0B]" />
          <h1 className="text-xl font-bold text-[#F8FAFC] mb-2">Paiement annulé</h1>
          <p className="text-sm text-[#94A3B8] mb-6">
            Aucun montant n&apos;a été prélevé. Vous pouvez réessayer quand vous voulez.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#3B82F6]/20 transition-all"
            >
              Réessayer
              <ArrowLeft size={16} />
            </Link>
            <Link
              href="/"
              className="text-sm text-[#64748B] hover:text-[#3B82F6] transition-colors"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
