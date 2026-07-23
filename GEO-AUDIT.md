# Metierium — GEO / AI SEO Audit Report
**Date:** July 23, 2026
**Audited by:** Hermes Agent (subagent task)

---

## Executive Summary

**GEO Readiness Score: 4/10 (Low → Moderate)**

Metierium has strong fundamentals (fast load, valid SSL, good sitemap, excellent homepage JSON-LD content) but is held back by **critical technical SEO bugs** and a **client-side rendering architecture** that prevents most AI crawlers from seeing its content.

---

## 1. LLM-Readiness (3/10)

### What's Good
- **Homepage** has rich JSON-LD via `@graph` array:
  - `EducationalOrganization` with 16 `hasCourse[]` entries (detailed course names + descriptions)
  - `HowTo` schema with 3 steps
  - `WebSite` schema with `SearchAction`
  - `FAQPage` schema with 8 complete Q&A pairs (detailed answers with code references, specific numbers)
  - `AggregateRating`: 4.8/5, 342 ratings, 127 reviews
- FAQ data exists as a 5287-line JSON file with rich HTML answers per trade/category

### Critical Problems
- **ALL JSON-LD is client-side rendered** via `next/script` on `'use client'` pages
  - Homepage uses `strategy="beforeInteractive"` — works for Google but NOT for Perplexity/limited-JS crawlers
  - Blog uses `strategy="afterInteractive"` — requires full JS execution
  - FAQ [slug] pages use `strategy="afterInteractive"`
