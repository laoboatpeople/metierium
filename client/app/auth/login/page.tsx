import type { Metadata } from 'next';
import LoginPage from './PageContent';

export const metadata: Metadata = {
  title: 'Sign In | Metierium',
  description: 'Sign in to your Metierium account to access trade exam preparation, practice tests, and progress tracking for Quebec certification exams.',
  alternates: {
    canonical: 'https://metierium.com/auth/login',
    languages: {
      'fr-CA': 'https://metierium.com/auth/login',
      'en-CA': 'https://metierium.com/en/auth/login',
    },
  },
  openGraph: {
    title: 'Sign In | Metierium',
    description: 'Sign in to your Metierium account to access trade exam preparation.',
    locale: 'en_CA',
    alternateLocale: ['fr_CA'],
    siteName: 'Metierium',
  },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <LoginPage />;
}
