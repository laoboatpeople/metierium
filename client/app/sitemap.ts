import { MetadataRoute } from 'next';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://certificationquebec.com';

  const entries: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/auth/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/auth/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/auth/forgot-password`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/theory`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/exams`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/subscription`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/tutor`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/profile`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.2 },
    { url: `${baseUrl}/app`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/stats`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/trade/cmeq`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/trade/cmmtq`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/trade/qbq`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/trade/hvac`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/trade/mvl`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  ];

  // Add FAQ pages from faq-data.json
  const faqPath = join(process.cwd(), 'public', 'faq-data.json');
  if (existsSync(faqPath)) {
    try {
      const faqData = JSON.parse(readFileSync(faqPath, 'utf-8'));
      for (const entry of faqData) {
        if (entry.slug) {
          entries.push({
            url: `${baseUrl}/faq/${entry.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        }
      }
    } catch {}
  }

  // Add blog posts from blog-data.json
  const blogPath = join(process.cwd(), 'public', 'blog-data.json');
  if (existsSync(blogPath)) {
    try {
      const blogData = JSON.parse(readFileSync(blogPath, 'utf-8'));
      for (const post of blogData) {
        if (post.slug) {
          entries.push({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
          });
        }
      }
    } catch {}
  }

  return entries;
}
