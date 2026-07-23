'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { Calendar, Clock, ArrowLeft, ChevronRight, Share2, Loader2 } from 'lucide-react';
import Nav from '@/components/Nav';
import { useLocale } from '@/src/contexts/LocaleContext';

interface BlogPost {
  slug: string;
  title: string;
  titleEn?: string;
  content: string;
  excerpt?: string;
  excerptEn?: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  tags: string[];
}

export default function BlogPostPage() {
  const { t, locale } = useLocale();
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/blog-data.json')
      .then(r => r.json())
      .then((data: BlogPost[]) => {
        setAllPosts(data);
        setPost(data.find(p => p.slug === slug) || null);
      })
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-[#3B82F6]" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
        <p className="text-[#94A3B8]">{t('blogArticleNotFound')}</p>
      </div>
    );
  }

  const related = allPosts.filter(p => p.category === post.category && p.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <Nav />
      {/* Key Takeaways for AI crawlers */}
      <div className="key-takeaways blog-content" style={{ display: 'none' }}>
        <h2>Key Takeaways</h2>
        <h3>{locale === 'en' && post.titleEn ? post.titleEn : post.title}</h3>
        <p>{post.excerpt?.replace(/<[^>]*>/g, '').slice(0, 300)}</p>
        <p>Category: {post.category} | Author: {post.author} | Published: {post.date}</p>
        {post.tags.map(tag => (<span key={tag}>#{tag} </span>))}
      </div>
      <Script id="blog-article" type="application/ld+json" strategy="afterInteractive">{`
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": ${JSON.stringify(locale === 'en' && post.titleEn ? post.titleEn : post.title)},
          "datePublished": "${post.date}",
          "author": { "@type": "Person", "name": "${post.author}" },
          "publisher": { "@type": "Organization", "name": "Metierium" }
        }
      `}</Script>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-xs text-[#64748B] mb-6">
          <Link href="/" className="hover:text-[#3B82F6]">{t('blogArticleHome')}</Link>
          <ChevronRight size={12} />
          <Link href="/blog" className="hover:text-[#3B82F6]">{t('blogArticleBlog')}</Link>
          <ChevronRight size={12} />
          <span className="text-[#94A3B8] truncate max-w-[200px]">{locale === 'en' && post.titleEn ? post.titleEn : post.title}</span>
        </nav>

        <article className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6 md:p-8">
          <div className="flex items-center gap-3 text-xs text-[#64748B] mb-3">
            <time dateTime={post.date} className="flex items-center gap-1"><Calendar size={12} /> {post.date}</time>
            <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
            <span className="px-1.5 py-0.5 rounded bg-[#3B82F6]/10 text-[#3B82F6]">{post.category}</span>
          </div>

          <h1 className="text-2xl font-bold text-[#F8FAFC] mb-4">{locale === 'en' && post.titleEn ? post.titleEn : post.title}</h1>
          <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-[#64748B]">{t('blogArticleByAuthor', { author: post.author })}</p>
          <button
            onClick={() => {
              const url = window.location.href;
              if (typeof navigator !== 'undefined' && navigator.share) {
                navigator.share({ title: post.title, url }).catch(() => {});
              } else {
                navigator.clipboard.writeText(url).catch(() => {});
              }
            }}
            className="text-xs text-[#64748B] hover:text-[#3B82F6] transition-colors p-1"
            aria-label="Partager"
          >
            <Share2 size={14} />
          </button>
        </div>

          <div className="prose prose-sm max-w-none text-[#94A3B8] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags.length > 0 && (
            <div className="mt-6 pt-6 border-t border-[#2D3A52] flex flex-wrap gap-1.5">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-1 rounded-md bg-[#111827] border border-[#2D3A52] text-[#64748B]">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {related.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-[#F8FAFC] mb-3">{t('blogArticleRelatedTitle')}</h2>
            <div className="grid md:grid-cols-3 gap-3">
              {related.map(r => (
                <Link key={r.slug} href={`/blog/${r.slug}`}
                  className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-4 hover:border-[#3B82F6]/30 transition-colors">
                  <p className="text-xs text-[#64748B]">{r.date}</p>
                  <p className="text-sm font-medium text-[#F8FAFC] mt-1 line-clamp-2">{locale === 'en' && r.titleEn ? r.titleEn : r.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[#3B82F6] hover:text-[#06B6D4]">
            <ArrowLeft size={14} /> {t('blogArticleBack')}
          </Link>
        </div>
      </div>
    </div>
  );
}
