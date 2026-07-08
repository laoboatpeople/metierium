import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/auth/login', '/auth/register', '/pricing', '/theory', '/exams', '/faq', '/blog', '/trade'],
        disallow: ['/app/', '/admin/', '/payment/', '/api/', '/tutor/', '/profile/', '/subscription/'],
      },
      {
        userAgent: 'GPTBot',
        allow: ['/', '/pricing', '/theory'],
        disallow: ['/app/', '/auth/', '/admin/', '/api/', '/payment/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/app/', '/admin/', '/api/'],
      },
    ],
    sitemap: 'https://certificationquebec.com/sitemap.xml',
  };
}
