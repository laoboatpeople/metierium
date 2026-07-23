import type { Metadata } from 'next';
import RegisterPage from './PageContent';

export const metadata: Metadata = {
  title: 'Create Account | Metierium',
  description: 'Create your Metierium account and start preparing for Quebec trade certification exams with comprehensive theory and practice tests.',
  alternates: {
    canonical: 'https://metierium.com/auth/register',
    languages: {
      'fr-CA': 'https://metierium.com/auth/register',
      'en-CA': 'https://metierium.com/en/auth/register',
    },
  },
  openGraph: {
    title: 'Create Account | Metierium',
    description: 'Create your Metierium account and start preparing for Quebec trade certification exams.',
    locale: 'en_CA',
    alternateLocale: ['fr_CA'],
    siteName: 'Metierium',
  },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <RegisterPage />;
}
