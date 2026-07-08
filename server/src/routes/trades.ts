import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { authenticate, requireRoles } from '../middleware/auth';
import { getUserTradeAccess } from '../middleware/tradeAccess';

const router = Router();

/**
 * GET /api/trades
 * List all trades.
 */
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const trades = await prisma.trade.findMany({
      orderBy: { name: 'asc' },
    });
    res.json({ data: trades });
  } catch (err) {
    console.error('[Trades] List error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * GET /api/trades/:code
 * Get a trade by its code (e.g., "CMEQ"), including its chapters.
 */
router.get('/:code', async (req: Request, res: Response): Promise<void> => {
  try {
    const trade = await prisma.trade.findUnique({
      where: { code: req.params.code },
      include: {
        chapters: {
          orderBy: { number: 'asc' },
        },
      },
    });

    if (!trade) {
      res.status(404).json({ message: 'Trade not found' });
      return;
    }

    res.json(trade);
  } catch (err) {
    console.error('[Trades] Get error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * GET /api/trades/access
 * Returns all trades with the current user's access status for each.
 * Requires authentication.
 */
router.get('/access', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const trades = await prisma.trade.findMany({
      orderBy: { name: 'asc' },
    });

    const access = await getUserTradeAccess(req.user!.id);

    const data = trades.map(trade => ({
      ...trade,
      hasAccess: access.type === 'all' || (access.type === 'single' && access.tradeId === trade.id),
      accessType: access.type,
    }));

    res.json({ data });
  } catch (err) {
    console.error('[Trades] Access error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * POST /api/trades/seed
 * Admin-only endpoint to populate trades, chapters, and questions from seed data.
 * This triggers the same logic as `prisma/seed.ts`.
 * Body: { data: { trades: [...] } } — or empty to use default seed data.
 */
router.post('/seed', authenticate, requireRoles('ADMIN'), async (_req: Request, res: Response): Promise<void> => {
  try {
    // Check if trades already exist — refuse if already seeded
    const existingCount = await prisma.trade.count();
    if (existingCount > 0) {
      res.status(409).json({
        message: 'Database already contains trades. Use prisma/seed.ts to reseed after clearing.',
        tradeCount: existingCount,
      });
      return;
    }

    // ─── Create trades ──────────────────────────────────────────────
    const cmeg = await prisma.trade.create({
      data: {
        code: 'CMEQ',
        name: 'Electrician',
        nameFr: 'Électricien',
        description: 'Commission de la construction du Québec — Électricien',
      },
    });

    const cmmtq = await prisma.trade.create({
      data: {
        code: 'CMMTQ',
        name: 'Plumber',
        nameFr: 'Plombier',
        description: 'Corporation des maîtres mécaniciens en tuyauterie du Québec',
      },
    });

    const qbq = await prisma.trade.create({
      data: {
        code: 'QBQ',
        name: 'Welder',
        nameFr: 'Soudeur',
        description: 'Québec Board of Trades — Soudeur',
      },
    });

    // ─── Create chapters for CMEQ ───────────────────────────────────
    const chapters = [
      { number: 1, name: "Ohm's Law", nameFr: "Loi d'Ohm" },
      { number: 2, name: 'DC/AC Circuits', nameFr: 'Circuits CC/CA' },
      { number: 3, name: 'Residential Wiring', nameFr: 'Câblage résidentiel' },
      { number: 4, name: 'Circuit Protection', nameFr: 'Protection des circuits' },
      { number: 5, name: 'Electric Motors', nameFr: 'Moteurs électriques' },
      { number: 6, name: 'Solar Panels', nameFr: 'Panneaux solaires' },
      { number: 7, name: 'Security Systems', nameFr: 'Systèmes de sécurité' },
      { number: 8, name: 'Construction Code', nameFr: 'Code de construction' },
      { number: 9, name: 'Electrical Diagrams', nameFr: 'Schémas électriques' },
      { number: 10, name: 'Load Calculations', nameFr: 'Calculs de charge' },
    ];

    for (const ch of chapters) {
      await prisma.chapter.create({
        data: {
          tradeId: cmeg.id,
          number: ch.number,
          name: ch.name,
          nameFr: ch.nameFr,
          theoryContent: getTheoryContent(ch.number),
        },
      });
    }

    // ─── Create questions for each chapter ──────────────────────────
    for (let chapterNumber = 1; chapterNumber <= 10; chapterNumber++) {
      const chapter = await prisma.chapter.findFirst({
        where: { tradeId: cmeg.id, number: chapterNumber },
      });
      if (!chapter) continue;

      const questions = getQuestionsForChapter(chapterNumber);
      for (const q of questions) {
        await prisma.question.create({
          data: {
            tradeId: cmeg.id,
            chapterId: chapter.id,
            type: 'MCQ',
            difficulty: q.difficulty,
            question: q.question,
            options: q.options,
            answer: q.answer,
            explanation: q.explanation,
            locale: 'fr',
          },
        });
      }
    }

    res.status(201).json({
      message: 'Database seeded successfully',
      trades: { CMEQ: cmeg.id, CMMTQ: cmmtq.id, QBQ: qbq.id },
    });
  } catch (err) {
    console.error('[Trades] Seed error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;

// ─── Theory content (500-1000 words, rich markdown, in French) ─────

function getTheoryContent(chapterNumber: number): string {
  const contents: Record<number, string> = {
    1: `# Loi d'Ohm — Fondamentaux de l'Électricité

## Introduction

La loi d'Ohm est la pierre angulaire de l'électricité et de l'électronique. Formulée par le physicien allemand Georg Simon Ohm en 1827, elle établit la relation fondamentale entre la tension (V), le courant (I) et la résistance (R) dans un circuit électrique.

## Formule fondamentale

La loi d'Ohm s'exprime par la relation mathématique suivante :

**V = R × I**

Où :
- **V** est la tension en volts (V)
- **R** est la résistance en ohms (Ω)
- **I** est le courant en ampères (A)

Cette formule peut être réarrangée pour calculer n'importe laquelle des trois variables :

- I = V / R (courant = tension ÷ résistance)
- R = V / I (résistance = tension ÷ courant)

## Application pratique

### Calcul du courant
Si une résistance de 10 Ω est connectée à une source de 120 V, le courant qui circule est :  
I = 120 V / 10 Ω = 12 A

### Calcul de la résistance
Si un appareil de 120 V consomme 8 A, sa résistance est :  
R = 120 V / 8 A = 15 Ω

### Calcul de la tension
Si un circuit de 5 A traverse une résistance de 24 Ω, la tension est :  
V = 5 A × 24 Ω = 120 V

## La puissance électrique

La loi d'Ohm est étroitement liée à la puissance électrique. La puissance (P) se calcule par :

**P = V × I**

Où P est la puissance en watts (W). En combinant avec la loi d'Ohm :

- P = I² × R (si on connaît le courant et la résistance)
- P = V² / R (si on connaît la tension et la résistance)

### Exemple de calcul de puissance
Un radiateur électrique branché sur 240 V avec un courant de 10 A :  
P = 240 V × 10 A = 2 400 W (2,4 kW)

## Limitations de la loi d'Ohm

La loi d'Ohm s'applique strictement aux **composants ohmiques** (résistances linéaires) dont la résistance reste constante quelle que soit la tension appliquée. Certains composants comme les diodes, les transistors et les ampoules à incandescence ont un comportement non-linéaire.

## Importance dans le métier d'électricien

La maîtrise de la loi d'Ohm est essentielle pour :
- Dimensionner correctement les conducteurs et les protections
- Diagnostiquer les pannes électriques
- Calculer les chutes de tension dans les circuits longs
- Vérifier la conformité des installations selon le Code de construction du Québec`,
    2: `# Circuits à Courant Continu (CC) et Courant Alternatif (CA)

## Introduction

Les installations électriques résidentielles, commerciales et industrielles utilisent deux types de courant : le courant continu (CC) et le courant alternatif (CA). Chacun possède des caractéristiques distinctes qui déterminent ses applications.

## Courant Continu (CC)

### Caractéristiques
Le courant continu circule dans une seule direction, de la borne positive vers la borne négative. La tension reste constante dans le temps.

### Sources de CC
- Piles et batteries
- Panneaux solaires photovoltaïques
- Alimentations à découpage
- Dynamos

### Applications
- Électronique grand public
- Systèmes de sécurité et alarmes
- Véhicules électriques
- Télécommunications
- Éclairage d'urgence

## Courant Alternatif (CA)

### Caractéristiques
Le courant alternatif change périodiquement de direction. Au Québec, la fréquence standard est de 60 Hz, ce qui signifie que le courant change de direction 120 fois par seconde.

### Paramètres importants
- **Fréquence (f)** : 60 Hz au Canada
- **Tension efficace (Vrms)** : 120 V / 240 V résidentiel
- **Tension de crête** : Vmax = Vrms × √2 ≈ 170 V pour 120 V
- **Période (T)** : T = 1/f = 16,67 ms

### Applications
- Distribution d'électricité résidentielle
- Appareils électroménagers
- Moteurs industriels
- Éclairage général

## Comparaison CC vs CA

| Caractéristique | CC | CA |
|-----------------|----|----|
| Direction du courant | Unique | Alternée |
| Transport longue distance | Difficile (pertes élevées) | Facile (transformateurs) |
| Stockage | Possible (batteries) | Impossible |
| Conversion de tension | Complexe | Simple (transformateur) |
| Sécurité | Plus dangereux à haute tension | Standardisé |

## Circuits en série et parallèle

### Circuit série
- Le courant est identique dans tous les composants
- La tension se divise entre les composants
- Rtotale = R1 + R2 + R3 + ...

### Circuit parallèle
- La tension est identique aux bornes de chaque branche
- Le courant se divise entre les branches
- 1/Rtotale = 1/R1 + 1/R2 + 1/R3 + ...

## Importance pour l'électricien

Comprendre les différences entre CC et CA est fondamental pour :
- Installer correctement les systèmes photovoltaïques
- Diagnostiquer les pannes dans les circuits résidentiels
- Câbler des équipements spécialisés
- Respecter les normes du Code de construction`,
    3: `# Câblage Résidentiel — Normes et Pratiques

## Introduction

Le câblage résidentiel au Québec doit respecter le Code de construction du Québec, Chapitre V — Électricité, qui reprend essentiellement le Code canadien de l'électricité (CCE). Ce chapitre couvre tous les aspects du câblage résidentiel, du dimensionnement des conducteurs à l'installation des dispositifs de protection.

## Principes fondamentaux

### Conducteurs et câbles

Les conducteurs les plus courants en résidentiel sont :

- **NM-B (Romex)** : Câble non métallique pour usage intérieur général
  - 14 AWG : 15 A (éclairage, prises générales)
  - 12 AWG : 20 A (cuisine, salle de bain)
  - 10 AWG : 30 A (sécheuse, climatiseur)
- **AC90 (armé)** : Câble blindé pour sous-sols et garages
- **NMD90** : Câble non métallique gainé standard
- **TECK90** : Câble blindé pour usage extérieur et humide

### Tableau de distribution

Le panneau électrique (tableau de distribution) est le cœur de l'installation :

- **Entrée principale** : Généralement 100 A ou 200 A
- **Disjoncteurs** : Chaque circuit est protégé par un disjoncteur calibré
- **Barre neutre** : Retour du courant vers le transformateur
- **Barre de mise à la terre** : Liaison avec le système de mise à la terre

## Circuits résidentiels types

### Circuits d'éclairage (15 A)
- Fil 14 AWG sur disjoncteur 15 A
- Maximum 12 luminaires par circuit (selon la puissance)
- Interrupteurs unipolaires, à 3 voies ou à 4 voies

### Circuits de prises générales (15 A)
- Fil 14 AWG sur disjoncteur 15 A
- Maximum 12 prises par circuit
- Espacement : pas plus de 1,8 m entre les prises

### Circuits de cuisine (20 A)
- Fil 12 AWG sur disjoncteur 20 A
- Minimum 2 circuits de prises de comptoir
- Prises avec protection DDFT (détecteur de défaut de terre requises)

### Circuits spécialisés (30 A et plus)
- Sécheuse : 30 A, 240 V, fil 10 AWG
- Cuisinière : 40 A, 240 V, fil 8 AWG
- Chauffe-eau : 30 A, 240 V
- Pompe à chaleur : selon la puissance

## Mise à la terre et liaison équipotentielle

La mise à la terre est cruciale pour la sécurité :

- **Électrode de terre** : Tige de cuivre de 3 m enfoncée dans le sol
- **Conducteur de liaison** : Relie le panneau électrique aux canalisations métalliques
- **Mise à la terre des prises** : Troisième broche reliée à la terre

## Règles de sécurité essentielles

1. Toujours couper l'alimentation avant de travailler sur un circuit
2. Utiliser des outils isolés homologués
3. Respecter les distances de dégagement autour du panneau (1 m minimum)
4. Ne jamais surcharger un circuit au-delà de sa capacité nominale
5. Tous les travaux doivent être inspectés par la RBQ`,
    4: `# Protection des Circuits — Disjoncteurs et Fusibles

## Introduction

La protection des circuits est un élément fondamental de toute installation électrique. Les dispositifs de protection ont pour fonction d'interrompre automatiquement le courant en cas de défaut ou de surcharge, protégeant ainsi les personnes, les biens et les équipements.

## Types de surintensités

### Surcharge
Une surcharge survient lorsqu'un circuit transporte un courant supérieur à sa capacité nominale pendant une période prolongée. Cela se produit généralement lorsqu'on branche trop d'appareils sur un même circuit.

### Court-circuit
Un court-circuit est une connexion accidentelle entre deux conducteurs de tensions différentes. L'impédance devient très faible, ce qui permet un courant extrêmement élevé.

### Défaut à la terre
Un défaut à la terre se produit lorsqu'un conducteur sous tension entre en contact avec une surface mise à la terre ou avec le conducteur de terre.

## Disjoncteurs

### Disjoncteur standard
Protège contre les surcharges et les courts-circuits. Il comprend :
- **Déclencheur thermique** : Lame bimétallique qui se déforme sous l'effet de la chaleur (surcharge)
- **Déclencheur magnétique** : Bobine qui réagit aux courants de court-circuit

### Disjoncteur DDFT (GFCI)
Le détecteur de défaut de terre (DDFT) coupe le circuit lorsqu'il détecte une différence de courant entre le fil sous tension et le fil neutre (aussi faible que 5 mA). Obligatoire dans :
- Salles de bain
- Cuisines
- Sous-sols
- Extérieur
- Garages

### Disjoncteur DFARC (AFCI)
Le détecteur d'arc électrique (DFARC) détecte les arcs électriques dangereux qui pourraient causer un incendie. Obligatoire dans :
- Chambres à coucher
- Pièces de séjour
- Circuits d'éclairage

## Fusibles

Bien que moins courants aujourd'hui, les fusibles existent encore :
- **Fusible à cartouche** : Pour applications industrielles
- **Fusible à vis (type Edisson)** : Anciennes installations résidentielles
- **Fusible à haut pouvoir de coupure** : Pour applications spéciales

## Calibrage des protections

Le calibre du disjoncteur doit correspondre à la capacité du conducteur :

| Calibre du fil | Capacité max | Protection recommandée |
|----------------|-------------|----------------------|
| 14 AWG | 15 A | 15 A |
| 12 AWG | 20 A | 20 A |
| 10 AWG | 30 A | 30 A |
| 8 AWG | 40 A | 40 A |
| 6 AWG | 55 A | 50 A ou 60 A |

## Sélectivité et coordination

La coordination des protections permet d'isoler un défaut sans couper l'alimentation des autres circuits. En pratique :
- Le disjoncteur de branche doit sauter avant le disjoncteur principal
- Les dispositifs en amont doivent avoir un calibre supérieur ou un délai plus long

## Entretien et inspection

- Tester mensuellement les DDFT en appuyant sur le bouton « Test »
- Vérifier visuellement les signes de surchauffe
- Ne jamais remplacer un disjoncteur par un calibre supérieur à celui autorisé
- Faire inspecter le panneau électrique par un professionnel`,
    5: `# Moteurs Électriques — Principes et Installations

## Introduction

Les moteurs électriques transforment l'énergie électrique en énergie mécanique. Ils sont omniprésents dans l'industrie, le commerce et les résidences. Pour un électricien, comprendre leur fonctionnement et leur installation est essentiel.

## Principes de fonctionnement

Un moteur électrique repose sur le principe qu'un conducteur parcouru par un courant dans un champ magnétique subit une force (principe de Lorentz). Les composants principaux sont :

- **Stator** : Partie fixe qui génère le champ magnétique
- **Rotor** : Partie rotative qui produit le couple
- **Collecteur ou bagues** : Assure la transmission du courant au rotor
- **Balais (moteurs à courant continu)** : Contacts glissants

## Types de moteurs

### Moteur à courant continu (CC)
- **Moteur série** : Fort couple de démarrage (grues, treuils)
- **Moteur shunt** : Vitesse constante (machines-outils)
- **Moteur compound** : Combinaison des deux précédents

### Moteur à courant alternatif (CA)
- **Moteur asynchrone (induction)** : Le plus répandu dans l'industrie
  - À cage d'écureuil : Simple, robuste, sans balais
  - À rotor bobiné : Contrôle de vitesse possible
- **Moteur synchrone** : Vitesse exactement synchronisée avec la fréquence du réseau
- **Moteur universel** : Fonctionne sur CC et CA (outils électriques)

## Protection des moteurs

La protection d'un moteur électrique est plus complexe qu'un simple circuit d'éclairage :

### Protection contre les surcharges
- Relais thermique (bilame) : Protège contre les surcharges prolongées
- Sonde PTC/CTP : Détection directe de la température du bobinage

### Protection contre les courts-circuits
- Fusibles ou disjoncteurs magnétiques
- Calcul du courant de court-circuit disponible

### Protection contre la perte de phase
Relais de phase qui coupe le moteur si une phase manque (pour moteurs triphasés)

## Démarrage des moteurs

### Démarrage direct
Le plus simple mais avec un appel de courant très élevé (5-8× le courant nominal)

### Démarrage étoile-triangle
Pour moteurs triphasés, divise le courant de démarrage par 3

### Démarrage progressif (soft starter)
Augmente progressivement la tension appliquée au moteur

### Variateur de fréquence (VFD/VSD)
Contrôle la vitesse du moteur en faisant varier la fréquence d'alimentation

## Câblage et installation

- Conducteurs dimensionnés à 125% du courant nominal du moteur
- Disjoncteur dimensionné selon le courant de démarrage
- Sectionneur visible à proximité du moteur
- Mise à la terre du châssis obligatoire

## Maintenance

Les vérifications régulières incluent :
- Mesure de la résistance d'isolement (mégohmmètre)
- Vérification des roulements et de la lubrification
- Contrôle du jeu axial
- Analyse des vibrations`,
    6: `# Panneaux Solaires — Installation et Raccordement

## Introduction

L'énergie solaire photovoltaïque connaît une croissance rapide au Québec. Les électriciens doivent maîtriser les spécificités de l'installation de panneaux solaires, tant pour les systèmes raccordés au réseau que pour les systèmes autonomes.

## Principes du photovoltaïque

L'effet photovoltaïque permet de convertir directement la lumière du soleil en électricité. Une cellule photovoltaïque est constituée de matériaux semi-conducteurs (généralement du silicium) qui libèrent des électrons lorsqu'ils sont exposés à la lumière.

### Types de panneaux
- **Monocristallin** : Rendement élevé (18-22%), coût plus élevé
- **Polycristallin** : Rendement moyen (15-18%), bon rapport qualité-prix
- **Couche mince** : Rendement plus faible (10-12%), flexible

## Composants d'un système solaire

### Panneaux solaires
Génèrent du courant continu (CC) lorsqu'ils sont exposés au soleil. La puissance est mesurée en watts-crête (Wc).

### Onduleur (Inverter)
Convertit le courant continu (CC) des panneaux en courant alternatif (CA) compatible avec le réseau. Types :
- **Onduleur centralisé** : Un seul onduleur pour tout le système
- **Micro-onduleurs** : Un onduleur par panneau (meilleure tolérance à l'ombrage)
- **Onduleur hybride** : Compatible avec stockage sur batterie

### Régulateur de charge
Pour systèmes avec batteries, empêche la surcharge et la décharge profonde.

### Batteries (optionnel)
Stockage de l'énergie pour utilisation nocturne ou lors de pannes.

### Compteur bidirectionnel
Mesure l'énergie consommée du réseau et injectée dans le réseau.

## Raccordement au réseau

### Au Québec
- **Net metering** : L'énergie injectée dans le réseau est créditée
- Puissance maximale : Habituellement limitée à la puissance du raccordement
- Doit respecter la norme CSA C22.2 No. 257

### Sécurité
- Sectionneur CC entre les panneaux et l'onduleur
- Sectionneur CA entre l'onduleur et le tableau principal
- Protection contre les surtensions (parafoudres)
- Mise à la terre adéquate

## Dimensionnement

### Facteurs à considérer
- Ensoleillement annuel du site
- Orientation et inclinaison des panneaux
- Ombrage potentiel
- Consommation électrique du bâtiment

### Calcul approximatif
Pour une maison typique consommant 15 000 kWh/an au Québec :
- Besoin d'environ 12-15 kWc de panneaux
- Surface requise : environ 70-90 m²

## Normes et réglementations

- **Code de construction du Québec** : Chapitre V - Électricité
- **Régie de l'énergie** : Conditions de raccordement
- **Hydro-Québec** : Brochure sur les installations photovoltaïques
- **CNESST** : Sécurité au travail pour les installations en hauteur`,
    7: `# Systèmes de Sécurité — Câblage et Installation

## Introduction

Les systèmes de sécurité sont devenus un élément essentiel des installations électriques modernes. Que ce soit pour les alarmes incendie, les systèmes d'alarme intrusion ou la vidéosurveillance, l'électricien doit connaître les normes et les techniques d'installation.

## Alarme Incendie

### Détecteurs
- **Détecteur de fumée ionisation** : Répond aux particules invisibles (feux à combustion rapide)
- **Détecteur de fumée optique** : Répond aux particules visibles (feux à combustion lente)
- **Détecteur de chaleur** : Déclenchement à une température fixe ou à une montée rapide
- **Détecteur de monoxyde de carbone** : Détecte le CO (gaz toxique)

### Câblage
- Conducteurs 18-14 AWG selon la distance
- Boucle classe A ou classe B selon la norme
- Résistance de fin de ligne (EOL) obligatoire

### Normes
- **CAN/ULC-S524** : Installation des systèmes d'alarme incendie
- **Code de construction du Québec** : Section 3.2 - Sécurité incendie

## Alarme Intrusion

### Composants
- **Panneau de contrôle** : Cerveau du système
- **Contacts magnétiques** : Détection d'ouverture des portes/fenêtres
- **Détecteurs de mouvement (PIR)** : Détection infrarouge passive
- **Sirène** : Avertisseur sonore intérieur/extérieur
- **Clavier** : Interface de contrôle

### Câblage recommandé
- Conducteurs 22-18 AWG pour les contacts
- Câble blindé pour les détecteurs de mouvement
- Alimentation 12 VCC ou 24 VCC selon l'équipement

## Vidéosurveillance (CCTV)

### Types de caméras
- **Caméra analogique (HD-CVI/TVI)** : Transmission coaxiale, portée jusqu'à 500 m
- **Caméra IP** : Transmission réseau (PoE), haute résolution
- **Caméra PTZ** : Motorisée, panoramique, inclinaison, zoom

### Câblage
- Coaxial RG59 ou RG6 pour caméras analogiques
- Cat5e/Cat6 pour caméras IP avec alimentation PoE
- Alimentation 12 VCC ou 24 VCA selon le modèle

## Contrôle d'accès

### Composants
- **Lecteurs de cartes** : RFID, biométriques, code
- **Gâches électriques** : Déverrouillage des portes
- **Boutons de sortie** : Pour ouvrir de l'intérieur
- **Contrôleur de porte** : Gère les accès

### Câblage
- Câble 22-18 AWG pour lecteurs et boutons
- Câble 18-14 AWG pour gâches électriques (selon la puissance)
- Alimentation sécurisée avec batterie de secours

## Alimentation de secours

Tout système de sécurité doit avoir une alimentation de secours :
- Batterie au plomb scellée (12 V, 7-18 Ah)
- Autonomie minimale : 4 heures pour l'alarme intrusion
- Autonomie minimale : 24 heures pour l'alarme incendie

## Bonnes pratiques d'installation

1. Étiqueter tous les conducteurs aux deux extrémités
2. Éviter de faire passer les câbles de sécurité près de conducteurs 120 V
3. Prévoir de la slack (boucle de service) à chaque composant
4. Utiliser des connecteurs adaptés à l'environnement
5. Documenter le système (plan de câblage, schéma)`,
    8: `# Code de Construction — Électricité (Chapitre V)

## Introduction

Le Code de construction du Québec, Chapitre V — Électricité, est la référence obligatoire pour toute installation électrique au Québec. Il adopte le Code canadien de l'électricité (CCE) avec des modifications propres au Québec, publiées par la Régie du bâtiment du Québec (RBQ).

## Structure du Code

Le Code est divisé en plusieurs sections :

### Section 0 — Objet, définition et administration
Définit le champ d'application, les termes techniques et les règles d'administration.

### Section 2 — Règles générales
Couvre les exigences de base pour toutes les installations électriques :
- Mise à la terre et liaison équipotentielle
- Espaces de travail autour des équipements électriques
- Marquage et identification des conducteurs
- Protection contre les surintensités

### Section 4 — Conducteurs
- Choix des conducteurs selon la température, le type d'isolant et le nombre
- Capacité de courant (tableaux 1 à 4)
- Chute de tension maximale : 3% pour un circuit d'utilisation, 5% total

### Section 6 — Services et entrées
- Nombre minimum de circuits requis
- Dispositif principal de protection
- Dimensionnement du conducteur de service

### Section 8 — Circuits de dérivation
- Nombre maximum de prises par circuit
- Circuits de dérivation pour cuisines, buanderies
- Exigences pour les DDFT et DFARC

### Section 10 — Installation des canalisations et câbles
- Méthodes de câblage autorisées
- Supports et attaches des câbles
- Joints étanches dans les endroits humides

## Exigences spécifiques du Québec

### Modifications québécoises
- Exigences plus strictes pour les DDFT : salles de bain, cuisines, sous-sols
- Protection DFARC obligatoire dans toutes les chambres
- Distance minimale entre le plancher et les luminaires dans certains locaux

### La RBQ
La Régie du bâtiment du Québec administre le Code et délivre les licences d'entrepreneur en électricité depuis 2017 (remplaçant la CMEQ).

## Permis et inspections

Tout travail électrique important nécessite :
1. Un permis de la RBQ (pour l'entrepreneur)
2. Un permis de construction de la municipalité
3. Une inspection par la RBQ après les travaux

## Sanctions

Le non-respect du Code peut entraîner :
- Amendes pouvant atteindre plusieurs milliers de dollars
- Révocation de la licence d'entrepreneur
- Obligation de refaire les travaux non conformes
- Responsabilité civile en cas d'accident`,
    9: `# Schémas Électriques — Lecture et Interprétation

## Introduction

Les schémas électriques sont le langage universel de l'électricien. Savoir lire, interpréter et réaliser des schémas est une compétence fondamentale pour tout électricien professionnel.

## Types de schémas

### Schéma unifilaire
Représentation simplifiée où un seul trait représente tous les conducteurs d'un circuit. Utilisé pour les plans d'ensemble et les tableaux de distribution.

### Schéma multifilaire
Tous les conducteurs sont représentés individuellement. Plus détaillé, utilisé pour les circuits complexes.

### Schéma de câblage
Montre le cheminement physique des conducteurs entre les appareillages selon leur position réelle.

### Schéma de principe (logique)
Représente le fonctionnement logique du circuit sans se soucier de la disposition physique.

### Schéma architectural
Superposé au plan du bâtiment, montre l'emplacement des prises, interrupteurs et luminaires.

## Symboles normalisés

Les symboles électriques sont normalisés selon la norme CSA Z99 :

### Symboles de base
- **Interrupteur unipolaire** : Trait avec une ouverture
- **Interrupteur à 3 voies** : Trait avec deux contacts
- **Prise de courant** : Demi-cercle avec deux traits
- **Luminaire** : Croix ou cercle avec croix
- **Disjoncteur** : Trait avec un interrupteur
- **Moteur** : Cercle avec un M
- **Transformateur** : Deux bobines enroulées

### Symboles de commande
- **Contact normalement ouvert (NO)** : Deux traits parallèles
- **Contact normalement fermé (NF)** : Deux traits avec une barre oblique
- **Bouton-poussoir** : Contact avec un cercle
- **Relais** : Bobine et contact associé

## Lecture d'un schéma

### Méthodologie
1. **Identifier la source d'alimentation** : Débuter par le haut du schéma
2. **Suivre le chemin du courant** : De la source vers la charge et retour
3. **Repérer les protections** : Disjoncteurs, fusibles
4. **Analyser les circuits de commande** : Relais, contacteurs, temporisateurs
5. **Vérifier les retours** : Neutre et mise à la terre

### Convention de lecture
- L'alimentation arrive généralement par le haut
- Les circuits de puissance sont en traits épais
- Les circuits de commande sont en traits minces
- Les bornes sont numérotées pour faciliter le repérage

## Exemple : Circuit d'éclairage avec interrupteur

1. Panneau → disjoncteur 15 A → fil sous tension (noir)
2. Fil noir → interrupteur unipolaire
3. Interrupteur → fil de commutation vers le luminaire
4. Luminaire → fil neutre (blanc) vers le panneau
5. Fil de mise à la terre (vert ou nu) relie toutes les parties métalliques

## Schémas de commande moteur

Les schémas de commande moteur comprennent :
- **Circuit de puissance** : Alimentation du moteur (contacteur principal)
- **Circuit de commande** : Bobine du contacteur, boutons démarrage/arrêt
- **Circuit de signalisation** : Voyants, alarmes
- **Protections** : Relais thermique, fusibles

## Logiciels de schémas

Les électriciens modernes utilisent des logiciels comme AutoCAD Electrical, SolidWorks Electrical ou des outils gratuits comme QElectroTech.`,
    10: `# Calculs de Charge — Dimensionnement des Installations

## Introduction

Les calculs de charge sont essentiels pour dimensionner correctement une installation électrique. Ils permettent de déterminer la puissance nécessaire, la taille des conducteurs, le calibre des protections et la capacité du panneau de distribution.

## Concepts fondamentaux

### Charge électrique
La charge est la puissance consommée par les appareils et l'éclairage. Elle s'exprime en watts (W) ou en voltampères (VA).

### Facteur de demande
Coefficient qui réduit la charge totale installée, car tous les appareils ne fonctionnent pas simultanément. Le Code précise les facteurs applicables selon le type d'installation.

### Calcul de puissance
- **Monophasé** : P = V × I × cos φ
- **Triphasé** : P = √3 × V × I × cos φ

## Méthode de calcul selon le Code

### Étape 1 : Calcul de l'éclairage général
- Résidentiel : 33 VA/m² de surface habitable (minimum)
- Commercial : 22 VA/m² à 40 VA/m² selon le type de local

### Étape 2 : Circuits de prises
- Chaque prise comptée à 150 VA dans les calculs de charge
- Maximum 12 prises par circuit de 15 A

### Étape 3 : Gros appareils
- Cuisinière : 8 000 W à 12 000 W selon la taille
- Sécheuse : 5 000 W
- Chauffe-eau : 3 000 W à 4 500 W
- Pompe thermopompe : Selon la fiche technique

### Étape 4 : Facteur de demande
- Éclairage : 100% des premiers 2 000 VA, 35% du reste
- Prises : 100% des premiers 10 000 VA, 50% du reste
- Cuisinière : Tableau 8 du Code (selon la puissance)

### Étape 5 : Calcul du service principal
Total de la charge après application des facteurs de demande.

## Exemple de calcul résidentiel

**Maison de 200 m² avec :**
- Éclairage : 200 m² × 33 VA/m² = 6 600 VA
- Prises : 15 circuits × 12 prises × 150 VA = 27 000 VA (avant facteur)
- Cuisinière : 10 000 W
- Sécheuse : 5 000 W
- Chauffe-eau : 3 500 W

**Application des facteurs de demande :**
- Éclairage : 2 000 VA + (4 600 VA × 35%) = 3 610 VA
- Prises : 10 000 VA + (17 000 VA × 50%) = 18 500 VA
- Cuisinière : selon tableau (environ 6 500 VA)

**Total estimé :** Environ 40 000 VA = 167 A à 240 V
→ Généreusement, un service de 200 A est recommandé

## Dimensionnement des conducteurs

Une fois la charge calculée, on dimensionne les conducteurs :
- Capacité de courant (ampacité) selon les tableaux 1 à 4 du Code
- Correction pour la température ambiante
- Correction pour le nombre de conducteurs dans le même conduit
- Chute de tension maximale de 3%

## Logiciels de calcul

Des outils comme le « Guide de calcul de charge résidentielle » de la RBQ ou les logiciels des fabricants facilitent ces calculs, mais la compréhension des principes reste essentielle.

## Erreurs courantes à éviter

1. Oublier d'appliquer les facteurs de demande
2. Sous-estimer les charges de chauffage
3. Négliger les charges futures prévisibles
4. Confondre puissance installée et puissance demandée`,
  };

  return contents[chapterNumber] || `# Chapitre ${chapterNumber}\n\nContenu théorique à venir.`;
}

// ─── Questions for each chapter (5+ MCQ per chapter) ─────────────

interface SeedQuestion {
  question: string;
  options: string[];
  answer: string;
  difficulty: string;
  explanation: string;
}

function getQuestionsForChapter(chapterNumber: number): SeedQuestion[] {
  const questions: Record<number, SeedQuestion[]> = {
    1: [
      {
        question: "Quelle est la formule de la loi d'Ohm ?",
        options: ['V = R × I', 'V = R / I', 'V = I / R', 'V = R + I'],
        answer: 'V = R × I',
        difficulty: 'EASY',
        explanation: "La loi d'Ohm stipule que la tension (V) est égale au produit du courant (I) et de la résistance (R) : V = R × I.",
      },
      {
        question: 'Un circuit de 120 V alimente une résistance de 30 Ω. Quel est le courant ?',
        options: ['2 A', '4 A', '6 A', '8 A'],
        answer: '4 A',
        difficulty: 'EASY',
        explanation: "I = V / R = 120 V / 30 Ω = 4 A. C'est l'application directe de la loi d'Ohm.",
      },
      {
        question: 'Un appareil consomme 5 A sous 120 V. Quelle est sa puissance ?',
        options: ['120 W', '300 W', '500 W', '600 W'],
        answer: '600 W',
        difficulty: 'MEDIUM',
        explanation: 'P = V × I = 120 V × 5 A = 600 W. La puissance est le produit de la tension et du courant.',
      },
      {
        question: "Un chauffe-eau de 4 500 W fonctionne sur 240 V. Quel est le courant approximatif ?",
        options: ["15,75 A", "18,75 A", "20,5 A", "22,25 A"],
        answer: '18,75 A',
        difficulty: 'MEDIUM',
        explanation: 'I = P / V = 4 500 W / 240 V = 18,75 A.',
      },
      {
        question: "Quel type de composant ne suit PAS la loi d'Ohm ?",
        options: ['Une résistance fixe', 'Un fil conducteur', 'Une diode', 'Un radiateur électrique'],
        answer: 'Une diode',
        difficulty: 'HARD',
        explanation: 'Les diodes sont des composants non-linéaires : leur résistance varie avec la tension appliquée.',
      },
    ],
    2: [
      {
        question: 'Quelle est la fréquence standard du courant alternatif au Québec ?',
        options: ['50 Hz', '60 Hz', '100 Hz', '120 Hz'],
        answer: '60 Hz',
        difficulty: 'EASY',
        explanation: 'Au Canada et au Québec, la fréquence standard est de 60 Hz. En Europe et en Asie, elle est de 50 Hz.',
      },
      {
        question: 'Un circuit en parallèle avec 3 résistances de 10 Ω, 20 Ω et 30 Ω a une résistance totale de :',
        options: ["5,45 Ω", "10 Ω", "20 Ω", "60 Ω"],
        answer: '5,45 Ω',
        difficulty: 'MEDIUM',
        explanation: "1/Rt = 1/10 + 1/20 + 1/30 = 0,1 + 0,05 + 0,033 = 0,183. Donc Rt = 1/0,183 = 5,45 Ω.",
      },
      {
        question: 'Dans un circuit en série de 3 résistances identiques, la tension se répartit :',
        options: ['Également entre les résistances', "Uniquement sur la première", "Uniquement sur la dernière", "Aléatoirement"],
        answer: 'Également entre les résistances',
        difficulty: 'EASY',
        explanation: "Dans un circuit série, le courant est identique partout, donc la tension se divise proportionnellement à chaque résistance.",
      },
      {
        question: 'Quelle est la tension de crête pour un circuit 120 V CA ?',
        options: ['120 V', '150 V', '170 V', '200 V'],
        answer: '170 V',
        difficulty: 'MEDIUM',
        explanation: 'Vmax = Vrms × √2 ≈ 120 V × 1,414 ≈ 170 V.',
      },
      {
        question: 'Pourquoi le courant alternatif est-il préféré pour le transport d\'électricité ?',
        options: ['Il est moins dangereux', 'On peut le transformer facilement', 'Il ne perd pas d\'énergie', 'Il est plus rapide'],
        answer: 'On peut le transformer facilement',
        difficulty: 'MEDIUM',
        explanation: 'Le CA permet d\'utiliser des transformateurs pour élever la tension (réduire les pertes) lors du transport longue distance.',
      },
    ],
    3: [
      {
        question: 'Quel calibre de fil est requis pour un circuit de cuisson de 40 A ?',
        options: ['14 AWG', '12 AWG', '10 AWG', '8 AWG'],
        answer: '8 AWG',
        difficulty: 'MEDIUM',
        explanation: 'Un circuit de 40 A nécessite un conducteur 8 AWG dont la capacité nominale est d\'au moins 40 A.',
      },
      {
        question: 'Espacement maximal entre deux prises dans un salon résidentiel :',
        options: ['1,2 m', '1,8 m', '2,4 m', '3,0 m'],
        answer: '1,8 m',
        difficulty: 'MEDIUM',
        explanation: "Le Code exige que l'espacement entre deux prises ne dépasse pas 1,8 m dans les pièces de séjour.",
      },
      {
        question: "Quel type de câble est recommandé pour un sous-sol ou garage ?",
        options: ['NM-B (Romex)', 'AC90 (armé)', 'NMD90', 'TECK90'],
        answer: 'AC90 (armé)',
        difficulty: 'MEDIUM',
        explanation: "Le câble AC90 (armé) est recommandé pour les sous-sols et garages car il offre une protection mécanique supplémentaire.",
      },
      {
        question: "Quel est le calibre minimal du service électrique pour une maison neuve au Québec ?",
        options: ['60 A', '100 A', '150 A', '200 A'],
        answer: '100 A',
        difficulty: 'EASY',
        explanation: "Le Code exige un minimum de 100 A pour les maisons unifamiliales neuves au Québec.",
      },
      {
        question: 'Quelles pièces exigent des prises avec protection DDFT ?',
        options: ['Chambres et salon', 'Salle de bain et cuisine', 'Débarras et garage', 'Toutes les pièces'],
        answer: 'Salle de bain et cuisine',
        difficulty: 'EASY',
        explanation: 'Les salles de bain et les cuisines exigent des DDFT car ce sont des pièces humides.',
      },
    ],
    4: [
      {
        question: 'Quel dispositif protège contre les arcs électriques ?',
        options: ['DDFT (GFCI)', 'DFARC (AFCI)', 'Disjoncteur standard', 'Fusible'],
        answer: 'DFARC (AFCI)',
        difficulty: 'MEDIUM',
        explanation: "Le Détecteur d'Arc (DFARC/AFCI) détecte les arcs électriques dangereux pouvant causer un incendie.",
      },
      {
        question: 'Quel calibre de disjoncteur pour un fil 14 AWG ?',
        options: ['10 A', '15 A', '20 A', '30 A'],
        answer: '15 A',
        difficulty: 'EASY',
        explanation: 'Un conducteur 14 AWG a une capacité de 15 A, donc le disjoncteur doit être de 15 A maximum.',
      },
      {
        question: 'La différence entre un défaut de terre et un court-circuit est que :',
        options: ['Ils sont identiques', "Le défaut implique la terre, le court-circuit implique deux conducteurs", 'Le court-circuit est moins dangereux', "Le défaut se produit à basse tension"],
        answer: 'Le défaut implique la terre, le court-circuit implique deux conducteurs',
        difficulty: 'MEDIUM',
        explanation: 'Un défaut à la terre implique un conducteur sous tension et une surface mise à la terre, alors qu\'un court-circuit implique deux conducteurs.',
      },
      {
        question: "À quelle fréquence faut-il tester les DDFT ?",
        options: ['Jamais', 'Mensuellement', 'Annuellement', 'Lors de chaque inspection'],
        answer: 'Mensuellement',
        difficulty: 'EASY',
        explanation: 'Les DDFT doivent être testés mensuellement en appuyant sur le bouton « Test » pour assurer leur bon fonctionnement.',
      },
      {
        question: 'Quel courant de fuite déclenche un DDFT typique ?',
        options: ['1 mA', '5 mA', '10 mA', '30 mA'],
        answer: '5 mA',
        difficulty: 'MEDIUM',
        explanation: 'Un DDFT standard se déclenche lorsqu\'il détecte un courant de fuite aussi faible que 5 mA.',
      },
    ],
    5: [
      {
        question: "Quel est le type de moteur le plus répandu dans l'industrie ?",
        options: ['Moteur synchrone', 'Moteur asynchrone à cage d\'écureuil', 'Moteur à courant continu', 'Moteur universel'],
        answer: 'Moteur asynchrone à cage d\'écureuil',
        difficulty: 'MEDIUM',
        explanation: 'Le moteur asynchrone à cage d\'écureuil est le plus répandu en raison de sa simplicité, sa robustesse et son faible coût.',
      },
      {
        question: 'Quel est l\'appel de courant typique d\'un moteur au démarrage ?',
        options: ['1-2× le courant nominal', '3-4× le courant nominal', '5-8× le courant nominal', '10-15× le courant nominal'],
        answer: '5-8× le courant nominal',
        difficulty: 'MEDIUM',
        explanation: 'Au démarrage, un moteur asynchrone peut tirer 5 à 8 fois son courant nominal en raison de l\'absence de contre-électromotrice.',
      },
      {
        question: 'À quel pourcentage le conducteur d\'alimentation d\'un moteur doit-il être dimensionné ?',
        options: ['100% du courant nominal', '115% du courant nominal', '125% du courant nominal', '150% du courant nominal'],
        answer: '125% du courant nominal',
        difficulty: 'MEDIUM',
        explanation: "Le Code exige que les conducteurs d'alimentation d'un moteur soient dimensionnés à 125% du courant nominal.",
      },
      {
        question: 'Un moteur synchrone se distingue par :',
        options: ['Sa vitesse variable', 'Sa vitesse constante synchrone avec la fréquence', 'Son faible coût', 'Sa petite taille'],
        answer: 'Sa vitesse constante synchrone avec la fréquence',
        difficulty: 'HARD',
        explanation: 'Le moteur synchrone tourne exactement à la vitesse du champ magnétique tournant, déterminée par la fréquence du réseau.',
      },
      {
        question: 'Quel dispositif permet de faire varier la vitesse d\'un moteur CA ?',
        options: ['Relais thermique', 'Contacteur', 'Variateur de fréquence (VFD)', 'Transformateur'],
        answer: 'Variateur de fréquence (VFD)',
        difficulty: 'EASY',
        explanation: 'Le variateur de fréquence (VFD/VSD) contrôle la vitesse en faisant varier la fréquence et la tension d\'alimentation.',
      },
    ],
    6: [
      {
        question: 'Quel type de panneau solaire offre le meilleur rendement ?',
        options: ['Polycristallin', 'Monocristallin', 'Couche mince', 'Amorphe'],
        answer: 'Monocristallin',
        difficulty: 'EASY',
        explanation: "Les panneaux monocristallins offrent le meilleur rendement (18-22%) car ils sont fabriqués à partir d'un seul cristal de silicium.",
      },
      {
        question: "À quoi sert un onduleur dans un système solaire ?",
        options: ['Produire de l\'électricité', 'Convertir le CC en CA', 'Stocker l\'énergie', 'Réguler la température'],
        answer: 'Convertir le CC en CA',
        difficulty: 'EASY',
        explanation: "L'onduleur convertit le courant continu (CC) produit par les panneaux en courant alternatif (CA) compatible avec le réseau.",
      },
      {
        question: 'Qu\'est-ce que le « net metering » au Québec ?',
        options: ['Un type de panneau', 'Un crédit pour l\'énergie injectée dans le réseau', 'Un dispositif de sécurité', 'Un type de batterie'],
        answer: 'Un crédit pour l\'énergie injectée dans le réseau',
        difficulty: 'MEDIUM',
        explanation: 'Le net metering permet aux producteurs solaires de recevoir un crédit pour l\'électricité qu\'ils injectent dans le réseau.',
      },
      {
        question: 'Quel composant empêche la surcharge et la décharge profonde des batteries solaires ?',
        options: ['Onduleur', 'Régulateur de charge', 'Compteur bidirectionnel', 'Disjoncteur'],
        answer: 'Régulateur de charge',
        difficulty: 'MEDIUM',
        explanation: 'Le régulateur de charge protège les batteries contre la surcharge et la décharge profonde, prolongeant leur durée de vie.',
      },
      {
        question: "Quel sectionneur est requis entre les panneaux et l'onduleur ?",
        options: ['Aucun', 'Sectionneur CC uniquement', 'Sectionneur CA uniquement', 'Sectionneurs CC et CA'],
        answer: 'Sectionneur CC uniquement',
        difficulty: 'HARD',
        explanation: 'Un sectionneur CC est requis entre les panneaux et l\'onduleur pour permettre la coupure de l\'alimentation en courant continu.',
      },
    ],
    7: [
      {
        question: 'Quels types de détecteurs d\'incendie sont les plus courants ?',
        options: ['Ionisation et optique', 'Thermique et barrière', 'Laser et ultrason', 'Capacitif et magnétique'],
        answer: 'Ionisation et optique',
        difficulty: 'EASY',
        explanation: 'Les deux types principaux de détecteurs de fumée sont les détecteurs à ionisation et les détecteurs optiques (photodétecteurs).',
      },
      {
        question: 'Quelle norme régit l\'installation des systèmes d\'alarme incendie au Canada ?',
        options: ['CSA C22.1', 'CAN/ULC-S524', 'CAN/ULC-S301', 'CSA B44'],
        answer: 'CAN/ULC-S524',
        difficulty: 'HARD',
        explanation: "La norme CAN/ULC-S524 est la norme d'installation des systèmes d'alarme incendie au Canada.",
      },
      {
        question: 'Quel type de câble est recommandé pour les détecteurs de mouvement (PIR) ?',
        options: ['Câble non blindé', 'Câble blindé', 'Câble coaxial', 'Fil de terre'],
        answer: 'Câble blindé',
        difficulty: 'MEDIUM',
        explanation: 'Les détecteurs de mouvement nécessitent un câble blindé pour éviter les interférences électromagnétiques.',
      },
      {
        question: "Quelle autonomie minimale est requise pour l'alarme incendie ?",
        options: ['4 heures', '12 heures', '24 heures', '48 heures'],
        answer: '24 heures',
        difficulty: 'MEDIUM',
        explanation: "Les normes exigent une autonomie minimale de 24 heures pour l'alimentation de secours des systèmes d'alarme incendie.",
      },
      {
        question: "Qu'est-ce qu'une boucle de Classe A dans un système d'alarme ?",
        options: ['Une boucle sans fin de ligne', 'Une boucle avec retour au panneau', 'Une boucle ouverte', 'Une boucle sans résistance'],
        answer: 'Une boucle avec retour au panneau',
        difficulty: 'HARD',
        explanation: 'Une boucle Classe A a un chemin de retour au panneau de contrôle, assurant que le circuit reste fonctionnel même après une rupture.',
      },
    ],
    8: [
      {
        question: "Quel organisme administre le Code de construction du Québec, Chapitre V — Électricité ?",
        options: ['CMEQ', 'RBQ', 'Hydro-Québec', 'CNESST'],
        answer: 'RBQ',
        difficulty: 'EASY',
        explanation: "Depuis 2017, la Régie du bâtiment du Québec (RBQ) administre le Code de construction du Québec, Chapitre V — Électricité.",
      },
      {
        question: 'Quelle est la chute de tension maximale permise pour un circuit d\'utilisation ?',
        options: ['1%', '3%', '5%', '10%'],
        answer: '3%',
        difficulty: 'MEDIUM',
        explanation: "Le Code limite la chute de tension à 3% pour un circuit d'utilisation et à 5% au total entre le panneau et la charge.",
      },
      {
        question: 'Quels types de locaux exigent une protection DFARC au Québec ?',
        options: ['Sous-sols et garages', 'Chambres à coucher et pièces de séjour', 'Cuisines et salles de bain', 'Extérieurs seulement'],
        answer: 'Chambres à coucher et pièces de séjour',
        difficulty: 'MEDIUM',
        explanation: 'La protection DFARC est obligatoire dans les chambres à coucher et les pièces de séjour pour prévenir les incendies d\'origine électrique.',
      },
      {
        question: 'Quelles sont les conséquences du non-respect du Code de construction ?',
        options: ['Simple avertissement', 'Amendes, révocation de licence et refonte', 'Aucune conséquence', 'Prime réduite d\'assurance'],
        answer: 'Amendes, révocation de licence et refonte',
        difficulty: 'EASY',
        explanation: 'Le non-respect peut entraîner des amendes, la révocation de la licence et l\'obligation de refaire les travaux.',
      },
      {
        question: "Qui inspecte les travaux électriques au Québec ?",
        options: ["L'entrepreneur lui-même", 'Hydro-Québec', 'La RBQ', 'La CMMTQ'],
        answer: 'La RBQ',
        difficulty: 'EASY',
        explanation: 'La RBQ est responsable de l\'inspection des travaux électriques pour vérifier la conformité au Code.',
      },
    ],
    9: [
      {
        question: "Quel type de schéma montre le cheminement physique des conducteurs ?",
        options: ['Schéma unifilaire', 'Schéma multifilaire', 'Schéma de câblage', 'Schéma de principe'],
        answer: 'Schéma de câblage',
        difficulty: 'MEDIUM',
        explanation: 'Le schéma de câblage représente le cheminement physique réel des conducteurs entre les appareillages.',
      },
      {
        question: 'Dans un schéma de commande moteur, les circuits de puissance sont généralement représentés par :',
        options: ['Des traits minces', 'Des traits épais', 'Des pointillés', 'Des traits de couleur rouge'],
        answer: 'Des traits épais',
        difficulty: 'MEDIUM',
        explanation: 'Dans les schémas électriques, les circuits de puissance (fort courant) sont en traits épais, tandis que les circuits de commande sont en traits minces.',
      },
      {
        question: 'Quel symbole représente un contact normalement ouvert (NO) ?',
        options: ['Deux traits séparés', 'Deux traits avec une barre', 'Un cercle avec une croix', 'Un triangle'],
        answer: 'Deux traits séparés',
        difficulty: 'EASY',
        explanation: 'Le contact normalement ouvert (NO) est représenté par deux traits parallèles séparés. Le contact se ferme lorsqu\'il est actionné.',
      },
      {
        question: "Quel fil est utilisé pour le retour du courant vers le panneau (neutre) ?",
        options: ['Noir', 'Rouge', 'Blanc', 'Vert'],
        answer: 'Blanc',
        difficulty: 'EASY',
        explanation: 'Au Canada, le conducteur neutre est identifié par la couleur blanche (ou grise). Il assure le retour du courant vers la source.',
      },
      {
        question: "Comment les bornes sont-elles généralement identifiées dans un schéma électrique ?",
        options: ['Par des lettres', 'Par des numéros', 'Par des couleurs', 'Par des symboles'],
        answer: 'Par des numéros',
        difficulty: 'MEDIUM',
        explanation: 'Les bornes sont numérotées dans les schémas électriques pour faciliter le repérage et le câblage.',
      },
    ],
    10: [
      {
        question: "Quelle est la charge de calcul minimale pour l'éclairage résidentiel en VA/m² ?",
        options: ['22 VA/m²', '33 VA/m²', '40 VA/m²', '50 VA/m²'],
        answer: '33 VA/m²',
        difficulty: 'MEDIUM',
        explanation: "Le Code exige un minimum de 33 VA par mètre carré de surface habitable pour l'éclairage résidentiel.",
      },
      {
        question: 'Quel facteur de demande s\'applique à l\'éclairage résidentiel au-delà des premiers 2 000 VA ?',
        options: ['100%', '75%', '50%', '35%'],
        answer: '35%',
        difficulty: 'HARD',
        explanation: "Pour l'éclairage résidentiel, on applique 100% sur les premiers 2 000 VA et 35% sur le reste.",
      },
      {
        question: 'Quelle puissance typique est attribuée à une cuisinière électrique ?',
        options: ['5 000 W', '8 000-12 000 W', '15 000 W', '20 000 W'],
        answer: '8 000-12 000 W',
        difficulty: 'MEDIUM',
        explanation: 'Une cuisinière électrique typique a une puissance installée de 8 000 à 12 000 W selon sa taille et ses fonctionnalités.',
      },
      {
        question: "Quel est le courant approximatif pour une charge de 40 000 VA sur 240 V ?",
        options: ['100 A', '150 A', '167 A', '200 A'],
        answer: '167 A',
        difficulty: 'MEDIUM',
        explanation: 'I = P / V = 40 000 VA / 240 V ≈ 167 A. Un service de 200 A serait recommandé.',
      },
      {
        question: "Qu'est-ce qu'un facteur de demande ?",
        options: ['La puissance totale installée', 'Un coefficient réduisant la charge totale', 'La tension nominale', 'La capacité du disjoncteur'],
        answer: 'Un coefficient réduisant la charge totale',
        difficulty: 'EASY',
        explanation: 'Le facteur de demande est un coefficient qui réduit la charge totale installée, car tous les appareils ne fonctionnent pas simultanément.',
      },
    ],
  };

  return questions[chapterNumber] || [];
}
