import type { Metadata } from 'next';
import TheoryPage from './PageContent';

export const metadata: Metadata = {
  title: 'Theory | Metierium',
  description: 'Browse trade theory content organized by chapter. Study Quebec construction codes, electrical, plumbing, welding, and more with detailed explanations.',
  alternates: {
    canonical: 'https://metierium.com/theory',
    languages: {
      'fr-CA': 'https://metierium.com/theory',
      'en-CA': 'https://metierium.com/en/theory',
    },
  },
  openGraph: {
    title: 'Theory | Metierium',
    description: 'Browse trade theory content organized by chapter for Quebec certification exams.',
    locale: 'en_CA',
    alternateLocale: ['fr_CA'],
    siteName: 'Metierium',
  },
};

export default function Page() {
  return <TheoryPage />;
}
