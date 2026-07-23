import type { Metadata } from 'next';
import BlogListing from './PageContent';
import blogData from '@/public/blog-data.json';

export const metadata: Metadata = {
  title: 'Blog | Metierium',
  description: 'Read articles about Quebec trade certification, exam preparation tips, code changes, Sceau Rouge (Red Seal), and industry news for tradespeople.',
  alternates: {
    canonical: 'https://metierium.com/blog',
    languages: {
      'fr-CA': 'https://metierium.com/blog',
      'en-CA': 'https://metierium.com/en/blog',
    },
  },
  openGraph: {
    title: 'Blog | Metierium',
    description: 'Quebec trade certification articles, exam tips, and industry news.',
    locale: 'en_CA',
    alternateLocale: ['fr_CA'],
    siteName: 'Metierium',
  },
};

export default function Page() {
  // Pass data server-side so BlogListing doesn't need client-side fetch
  const initialData = blogData as any[];

  return <BlogListing initialData={initialData} />;
}
