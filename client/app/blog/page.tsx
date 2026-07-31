import type { Metadata } from 'next';
import BlogListing from './PageContent';
import blogData from '@/public/blog-data.json';

export const metadata: Metadata = {
  title: 'Blog | Metierium',
  description: 'Articles sur la certification des métiers au Québec, conseils de préparation aux examens, modifications du Code, Sceau Rouge (Red Seal) et actualités de l\'industrie pour les travailleurs de la construction.',
  alternates: {
    canonical: 'https://metierium.com/blog',
    languages: {
      'fr-CA': 'https://metierium.com/blog',
      'en-CA': 'https://metierium.com/en/blog',
    },
  },
  openGraph: {
    title: 'Blog | Metierium',
    description: 'Articles sur la certification des métiers au Québec, conseils d\'examen et actualités de l\'industrie.',
    locale: 'fr_CA',
    alternateLocale: ['en_CA'],
    siteName: 'Metierium',
  },
};

export default function Page() {
  // Pass data server-side so BlogListing doesn't need client-side fetch
  const initialData = blogData as any[];

  return <BlogListing initialData={initialData} />;
}
