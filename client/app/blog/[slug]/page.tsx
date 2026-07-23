import type { Metadata } from 'next';
import Script from 'next/script';
import BlogPostPage from './PageContent';
import blogData from '@/public/blog-data.json';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const posts = blogData as any[];
  const post = posts.find((p: any) => p.slug === slug);
  
  if (post) {
    return {
      title: `${post.title} | Metierium Blog`,
      description: post.excerpt?.replace(/<[^>]*>/g, '').slice(0, 160) || `Read about ${post.category} — Quebec trade exam certification tips and insights.`,
      alternates: {
        canonical: `https://metierium.com/blog/${slug}`,
        languages: {
          'fr-CA': `https://metierium.com/blog/${slug}`,
          'en-CA': `https://metierium.com/en/blog/${slug}`,
        },
      },
      openGraph: {
        title: `${post.title} | Metierium Blog`,
        description: post.excerpt?.replace(/<[^>]*>/g, '').slice(0, 160),
        type: 'article',
        locale: 'en_CA',
        alternateLocale: ['fr_CA'],
        siteName: 'Metierium',
        publishedTime: post.date,
        authors: [post.author],
      },
    };
  }

  return {
    title: 'Blog Post | Metierium',
    description: 'Read articles about Quebec trade certification and exam preparation.',
    alternates: {
      canonical: `https://metierium.com/blog/${slug}`,
    },
  };
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00Z');
  return date.toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const posts = blogData as any[];
  const { slug } = await params;
  const post = posts.find((p: any) => p.slug === slug);

  if (post) {
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': `https://metierium.com/blog/${slug}#article`,
      headline: post.title,
      description: post.excerpt?.replace(/<[^>]*>/g, '').slice(0, 200),
      datePublished: post.date,
      dateModified: post.date,
      author: {
        '@type': 'Person',
        name: post.author,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Metierium',
        url: 'https://metierium.com',
      },
      image: 'https://metierium.com/og-image.png',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://metierium.com/blog/${slug}`,
      },
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['.key-takeaways', '.blog-content'],
      },
    };

    const formattedDate = formatDate(post.date);

    return (
      <>
        <Script id="article-schema" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(articleSchema)}
        </Script>
        {/* Visible datePublished for GEO */}
        <div className="hidden md:block max-w-3xl mx-auto px-4 pt-4">
          <div className="flex items-center gap-2 text-sm text-[#64748B]">
            <time dateTime={post.date}>Publié le {formattedDate}</time>
            <span className="text-[#2D3A52]">|</span>
            <span>Par {post.author}</span>
            <span className="text-[#2D3A52]">|</span>
            <span>{post.readTime}</span>
          </div>
        </div>
        <BlogPostPage />
      </>
    );
  }

  return <BlogPostPage />;
}
