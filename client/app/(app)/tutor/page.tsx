import type { Metadata } from 'next';
import TutorPage from './PageContent';

export const metadata: Metadata = {
  title: 'AI Tutor | Metierium',
  description: 'Chat with Metierium AI tutor for personalized help with Quebec trade exam questions, code calculations, and theory concepts.',
  alternates: {
    canonical: 'https://metierium.com/tutor',
    languages: {
      'fr-CA': 'https://metierium.com/tutor',
      'en-CA': 'https://metierium.com/en/tutor',
    },
  },
  openGraph: {
    title: 'AI Tutor | Metierium',
    description: 'Chat with Metierium AI tutor for help with Quebec trade exam questions.',
    locale: 'en_CA',
    alternateLocale: ['fr_CA'],
    siteName: 'Metierium',
  },
};

export default function Page() {
  return <TutorPage />;
}
