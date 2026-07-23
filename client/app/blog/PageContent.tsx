'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Calendar, Clock, ArrowRight, Share2, GraduationCap, Loader2 } from 'lucide-react';
import Nav from '@/components/Nav';
import { useLocale } from '@/src/contexts/LocaleContext';

interface BlogPost {
  slug: string;
  title: string;
  titleEn?: string;
  excerpt: string;
  excerptEn?: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  tags: string[];
}
interface Props {
  initialData?: BlogPost[];
}

function BlogContent({ initialData }: Props) {
  const { t, locale } = useLocale();
  const [posts, setPosts] = useState<BlogPost[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const searchParams = useSearchParams();
  const activeCat = searchParams.get('cat') || '';

  useEffect(() => {
    if (initialData) return; // Data already provided from server
    fetch('/blog-data.json')
      .then(r => r.json())
      .then(setPosts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [initialData]);

  const categories = posts.reduce<string[]>((acc, p) => acc.includes(p.category) ? acc : [...acc, p.category], []);
  const filtered = activeCat ? posts.filter(p => p.category === activeCat) : posts;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-[#3B82F6]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <Nav />
      {/* Key Takeaways for AI crawlers */}
      <div className="key-takeaways" style={{ display: 'none' }}>
        <h2>Key Takeaways — Metierium Blog</h2>
        <p>Expert articles about Quebec trade certification exams, including CMEQ (Electrician), CMMTQ (Plumber), QBQ (Welder), RBQ licenses, Sceau Rouge (Red Seal), code changes, and exam preparation strategies.</p>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8 pt-16">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center mx-auto mb-3">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">{t('blogTitle')}</h1>
          <p className="text-sm text-[#94A3B8] mt-1">{t('blogSubtitle')}</p>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Link
            href="/blog"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
              !activeCat
                ? 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20'
                : 'bg-[#111827] text-[#94A3B8] border-[#2D3A52] hover:text-[#3B82F6]'
            }`}
          >
            {t('blogAllCategories')}
          </Link>
          {categories.map(cat => (
            <Link
              key={cat}
              href={`/blog${cat ? `?cat=${encodeURIComponent(cat)}` : ''}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                activeCat === cat
                  ? 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20'
                  : 'bg-[#111827] text-[#94A3B8] border-[#2D3A52] hover:text-[#3B82F6]'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Posts */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[#64748B]">
            <p className="text-lg">{t('blogNoPosts')}</p>
            <Link href="/blog" className="text-sm text-[#3B82F6] hover:text-[#06B6D4] mt-2 inline-block">
              {t('blogViewAll')}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(post => (
              <article
                key={post.slug}
                className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-5 hover:border-[#3B82F6]/30 transition-all group"
              >
                <div className="flex items-center gap-3 text-xs text-[#64748B] mb-2">
                  <time dateTime={post.date} className="flex items-center gap-1"><Calendar size={12} /> {post.date}</time>
                  <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#3B82F6]/10 text-[#3B82F6]">{post.category}</span>
                </div>
                <h2 className="text-lg font-semibold text-[#F8FAFC] mb-2 group-hover:text-[#3B82F6] transition-colors">
                  <Link href={`/blog/${post.slug}`}>{locale === 'en' && post.titleEn ? post.titleEn : post.title}</Link>
                </h2>
                <p className="text-sm text-[#94A3B8] line-clamp-2 mb-3">{locale === 'en' && post.excerptEn ? post.excerptEn : post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#64748B]">{t('blogByAuthor', { author: post.author })}</span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xs text-[#3B82F6] flex items-center gap-1 hover:text-[#06B6D4]"
                    >
                      {t('blogReadMore')} <ArrowRight size={12} />
                    </Link>
                    <button
                      onClick={() => {
                        const url = `${window.location.origin}/blog/${post.slug}`;
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
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BlogListing({ initialData }: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center"><Loader2 size={24} className="animate-spin text-[#3B82F6]" /></div>}>
      <BlogContent initialData={initialData} />
    </Suspense>
  );
}
