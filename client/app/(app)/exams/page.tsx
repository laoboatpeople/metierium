import type { Metadata } from 'next';
import ExamsPageWrapper from './PageContent';

export const metadata: Metadata = {
  title: 'Practice Exams | Metierium',
  description: 'Take timed practice exams for Quebec trade certification. Choose your trade, chapters, and difficulty. Get detailed results with per-chapter breakdown.',
  alternates: {
    canonical: 'https://metierium.com/exams',
    languages: {
      'fr-CA': 'https://metierium.com/exams',
      'en-CA': 'https://metierium.com/en/exams',
    },
  },
  openGraph: {
    title: 'Practice Exams | Metierium',
    description: 'Take timed practice exams for Quebec trade certification.',
    locale: 'en_CA',
    alternateLocale: ['fr_CA'],
    siteName: 'Metierium',
  },
};

export default function Page() {
  return <ExamsPageWrapper />;
}
