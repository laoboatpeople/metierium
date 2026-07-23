import type { Metadata } from 'next';
import ContactPage from './PageContent';

export const metadata: Metadata = {
  title: 'Contact Us | Metierium',
  description: 'Contact the Metierium team. Send us a message about Quebec trade exam preparation, platform questions, or support requests.',
  alternates: {
    canonical: 'https://metierium.com/contact',
    languages: {
      'fr-CA': 'https://metierium.com/contact',
      'en-CA': 'https://metierium.com/en/contact',
    },
  },
  openGraph: {
    title: 'Contact Us | Metierium',
    description: 'Contact the Metierium team about Quebec trade exam preparation.',
    locale: 'en_CA',
    alternateLocale: ['fr_CA'],
    siteName: 'Metierium',
  },
};

export default function Page() {
  return <ContactPage />;
}
