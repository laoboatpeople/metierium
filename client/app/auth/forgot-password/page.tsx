import type { Metadata } from 'next';
import ForgotPasswordPage from './PageContent';

export const metadata: Metadata = {
  title: 'Forgot Password | Metierium',
  description: 'Reset your password for your Metierium account. Enter your email address and we will send you a reset link.',
  alternates: {
    canonical: 'https://metierium.com/auth/forgot-password',
    languages: {
      'fr-CA': 'https://metierium.com/auth/forgot-password',
      'en-CA': 'https://metierium.com/en/auth/forgot-password',
    },
  },
  openGraph: {
    title: 'Forgot Password | Metierium',
    description: 'Reset your Metierium account password.',
    locale: 'en_CA',
    alternateLocale: ['fr_CA'],
    siteName: 'Metierium',
  },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ForgotPasswordPage />;
}
