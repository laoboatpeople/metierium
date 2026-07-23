import type { Metadata } from 'next';
import ResetPasswordPage from './PageContent';

export const metadata: Metadata = {
  title: 'Reset Password | Metierium',
  description: 'Reset your Metierium account password and regain access to your trade exam preparation platform.',
  alternates: {
    canonical: 'https://metierium.com/auth/reset-password',
    languages: {
      'fr-CA': 'https://metierium.com/auth/reset-password',
      'en-CA': 'https://metierium.com/en/auth/reset-password',
    },
  },
  openGraph: {
    title: 'Reset Password | Metierium',
    description: 'Reset your Metierium account password.',
    locale: 'en_CA',
    alternateLocale: ['fr_CA'],
    siteName: 'Metierium',
  },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ResetPasswordPage />;
}
