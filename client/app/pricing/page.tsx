import type { Metadata } from 'next';
import PricingPage from './PageContent';

export const metadata: Metadata = {
  title: "Tarifs — Plans GRATUIT, ESSENTIEL, PRO et À VIE | Metierium",
  description:
    "Choisissez votre plan Metierium : GRATUIT pour découvrir, ESSENTIEL 29 $/mois pour un métier, PRO 99 $/an pour tous les métiers, ou À VIE 399 $. Préparation complète à l'examen de certification au Québec.",
  alternates: {
    canonical: 'https://metierium.com/pricing',
    languages: {
      fr: 'https://metierium.com/pricing',
      'en-CA': 'https://metierium.com/en/pricing',
    },
  },
  openGraph: {
    title: "Tarifs — Plans GRATUIT, ESSENTIEL, PRO et À VIE | Metierium",
    description:
      'Plans GRATUIT, ESSENTIEL, PRO et À VIE — préparation aux examens de métiers au Québec.',
    url: 'https://metierium.com/pricing',
    type: 'website',
    locale: 'fr_CA',
    alternateLocale: ['en_CA'],
    siteName: 'Metierium',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Tarifs — Metierium",
  },
};

export default function Page() {
  return <PricingPage />;
}
