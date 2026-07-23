import type { Metadata } from 'next';
import PaymentSuccess from './PageContent';

export const metadata: Metadata = {
  title: 'Payment Successful | Metierium',
  description: 'Your payment was successful. You now have access to Metierium trade exam preparation platform.',
  alternates: {
    canonical: 'https://metierium.com/payment/success',
    languages: {
      'fr-CA': 'https://metierium.com/payment/success',
      'en-CA': 'https://metierium.com/en/payment/success',
    },
  },
  openGraph: {
    title: 'Payment Successful | Metierium',
    description: 'Your Metierium payment was successful.',
    locale: 'en_CA',
    alternateLocale: ['fr_CA'],
    siteName: 'Metierium',
  },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PaymentSuccess />;
}