- **Root layout's JSON-LD is invalid**: Uses Next.js `metadata.other` which renders as `<meta name="application/ld+json" content="...">` instead of the standard `<script type="application/ld+json">...</script>`. Schema validators won't parse it.
- **No server-side JSON-LD** on ANY subpage (FAQ, blog, trade, pricing)
- **No Organization schema** (only EducationalOrganization on homepage client-side)
- **No Product schema** on pricing page
- **No Article schema** server-side on blog posts
- **No Course schema** on individual trade pages (only in homepage's hasCourse[])

---

## 2. AI Search Engine Visibility (Unknown — tools unavailable)

- Web search tools returned API errors — could not verify rankings for "trade exam preparation Quebec" / "préparation examen métier Québec"
- **However:** The canonical bug (see #6) means ALL subpages canonicalize to the root URL. Google/AI crawlers will see every page as a duplicate of the homepage, severely limiting indexation of individual trade guides, blog posts, and FAQ pages.

---

## 3. Featured Snippet / AI Overview Potential (5/10)

### What's Good
- Homepage FAQPage has 8 well-structured Q&A pairs with specific, factual answers (code references, numbers, process steps)
- Questions are natural-language queries (e.g., "Combien de questions y a-t-il à l'examen d'électricien CMEQ ?")
- Answers include specific details: "50 à 100 questions à choix multiples", "70 % seuil de réussite", "CSA W47.1, CSA W59"

### Missing
- **No SpeakableSpecification** on any page — AI crawlers get no hint about which content to prioritize for extraction
- **No Key Takeaways sections** — AI systems look for summary blocks
- **No "Definition" style content** — FAQ answers are full paragraphs, not concise definition snippets
- FAQ content is loaded client-side — Perplexity and some AI crawlers may not see it
- No per-page Q&A sections on trade pages

---

## 4. Authority Signals (Limited data)

### Present
- References real regulatory bodies: CMEQ, CMMTQ, QBQ, RBQ, CCQ, ASP Construction
- Mentions actual codes: CSA W47.1, CSA B149.1, CCQ, RBQ licensing
- AggregateRating of 4.8/5 with 342 ratings (in JSON-LD)

### Missing
- No /about page with Person schema
- No author bylines with credentials
- No external citations/sources on claims
- No blog author profiles
- No backlink data available (tool failure)

---

## 5. Content Structure for AI Consumption (4/10)

### Homepage ✓
- Clear h1: "La référence en préparation aux examens de métiers"
- Logical h2-h3 hierarchy (Trades → How it works → Features → Pricing → FAQ)
- Factual claims with specific details (code numbers, exam structure)
- First paragraph is a value proposition (ideal for AI excerpts)

### Trade Pages ✗
- Very thin: h1 (trade name) + h2 (CTA) only
- No server-rendered content depth
- Content loaded via client-side API calls
- No date/context on factual claims

### Blog Posts ✗
- **No headings at all in server-rendered HTML** — content is entirely loaded from `/blog-data.json` via client-side fetch
- No meta description per article
- No date published in meta tags (only in JS-rendered HTML)
- Same `og:title` and `og:description` as homepage

### FAQ Pages ✗
- FAQ listing page: only h1 "Questions fréquentes" server-side
- Content loaded from `/faq-data.json` via client-side fetch
- Individual FAQ pages ([slug]) load content client-side
- FAQPage schema is injected client-side only

---

## 6. Technical GEO (6/10)

### ✅ Good
- **Load speed**: 44ms time-to-first-byte (excellent)
- **SSL**: Let's Encrypt, valid through Oct 7, 2026
- **HTTPS**: Full, redirects HTTP→HTTPS
- **Sitemap**: 60+ URLs across 4 content types with proper priorities
- **robots.txt**: Blocks only /auth/, /api/, /admin/, /payment/ — appropriate
- **X-Frame-Options**: SAMEORIGIN ✓
- **X-Content-Type-Options**: nosniff ✓
- **Permissions-Policy**: Restricted ✓

### ❌ Critical Issues
| Issue | Severity | Details |
|-------|----------|---------|
| **Canonical bug** | 🔴 CRITICAL | Root layout sets `alternates.canonical: 'https://metierium.com'` — ALL subpages canonicalize to homepage. Google won't index FAQ, blog, trade pages independently. |
| **Same title/description everywhere** | 🔴 CRITICAL | Every subpage has the exact same `<title>` and meta description as the homepage |
| **Cache-Control** | 🟡 MEDIUM | `private, no-cache, no-store, max-age=0` — no CDN/edge caching |
| **No Content-Language header** | 🟡 MEDIUM | Server doesn't send `Content-Language` even though site is localized |
| **JSON-LD via meta tag** | 🟡 MEDIUM | BreadcrumbList in `<meta>` instead of `<script>` — invalid for schema validators |
| **No lastmod in sitemap** | 🟢 LOW | Sitemap entries use `new Date()` — not static dates |

---

## 7. Competitive Analysis (Limited — no web search)

Based on codebase analysis:
- **Coverage**: Covers 16 trades (CMEQ, CMMTQ, QBQ, RBQ, CCQ, ASP Construction) — comprehensive for Quebec
- **Technical debt**: Client-side rendering, canonical bug, no per-page SEO — competitors likely have better basic SEO
- **Rich data**: FAQ data (5287 lines JSON, ~150+ Q&As) and blog data (17 articles) exist statically — just need proper server-side rendering
- **Unique selling point**: AI Tutor feature, Interactive Practice Question widget on homepage — strong for conversions, but invisible to crawlers

---

## 8. Prioritized GEO Recommendations

### 🔴 P0 — Critical (Fix this week)

1. **Fix canonical bug** — Remove `alternates.canonical` from root layout `generateMetadata()`. Add per-page canonicals to each page's own metadata export (trade/[slug], faq, faq/[slug], blog/[slug], blog, pricing, theory, exams).

2. **Add per-page unique metadata** — Generate unique `<title>` and `<meta name="description">` for:
   - Each trade page (16 pages) — e.g., "Préparation Examen Électricien CMEQ | Metierium"
   - Each FAQ page (11 pages)
   - Each blog post (17 pages)
   - Blog listing, FAQ listing, theory, exams, pricing

3. **Move JSON-LD server-side** — Convert key pages from `'use client'` to server components, or add server-side JSON-LD injection:
   - `EducationalOrganization` + `WebSite` in root layout (via `<script>` not `other` metadata)
   - `FAQPage` in `/faq` listing page
   - `Article` in blog posts (server-rendered from `/blog-data.json`)
   - `Course` in trade pages
   - `Product` in `/pricing`

### 🟡 P1 — High (Fix this month)

4. **Add Organization + WebSite + BreadcrumbList schemas** as proper `<script type="application/ld+json">` in root layout (replace the broken meta tag approach)

5. **Add FAQPage schema to `/faq` listing page** — Server-render the first 20-30 FAQ entries from `faq-data.json` as schema markup

6. **Add Article schema to ALL blog posts** — Pre-render JSON-LD using `blog-data.json` data server-side instead of client-side injection

7. **Add Product schema to pricing page** — Three plans (Free $0, Essential $29/mo, Pro $49/mo, À Vie) with `Offers[]`

8. **Add SpeakableSpecification** to FAQ and key pages — Use `.key-takeaways` or `.faq-content` CSS selectors

### 🟢 P2 — Medium (Fix this quarter)

9. **Server-render FAQ content** — Instead of fetching `/faq-data.json` client-side, import and pre-render FAQ data on the server. The JSON file already has all the data.

10. **Server-render blog content** — Same as FAQ: pre-render blog content from `/blog-data.json` rather than fetching client-side

11. **Add caching headers** — Allow CDN caching for static pages (public, max-age=3600, s-maxage=86400)

12. **Create /about page** — With Person schema, bio, credentials for E-E-A-T

13. **Add llms.txt + llms-full.txt** — Reference key pages for AI crawlers

14. **Add Key Takeaways sections** — To blog posts and trade pages for AI extraction

15. **Add datePublished/dateModified** — To all articles, blog posts, and FAQ entries in visible HTML and schema

16. **Add proper hreflang** — `fr-CA` and `en-CA` per-page (currently only in root layout)

---

## Schema Coverage Matrix

| Schema Type | Homepage | Trade | Blog | FAQ | Pricing |
|-------------|----------|-------|------|-----|---------|
| EducationalOrganization | ✅ (client) | ❌ | ❌ | ❌ | ❌ |
| WebSite | ✅ (client) | ❌ | ❌ | ❌ | ❌ |
| BreadcrumbList | ❌ (meta tag) | ❌ (meta tag) | ❌ (meta tag) | ❌ (meta tag) | ❌ (meta tag) |
| FAQPage | ✅ (client, 8 Q&A) | ❌ | ❌ | ✅ (client, 1 Q&A) | ❌ |
| Article | ❌ | ❌ | ✅ (client) | ❌ | ❌ |
| HowTo | ✅ (client, 3 steps) | ❌ | ❌ | ❌ | ❌ |
| Course | ✅ (in hasCourse[]) | ❌ | ❌ | ❌ | ❌ |
| Product | ❌ | ❌ | ❌ | ❌ | ❌ |
| Person | ❌ | ❌ | ❌ | ❌ | ❌ |
| AggregateRating | ✅ (client) | ❌ | ❌ | ❌ | ❌ |
| Organization | ❌ | ❌ | ❌ | ❌ | ❌ |

✅ = Has schema, ❌ = Missing, (client) = Only visible after JS execution
