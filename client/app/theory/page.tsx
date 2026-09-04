import type { Metadata } from 'next';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { BookOpen, ChevronRight, Home, ArrowRight } from 'lucide-react';
import theoryData from '@/src/data/theory-data.json';
import chapterTrades from '@/src/data/theory-trades.json';

type TheoryChapter = {
  number: number;
  name: string;
  id: string;
  content: string;
};

const chapters = theoryData as TheoryChapter[];

// Trade order, names (FR) and brand colors — mirrors app/trade/[slug] slugs.
const TRADES: { code: string; name: string; color: string; slug: string }[] = [
  { code: 'CMEQ', name: 'Électricien (CMEQ)', color: '#3B82F6', slug: 'cmeq' },
  { code: 'CMMTQ', name: 'Plombier (CMMTQ)', color: '#06B6D4', slug: 'cmmtq' },
  { code: 'QBQ', name: 'Soudeur (QBQ)', color: '#8B5CF6', slug: 'qbq' },
  { code: 'HVAC', name: 'CVC (CMMTQ)', color: '#F59E0B', slug: 'hvac' },
  { code: 'MVL', name: 'Mécanicien véhicules lourds (CCQ)', color: '#10B981', slug: 'mvl' },
  { code: 'INCENDIE', name: 'Sécurité incendie (RBQ)', color: '#EF4444', slug: 'securite-incendie' },
  { code: 'FERBLAN', name: 'Ferblantier (CCQ)', color: '#8B5CF6', slug: 'ferblantier' },
  { code: 'BRIQUE', name: 'Briqueteur (CCQ)', color: '#F59E0B', slug: 'briqueteur' },
  { code: 'OPEQUIP', name: 'Opérateur équipement lourd (CCQ)', color: '#06B6D4', slug: 'operateur-equipement-lourd' },
  { code: 'GAZ', name: 'Technicien gaz (RBQ)', color: '#F59E0B', slug: 'gaz' },
  { code: 'ASCEN', name: 'Mécanicien ascenseurs (RBQ)', color: '#10B981', slug: 'ascenseurs' },
  { code: 'REFRIG', name: 'Opérateur réfrigération (RBQ)', color: '#0E7490', slug: 'refrigeration' },
  { code: 'CONSTR', name: 'Constructeur-rénovateur (RBQ)', color: '#7C3AED', slug: 'constructeur' },
  { code: 'ENTGEN', name: 'Entrepreneur général (RBQ)', color: '#4F46E5', slug: 'entrepreneur-general' },
  { code: 'INSPECT', name: 'Inspecteur bâtiment (RBQ)', color: '#0E7490', slug: 'inspecteur' },
  { code: 'SST', name: 'Coordonnateur SST (ASP Const.)', color: '#DC2626', slug: 'coordonnateur-sst' },
  { code: 'GESTRAV', name: 'Gestion des travaux (RBQ)', color: '#4F46E5', slug: 'gestion-travaux' },
];

const tradeOf = chapterTrades as Record<string, { code: string; tradeNameFr: string }>;

const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI','XXII','XXIII','XXIV','XXV'];

