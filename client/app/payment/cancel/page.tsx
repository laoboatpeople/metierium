import type { Metadata } from 'next';
import PaymentCancel from './PageContent';

export const metadata: Metadata = {
  title: 'Payment Cancelled | Metierium',
  description: 'Your payment was cancelled. No charges were made. You can try again or choose a different plan.',
  alternates: {
    canonical: 'https://metierium.com/payment/cancel',
    languages: {
      'fr-CA': 'https://metierium.com/payment/cancel',
      'en-CA': 'https://metierium.com/en/payment/cancel',
    },
  },
  openGraph: {
    title: 'Payment Cancelled | Metierium',
    description: 'Your Metierium payment was cancelled.',
    locale: 'en_CA',
    alternateLocale: ['fr_CA'],
    siteName: 'Metierium',
  },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PaymentCancel />;
}
