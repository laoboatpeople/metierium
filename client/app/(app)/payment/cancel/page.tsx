import { Suspense } from 'react';
import PaymentCancelContent from './content';

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center p-4">
        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-2xl p-8 max-w-md w-full text-center">
          <div className="animate-pulse space-y-4 py-8">
            <div className="w-12 h-12 bg-[#2D3A52] rounded-full mx-auto" />
            <div className="h-6 bg-[#2D3A52] rounded w-48 mx-auto" />
          </div>
        </div>
      </div>
    }>
      <PaymentCancelContent />
    </Suspense>
  );
}
