'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, GraduationCap, Loader2 } from 'lucide-react';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
}

export default function BlogListing() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/blog-data.json')
      .then(r => r.json())
      .then(setPosts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-[#3B82F6]" />
      </div>
    );
  }

  const categories = [...new Set(posts.map(p => p.category))];

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center mx-auto mb-3">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Blog</h1>
          <p className="text-sm text-[#94A3B8] mt-1">Actualités, conseils et mises à jour sur les examens de métier au Québec</p>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Link href="/blog" className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20">
            Tout
          </Link>
          {categories.map(cat => (
            <Link
              key={cat}
              href={`/blog?cat=${encodeURIComponent(cat)}`}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#111827] text-[#94A3B8] border border-[#2D3A52] hover:text-[#3B82F6]"
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.map(post => (
            <article
              key={post.slug}
              className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-5 hover:border-[#3B82F6]/30 transition-all group"
            >
              <div className="flex items-center gap-3 text-xs text-[#64748B] mb-2">
                <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                <span className="px-1.5 py-0.5 rounded bg-[#3B82F6]/10 text-[#3B82F6]">{post.category}</span>
              </div>
              <h2 className="text-lg font-semibold text-[#F8FAFC] mb-2 group-hover:text-[#3B82F6] transition-colors">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-sm text-[#94A3B8] line-clamp-2 mb-3">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#64748B]">Par {post.author}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs text-[#3B82F6] flex items-center gap-1 hover:text-[#06B6D4]"
                >
                  Lire <ArrowRight size={12} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
