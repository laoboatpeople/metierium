import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import { headers } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
  let locale = 'fr';
  try {
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') ?? headersList.get('next-url') ?? '';
    if (pathname.startsWith('/en')) {
      locale = 'en';
    }
  } catch {
    // headers() may throw during fallback rendering — default to French
  }

  if (locale === 'en') {
    return {
      title: 'About | Metierium',
      description: 'Learn about Metierium — Quebec\'s leading platform for trade exam preparation. AI-powered study tools for CMEQ, CMMTQ, QBQ, RBQ, and CCQ certification.',
      alternates: {
        canonical: 'https://metierium.com/en/about',
        languages: {
          'fr-CA': 'https://metierium.com/about',
          'en-CA': 'https://metierium.com/en/about',
        },
      },
      openGraph: {
        title: 'About Metierium — Trade Exam Prep in Quebec',
        description: 'Learn about Metierium — Quebec\'s leading platform for trade exam preparation.',
        locale: 'en_CA',
        alternateLocale: ['fr_CA'],
        siteName: 'Metierium',
      },
    };
  }

  return {
    title: 'À propos | Metierium',
    description: 'Découvrez Metierium — la plateforme de préparation aux examens de métiers au Québec. Outils d\'étude IA pour la certification CMEQ, CMMTQ, QBQ, RBQ et CCQ.',
    alternates: {
      canonical: 'https://metierium.com/about',
      languages: {
        'fr-CA': 'https://metierium.com/about',
        'en-CA': 'https://metierium.com/en/about',
      },
    },
    openGraph: {
      title: 'À propos de Metierium — Préparation aux examens de métiers',
      description: 'Découvrez Metierium — la plateforme de préparation aux examens de métiers au Québec.',
      locale: 'fr_CA',
      alternateLocale: ['en_CA'],
      siteName: 'Metierium',
    },
  };
}

