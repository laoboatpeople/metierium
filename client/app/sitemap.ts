import { MetadataRoute } from 'next';
import blogData from '@/public/blog-data.json';
import faqData from '@/public/faq-data.json';
import theoryData from '@/src/data/theory-data.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://metierium.com';

  // Static pages
  const staticPages = [
    { url: baseUrl, priority: 1.0, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/theory`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/exams`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/pricing`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/blog`, priority: 0.7, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/faq`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/contact`, priority: 0.5, changeFrequency: 'monthly' as const },
  ];

  // Trade pillar pages
  const trades = [
    'cmeq', 'cmmtq', 'qbq', 'hvac', 'mvl',
    'securite-incendie', 'ferblantier', 'briqueteur',
    'operateur-equipement-lourd', 'gaz', 'ascenseurs',
    'refrigeration', 'constructeur', 'entrepreneur-general',
    'inspecteur', 'coordonnateur-sst',
  ];

  const tradePages = trades.map((slug) => ({
    url: `${baseUrl}/trade/${slug}`,
    priority: 0.9,
    changeFrequency: 'weekly' as const,
  }));

  // Blog posts — from the REAL data file (not hardcoded slugs)
  const blogPosts = blogData as Array<{ slug: string; date?: string }>;
  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    priority: 0.6,
    changeFrequency: 'monthly' as const,
    ...(post.date ? { lastModified: post.date } : {}),
  }));

  // FAQ pages — from the REAL data file (FR only; EN FAQs have separate slugs)
  const faqPosts = faqData as Array<{ slug: string; locale?: string }>;
  const faqPages = faqPosts
    .filter((f) => !f.locale || f.locale === 'fr')
    .map((f) => ({
      url: `${baseUrl}/faq/${f.slug}`,
      priority: 0.5,
      changeFrequency: 'monthly' as const,
    }));
  const theoryChapters: MetadataRoute.Sitemap = theoryData.map((ch) => ({ url: `${baseUrl}/theory/${ch.id}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 }));


  return [...theoryChapters, 
    ...staticPages,
    ...tradePages,
    ...blogPages,
    ...faqPages,
  ];
}
