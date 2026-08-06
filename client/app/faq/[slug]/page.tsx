import type { Metadata } from 'next';
import Script from 'next/script';
import FaqPage from './PageContent';
import faqData from '@/public/faq-data.json';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const faqs = faqData as Array<{ slug: string; question?: string; answer?: string; locale?: string }>;
  const faq = faqs.find((f) => f.slug === slug);

  if (faq && faq.question) {
    const cleanQuestion = faq.question.replace(/<[^>]*>/g, '').trim();
    const cleanAnswer = faq.answer ? faq.answer.replace(/<[^>]*>/g, '').trim().slice(0, 150) : '';

    return {
      title: `${cleanQuestion} | Metierium`,
      description: `${cleanAnswer}${cleanAnswer ? ' — ' : ''}Réponse d'expert pour votre préparation à l'examen de métier au Québec.`,
      alternates: {
        canonical: `https://metierium.com/faq/${slug}`,
        languages: {
          'fr-CA': `https://metierium.com/faq/${slug}`,
        },
      },
      openGraph: {
        title: `${cleanQuestion} | Metierium`,
        description: cleanAnswer || `Réponse d'expert pour votre préparation à l'examen de métier au Québec.`,
        type: 'article',
        locale: 'fr_CA',
        siteName: 'Metierium',
      },
    };
  }

  return {
    title: `Préparation examen de métier au Québec | Metierium FAQ`,
    description: `Réponses d'experts sur les examens de certification des métiers au Québec (CMEQ, CMMTQ, QBQ, CCQ, RBQ) : questions, coûts, prérequis et préparation.`,
    alternates: {
      canonical: `https://metierium.com/faq/${slug}`,
    },
  };
}

export default function Page() {
  return <FaqPage />;
}
