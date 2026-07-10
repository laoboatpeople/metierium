'use client';

import PracticeQuestionWidget from '@/components/PracticeQuestionWidget';
import Link from 'next/link';
import Script from 'next/script';
import {
  GraduationCap,
  BookOpen,
  FileText,
  BarChart3,
  ChevronRight,
  Sparkles,
  Zap,
  LogIn,
  Monitor,
  Smartphone,
  Check,
  Wrench,
  Shield,
  ArrowRight,
  Globe,
  Menu,
  X,
  Thermometer,
  Truck,
  Infinity,
} from 'lucide-react';
import { useState } from 'react';
import { useLocale } from '@/src/contexts/LocaleContext';

export default function LandingPage() {
  const { t, locale, toggleLocale } = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-[#F8FAFC] font-sans overflow-x-hidden">
      {/* JSON-LD Structured Data */}
      <Script id="json-ld" type="application/ld+json" strategy="beforeInteractive">{`
        {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "EducationalOrganization",
              "@id": "https://metierium.com/#organization",
              "name": "Metierium",
              "description": "Préparation aux examens de métiers au Québec — CMEQ, CMMTQ, QBQ",
              "url": "https://metierium.com",
              "address": {
                "@type": "PostalAddress",
                "addressRegion": "Québec",
                "addressCountry": "CA"
              },
              "offers": {
                "@type": "Offer",
                "description": "Préparation aux examens de certification",
                "offeredBy": { "@type": "Organization", "name": "Metierium" }
              },
              "hasCourse": [
                { "@type": "Course", "name": "Préparation Examen Électricien CMEQ", "description": "Préparation à l'examen de certification des maîtres électriciens du Québec — théorie complète et examens blancs", "provider": { "@type": "Organization", "name": "Metierium" } },
                { "@type": "Course", "name": "Préparation Examen Plombier CMMTQ", "description": "Préparation à l'examen de certification en plomberie — Code de plomberie, tuyauterie et normes", "provider": { "@type": "Organization", "name": "Metierium" } },
                { "@type": "Course", "name": "Préparation Examen Soudeur QBQ", "description": "Préparation à l'examen de certification en soudage — SMAW, GMAW, FCAW et normes CSA", "provider": { "@type": "Organization", "name": "Metierium" } },
                { "@type": "Course", "name": "Préparation Examen HVAC CMMTQ", "description": "Préparation à l'examen de certification en chauffage-climatisation — thermodynamique, CVC et réfrigération", "provider": { "@type": "Organization", "name": "Metierium" } },
                { "@type": "Course", "name": "Préparation Examen Mécanicien Véhicules Lourds CCQ", "description": "Préparation à l'examen de certification en mécanique de véhicules lourds — moteurs diesel, transmissions et hydraulique", "provider": { "@type": "Organization", "name": "Metierium" } },
                { "@type": "Course", "name": "Préparation Examen Technicien Sécurité Incendie RBQ", "description": "Préparation à l'examen de certification RBQ en sécurité incendie — alarmes, gicleurs, détection et signalisation", "provider": { "@type": "Organization", "name": "Metierium" } },
                { "@type": "Course", "name": "Préparation Examen Ferblantier Tôlier CCQ", "description": "Préparation à l'examen de certification CCQ en ferblanterie et tôlerie — ventilation, toiture, métaux en feuilles", "provider": { "@type": "Organization", "name": "Metierium" } },
                { "@type": "Course", "name": "Préparation Examen Briqueteur Maçon CCQ", "description": "Préparation à l'examen de certification CCQ en maçonnerie — brique, bloc, pierre, mortier", "provider": { "@type": "Organization", "name": "Metierium" } },
                { "@type": "Course", "name": "Préparation Examen Opérateur Équipement Lourd CCQ", "description": "Préparation à l'examen de certification CCQ en opération d'équipement lourd — pelles, bulldozers, niveleuses", "provider": { "@type": "Organization", "name": "Metierium" } },
                { "@type": "Course", "name": "Préparation Examen Technicien Gaz RBQ", "description": "Préparation à l'examen de certification RBQ en technique de gaz — CSA B149.1, B149.2, installation et sécurité", "provider": { "@type": "Organization", "name": "Metierium" } },
                { "@type": "Course", "name": "Préparation Examen Mécanicien Ascenseurs RBQ", "description": "Préparation à l'examen de certification RBQ en mécanique d'ascenseurs — CSA B44, installation et sécurité", "provider": { "@type": "Organization", "name": "Metierium" } },
                { "@type": "Course", "name": "Préparation Examen Opérateur Réfrigération RBQ", "description": "Préparation à l'examen de certification RBQ en opération de réfrigération — gaz frigorigènes, compresseurs, sécurité", "provider": { "@type": "Organization", "name": "Metierium" } },
                { "@type": "Course", "name": "Préparation Examen Constructeur Rénovateur RBQ", "description": "Préparation à l'examen de licence RBQ pour constructeur-rénovateur — gestion, code, contrats et sécurité", "provider": { "@type": "Organization", "name": "Metierium" } },
                { "@type": "Course", "name": "Préparation Examen Entrepreneur Général RBQ", "description": "Préparation à l'examen de licence RBQ pour entrepreneur général — gestion de projets, code de construction et SST", "provider": { "@type": "Organization", "name": "Metierium" } },
                { "@type": "Course", "name": "Préparation Examen Inspecteur Bâtiment RBQ", "description": "Préparation à l'examen de certification RBQ en inspection de bâtiments — code, structures, enveloppe et sécurité", "provider": { "@type": "Organization", "name": "Metierium" } },
                { "@type": "Course", "name": "Préparation Examen Coordonnateur SST ASP Construction", "description": "Préparation à l'examen de certification ASP Construction en coordination SST — prévention, IRSST, gestion de chantier", "provider": { "@type": "Organization", "name": "Metierium" } }
              ]
            },
            {
              "@type": "WebSite",
              "@id": "https://metierium.com/#website",
              "url": "https://metierium.com",
              "name": "Metierium",
              "description": "Préparation aux examens de métiers au Québec",
              "inLanguage": "fr-CA",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://metierium.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            },
            {
              "@type": "FAQPage",
              "@id": "https://metierium.com/#faq",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Qu'est-ce que l'examen CMEQ pour électricien ?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "L'examen CMEQ (Corporation des maîtres électriciens du Québec) est l'examen de certification obligatoire pour devenir électricien au Québec. Il couvre le Code de construction du Québec — Chapitre V (électricité), les calculs de charge, les circuits, la protection, les moteurs et les normes de sécurité."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Combien de questions y a-t-il à l'examen d'électricien CMEQ ?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "L'examen CMEQ contient généralement entre 50 et 100 questions à choix multiples. Les questions portent sur le Code de l'électricité (CCE), les calculs de charge résidentielle et commerciale, la protection des circuits, les moteurs, la mise à la terre, et les méthodes de câblage."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Comment se préparer à l'examen de plomberie CMMTQ ?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Pour se préparer à l'examen CMMTQ (Corporation des maîtres mécaniciens en tuyauterie du Québec), il faut étudier le Code de plomberie du Québec, les méthodes d'installation des tuyaux (cuivre, PVC, ABS, PEX), l'alimentation en eau potable, l'évacuation et la ventilation, les appareils sanitaires, le chauffage de l'eau et les systèmes de gaz (CSA B149)."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Quel est le taux de réussite pour passer l'examen de métier au Québec ?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Le seuil de réussite pour les examens de métier au Québec est de 70 %. Il est essentiel de bien se préparer avec du contenu théorique complet et des examens blancs pour maximiser ses chances de succès."
                  }
                },
                {
                  "@type": "Question",
                  "name": "La certification QBQ pour soudeur est-elle reconnue au Québec ?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Oui, la certification QBQ (Québec Board of Trades) est la certification officielle pour les soudeurs au Québec. Les normes CSA W47.1 (acier) et CSA W59 (construction soudée) sont les références. Les soudeurs doivent réussir un examen théorique et pratique, et la certification est valide 2 ans."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Quels sont les prérequis pour passer l'examen d'électricien au Québec ?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Pour passer l'examen d'électricien au Québec, il faut généralement avoir complété un DEP en électricité (1 800 heures), accumulé les heures d'apprentissage requises, et être inscrit à la Commission de la construction du Québec (CCQ)."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Combien coûte l'examen de certification de soudeur QBQ ?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Les frais d'examen pour la certification QBQ varient selon le type de certificat. Les plans de préparation en ligne commencent à partir de 29$/mois pour l'accès complet à la théorie, aux examens blancs et au suivi de progression."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Où puis-je passer l'examen de métier au Québec ?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Les examens de métier au Québec sont administrés par la CCQ (Commission de la construction du Québec), la RBQ (Régie du bâtiment du Québec), le QBQ (Québec Board of Trades) et les corporations respectives (CMEQ pour les électriciens, CMMTQ pour les plombiers). La préparation peut se faire en ligne via des plateformes comme Metierium qui offrent théorie complète et examens blancs."
                  }
                }
              ]
            }
          ]
        }
      `}</Script>
      {/* ===== NAVIGATION ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0A0E1A]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">{t('navBrand')}</span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-[#94A3B8] hover:text-white transition-colors">{t('navFeatures')}</a>
            <a href="#trades" className="text-sm text-[#94A3B8] hover:text-white transition-colors">{t('navTrades')}</a>
            <a href="#pricing" className="text-sm text-[#94A3B8] hover:text-white transition-colors">{t('navPricing')}</a>
            <Link href="/faq" className="text-sm text-[#94A3B8] hover:text-white transition-colors">FAQ</Link>
            <Link href="/blog" className="text-sm text-[#94A3B8] hover:text-white transition-colors">Blog</Link>
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-sm text-[#94A3B8] hover:text-white hover:border-white/20 transition-all"
            >
              <Globe className="w-4 h-4" />
              {locale === 'fr' ? 'EN' : 'FR'}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="hidden md:inline-flex px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg text-sm font-medium transition-colors"
            >
              {t('navSignIn')}
            </Link>
            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-[#94A3B8] hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#0A0E1A]/95 backdrop-blur-md">
            <div className="px-6 py-4 flex flex-col gap-3">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#94A3B8] hover:text-white transition-colors py-2">{t('navFeatures')}</a>
              <a href="#trades" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#94A3B8] hover:text-white transition-colors py-2">{t('navTrades')}</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#94A3B8] hover:text-white transition-colors py-2">{t('navPricing')}</a>
              <Link href="/faq" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-[#94A3B8] hover:text-white transition-colors py-2">FAQ</Link>
              <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-[#94A3B8] hover:text-white transition-colors py-2">Blog</Link>
              <button
                onClick={() => { toggleLocale(); setMobileMenuOpen(false); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-[#94A3B8] hover:text-white w-fit"
              >
                <Globe className="w-4 h-4" />
                {locale === 'fr' ? 'EN' : 'FR'}
              </button>
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg text-sm font-medium transition-colors text-center"
              >
                {t('navSignIn')}
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#3B82F6]/10 via-[#0A0E1A] to-[#0A0E1A]" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#3B82F6]/20 rounded-full blur-[120px]" />
        <div className="absolute top-40 right-20 w-[400px] h-[400px] bg-[#06B6D4]/10 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-sm text-[#94A3B8]">{t('heroBadge')}</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
                  {t('heroTitle')}
                </span>
                <br />
                <span>
                  {t('heroTagline')}
                </span>
              </h1>

              <p className="text-lg md:text-xl text-[#94A3B8] mb-8 max-w-xl mx-auto lg:mx-0">
                {t('heroDesc')}
              </p>

              {/* Trade acronym badges */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
                {[
                  { label: 'CMEQ', color: 'from-[#3B82F6] to-[#06B6D4]' },
                  { label: 'CMMTQ', color: 'from-[#06B6D4] to-[#0E7490]' },
                  { label: 'QBQ', color: 'from-[#8B5CF6] to-[#7C3AED]' },
                  { label: 'HVAC', color: 'from-[#F59E0B] to-[#D97706]' },
                  { label: 'MVL', color: 'from-[#10B981] to-[#059669]' },
                  { label: 'INCENDIE', color: 'from-[#EF4444] to-[#DC2626]' },
                  { label: 'FERBLAN', color: 'from-[#8B5CF6] to-[#7C3AED]' },
                  { label: 'BRIQUE', color: 'from-[#F59E0B] to-[#D97706]' },
                  { label: 'OPEQUIP', color: 'from-[#06B6D4] to-[#0E7490]' },
                  { label: 'GAZ', color: 'from-[#F59E0B] to-[#D97706]' },
                  { label: 'ASCEN', color: 'from-[#10B981] to-[#059669]' },
                  { label: 'REFRIG', color: 'from-[#0E7490] to-[#0A5C70]' },
                  { label: 'CONSTR', color: 'from-[#7C3AED] to-[#6D28D9]' },
                  { label: 'ENTGEN', color: 'from-[#4F46E5] to-[#4338CA]' },
                  { label: 'INSPECT', color: 'from-[#0E7490] to-[#0A5C70]' },
                  { label: 'SST', color: 'from-[#DC2626] to-[#B91C1C]' },
                ].map((item, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${item.color} text-white`}
                  >
                    {item.label}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
                {[
                  { icon: Sparkles, key: 'heroPillTheory' },
                  { icon: Monitor, key: 'heroPillExams' },
                  { icon: Smartphone, key: 'heroPillTracking' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <item.icon className="w-4 h-4 text-[#3B82F6]" />
                    <span className="text-sm text-[#94A3B8]">{t(item.key)}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/auth/register"
                  className="group px-8 py-4 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] rounded-xl font-semibold text-white hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  {t('heroCta')}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Hero right - visual card */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="relative w-80 h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] rounded-3xl rotate-6 opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#06B6D4] to-[#3B82F6] rounded-3xl -rotate-3 opacity-30" />
                <div className="relative w-full h-full bg-[#1A2035] rounded-3xl border border-[#2D3A52] flex items-center justify-center backdrop-blur-sm">
                  <div className="text-left p-6 w-full">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-[#3B82F6]">Exemple de question</span>
                    </div>
                    <p className="text-sm text-[#F8FAFC] font-medium mb-3 leading-relaxed">
                      Quel composant du cycle de réfrigération augmente la pression du réfrigérant ?
                    </p>
                    <div className="space-y-1.5">
                      {['Évaporateur', 'Détendeur', 'Compresseur', 'Condenseur'].map((opt, i) => (
                        <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${i === 2 ? 'bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#3B82F6]' : 'bg-white/5 text-[#94A3B8]'}`}>
                          <span className="font-mono w-4">{String.fromCharCode(65 + i)}.</span>
                          <span>{opt}</span>
                          {i === 2 && (
                            <svg className="w-3.5 h-3.5 ml-auto text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-[#64748B] mt-3 text-center">
                      Plus de 2 400 questions dans 5 métiers
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRADES SECTION ===== */}
      <section id="trades" className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#06B6D4]/5 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
                {t('tradesTitle')}
              </span>
            </h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto">
              {t('tradesSubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Électricien (CMEQ) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#3B82F6]/10 to-[#06B6D4]/10 border border-[#3B82F6]/20 hover:border-[#3B82F6]/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-2 group-hover:text-[#3B82F6] transition-colors">
                <Link href="/trade/cmeq">{t('tradeElectricien')}</Link>
              </h3>
              <p className="text-sm text-[#94A3B8] mb-4">
                {t('tradeElectricienDesc')}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#3B82F6]">
                <Check size={14} />
                <span>{t('tradeTheoryComplete')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#3B82F6] mt-1">
                <Check size={14} />
                <span>{t('tradeExamQuestions')}</span>
              </div>
            </div>

            {/* Plombier (CMMTQ) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#06B6D4]/10 to-[#0E7490]/10 border border-[#06B6D4]/20 hover:border-[#06B6D4]/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#06B6D4] to-[#0E7490] flex items-center justify-center mb-4">
                <Wrench className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-2 group-hover:text-[#06B6D4] transition-colors">
                <Link href="/trade/cmmtq">{t('tradePlombier')}</Link>
              </h3>
              <p className="text-sm text-[#94A3B8] mb-4">
                {t('tradePlombierDesc')}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#06B6D4]">
                <Check size={14} />
                <span>{t('tradeTheoryComplete')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#06B6D4] mt-1">
                <Check size={14} />
                <span>{t('tradeExamQuestions')}</span>
              </div>
            </div>

            {/* Soudeur (QBQ) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#8B5CF6]/10 to-[#7C3AED]/10 border border-[#8B5CF6]/20 hover:border-[#8B5CF6]/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-2 group-hover:text-[#8B5CF6] transition-colors">
                <Link href="/trade/qbq">{t('tradeSoudeur')}</Link>
              </h3>
              <p className="text-sm text-[#94A3B8] mb-4">
                {t('tradeSoudeurDesc')}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#8B5CF6]">
                <Check size={14} />
                <span>{t('tradeTheoryComplete')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#8B5CF6] mt-1">
                <Check size={14} />
                <span>{t('tradeExamQuestions')}</span>
              </div>
            </div>

            {/* HVAC (CMMTQ) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#F59E0B]/10 to-[#D97706]/10 border border-[#F59E0B]/20 hover:border-[#F59E0B]/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center mb-4">
                <Thermometer className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-2 group-hover:text-[#F59E0B] transition-colors">
                <Link href="/trade/hvac">{t('tradeHvac')}</Link>
              </h3>
              <p className="text-sm text-[#94A3B8] mb-4">
                {t('tradeHvacDesc')}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#F59E0B]">
                <Check size={14} />
                <span>{t('tradeTheoryComplete')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#F59E0B] mt-1">
                <Check size={14} />
                <span>{t('tradeExamQuestions')}</span>
              </div>
            </div>

            {/* Mécanicien véhicules lourds (CCQ) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#10B981]/10 to-[#059669]/10 border border-[#10B981]/20 hover:border-[#10B981]/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center mb-4">
                <Truck className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-2 group-hover:text-[#10B981] transition-colors">
                <Link href="/trade/mvl">{t('tradeMvl')}</Link>
              </h3>
              <p className="text-sm text-[#94A3B8] mb-4">
                {t('tradeMvlDesc')}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#10B981]">
                <Check size={14} />
                <span>{t('tradeTheoryComplete')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#10B981] mt-1">
                <Check size={14} />
                <span>{t('tradeExamQuestions')}</span>
              </div>
            </div>

            {/* Technicien en sécurité incendie (INCENDIE) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#EF4444]/10 to-[#DC2626]/10 border border-[#EF4444]/20 hover:border-[#EF4444]/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#EF4444] to-[#DC2626] flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-2 group-hover:text-[#EF4444] transition-colors">
                <Link href="/trade/securite-incendie">{t('tradeIncendie')}</Link>
              </h3>
              <p className="text-sm text-[#94A3B8] mb-4">
                {t('tradeIncendieDesc')}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#EF4444]">
                <Check size={14} />
                <span>{t('tradeTheoryComplete')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#EF4444] mt-1">
                <Check size={14} />
                <span>{t('tradeExamQuestions')}</span>
              </div>
            </div>

            {/* Ferblantier / Tôlier (FERBLAN) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#8B5CF6]/10 to-[#7C3AED]/10 border border-[#8B5CF6]/20 hover:border-[#8B5CF6]/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center mb-4">
                <Wrench className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-2 group-hover:text-[#8B5CF6] transition-colors">
                <Link href="/trade/ferblantier">{t('tradeFerblantier')}</Link>
              </h3>
              <p className="text-sm text-[#94A3B8] mb-4">
                {t('tradeFerblantierDesc')}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#8B5CF6]">
                <Check size={14} />
                <span>{t('tradeTheoryComplete')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#8B5CF6] mt-1">
                <Check size={14} />
                <span>{t('tradeExamQuestions')}</span>
              </div>
            </div>

            {/* Briqueteur-maçon (BRIQUE) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#F59E0B]/10 to-[#D97706]/10 border border-[#F59E0B]/20 hover:border-[#F59E0B]/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center mb-4">
                <Wrench className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-2 group-hover:text-[#F59E0B] transition-colors">
                <Link href="/trade/briqueteur">{t('tradeBriqueteur')}</Link>
              </h3>
              <p className="text-sm text-[#94A3B8] mb-4">
                {t('tradeBriqueteurDesc')}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#F59E0B]">
                <Check size={14} />
                <span>{t('tradeTheoryComplete')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#F59E0B] mt-1">
                <Check size={14} />
                <span>{t('tradeExamQuestions')}</span>
              </div>
            </div>

            {/* Opérateur d'équipement lourd (OPEQUIP) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#06B6D4]/10 to-[#0E7490]/10 border border-[#06B6D4]/20 hover:border-[#06B6D4]/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#06B6D4] to-[#0E7490] flex items-center justify-center mb-4">
                <Truck className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-2 group-hover:text-[#06B6D4] transition-colors">
                <Link href="/trade/operateur-equipement-lourd">{t('tradeOpEquip')}</Link>
              </h3>
              <p className="text-sm text-[#94A3B8] mb-4">
                {t('tradeOpEquipDesc')}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#06B6D4]">
                <Check size={14} />
                <span>{t('tradeTheoryComplete')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#06B6D4] mt-1">
                <Check size={14} />
                <span>{t('tradeExamQuestions')}</span>
              </div>
            </div>

            {/* Technicien en gaz (GAZ) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#F59E0B]/10 to-[#D97706]/10 border border-[#F59E0B]/20 hover:border-[#F59E0B]/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center mb-4">
                <Thermometer className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-2 group-hover:text-[#F59E0B] transition-colors">
                <Link href="/trade/gaz">{t('tradeGaz')}</Link>
              </h3>
              <p className="text-sm text-[#94A3B8] mb-4">
                {t('tradeGazDesc')}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#F59E0B]">
                <Check size={14} />
                <span>{t('tradeTheoryComplete')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#F59E0B] mt-1">
                <Check size={14} />
                <span>{t('tradeExamQuestions')}</span>
              </div>
            </div>

            {/* Mécanicien d'ascenseurs (ASCEN) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#10B981]/10 to-[#059669]/10 border border-[#10B981]/20 hover:border-[#10B981]/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center mb-4">
                <Wrench className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-2 group-hover:text-[#10B981] transition-colors">
                <Link href="/trade/ascenseurs">{t('tradeAscenseur')}</Link>
              </h3>
              <p className="text-sm text-[#94A3B8] mb-4">
                {t('tradeAscenseurDesc')}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#10B981]">
                <Check size={14} />
                <span>{t('tradeTheoryComplete')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#10B981] mt-1">
                <Check size={14} />
                <span>{t('tradeExamQuestions')}</span>
              </div>
            </div>

            {/* Opérateur de réfrigération (REFRIG) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0E7490]/10 to-[#0A5C70]/10 border border-[#0E7490]/20 hover:border-[#0E7490]/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0E7490] to-[#0A5C70] flex items-center justify-center mb-4">
                <Thermometer className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-2 group-hover:text-[#0E7490] transition-colors">
                <Link href="/trade/refrigeration">{t('tradeRefrig')}</Link>
              </h3>
              <p className="text-sm text-[#94A3B8] mb-4">
                {t('tradeRefrigDesc')}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#0E7490]">
                <Check size={14} />
                <span>{t('tradeTheoryComplete')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#0E7490] mt-1">
                <Check size={14} />
                <span>{t('tradeExamQuestions')}</span>
              </div>
            </div>

            {/* Constructeur-rénovateur (CONSTR) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#7C3AED]/10 to-[#6D28D9]/10 border border-[#7C3AED]/20 hover:border-[#7C3AED]/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] flex items-center justify-center mb-4">
                <Wrench className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-2 group-hover:text-[#7C3AED] transition-colors">
                <Link href="/trade/constructeur">{t('tradeConstr')}</Link>
              </h3>
              <p className="text-sm text-[#94A3B8] mb-4">
                {t('tradeConstrDesc')}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#7C3AED]">
                <Check size={14} />
                <span>{t('tradeTheoryComplete')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#7C3AED] mt-1">
                <Check size={14} />
                <span>{t('tradeExamQuestions')}</span>
              </div>
            </div>

            {/* Entrepreneur général (ENTGEN) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#4F46E5]/10 to-[#4338CA]/10 border border-[#4F46E5]/20 hover:border-[#4F46E5]/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#4338CA] flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-2 group-hover:text-[#4F46E5] transition-colors">
                <Link href="/trade/entrepreneur-general">{t('tradeEntgen')}</Link>
              </h3>
              <p className="text-sm text-[#94A3B8] mb-4">
                {t('tradeEntgenDesc')}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#4F46E5]">
                <Check size={14} />
                <span>{t('tradeTheoryComplete')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#4F46E5] mt-1">
                <Check size={14} />
                <span>{t('tradeExamQuestions')}</span>
              </div>
            </div>

            {/* Inspecteur en bâtiment (INSPECT) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0E7490]/10 to-[#0A5C70]/10 border border-[#0E7490]/20 hover:border-[#0E7490]/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0E7490] to-[#0A5C70] flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-2 group-hover:text-[#0E7490] transition-colors">
                <Link href="/trade/inspecteur">{t('tradeInspect')}</Link>
              </h3>
              <p className="text-sm text-[#94A3B8] mb-4">
                {t('tradeInspectDesc')}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#0E7490]">
                <Check size={14} />
                <span>{t('tradeTheoryComplete')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#0E7490] mt-1">
                <Check size={14} />
                <span>{t('tradeExamQuestions')}</span>
              </div>
            </div>

            {/* Coordonnateur SST (SST) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#DC2626]/10 to-[#B91C1C]/10 border border-[#DC2626]/20 hover:border-[#DC2626]/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#DC2626] to-[#B91C1C] flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-2 group-hover:text-[#DC2626] transition-colors">
                <Link href="/trade/coordonnateur-sst">{t('tradeSst')}</Link>
              </h3>
              <p className="text-sm text-[#94A3B8] mb-4">
                {t('tradeSstDesc')}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#DC2626]">
                <Check size={14} />
                <span>{t('tradeTheoryComplete')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#DC2626] mt-1">
                <Check size={14} />
                <span>{t('tradeExamQuestions')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS SECTION (NEW) ===== */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#06B6D4]/5 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
                {t('howItWorksTitle')}
              </span>
            </h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto">
              {t('howItWorksSubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '1',
                icon: BookOpen,
                titleKey: 'step1Title',
                descKey: 'step1Desc',
              },
              {
                step: '2',
                icon: Monitor,
                titleKey: 'step2Title',
                descKey: 'step2Desc',
              },
              {
                step: '3',
                icon: GraduationCap,
                titleKey: 'step3Title',
                descKey: 'step3Desc',
              },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="relative mb-6 inline-flex">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#F59E0B] flex items-center justify-center text-xs font-bold text-[#0A0E1A]">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[#F8FAFC] mb-3">{t(item.titleKey)}</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed max-w-xs mx-auto">
                  {t(item.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PracticeQuestionWidget />

      {/* ===== FEATURES SECTION ===== */}
      <section id="features" className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#3B82F6]/5 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
                {t('featuresTitle')}
              </span>
            </h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto">
              {t('featuresSubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                titleKey: 'featureTheorie',
                descKey: 'featureTheorieDesc',
                gradient: 'from-[#3B82F6] to-[#06B6D4]',
              },
              {
                icon: FileText,
                titleKey: 'featureExamens',
                descKey: 'featureExamensDesc',
                gradient: 'from-[#8B5CF6] to-[#3B82F6]',
              },
              {
                icon: BarChart3,
                titleKey: 'featureSuivi',
                descKey: 'featureSuiviDesc',
                gradient: 'from-[#06B6D4] to-[#10B981]',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#3B82F6]/30 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#F8FAFC] mb-2 group-hover:text-[#3B82F6] transition-colors">
                  {t(item.titleKey)}
                </h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  {t(item.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ===== PRICING SECTION (FULL 4 PLANS) ===== */}
      <section id="pricing" className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#3B82F6]/5 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
                {t('pricingTitle')}
              </span>
            </h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto">
              {t('pricingSubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {/* GRATUIT */}
            <div className="bg-[#1A2035] border border-[#2D3A52] hover:border-[#3B82F6]/30 rounded-2xl p-4 flex flex-col transition-all duration-300">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">GRATUIT</h3>
                <p className="text-[11px] text-[#94A3B8] mb-4 min-h-[28px]">Pour découvrir la plateforme</p>
                <div className="flex items-baseline gap-0.5 mb-5">
                  <span className="text-3xl font-bold text-[#F8FAFC]">0</span>
                  <span className="text-xs text-[#94A3B8]">$</span>
                  <span className="text-xs text-[#64748B]">/mois</span>
                </div>
                <ul className="space-y-2 mb-5">
                  {[
                    { text: '1 métier au choix', inc: true },
                    { text: 'Contenu théorique complet', inc: true },
                    { text: 'Questions limitées', inc: true },
                    { text: 'Examens illimités', inc: false },
                    { text: 'Tuteur IA', inc: false },
                  ].map((f) => (
                    <li key={f.text} className="flex items-start gap-2">
                      {f.inc ? (
                        <Check size={14} className={`mt-0.5 shrink-0 ${f.highlight ? 'text-[#3B82F6]' : 'text-[#10B981]'}`} />
                      ) : (
                        <div className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      )}
                      <span className={`text-xs ${f.highlight ? 'text-[#3B82F6] font-medium' : (f.inc ? 'text-[#F8FAFC]' : 'text-[#64748B]')}`}>{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/auth/register"
                className="block w-full text-center py-2.5 rounded-xl bg-[#3B82F6] text-white text-sm font-semibold hover:bg-[#2563EB] transition-all"
              >
                Commencer gratuitement
              </Link>
            </div>

            {/* ESSENTIEL */}
            <div className="bg-[#1A2035] border border-[#2D3A52] hover:border-[#3B82F6]/30 rounded-2xl p-4 flex flex-col transition-all duration-300">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-[#3B82F6] mb-1">ESSENTIEL</h3>
                <p className="text-[11px] text-[#94A3B8] mb-4 min-h-[28px]">1 métier, accès complet</p>
                <div className="flex items-baseline gap-0.5 mb-5">
                  <span className="text-3xl font-bold text-[#F8FAFC]">29</span>
                  <span className="text-xs text-[#94A3B8]">$</span>
                  <span className="text-xs text-[#64748B]">/mois</span>
                </div>
                <ul className="space-y-2 mb-5">
                  {[
                    { text: '1 métier au choix', inc: true },
                    { text: 'Contenu théorique complet', inc: true },
                    { text: 'Questions illimitées', inc: true },
                    { text: 'Examens illimités', inc: true },
                    { text: 'Tuteur IA', inc: true },
                    { text: '🔒 Métier verrouillé', inc: true, highlight: true },
                  ].map((f) => (
                    <li key={f.text} className="flex items-start gap-2">
                      <Check size={14} className={`mt-0.5 shrink-0 ${f.highlight ? 'text-[#3B82F6]' : 'text-[#10B981]'}`} />
                      <span className={`text-xs ${f.highlight ? 'text-[#3B82F6] font-medium' : 'text-[#F8FAFC]'}`}>{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/pricing"
                className="block w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#3B82F6]/20 transition-all"
              >
                S'abonner
              </Link>
            </div>

            {/* PRO — popular */}
            <div className="bg-[#1A2035] border border-[#3B82F6]/40 rounded-2xl p-4 flex flex-col shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <span className="px-4 py-1 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white text-xs font-semibold rounded-full whitespace-nowrap">
                  POPULAIRE
                </span>
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-base font-semibold text-[#8B5CF6] mb-1">PRO</h3>
                <p className="text-[11px] text-[#94A3B8] mb-4 min-h-[28px]">Tous les métiers, sans limites</p>
                <div className="flex items-baseline gap-0.5 mb-5">
                  <span className="text-3xl font-bold text-[#F8FAFC]">49</span>
                  <span className="text-xs text-[#94A3B8]">$</span>
                  <span className="text-xs text-[#64748B]">/mois</span>
                </div>
                <ul className="space-y-2 mb-5">
                  {[
                    { text: 'Tous les métiers', inc: true },
                    { text: 'Contenu théorique complet', inc: true },
                    { text: 'Questions illimitées', inc: true },
                    { text: 'Examens illimités', inc: true },
                    { text: 'Tuteur IA', inc: true },
                    { text: 'Suivi de progression', inc: true },
                  ].map((f) => (
                    <li key={f.text} className="flex items-start gap-2">
                      <Check size={14} className="mt-0.5 text-[#10B981] shrink-0" />
                      <span className="text-xs text-[#F8FAFC]">{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/pricing"
                className="block w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#3B82F6]/20 transition-all"
              >
                S'abonner
              </Link>
            </div>

            {/* À VIE */}
            <div className="bg-[#1A2035] border border-[#2D3A52] hover:border-[#F59E0B]/30 rounded-2xl p-4 flex flex-col transition-all duration-300">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-[#F59E0B] mb-1">À VIE</h3>
                <p className="text-[11px] text-[#94A3B8] mb-4 min-h-[28px]">Tous les métiers, à vie</p>
                <div className="flex items-baseline gap-0.5 mb-5">
                  <span className="text-3xl font-bold text-[#F8FAFC]">559</span>
                  <span className="text-xs text-[#94A3B8]">$</span>
                </div>
                <ul className="space-y-2 mb-5">
                  {[
                    { text: 'Tous les métiers', inc: true, highlight: true },
                    { text: 'Contenu théorique complet', inc: true },
                    { text: 'Questions illimitées', inc: true },
                    { text: 'Examens illimités', inc: true },
                    { text: 'Tuteur IA', inc: true },
                    { text: 'Mises à jour incluses', inc: true },
                  ].map((f) => (
                    <li key={f.text} className="flex items-start gap-2">
                      <Check size={14} className={`mt-0.5 shrink-0 ${f.highlight ? 'text-[#F59E0B]' : 'text-[#10B981]'}`} />
                      <span className={`text-xs ${f.highlight ? 'text-[#F59E0B] font-medium' : 'text-[#F8FAFC]'}`}>{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/pricing"
                className="block w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#F59E0B]/20 transition-all"
              >
                Acheter à vie
              </Link>
            </div>
          </div>

          <p className="text-center text-sm text-[#64748B] mt-8">
            {t('planCancelAnytime')}
          </p>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6]/20 via-[#06B6D4]/20 to-[#3B82F6]/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3B82F6]/10 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('ctaTitle')}
          </h2>
          <p className="text-lg text-[#94A3B8] mb-8 max-w-xl mx-auto">
            {t('ctaDesc')}
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] rounded-xl font-semibold text-white hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300"
          >
            <Zap className="w-5 h-5" />
            {t('ctaButton')}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section id="faq" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
                Questions fréquentes
              </span>
            </h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto">
              Tout ce que vous devez savoir sur les examens de métier au Québec
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Qu'est-ce que l'examen CMEQ pour électricien ?",
                a: "L'examen CMEQ (Corporation des maîtres électriciens du Québec) est l'examen de certification obligatoire pour devenir électricien au Québec. Il couvre le Code de construction du Québec — Chapitre V (électricité), les calculs de charge, les circuits, la protection des circuits, les moteurs électriques et les normes de sécurité. Notre plateforme offre 950 questions d'entraînement couvrant l'ensemble des 10 chapitres du programme."
              },
              {
                q: "Combien de questions y a-t-il à l'examen d'électricien CMEQ ?",
                a: "L'examen CMEQ contient généralement entre 50 et 100 questions à choix multiples portant sur le Code de l'électricité (CCE), les calculs de charge résidentielle et commerciale, la protection des circuits, les moteurs, la mise à la terre et les méthodes de câblage. Le seuil de réussite est de 70 %."
              },
              {
                q: "Comment se préparer à l'examen de plomberie CMMTQ ?",
                a: "Pour vous préparer à l'examen CMMTQ, étudiez le Code de plomberie du Québec, les types de tuyaux (cuivre M/L/K, PVC, ABS, PEX), l'alimentation en eau potable, l'évacuation et la ventilation, les appareils sanitaires, le chauffage de l'eau, les systèmes de gaz (CSA B149) et la protection incendie. Notre plateforme couvre ces 8 chapitres avec plus de 600 questions d'entraînement."
              },
              {
                q: "Quel est le seuil de réussite aux examens de métier au Québec ?",
                a: "Le seuil de réussite pour les examens de métier au Québec est de 70 %. Une préparation adéquate avec du contenu théorique complet et des examens blancs est essentielle pour maximiser vos chances de succès dès la première tentative."
              },
              {
                q: "La certification QBQ pour soudeur est-elle reconnue ?",
                a: "Oui, la certification QBQ (Québec Board of Trades) est officielle et reconnue pour les soudeurs au Québec. Les normes CSA W47.1 (acier) et CSA W59 (construction soudée) sont les références. La certification est valide 2 ans et nécessite une réussite aux examens théorique et pratique."
              },
              {
                q: "Quels sont les prérequis pour l'examen d'électricien ?",
                a: "Pour passer l'examen d'électricien au Québec, il faut généralement avoir complété un DEP en électricité (1 800 heures), accumulé les heures d'apprentissage requises, et être inscrit à la Commission de la construction du Québec (CCQ)."
              },
              {
                q: "Combien coûte la préparation aux examens ?",
                a: "Nos plans commencent à 0$ pour le plan GRATUIT (accès limité à un métier), 29$/mois pour le plan ESSENTIEL (théorie complète et examens blancs) et 49$/mois pour le plan PRO (tous les métiers). Un accès À VIE est disponible pour 559$."
              },
              {
                q: "Où puis-je passer l'examen de métier au Québec ?",
                a: "Les examens sont administrés par la CCQ, la RBQ, le QBQ et les corporations (CMEQ, CMMTQ). La préparation peut se faire en ligne via notre plateforme avec théorie complète, 2 161 questions d'entraînement et un tuteur IA pour vous accompagner."
              }
            ].map((item, idx) => (
              <details
                key={idx}
                className="group bg-[#1A2035] border border-[#2D3A52] rounded-xl overflow-hidden hover:border-[#3B82F6]/30 transition-colors"
              >
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-medium text-[#F8FAFC] hover:text-[#3B82F6] transition-colors list-none">
                  <span>{item.q}</span>
                  <ChevronRight size={16} className="text-[#64748B] group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-5 pb-4 text-sm text-[#94A3B8] leading-relaxed border-t border-[#2D3A52] pt-3">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/5 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">{t('footerBrand')}</span>
              </div>
              <p className="text-sm text-[#64748B] leading-relaxed">
                {t('heroBadge')}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-[#94A3B8] mb-4">{t('footerQuickLinks')}</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-sm text-[#64748B] hover:text-[#3B82F6] transition-colors">{t('footerLinkFeatures')}</a>
                </li>
                <li>
                  <a href="#trades" className="text-sm text-[#64748B] hover:text-[#3B82F6] transition-colors">{t('footerLinkTrades')}</a>
                </li>
                <li>
                  <a href="#pricing" className="text-sm text-[#64748B] hover:text-[#3B82F6] transition-colors">{t('footerLinkPricing')}</a>
                </li>
                <li>
                  <a href="#contact" className="text-sm text-[#64748B] hover:text-[#3B82F6] transition-colors">{t('footerLinkContact')}</a>
                </li>
              </ul>
            </div>

            {/* Legal / Resources */}
            <div>
              <h4 className="text-sm font-semibold text-[#94A3B8] mb-4">{t('navTrades')}</h4>
              <ul className="space-y-2">
                <li>
                  <span className="text-sm text-[#64748B]">{t('tradeElectricien')}</span>
                </li>
                <li>
                  <span className="text-sm text-[#64748B] opacity-60">{t('tradePlombier')}</span>
                </li>
                <li>
                  <span className="text-sm text-[#64748B] opacity-60">{t('tradeSoudeur')}</span>
                </li>
                <li>
                  <span className="text-sm text-[#64748B] opacity-60">{t('tradeHvac')}</span>
                </li>
                <li>
                  <span className="text-sm text-[#64748B] opacity-60">{t('tradeMvl')}</span>
                </li>
              </ul>
            </div>

            {/* Language & Auth */}
            <div>
              <h4 className="text-sm font-semibold text-[#94A3B8] mb-4">{t('language')}</h4>
              <button
                onClick={toggleLocale}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-sm text-[#94A3B8] hover:text-white hover:border-white/20 transition-all"
              >
                <Globe className="w-4 h-4" />
                {locale === 'fr' ? 'English' : 'Français'}
              </button>
              <div className="mt-4">
                <Link
                  href="/auth/login"
                  className="text-sm text-[#64748B] hover:text-[#3B82F6] transition-colors"
                >
                  {t('navSignIn')}
                </Link>
                <span className="text-[#64748B] mx-2">·</span>
                <Link
                  href="/auth/register"
                  className="text-sm text-[#64748B] hover:text-[#3B82F6] transition-colors"
                >
                  {t('navSignUp')}
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#64748B]">
              {t('footerRights', { year: new Date().getFullYear() })}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
