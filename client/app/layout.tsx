import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import Script from 'next/script';
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
      title: 'Metierium — Trade exam prep in Quebec | CMEQ, CMMTQ, QBQ',
      description: 'Prepare to pass your Quebec trade certification exam with complete theory, practice exams, and AI-powered tracking. CMEQ, CMMTQ, QBQ and more.',
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
    };
  }

  // Default: French metadata
  return {
    title: 'Metierium — Préparez vos examens de métiers | CMEQ, CMMTQ, QBQ',
    description: 'Réussissez votre examen de certification au Québec avec théorie complète, examens blancs et suivi IA. Électricien, plombier, soudeur et 13 autres métiers.',
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
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let locale = 'fr';
  try {
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') ?? headersList.get('next-url') ?? '';
    if (pathname.startsWith('/en')) {
      locale = 'en';
    }
  } catch {
    // headers() may throw during fallback rendering
  }

  const isEn = locale === 'en';
  const siteUrl = isEn ? 'https://metierium.com/en' : 'https://metierium.com';
  const lang = isEn ? 'en-CA' : 'fr-CA';
  const langAttr = isEn ? 'en' : 'fr';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://metierium.com/#organization',
    name: 'Metierium',
    url: 'https://metierium.com',
    logo: 'https://metierium.com/favicon.ico',
    sameAs: [
      'https://www.facebook.com/metierium',
      'https://www.linkedin.com/company/metierium',
    ],
    description: isEn
      ? 'Quebec trade exam preparation platform — CMEQ, CMMTQ, QBQ'
      : 'Plateforme de préparation aux examens de métiers au Québec — CMEQ, CMMTQ, QBQ',
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Québec',
      addressCountry: 'CA',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://metierium.com/#website',
    url: 'https://metierium.com',
    name: 'Metierium',
    inLanguage: lang,
    description: isEn
      ? 'Prepare for your trade exams in Quebec with intelligent study tools'
      : 'Préparez vos examens de métiers au Québec avec des outils d\'étude intelligents',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://metierium.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const breadcrumbListSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    name: isEn ? 'Metierium' : 'Metierium',
    itemListElement: isEn
      ? [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://metierium.com/en' },
          { '@type': 'ListItem', position: 2, name: 'Theory', item: 'https://metierium.com/en/theory' },
          { '@type': 'ListItem', position: 3, name: 'Exams', item: 'https://metierium.com/en/exams' },
          { '@type': 'ListItem', position: 4, name: 'Pricing', item: 'https://metierium.com/en/pricing' },
        ]
      : [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://metierium.com' },
          { '@type': 'ListItem', position: 2, name: 'Théorie', item: 'https://metierium.com/theory' },
          { '@type': 'ListItem', position: 3, name: 'Examens', item: 'https://metierium.com/exams' },
          { '@type': 'ListItem', position: 4, name: 'Abonnement', item: 'https://metierium.com/pricing' },
        ],
  };

  return (
    <html lang={langAttr} className={inter.variable}>
      <Script id="schema-organization" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(organizationSchema)}
      </Script>
      <Script id="schema-website" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(websiteSchema)}
      </Script>
      <Script id="schema-breadcrumb" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(breadcrumbListSchema)}
      </Script>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
