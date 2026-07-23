import type { Metadata } from 'next';
import Script from 'next/script';
import PricingPage from './PageContent';

export const metadata: Metadata = {
  title: 'Pricing | Metierium',
  description: 'Choose the right Metierium plan for your Quebec trade exam preparation. Free, Essential, Pro, or Lifetime — access theory, exams, and AI tutor.',
  alternates: {
    canonical: 'https://metierium.com/pricing',
    languages: {
      'fr-CA': 'https://metierium.com/pricing',
      'en-CA': 'https://metierium.com/en/pricing',
    },
  },
  openGraph: {
    title: 'Pricing | Metierium',
    description: 'Choose the right Metierium plan for your Quebec trade exam preparation.',
    locale: 'en_CA',
    alternateLocale: ['fr_CA'],
    siteName: 'Metierium',
  },
};

export default function Page() {
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': 'https://metierium.com/#product',
    name: 'Metierium',
    description: 'Quebec trade exam preparation platform with theory, practice exams, AI tutor, and progress tracking.',
    url: 'https://metierium.com',
    brand: { '@type': 'Brand', name: 'Metierium' },
    offers: [
      {
        '@type': 'Offer',
        name: 'Free',
        price: '0',
        priceCurrency: 'CAD',
        description: 'One trade, full theory, limited questions',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Essential',
        price: '29',
        priceCurrency: 'CAD',
        priceUnit: '/month',
        description: 'One trade, unlimited theory and exams, AI tutor',
        availability: 'https://schema.org/InStock',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '29',
          priceCurrency: 'CAD',
          unitText: 'MONTH',
        },
      },
      {
        '@type': 'Offer',
        name: 'Pro',
        price: '49',
        priceCurrency: 'CAD',
        priceUnit: '/month',
        description: 'All trades, unlimited everything, AI tutor',
        availability: 'https://schema.org/InStock',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '49',
          priceCurrency: 'CAD',
          unitText: 'MONTH',
        },
      },
      {
        '@type': 'Offer',
        name: 'À Vie (Lifetime)',
        price: '559',
        priceCurrency: 'CAD',
        description: 'All trades, lifetime access, all features',
        availability: 'https://schema.org/InStock',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      bestRating: '5',
      ratingCount: '342',
    },
  };

  return (
    <>
      <Script id="product-schema" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(productSchema)}
      </Script>
      <PricingPage />
    </>
  );
}
