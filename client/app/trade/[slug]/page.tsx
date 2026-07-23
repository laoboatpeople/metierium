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
  };

  const trade = tradeNames[slug];

  return {
    title: trade ? `${trade.name} Exam Preparation | Metierium` : `Trade Exam Prep | Metierium`,
    description: trade
      ? `Prepare for your ${trade.name} certification exam in Quebec with complete theory, practice tests, and AI tutor.`
      : `Prepare for your Quebec trade certification exam with Metierium.`,
    alternates: {
      canonical: `https://metierium.com/trade/${slug}`,
      languages: {
        'fr-CA': `https://metierium.com/trade/${slug}`,
        'en-CA': `https://metierium.com/en/trade/${slug}`,
      },
    },
    openGraph: {
      title: trade ? `${trade.name} Exam Preparation | Metierium` : `Trade Exam Prep | Metierium`,
      description: trade
        ? `Prepare for your ${trade.name} certification exam in Quebec.`
        : `Prepare for your Quebec trade certification exam.`,
      locale: 'en_CA',
      alternateLocale: ['fr_CA'],
      siteName: 'Metierium',
    },
  };
}

export default function Page() {
  return <TradePillarPage />;
}