function excerpt(content: string, max = 140): string {
  const plain = content
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/[#*`>|_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > max ? `${plain.slice(0, max - 3).trimEnd()}...` : plain;
}

// Freshness dates derived from the actual content file (stable at build time).
const THEORY_DATA_MTIME = new Date(
  fs.statSync(path.join(process.cwd(), 'src/data/theory-data.json')).mtimeMs
).toISOString().slice(0, 10);

export const metadata: Metadata = {
  title: 'Théorie des métiers — Chapitres complets pour l\'examen | Metierium',
  description:
    '138 chapitres de théorie gratuits pour préparer votre examen de certification au Québec : électricien (CMEQ), plombier (CMMTQ), soudeur (QBQ), CVC, gaz, sécurité incendie, ferblantier et plus.',
  alternates: {
    canonical: 'https://metierium.com/theory',
    languages: {
      fr: 'https://metierium.com/theory',
      'en-CA': 'https://metierium.com/en/theory',
    },
  },
  openGraph: {
    title: 'Théorie des métiers — Chapitres complets pour l\'examen | Metierium',
    description:
      '138 chapitres de théorie gratuits pour préparer votre examen de certification au Québec.',
    url: 'https://metierium.com/theory',
    type: 'website',
    locale: 'fr_CA',
    alternateLocale: ['en_CA'],
    siteName: 'Metierium',
    images: [
      {
        url: 'https://metierium.com/images/og/theory.jpg',
        width: 1200,
        height: 630,
        alt: 'Metierium — Théorie des métiers pour l\'examen',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Théorie des métiers — Chapitres complets | Metierium',
  },
  other: {
    'article:published_time': THEORY_DATA_MTIME,
    'article:modified_time': THEORY_DATA_MTIME,
  },
};

export default function TheoryIndexPage() {
  return (
    <div className="min-h-screen bg-[#061C33] text-[#F6FBFF]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LearningResource',
            name: 'Théorie des métiers — 138 chapitres complets',
            description:
              'Chapitres de théorie gratuits pour les examens de certification des métiers de la construction au Québec : électricien, plombier, soudeur, CVC, gaz, sécurité incendie, ferblantier, briqueteur, opérateur équipement lourd, ascenseurs, réfrigération, entrepreneur général et plus.',
            educationalLevel: 'Professional',
            teaches: TRADES.map((t) => t.name),
            resourceType: 'StudyGuide',
          }),
        }}
      />
      <header className="border-b border-white/5 bg-[#061C33]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="Metierium home">
            <img src="/logo/logo-main.png?v=2" alt="Metierium" className="h-7 w-auto" />
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/theory" className="text-[#F6FBFF] font-medium transition-colors">Tous les chapitres</Link>
            <Link href="/exams" className="text-[#D6EAF7] hover:text-[#F6FBFF] transition-colors">Examens pratiques</Link>
            <Link href="/pricing" className="px-4 py-2 rounded-lg bg-[#3B82F6] text-[#061C33] font-medium transition-colors">Tarifs</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <nav className="flex items-center gap-2 text-xs text-[#53697D] mb-6" aria-label="Fil d'Ariane">
          <Link href="/" className="hover:text-[#F6FBFF] flex items-center gap-1"><Home size={13} /> Accueil</Link>
          <ChevronRight size={14} />
          <span className="text-[#D6EAF7]">Théorie</span>
        </nav>

        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/30 flex items-center justify-center shrink-0">
            <BookOpen size={22} className="text-[#3B82F6]" />
          </div>
          <div>
            <div className="text-xs font-medium text-[#3B82F6] uppercase tracking-wide mb-1">Métiers de la construction — Québec</div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#F6FBFF] leading-tight">Théorie complète — 138 chapitres</h1>
          </div>
        </div>
        <p className="text-sm text-[#53697D] max-w-2xl mb-10">
          Chapitres de théorie gratuits pour préparer votre examen de certification au Québec — codes, normes et
          notions de chaque métier. Choisissez votre métier et parcourez tous les chapitres, puis testez vos
          connaissances avec des questions conformes à l'examen.
        </p>

        {TRADES.map((trade) => {
          const tradeChapters = chapters
            .filter((c) => (tradeOf[c.id]?.code ?? '') === trade.code)
            .sort((a, b) => a.number - b.number);
          if (tradeChapters.length === 0) return null;
          return (
            <section key={trade.code} className="mb-10">
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <h2 className="text-lg font-bold text-[#F6FBFF]">{trade.name}</h2>
                <Link href={`/trade/${trade.slug}`} className="text-xs text-[#D6EAF7] hover:text-[#F6FBFF] shrink-0">
                  Voir la page du métier →
                </Link>
              </div>
              <div className="space-y-2">
                {tradeChapters.map((ch) => (
                  <Link
                    key={ch.id}
                    href={`/theory/${ch.id}`}
                    className="group flex items-center gap-4 bg-[#12294D] border border-white/10 rounded-2xl p-4 transition-colors hover:border-[#3B82F6]/50"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border"
                      style={{ backgroundColor: `${trade.color}18`, borderColor: `${trade.color}40`, color: trade.color }}
                    >
                      <span className="text-xs font-bold">{ROMAN[ch.number - 1] || ch.number}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-[#F6FBFF] group-hover:text-[#3B82F6] transition-colors leading-snug">{ch.name}</h3>
                      <p className="text-xs text-[#7A93A8] mt-1 line-clamp-1 hidden md:block">{excerpt(ch.content)}</p>
                    </div>
                    <ArrowRight size={16} className="text-[#53697D] group-hover:text-[#3B82F6] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <div className="mt-10 bg-gradient-to-r from-[#3B82F6]/10 to-[#06B6D4]/10 border border-[#3B82F6]/20 rounded-2xl p-6 text-center">
          <h2 className="text-lg font-bold text-[#F6FBFF] mb-2">Prêt à tester vos connaissances?</h2>
          <p className="text-sm text-[#53697D] mb-4">Entraînez-vous avec des questions conformes à l'examen et des simulations chronométrées.</p>
          <Link href="/exams" className="inline-block px-6 py-3 rounded-lg bg-[#3B82F6] text-white text-sm font-medium transition-colors">
            Commencer gratuitement
          </Link>
        </div>
      </main>
    </div>
  );
}
