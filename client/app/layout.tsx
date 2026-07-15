import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import './globals.css';
import Providers from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  let locale = 'fr';
  try {
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') ?? headersList.get('next-url') ?? '';
    if (pathname.startsWith('/en')) {
      locale = 'en';
    }
  } catch {
    // headers() may throw during fallback rendering — default to French
  }

  if (locale === 'en') {
    return {
      title: 'Metierium — Prepare for your trade exams in Quebec (CMEQ, CMMTQ, QBQ, HVAC)',
      description: 'Prepare to pass your trade exam in Quebec with intelligent study tools — complete theory, practice exams, and personalized tracking for CMEQ (Electrician), CMMTQ (Plumber) and QBQ (Welder).',
      keywords: ['Quebec trade exam', 'CMEQ', 'CMMTQ', 'QBQ', 'electrician', 'plumber', 'welder', 'Quebec certification', 'RBQ exam', 'Quebec Construction Code', 'electrician exam prep', 'plumber exam Quebec'],
      openGraph: {
        title: 'Metierium — Prepare for your trade exams in Quebec',
        description: 'Pass your certification exam with complete theory, practice exams, and personalized tracking.',
        type: 'website',
        locale: 'en_CA',
        alternateLocale: ['fr_CA'],
        siteName: 'Metierium',
        images: [{ url: 'https://metierium.com/og-image.png', width: 1200, height: 630 }],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Metierium — Prepare for your trade exams in Quebec',
        description: 'Pass your certification exam with complete theory, practice exams, and personalized tracking.',
        images: ['https://metierium.com/og-image.png'],
      },
      robots: { index: true, follow: true },
      alternates: {
        canonical: 'https://metierium.com/en',
        languages: {
          'fr-CA': 'https://metierium.com',
          'en-CA': 'https://metierium.com/en',
        },
      },
      other: {
        'application/ld+json': JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          name: 'Metierium',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://metierium.com/en' },
            { '@type': 'ListItem', position: 2, name: 'Theory', item: 'https://metierium.com/en/theory' },
            { '@type': 'ListItem', position: 3, name: 'Exams', item: 'https://metierium.com/en/exams' },
            { '@type': 'ListItem', position: 4, name: 'Pricing', item: 'https://metierium.com/en/pricing' },
          ],
        }),
      },
    };
  }

  // Default: French metadata
  return {
    title: 'Metierium — Préparez vos examens de métiers au Québec (CMEQ, CMMTQ, QBQ, HVAC)',
    description: "Préparez-vous à réussir votre examen de métier au Québec avec des outils d'étude intelligents — théorie complète, examens blancs et suivi personnalisé pour CMEQ (Électricien), CMMTQ (Plombier) et QBQ (Soudeur).",
    keywords: ['examen métier Québec', 'CMEQ', 'CMMTQ', 'QBQ', 'électricien', 'plombier', 'soudeur', 'certification Québec', 'examen RBQ', 'Code construction Québec', 'préparation examen électricien', 'examen plombier Québec'],
    openGraph: {
      title: 'Metierium — Préparez vos examens de métiers au Québec',
      description: 'Réussissez votre examen de certification avec théorie complète, examens blancs et suivi personnalisé.',
      type: 'website',
      locale: 'fr_CA',
      alternateLocale: ['en_CA'],
      siteName: 'Metierium',
      images: [{ url: 'https://metierium.com/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Metierium — Préparez vos examens de métiers au Québec',
      description: 'Réussissez votre examen de certification avec théorie complète, examens blancs et suivi personnalisé.',
      images: ['https://metierium.com/og-image.png'],
    },
    robots: { index: true, follow: true },
    alternates: {
      canonical: 'https://metierium.com',
      languages: {
        'fr-CA': 'https://metierium.com',
        'en-CA': 'https://metierium.com/en',
      },
    },
    other: {
      'application/ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        name: 'Metierium',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://metierium.com' },
          { '@type': 'ListItem', position: 2, name: 'Théorie', item: 'https://metierium.com/theory' },
          { '@type': 'ListItem', position: 3, name: 'Examens', item: 'https://metierium.com/exams' },
          { '@type': 'ListItem', position: 4, name: 'Abonnement', item: 'https://metierium.com/pricing' },
        ],
      }),
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
