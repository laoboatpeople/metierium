import type { Metadata } from 'next';
import Script from 'next/script';
import FaqListing from './PageContent';
import faqData from '@/public/faq-data.json';

// Extract first 20 Q&As for FAQPage schema
const faqEntries = (faqData as any[]).slice(0, 20).map((entry: any) => ({
  '@type': 'Question' as const,
  name: entry.question,
  acceptedAnswer: {
    '@type': 'Answer' as const,
    text: entry.answer.replace(/<[^>]*>/g, ''),
  },
}));

export const metadata: Metadata = {
  title: 'FAQ | Metierium',
  description: 'Find answers to frequently asked questions about Quebec trade exams, certification processes, and the Metierium platform.',
  alternates: {
    canonical: 'https://metierium.com/faq',
    languages: {
      'fr-CA': 'https://metierium.com/faq',
      'en-CA': 'https://metierium.com/en/faq',
    },
  },
  openGraph: {
    title: 'FAQ | Metierium',
    description: 'Find answers to frequently asked questions about Quebec trade exams and certification.',
    locale: 'en_CA',
    alternateLocale: ['fr_CA'],
    siteName: 'Metierium',
  },
};

export default function Page() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': 'https://metierium.com/#faq',
    mainEntity: faqEntries,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.key-takeaways', '.faq-content'],
    },
  };

  // Pass data server-side so FaqListing doesn't need client-side fetch
  const initialData = faqData as any[];

  return (
    <>
      <Script id="faq-schema" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(faqSchema)}
      </Script>
      <FaqListing initialData={initialData} />
    </>
  );
}
