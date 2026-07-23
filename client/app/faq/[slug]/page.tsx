import type { Metadata } from 'next';
import Script from 'next/script';
import FaqPage from './PageContent';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())} | Metierium FAQ`,
    description: `Find answers about ${slug.replace(/-/g, ' ')} — Quebec trade exam certification questions and expert answers.`,
    alternates: {
      canonical: `https://metierium.com/faq/${slug}`,
      languages: {
        'fr-CA': `https://metierium.com/faq/${slug}`,
        'en-CA': `https://metierium.com/en/faq/${slug}`,
      },
    },
    openGraph: {
      title: `${slug.replace(/-/g, ' ')} | Metierium FAQ`,
      description: `Quebec trade exam FAQ about ${slug.replace(/-/g, ' ')}.`,
      locale: 'en_CA',
      alternateLocale: ['fr_CA'],
      siteName: 'Metierium',
    },
  };
}

export default function Page() {
  return <FaqPage />;
}
