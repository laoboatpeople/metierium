'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { GraduationCap, ChevronRight, Search, HelpCircle, ArrowLeft, Loader2 } from 'lucide-react';

interface FaqEntry {
  slug: string;
  question: string;
  answer: string;
  category: string;
  trade: string;
  keywords: string[];
}

// FAQ data - loaded from static import for build-time availability
const FAQ_DATA: Record<string, FaqEntry> = {};

// Dynamic import via fetch at runtime
export default function FaqPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [entry, setEntry] = useState<FaqEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [allEntries, setAllEntries] = useState<FaqEntry[]>([]);

  useEffect(() => {
    fetch('/faq-data.json')
      .then(r => r.json())
      .then((data: FaqEntry[]) => {
        setAllEntries(data);
        const found = data.find(e => e.slug === slug);
        setEntry(found || null);
      })
      .catch(() => setEntry(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-[#3B82F6]" />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <HelpCircle size={48} className="mx-auto text-[#64748B] mb-3" />
          <h1 className="text-xl font-bold text-[#F8FAFC] mb-1">Question introuvable</h1>
          <p className="text-sm text-[#94A3B8] mb-4">Cette page FAQ n'existe pas.</p>
          <Link href="/faq" className="text-sm text-[#3B82F6] hover:underline">Voir toutes les FAQ</Link>
        </div>
      </div>
    );
  }

  const related = allEntries
    .filter(e => e.trade === entry.trade && e.slug !== slug)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      {/* JSON-LD FAQPage for this specific question */}
      <Script id="faq-schema" type="application/ld+json" strategy="afterInteractive">{`
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [{
            "@type": "Question",
            "name": ${JSON.stringify(entry.question)},
            "acceptedAnswer": {
              "@type": "Answer",
              "text": ${JSON.stringify(entry.answer.replace(/<[^>]*>/g, ''))}
            }
          }]
        }
      `}</Script>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#64748B] mb-6">
          <Link href="/" className="hover:text-[#3B82F6]">Accueil</Link>
          <ChevronRight size={12} />
          <Link href="/faq" className="hover:text-[#3B82F6]">FAQ</Link>
          <ChevronRight size={12} />
          <span className="text-[#94A3B8] truncate max-w-[200px]">{entry.question}</span>
        </nav>

        {/* Content */}
        <article className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20">
              {entry.trade}
            </span>
            <span className="text-[10px] text-[#64748B]">{entry.category}</span>
          </div>
          <h1 className="text-2xl font-bold text-[#F8FAFC] mb-4">{entry.question}</h1>
          <div className="prose prose-sm max-w-none text-[#94A3B8] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: entry.answer }}
          />

          {/* Keywords */}
          <div className="mt-6 pt-6 border-t border-[#2D3A52]">
            <div className="flex flex-wrap gap-1.5">
              {entry.keywords.map(kw => (
                <Link
                  key={kw}
                  href={`/faq?q=${encodeURIComponent(kw)}`}
                  className="text-xs px-2 py-1 rounded-md bg-[#111827] border border-[#2D3A52] text-[#64748B] hover:text-[#3B82F6] hover:border-[#3B82F6]/30"
                >
                  {kw}
                </Link>
              ))}
            </div>
          </div>
        </article>

        {/* Related questions */}
        {related.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-[#F8FAFC] mb-3">Questions similaires</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {related.map(r => (
                <Link
                  key={r.slug}
                  href={`/faq/${r.slug}`}
                  className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-4 hover:border-[#3B82F6]/30 transition-colors"
                >
                  <p className="text-sm text-[#F8FAFC] font-medium line-clamp-2">{r.question}</p>
                  <p className="text-xs text-[#64748B] mt-1">{r.trade}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-6">
          <Link href="/faq" className="inline-flex items-center gap-2 text-sm text-[#3B82F6] hover:text-[#06B6D4]">
            <ArrowLeft size={14} /> Toutes les questions fréquentes
          </Link>
        </div>
      </div>
    </div>
  );
}
