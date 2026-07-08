import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Certification Québec | Préparation aux examens de métiers — Électricien CMEQ, Plombier CMMTQ, Soudeur QBQ',
  description: 'Préparez-vous à réussir votre examen de métier au Québec avec des outils d\'étude intelligents — théorie complète, examens blancs et suivi personnalisé pour CMEQ (Électricien), CMMTQ (Plombier) et QBQ (Soudeur).',
  keywords: ['examen métier Québec', 'CMEQ', 'CMMTQ', 'QBQ', 'électricien', 'plombier', 'soudeur', 'certification Québec', 'examen RBQ', 'Code construction Québec', 'préparation examen électricien', 'examen plombier Québec'],
  openGraph: {
    title: 'Certification Québec | Préparation aux examens de métiers',
    description: 'Réussissez votre examen de certification avec théorie complète, examens blancs et suivi personnalisé.',
    type: 'website',
    locale: 'fr_CA',
    siteName: 'Certification Québec',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Certification Québec | Préparation aux examens de métiers',
    description: 'Réussissez votre examen de certification avec théorie complète, examens blancs et suivi personnalisé.',
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: 'https://certificationquebec.com',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
