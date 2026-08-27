'use client';

import { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { usePathname } from 'next/navigation';

// App routes where the banner must not appear (with or without /en prefix)
const HIDDEN_PREFIXES = ['/app', '/exams', '/pricing', '/profile', '/theory', '/tutor', '/admin', '/auth', '/payment'];
const STORAGE_KEY = 'metierium:topbanner-dismissed';

export function TopBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const dismissed = localStorage.getItem(STORAGE_KEY) === '1';
    const p = (pathname || '').replace(/^\/en/, '');
    const hidden = HIDDEN_PREFIXES.some((prefix) => p === prefix || p.startsWith(prefix + '/'));
    setVisible(!dismissed && !hidden);
  }, [pathname]);

  if (!visible) return null;
  const isEn = (pathname || '').startsWith('/en');

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-10 bg-gradient-to-r from-[#0F172A] to-[#1E293B] border-b border-white/10">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-center gap-3 text-xs sm:text-sm">
        <span className="text-[#94A3B8] truncate">
          {isEn ? (
            <>
              Preparing for the <strong className="text-white">Red Seal exam</strong>?
            </>
          ) : (
            <>
              Vous préparez votre examen <strong className="text-white">Sceau Rouge</strong>?
            </>
          )}
        </span>
        <a
          href="https://redsealpractice.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-[#3B82F6] hover:text-[#06B6D4] transition-colors shrink-0"
        >
          {isEn ? 'Try RedSealPractice' : 'Essayer RedSealPractice'}
          <ExternalLink size={12} />
        </a>
        <button
          onClick={() => {
            localStorage.setItem(STORAGE_KEY, '1');
            setVisible(false);
            window.dispatchEvent(new Event('topbanner-dismissed'));
          }}
          className="text-[#64748B] hover:text-white transition-colors shrink-0"
          aria-label={isEn ? 'Close' : 'Fermer'}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
