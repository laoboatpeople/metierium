import { MetadataRoute } from 'next';

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

  // Blog posts
  const blogSlugs = [
    'guide-examen-electricien-cmeq',
    'guide-examen-plombier-cmmtq',
    'guide-examen-soudeur-qbq',
    'guide-examen-hvac',
    'guide-examen-mvl',
    'guide-examen-securite-incendie',
    'guide-examen-ferblantier',
    'guide-examen-briqueteur',
    'guide-examen-opequip',
    'guide-examen-gaz',
    'guide-examen-ascenseurs',
    'guide-examen-refrigeration',
    'guide-examen-constructeur',
    'guide-examen-entrepreneur-general',
    'guide-examen-inspecteur',
    'guide-examen-coordonnateur-sst',
    'calendrier-examens-metier-quebec-2026',
  ];

  const blogPages = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    priority: 0.6,
    changeFrequency: 'monthly' as const,
  }));

  // FAQ pages
  const faqSlugs = [
    'cmeq-examen-questions',
    'cmeq-combien-questions',
    'cmeq-preparation',
    'cmeq-prerequis',
    'cmmtq-examen-questions',
    'qbq-soudeur-certification',
    'examen-metier-cout',
    'ou-passer-examen-metier-quebec',
    'constr-examen-questions',
    'entgen-examen-questions',
    'inspect-examen-questions',
  ];

  const faqPages = faqSlugs.map((slug) => ({
    url: `${baseUrl}/faq/${slug}`,
    priority: 0.5,
    changeFrequency: 'monthly' as const,
  }));

  return [
    ...staticPages,
    ...tradePages,
    ...blogPages,
    ...faqPages,
  ];
}
