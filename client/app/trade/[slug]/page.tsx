import type { Metadata } from 'next';
import TradePillarPage from './PageContent';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tradeNames: Record<string, { name: string, nameFr: string }> = {
    cmeq: { name: 'Electrician (CMEQ)', nameFr: 'Électricien (CMEQ)' },
    cmmtq: { name: 'Plumber (CMMTQ)', nameFr: 'Plombier (CMMTQ)' },
    qbq: { name: 'Welder (QBQ)', nameFr: 'Soudeur (QBQ)' },
    hvac: { name: 'HVAC (CMMTQ)', nameFr: 'CVC (CMMTQ)' },
    mvl: { name: 'Heavy Vehicle Mechanic (CCQ)', nameFr: 'Mécanicien véhicules lourds (CCQ)' },
    'securite-incendie': { name: 'Fire Safety (RBQ)', nameFr: 'Sécurité incendie (RBQ)' },
    ferblantier: { name: 'Sheet Metal Worker (CCQ)', nameFr: 'Ferblantier (CCQ)' },
    briqueteur: { name: 'Bricklayer (CCQ)', nameFr: 'Briqueteur (CCQ)' },
    'operateur-equipement-lourd': { name: 'Heavy Equipment Operator (CCQ)', nameFr: 'Opérateur équipement lourd (CCQ)' },
    gaz: { name: 'Gas Technician (RBQ)', nameFr: 'Technicien gaz (RBQ)' },
    ascenseurs: { name: 'Elevator Mechanic (RBQ)', nameFr: 'Mécanicien ascenseurs (RBQ)' },
    refrigeration: { name: 'Refrigeration Operator (RBQ)', nameFr: 'Opérateur réfrigération (RBQ)' },
    constructeur: { name: 'Builder-Renovator (RBQ)', nameFr: 'Constructeur-rénovateur (RBQ)' },
    'entrepreneur-general': { name: 'General Contractor (RBQ)', nameFr: 'Entrepreneur général (RBQ)' },
    inspecteur: { name: 'Building Inspector (RBQ)', nameFr: 'Inspecteur bâtiment (RBQ)' },
    'coordonnateur-sst': { name: 'Safety Coordinator (ASP Const.)', nameFr: 'Coordonnateur SST (ASP Const.)' },
    'gestion-travaux': { name: 'Construction Project Management (RBQ)', nameFr: 'Gestion des travaux (RBQ)' },
  };

  const trade = tradeNames[slug];

  return {
    // FR-first metadata: the site targets Quebec francophone searchers
    title: trade
      ? `Préparation examen ${trade.nameFr} | Metierium`
      : `Préparation examen de métier au Québec | Metierium`,
    description: trade
      ? `Préparez votre examen de certification ${trade.nameFr} au Québec avec théorie complète, examens blancs et tuteur IA. Questions réelles du Code, simulations et suivi de progression.`
      : `Préparez votre examen de certification de métier au Québec avec Metierium : théorie complète, examens blancs et tuteur IA.`,
    alternates: {
      canonical: `https://metierium.com/trade/${slug}`,
      languages: {
        'fr-CA': `https://metierium.com/trade/${slug}`,
        'en-CA': `https://metierium.com/en/trade/${slug}`,
      },
    },
    openGraph: {
      title: trade
        ? `Préparation examen ${trade.nameFr} | Metierium`
        : `Préparation examen de métier au Québec | Metierium`,
      description: trade
        ? `Préparez votre examen ${trade.nameFr} au Québec avec théorie complète, examens blancs et tuteur IA.`
        : `Préparez votre examen de métier au Québec avec Metierium.`,
      locale: 'fr_CA',
      alternateLocale: ['en_CA'],
      siteName: 'Metierium',
    },
  };
}

export default function Page() {
  return <TradePillarPage />;
}
