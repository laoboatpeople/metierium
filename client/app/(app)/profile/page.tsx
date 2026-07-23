import type { Metadata } from 'next';
import ProfilePage from './PageContent';

export const metadata: Metadata = {
  title: 'Profile | Metierium',
  description: 'Manage your Metierium account profile, view subscription details, and update your personal information.',
  alternates: {
    canonical: 'https://metierium.com/profile',
    languages: {
      'fr-CA': 'https://metierium.com/profile',
      'en-CA': 'https://metierium.com/en/profile',
    },
  },
  openGraph: {
    title: 'Profile | Metierium',
    description: 'Manage your Metierium account profile and subscription.',
    locale: 'en_CA',
    alternateLocale: ['fr_CA'],
    siteName: 'Metierium',
  },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ProfilePage />;
}
