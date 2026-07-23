import type { Metadata } from 'next';
import DashboardPage from './PageContent';

export const metadata: Metadata = {
  title: 'Dashboard | Metierium',
  description: 'View your Metierium exam history, progress tracking, scores, and personalized study recommendations across all Quebec trade certifications.',
  alternates: {
    canonical: 'https://metierium.com/app',
    languages: {
      'fr-CA': 'https://metierium.com/app',
      'en-CA': 'https://metierium.com/en/app',
    },
  },
  openGraph: {
    title: 'Dashboard | Metierium',
    description: 'View your exam history and progress across Quebec trade certifications.',
    locale: 'en_CA',
    alternateLocale: ['fr_CA'],
    siteName: 'Metierium',
  },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <DashboardPage />;
}