export default async function AboutPage() {
  let locale = 'fr';
  try {
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') ?? headersList.get('next-url') ?? '';
    if (pathname.startsWith('/en')) {
      locale = 'en';
    }
  } catch {
    // headers() may throw during fallback rendering
  }

  const isEn = locale === 'en';

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Metierium',
    url: 'https://metierium.com/about',
    jobTitle: isEn ? 'Trade Exam Preparation Platform' : 'Plateforme de préparation aux examens de métiers',
    worksFor: {
      '@type': 'Organization',
      name: 'Metierium',
    },
    description: isEn
      ? 'Metierium is Quebec\'s leading platform for trade certification exam preparation, covering CMEQ, CMMTQ, QBQ, RBQ, and CCQ exams with AI-powered study tools.'
      : 'Metierium est la plateforme de référence au Québec pour la préparation aux examens de certification des métiers, couvrant les examens CMEQ, CMMTQ, QBQ, RBQ et CCQ avec des outils d\'étude alimentés par l\'IA.',
    knowsAbout: [
      isEn ? 'Quebec trade certification exams' : 'Examens de certification des métiers au Québec',
      isEn ? 'CMEQ electrician exam preparation' : 'Préparation à l\'examen CMEQ électricien',
      isEn ? 'CMMTQ plumber exam preparation' : 'Préparation à l\'examen CMMTQ plombier',
      isEn ? 'QBQ welder certification' : 'Certification QBQ soudeur',
      isEn ? 'RBQ contractor licensing' : 'Licence d\'entrepreneur RBQ',
      isEn ? 'Quebec Construction Code (Chapter V — Electricity)' : 'Code de construction du Québec (Chapitre V — Électricité)',
      isEn ? 'Quebec Construction Code (Chapter III — Plumbing)' : 'Code de construction du Québec (Chapitre III — Plomberie)',
      isEn ? 'Red Seal (Sceau rouge) interprovincial certification' : 'Certification interprovinciale Sceau rouge',
      isEn ? 'CCQ construction trade exams' : 'Examens de métiers de la construction CCQ',
      isEn ? 'ASP Construction occupational health and safety' : 'Santé et sécurité au travail ASP Construction',
    ],
    sameAs: [
      'https://www.facebook.com/metierium',
      'https://www.linkedin.com/company/metierium',
    ],
  };

  if (isEn) {
    return (
      <>
        <Script id="person-schema" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(personSchema)}
        </Script>
        <div className="min-h-screen bg-[#0A0E1A]">
          <div className="max-w-3xl mx-auto px-4 py-16">
            <h1 className="text-3xl font-bold text-[#F8FAFC] mb-6">About Metierium</h1>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-[#F8FAFC] mb-4">Our Mission</h2>
              <p className="text-[#94A3B8] leading-relaxed mb-4">
                Metierium was built to help Quebec tradespeople pass their certification exams on the first try. 
                We combine comprehensive theory content, realistic exam simulations, and AI-powered tutoring 
                to give every candidate the best possible preparation.
              </p>
              <p className="text-[#94A3B8] leading-relaxed">
                Covering <strong className="text-[#F8FAFC]">16 regulated trades</strong> — from electricians (CMEQ) 
                and plumbers (CMMTQ) to welders (QBQ), general contractors (RBQ), and construction trades (CCQ) — 
                our platform adapts to each exam&apos;s specific requirements.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-[#F8FAFC] mb-4">What We Offer</h2>
              <ul className="space-y-3 text-[#94A3B8]">
                <li className="flex items-start gap-2">
                  <span className="text-[#3B82F6] mt-1">•</span>
                  <span><strong className="text-[#F8FAFC]">Complete theory</strong> for all chapters tested on your certification exam</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3B82F6] mt-1">•</span>
                  <span><strong className="text-[#F8FAFC]">8,000+ practice questions</strong> with detailed explanations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3B82F6] mt-1">•</span>
                  <span><strong className="text-[#F8FAFC]">AI Tutor</strong> — an intelligent assistant that explains concepts and answers your questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3B82F6] mt-1">•</span>
                  <span><strong className="text-[#F8FAFC]">Timed mock exams</strong> that replicate the real testing environment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3B82F6] mt-1">•</span>
                  <span><strong className="text-[#F8FAFC]">Progress tracking</strong> to identify weak areas and measure improvement</span>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-[#F8FAFC] mb-4">Our Team</h2>
              <p className="text-[#94A3B8] leading-relaxed">
                Metierium is built by a team of Quebec-based developers, trade professionals, and 
                education specialists who understand first-hand what it takes to pass the certification exams. 
                We work closely with industry professionals to ensure our content stays current with 
                the latest Code changes and exam requirements.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-[#F8FAFC] mb-4">Contact Us</h2>
              <p className="text-[#94A3B8] leading-relaxed">
                Have questions or feedback? <Link href="/contact" className="text-[#3B82F6] hover:text-[#06B6D4]">Get in touch</Link> — we&apos;d love to hear from you.
              </p>
            </section>
          </div>
        </div>
      </>
    );
  }

  // Default: French content
  return (
    <>
      <Script id="person-schema" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(personSchema)}
      </Script>
      <div className="min-h-screen bg-[#0A0E1A]">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold text-[#F8FAFC] mb-6">À propos de Metierium</h1>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-[#F8FAFC] mb-4">Notre mission</h2>
            <p className="text-[#94A3B8] leading-relaxed mb-4">
              Metierium a été créé pour aider les travailleurs des métiers du Québec à réussir leur examen 
              de certification du premier coup. Nous combinons du contenu théorique complet, des simulations 
              d&apos;examen réalistes et un tutorat basé sur l&apos;IA pour offrir à chaque candidat la meilleure 
              préparation possible.
            </p>
            <p className="text-[#94A3B8] leading-relaxed">
              Couvrant <strong className="text-[#F8FAFC]">16 métiers réglementés</strong> — des électriciens (CMEQ) 
              et plombiers (CMMTQ) aux soudeurs (QBQ), entrepreneurs généraux (RBQ) et métiers de la 
              construction (CCQ) — notre plateforme s&apos;adapte aux exigences spécifiques de chaque examen.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-[#F8FAFC] mb-4">Ce que nous offrons</h2>
            <ul className="space-y-3 text-[#94A3B8]">
              <li className="flex items-start gap-2">
                <span className="text-[#3B82F6] mt-1">•</span>
                <span><strong className="text-[#F8FAFC]">Théorie complète</strong> pour tous les chapitres testés à votre examen de certification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#3B82F6] mt-1">•</span>
                <span><strong className="text-[#F8FAFC]">Plus de 8 000 questions</strong> avec explications détaillées</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#3B82F6] mt-1">•</span>
                <span><strong className="text-[#F8FAFC]">Tuteur IA</strong> — un assistant intelligent qui explique les concepts et répond à vos questions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#3B82F6] mt-1">•</span>
                <span><strong className="text-[#F8FAFC]">Examens blancs chronométrés</strong> qui reproduisent l&apos;environnement réel de test</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#3B82F6] mt-1">•</span>
                <span><strong className="text-[#F8FAFC]">Suivi de progression</strong> pour identifier vos points faibles et mesurer vos améliorations</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-[#F8FAFC] mb-4">Notre équipe</h2>
            <p className="text-[#94A3B8] leading-relaxed">
              Metierium est développé par une équipe de développeurs, de professionnels des métiers 
              et de spécialistes en éducation basés au Québec qui comprennent ce qu&apos;il faut pour réussir 
              les examens de certification. Nous travaillons en étroite collaboration avec des experts 
              de l&apos;industrie pour garantir que notre contenu reste à jour avec les dernières modifications 
              du Code et les exigences d&apos;examen.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-[#F8FAFC] mb-4">Nous contacter</h2>
            <p className="text-[#94A3B8] leading-relaxed">
              Des questions ou des commentaires ? <Link href="/contact" className="text-[#3B82F6] hover:text-[#06B6D4]">Contactez-nous</Link> — nous serions ravis de vous entendre.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
