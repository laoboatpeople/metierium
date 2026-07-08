import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Check if data already exists
  const existingTrades = await prisma.trade.count();
  if (existingTrades > 0) {
    console.log('⚠️  Database already contains trades. Clearing before reseed...');
    await prisma.question.deleteMany();
    await prisma.chapter.deleteMany();
    await prisma.trade.deleteMany();
    console.log('✅ Cleared existing data.');
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

  console.log(`✅ Trades created: CMEQ (${cmeg.id}), CMMTQ (${cmmtq.id}), QBQ (${qbq.id})`);

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

  const createdChapters: { number: number; id: string }[] = [];

  for (const ch of chapters) {
    const created = await prisma.chapter.create({
      data: {
        tradeId: cmeg.id,
        number: ch.number,
        name: ch.name,
        nameFr: ch.nameFr,
        theoryContent: getTheoryContent(ch.number),
      },
    });
    createdChapters.push({ number: created.number, id: created.id });
  }

  console.log(`✅ ${createdChapters.length} chapters created for CMEQ`);

  // ─── Create questions for each chapter ──────────────────────────
  let totalQuestions = 0;

  for (let chapterNumber = 1; chapterNumber <= 10; chapterNumber++) {
    const chapter = createdChapters.find((c) => c.number === chapterNumber);
    if (!chapter) continue;

    const questions = getQuestionsForChapter(chapterNumber);
    for (const q of questions) {
      await prisma.question.create({
        data: {
          tradeId: cmeg.id,
          chapterId: chapter.id,
          type: 'MCQ',
          difficulty: q.difficulty as any,
          question: q.question,
          options: q.options,
          answer: q.answer,
          explanation: q.explanation,
          locale: 'fr',
        },
      });
      totalQuestions++;
    }
  }

  console.log(`✅ ${totalQuestions} questions created for CMEQ`);
  console.log('🎉 Seeding complete!');
}

main()
  .catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// ─── Theory content ──────────────────────────────────────────────

function getTheoryContent(chapterNumber: number): string {
  const contents: Record<number, string> = {
    1: `# Loi d'Ohm et Puissance — Guide Complet CMEQ

## Introduction — Fondements de l'Électricité

La loi d'Ohm, formulée par le physicien allemand Georg Simon Ohm en 1827, est le principe fondamental sur lequel repose toute l'électricité. Pour l'électricien québécois, sa maîtrise est absolument essentielle : chaque calcul de dimensionnement, chaque diagnostic de panne, chaque vérification de conformité au **Code de construction du Québec, Chapitre V — Électricité** (basé sur le Code canadien de l'électricité, CCE) fait appel à cette loi.

Ce chapitre couvre en profondeur la loi d'Ohm, la loi de Joule (puissance), les circuits série et parallèle, la dissipation thermique, l'introduction à la chute de tension, et les articles du Code qui régissent ces concepts.

## Section 1 — La Loi d'Ohm : Relations Fondamentales

### 1.1 Formule de base

La loi d'Ohm s'exprime par la relation :

**V = R × I**

Où :
- **V** = Tension (volts, V) — la force électromotrice qui pousse les électrons
- **I** = Courant (ampères, A) — le débit d'électrons
- **R** = Résistance (ohms, Ω) — l'opposition au passage du courant

Cette formule se réarrange de deux façons équivalentes :

**I = V / R** — pour trouver le courant quand on connaît la tension et la résistance

**R = V / I** — pour trouver la résistance quand on connaît la tension et le courant

### 1.2 Exemples de calculs — Résidentiel

**Exemple 1 — Courant dans un radiateur :**
Un radiateur électrique de 240 V avec une résistance interne de 19,2 Ω.
I = 240 V / 19,2 Ω = **12,5 A**
→ Ce radiateur nécessite un disjoncteur de 15 A et du fil 14 AWG minimum.

**Exemple 2 — Résistance d'une plinthe :**
Une plinthe électrique de 1 500 W sous 240 V.
D'abord : I = P / V = 1500 / 240 = 6,25 A
Ensuite : R = V / I = 240 / 6,25 = **38,4 Ω**

**Exemple 3 — Chute de tension simple :**
Un circuit de 120 V alimente une charge de 10 A via 30 m de fil 12 AWG (résistance ≈ 0,159 Ω par 100 m à 60 °C).
Résistance totale du conducteur (aller-retour) : 2 × 30 m × 0,159 Ω/100 m = 0,0954 Ω
Chute de tension : ΔV = I × R = 10 A × 0,0954 Ω = **0,954 V** (0,8 % de chute — acceptable sous la limite de 3 % de l'art. 8-102)

### 1.3 Exemples de calculs — Commercial et Industriel

**Exemple commercial — Éclairage de bureau :**
Un circuit d'éclairage de 277 V (tension phase-neutre d'un système 480Y/277 V) avec 20 luminaires de 50 W chacun.
Courant total : I = P / V = (20 × 50 W) / 277 V = 1000 W / 277 V = **3,61 A**
→ On peut utiliser 14 AWG (15 A), mais on doit tenir compte de la longueur du circuit.

**Exemple industriel — Moteur triphasé :**
Un moteur de 10 HP (7,46 kW) à 575 V triphasé.
I = P / (V × √3 × cos φ) = 7460 / (575 × 1,732 × 0,85) = **8,8 A** (courant nominal)
→ Le conducteur doit être dimensionné à 125 % (art. 28-106) : 8,8 A × 1,25 = 11 A → minimum 14 AWG, mais on utilisera généralement 12 AWG pour la robustesse.

### 1.4 La roue des formules (triangle Ohm)

Il existe un moyen mnémotechnique simple : le triangle Ohm.

\`\`\`
    [ V ]
    [I R ]
\`\`\`

- V = I × R (cacher V → I et R sont côte à côte → multiplication)
- I = V / R (cacher I → V sur R → division)
- R = V / I (cacher R → V sur I → division)

## Section 2 — La Puissance Électrique (Loi de Joule)

### 2.1 Formules de puissance

La puissance électrique, ou **loi de Joule**, exprime le taux de conversion d'énergie électrique en chaleur :

**P = V × I** (Watts = Volts × Ampères)

En substituant la loi d'Ohm, on obtient deux formules dérivées :

**P = I² × R** — utile quand on connaît le courant et la résistance (dissipation dans les conducteurs)
**P = V² / R** — utile quand on connaît la tension et la résistance

### 2.2 Exemples de puissance — Multi-sectoriel

**Résidentiel :** Un chauffe-eau de 4 500 W sous 240 V.
I = P / V = 4500 / 240 = **18,75 A** → fil 10 AWG, disjoncteur 25 A

**Commercial :** Un climatiseur de 36 000 BTU (3 tonnes) avec un COP de 3,0.
Puissance électrique = Puissance frigorifique / COP = (36000 × 0,293) / 3,0 = 10548 / 3 = **3 516 W**
I = 3516 / 240 = **14,65 A** → fil 12 AWG, disjoncteur 20 A

**Industriel :** Un four électrique de 50 kW, 600 V triphasé.
I = P / (V × √3) = 50000 / (600 × 1,732) = 50000 / 1039 = **48,1 A**
→ Conducteur dimensionné à 125 % : 48,1 × 1,25 = 60,1 A → fil 6 AWG (capacité 65 A à 75 °C selon Tableau 2)
Disjoncteur : 60 A × 1,25 = 75 A → on installe un disjoncteur 70 A (calibre normalisé supérieur le plus proche permis par l'art. 14-104)

### 2.3 Dissipation thermique dans les conducteurs

La dissipation thermique (effet Joule) est cruciale à comprendre pour le dimensionnement :

**Q = I² × R × t** où t est le temps en secondes.

Pour un fil 14 AWG (R ≈ 8,45 mΩ/m à 60 °C) transportant 15 A sur 10 m :
Pdissipée = I² × R = 15² × (10 × 0,00845) = 225 × 0,0845 = **19 W** par conducteur.

En courant alternatif, il faut aussi considérer **l'effet pelliculaire (skin effect)** et **l'effet de proximité** qui augmentent la résistance effective à haute fréquence. Pour le 60 Hz, l'effet pelliculaire est négligeable pour les conducteurs jusqu'à 300 kcmil (150 mm²). Au-delà, le Code impose des conducteurs en parallèle (art. 4-022).

## Section 3 — Circuits en Série et en Parallèle

### 3.1 Circuits en série

**Caractéristiques :**
- Le courant **I** est le même dans tous les composants
- La tension se divise : **Vtotal = V1 + V2 + V3 + ...**
- La résistance totale : **Rtotal = R1 + R2 + R3 + ...**
- La puissance totale : **Ptotal = P1 + P2 + P3 + ...**

**Exemple résidentiel — Éclairage de Noël (série) :**
50 ampoules identiques (chacune R = 120 Ω) sur 120 V.
Rtotal = 50 × 120 Ω = 6 000 Ω
I = 120 V / 6 000 Ω = **0,02 A** (20 mA)
Tension par ampoule = 120 V / 50 = **2,4 V**
Puissance par ampoule = 2,4 V × 0,02 A = **0,048 W** (48 mW)

**Application pratique — Détection de pannes :**
Dans un circuit série, si un élément est ouvert (brûlé), tout le circuit cesse de fonctionner. C'est pourquoi le câblage résidentiel utilise presque exclusivement le parallèle.

### 3.2 Circuits en parallèle

**Caractéristiques :**
- La tension **V** est la même aux bornes de chaque branche
- Le courant se divise : **Itotal = I1 + I2 + I3 + ...**
- La résistance totale : **1/Rtotal = 1/R1 + 1/R2 + 1/R3 + ...**
- La puissance totale : **Ptotal = P1 + P2 + P3 + ...**

**Exemple résidentiel — Prises parallèles :**
Trois appareils branchés sur le même circuit 120 V :
- Lampe : 100 W → I = 100/120 = 0,83 A
- Téléviseur : 200 W → I = 200/120 = 1,67 A
- Ordinateur : 300 W → I = 300/120 = 2,50 A
Itotal = 0,83 + 1,67 + 2,50 = **5 A**

**Exemple industriel — Moteurs en parallèle :**
Trois moteurs de 5 HP, 575 V triphasé dans un même atelier. Chaque moteur (cos φ = 0,85, rendement η = 0,90) :
I = (5 × 746) / (575 × 1,732 × 0,85 × 0,90) = 3730 / 761 = **4,9 A**
Itotal = 3 × 4,9 = **14,7 A**
→ Le conducteur d'alimentation de l'armoire doit être dimensionné pour 14,7 A avec les facteurs de demande applicables.

### 3.3 Circuits mixtes (série-parallèle)

**Exemple pratique :** Un circuit d'éclairage avec 3 luminaires en parallèle, chaque luminaire ayant 2 ampoules en série (pour 347 V).

Chaque ampoule : 100 W, 173,5 V.
Rampoule = V²/P = 173,5²/100 = 301 Ω
Résistance par luminaire (2 en série) = 602 Ω
Résistance totale (3 luminaires en parallèle) = 602/3 = 200,7 Ω
I total = 347 V / 200,7 Ω = **1,73 A**

## Section 4 — Chute de Tension (Introduction Approfondie)

### 4.1 Principes et Code

La **chute de tension** est la réduction de tension qui se produit lorsqu'un courant traverse un conducteur ayant une résistance non nulle. L'article **8-102 du Code de construction du Québec** limite la chute de tension à :
- **3 %** maximum pour un circuit d'utilisation (branchement)
- **5 %** maximum entre le panneau de distribution et l'utilisation finale (total, incluant le feeder)

### 4.2 Formule de chute de tension

**CC :** ΔV = 2 × L × R × I (où L = longueur en m, R = résistance par mètre, facteur 2 pour l'aller-retour)

**CA monophasé :** ΔV = 2 × L × R × I × cos φ

**CA triphasé :** ΔV = √3 × L × R × I × cos φ

### 4.3 Exemples détaillés

**Exemple 1 — Rallonge de chantier :**
100 m de fil 12 AWG (R = 5,21 Ω/km) à 15 A, 120 V monophasé.
ΔV = 2 × 0,1 km × 5,21 Ω/km × 15 A = **15,63 V**
ΔV% = 15,63/120 × 100 = **13 %** → EXCESSIF ! Il faut passer au 10 AWG ou réduire la charge.

Avec 10 AWG (R = 3,28 Ω/km) :
ΔV = 2 × 0,1 × 3,28 × 15 = **9,84 V**
ΔV% = 9,84/120 × 100 = **8,2 %** → Encore trop élevé. Avec 8 AWG (R = 2,06 Ω/km) :
ΔV = 2 × 0,1 × 2,06 × 15 = **6,18 V** → 5,15 % — à la limite, acceptable si le feeder a moins de 0,15 % de chute.

**Exemple 2 — Alimentation de pompe submersible (industriel) :**
Moteur 10 HP, 575 V triphasé, 200 m de câble, courant 11 A, cos φ = 0,85.
ΔV = √3 × 0,2 km × R × 11 A × 0,85

Avec 10 AWG (R = 3,28 Ω/km) : ΔV = 1,732 × 0,2 × 3,28 × 11 × 0,85 = **10,6 V** (1,85 % — acceptable pour un moteur, car les moteurs tolèrent ±10 % selon la norme CSA et l'art. 28-010)

## Section 5 — Code de Construction du Québec — Articles Pertinents

### 5.1 Article 4-004 — Chute de tension dans les conducteurs

Cet article exige que les conducteurs soient dimensionnés pour que la chute de tension entre la source et tout point d'utilisation ne dépasse pas les limites de l'article 8-102. En pratique, cela signifie :

1. Calculer le courant maximal que le circuit doit transporter
2. Calculer la résistance du conducteur sur la longueur totale (aller-retour)
3. Calculer ΔV et vérifier qu'elle est dans les limites
4. Si ΔV dépasse 3 % (ou 5 % total), augmenter la grosseur du conducteur

### 5.2 Article 8-102 — Chute de tension

Spécifie les limites de chute de tension discutées plus haut. Important : au Québec, il n'y a pas d'amendement québécois qui modifie ces valeurs — on suit le CCE à cet égard.

### 5.3 Article 4-006 — Facteurs de correction

Lorsque plus de 3 conducteurs porteurs de courant sont groupés, la capacité de courant doit être réduite selon les **Tableaux 5A, 5B et 5C** du Code. C'est ce qu'on appelle le **facteur de groupement** ou **facteur de correction**.

**Exemple :** 6 conducteurs 12 AWG dans un même conduit (Tableau 5C — 80 % pour 4-6 conducteurs).
Capacité de base du 12 AWG (Tableau 2, 75 °C) : 25 A
Capacité corrigée : 25 A × 0,80 = **20 A** → Le disjoncteur ne doit pas dépasser 20 A.

### 5.4 Article 14-010 — Protection contre les surintensités

Tout conducteur doit être protégé contre les surintensités conformément à sa capacité de courant. Le calibre du dispositif de protection ne doit pas dépasser la capacité du conducteur, sauf exceptions prévues (certains moteurs, transformateurs).

## Section 6 — Questions d'Examen CMEQ Typiques

**Question typique 1 :** Un radiateur de 2 000 W fonctionne sous 240 V. Quel est le courant ?
**Approche :** Utiliser P = V × I → I = P / V = 2000 / 240 = **8,33 A**

**Question typique 2 :** Quelle est la résistance d'une plinthe de 1 000 W sous 240 V ?
**Approche :** D'abord I = P/V = 1000/240 = 4,17 A. Puis R = V/I = 240/4,17 = **57,6 Ω** (ou directement R = V²/P = 240²/1000 = 57,6 Ω)

**Question typique 3 :** Trois résistances de 10 Ω, 20 Ω et 30 Ω en parallèle. Résistance totale ?
**Approche :** 1/Rt = 1/10 + 1/20 + 1/30 = 6/60 + 3/60 + 2/60 = 11/60 → Rt = 60/11 = **5,45 Ω**

**Question typique 4 :** Un fil 14 AWG transporte 12 A sur 50 m à 120 V. Chute de tension ? (R 14 AWG = 8,45 Ω/km)
**Approche :** ΔV = 2 × 0,05 km × 8,45 Ω/km × 12 A = **10,14 V** = 8,45 % → Il faut augmenter le calibre à 12 AWG ou 10 AWG.

**Question typique 5 :** Un moteur de 15 HP, 575 V triphasé a un rendement de 0,88 et un facteur de puissance de 0,82. Quel est le courant nominal ?
**Approche :** I = (15 × 746) / (575 × 1,732 × 0,82 × 0,88) = 11190 / 718,6 = **15,6 A**

## Section 7 — Conseils Pratiques pour le Terrain

1. **Toujours vérifier la tension réelle** au point d'utilisation avant de poser un diagnostic — la tension mesurée peut être inférieure à la tension nominale à cause de la chute de tension.
2. **Mémoriser le triangle d'Ohm** — il vous sauvera des minutes de calcul mental sur les chantiers.
3. **Pour les longs circuits (>50 m), toujours vérifier la chute de tension** — la capacité de courant n'est jamais le seul facteur limitant.
4. **Les connexions lâches augmentent la résistance** et causent de l'échauffement localisé (effet Joule). Toujours serrer les connexions au couple recommandé.
5. **La puissance dissipée dans un conducteur = I²R** — doubler le courant quadruple la chaleur. C'est pourquoi un circuit 15 A mal protégé qui tire 30 A génère 4× la chaleur prévue.
6. **En triphasé, le calcul de courant n'oubliez pas le √3** — erreur fréquente à l'examen CMEQ.
7. **Utiliser les tableaux de l'annexe J du Code** pour les résistances de conducteurs — ils sont plus précis que les approximations en mémoire.
8. **Les charges non linéaires (LED, électronique)** génèrent des harmoniques qui augmentent l'échauffement du neutre. L'art. 4-022 impose de considérer le neutre comme conducteur sous tension dans ces cas.

## Section 8 — Sécurité et RBQ

La **Régie du bâtiment du Québec (RBQ)** exige que tous les travaux électriques respectent le Code. Les calculs de loi d'Ohm sont au cœur de chaque inspection :

- **Vérification du calibre des conducteurs** — l'inspecteur RBQ valide que le calibre correspond à la charge et à la longueur
- **Protection thermique** — les disjoncteurs doivent être calibrés pour la capacité du conducteur (art. 14-010)
- **Échauffement anormal** — détecté par thermographie infrarouge lors des inspections préventives
- **Plan de garantie** — obligatoire pour les travaux résidentiels de plus de 3 000 $ (Loi sur le bâtiment)

**Rappel important :** La **CNESST** exige que tous les travaux sous tension soient effectués par un électricien qualifié avec l'équipement de protection individuelle (EPI) approprié, incluant les gants isolés classe 00 (1 000 V max) pour les travaux sur des circuits sous tension.`,
    2: `# Circuits CC/CA — Théorie Approfondie pour l'Examen CMEQ

## Introduction

La maîtrise des circuits à courant continu (CC) et à courant alternatif (CA) est fondamentale pour l'électricien québécois. Au Québec, la distribution électrique est en CA à 60 Hz, mais de plus en plus d'équipements utilisent le CC (panneaux solaires, véhicules électriques, électronique). Ce chapitre couvre en détail les deux types de courant, leurs caractéristiques, le calcul des grandeurs CA (RMS, crête, facteur de puissance), les systèmes triphasés (120/208 V, 347/600 V), les transformateurs, et les articles du **Code de construction du Québec, Chapitre V — Électricité** (Section 26) qui les régissent.

## Section 1 — Courant Continu (CC)

### 1.1 Fondements du CC

Le courant continu est caractérisé par un flux d'électrons qui circule **toujours dans la même direction**, de la borne négative (excès d'électrons) vers la borne positive (déficit d'électrons). La tension aux bornes d'une source CC pure est constante dans le temps.

**Caractéristiques principales :**
- Tension constante : V(t) = Vmax (constante)
- Courant unidirectionnel
- Pas de fréquence (f = 0 Hz)
- La puissance est simplement P = V × I

### 1.2 Sources de CC

**Batteries :** Tension nominale typique : 12 V (automobile), 24 V (équipement industriel), 48 V (télécommunications). Une batterie au plomb-acide de 12 V a en réalité une tension à vide de 12,7 V et une tension en fin de décharge de 10,5 V.

**Panneaux solaires photovoltaïques :** Un panneau typique de 400 W produit 40 V CC à 10 A (STC — Standard Test Conditions). La tension varie avec l'ensoleillement et la température : -0,3 à -0,5 %/°C pour les panneaux monocristallins.

**Alimentations à découpage (SMPS) :** Utilisées dans tous les appareils électroniques modernes. Elles convertissent le CA en CC avec un rendement de 85-95 %. Exemple : une alimentation d'ordinateur de 500 W prend du 120 V CA et produit 3,3 V, 5 V et 12 V CC.

### 1.3 Applications CC au Québec

- **Véhicules électriques (VE) :** Bornes de recharge de niveau 2 (240 V CA, 30-50 A) qui alimentent un chargeur embarqué convertissant en CC pour la batterie (400-800 V CC)
- **Systèmes de sécurité :** Caméras IP alimentées par PoE (Power over Ethernet — 48 V CC), panneaux d'alarme (12 V CC)
- **Éclairage d'urgence :** Batteries 6 V ou 12 V avec convertisseur et luminaires à LED (typiquement 24 V CC)
- **Télécommunications :** Équipement central téléphonique en -48 V CC (historique)
- **Contrôle industriel :** Automates programmables (PLC) alimentés en 24 V CC, capteurs 24 V CC

## Section 2 — Courant Alternatif (CA) — Fondements

### 2.1 Principe de la génération CA

Le courant alternatif est produit par des alternateurs qui font tourner une bobine dans un champ magnétique. La tension générée suit une **onde sinusoïdale** :

**V(t) = Vmax × sin(ωt)**

Où :
- **Vmax** = Tension de crête (amplitude maximale)
- **ω** = Vitesse angulaire = 2πf (radians/seconde)
- **f** = Fréquence (Hz)
- **t** = Temps (secondes)

**Au Québec (Amérique du Nord) :** f = **60 Hz** (soit 60 cycles complets par seconde, 120 alternances par seconde)
**En Europe :** f = 50 Hz

### 2.2 Valeurs caractéristiques du CA

**Tension efficace (Vrms) :** La tension continue équivalente qui produirait la même puissance dans une résistance. C'est la valeur mesurée par un voltmètre standard.

**Vrms = Vmax / √2 ≈ Vmax × 0,707**

**Vmax = Vrms × √2 ≈ Vrms × 1,414**

**Exemples de calculs :**

| Tension nominale | Vrms | Vmax (crête) | Vcrête-à-crête |
|-----------------|------|-------------|----------------|
| 120 V (résidentiel) | 120 V | 170 V | 340 V |
| 208 V (triphasé) | 208 V | 294 V | 588 V |
| 240 V (résidentiel) | 240 V | 339 V | 678 V |
| 347 V (éclairage commercial) | 347 V | 491 V | 982 V |
| 480 V (industriel) | 480 V | 679 V | 1 358 V |
| 600 V (industriel) | 600 V | 849 V | 1 698 V |

**Exemple de calcul détaillé :** Un électricien mesure 347 V à un luminaire avec un voltmètre (RMS). La tension de crête est : Vmax = 347 × 1,414 = **491 V**. L'isolation du câble doit donc supporter au moins 491 V (les câbles NMD90 sont évalués à 300 V ou 600 V selon le type).

**Période :** T = 1/f = 1/60 = **16,67 ms**

### 2.3 Formes d'ondes alternatives (non sinusoïdales)

Bien que la sinusoïde soit la forme d'onde idéale, les charges non linéaires génèrent des **harmoniques** qui déforment l'onde :

- **Ondes carrées :** Produites par certains onduleurs bas de gamme
- **Ondes à créneaux (modified sine wave) :** Onduleurs économiques pour VR
- **Harmoniques :** Causées par les alimentations à découpage, les LED, les VFD. Le taux de distorsion harmonique total (THD) est réglementé par la norme IEEE 519 et mentionné dans l'art. 2-100 du Code.

**Exemple pratique :** Un variateur de fréquence (VFD) peut générer jusqu'à 30-40 % de THD sur le courant. Les filtres harmoniques ou les transformateurs à déphasage (12 pulses, 18 pulses) sont parfois nécessaires pour respecter les limites.

## Section 3 — Systèmes Triphasés

### 3.1 Principes du triphasé

Un système triphasé comporte trois tensions sinusoïdales décalées de **120°** (2π/3 radians) l'une par rapport à l'autre :

**Va = Vmax × sin(ωt)**
**Vb = Vmax × sin(ωt — 120°)**
**Vc = Vmax × sin(ωt — 240°)**

**Avantages du triphasé :**
- Transmission plus efficace (3 conducteurs au lieu de 6 pour le même transport de puissance)
- Courant réduit de 42 % par rapport au monophasé pour la même puissance (√3)
- Les moteurs triphasés sont plus simples, plus efficaces, et auto-démarrent
- Tension constante — la puissance instantanée est constante (pas de pulsation à 120 Hz)

### 3.2 Tensions triphasées au Québec

Le Québec utilise **quatre tensions triphasées standard** en fonction du type d'installation :

| Système | Phase-Phase | Phase-Neutre | Application |
|---------|-------------|--------------|-------------|
| 120/208 V | 208 V | 120 V | Petits commerces, immeubles |
| 347/600 V | 600 V | 347 V | Industrie lourde, grands bâtiments |
| 277/480 V | 480 V | 277 V | Bâtiments commerciaux, éclairage |
| 120/240 V (monophasé 3 fils) | 240 V | 120 V | Résidentiel (pas vraiment triphasé) |

**Relation phase-phase vs phase-neutre :**
**Vphase-phase = Vphase-neutre × √3**
**Vphase-neutre = Vphase-phase / √3**

**Exemple :** Dans un système 347/600 V :
- Tension phase-neutre : 347 V (alimentation d'éclairage et prises)
- Tension phase-phase : 347 V × 1,732 = **601 V** (≈ 600 V — alimentation moteurs et équipements)
- Vérification : 600 V / 1,732 = 346,4 V ≈ 347 V

### 3.3 Calcul de courant triphasé

**P = V × I × √3 × cos φ** (puissance active en watts)
**S = V × I × √3** (puissance apparente en VA)
**Q = V × I × √3 × sin φ** (puissance réactive en VAR)

**Exemple résidentiel / commercial :** Un immeuble de 12 logements avec un service de 200 A, 120/208 V triphasé.
Puissance apparente : S = 208 V × 200 A × 1,732 = **72 051 VA** (72 kVA)
Puissance active (cos φ = 0,95) : P = 72 000 × 0,95 = **68,4 kW**

**Exemple industriel :** Un moteur de 50 HP (37,3 kW), 600 V triphasé, cos φ = 0,88, rendement η = 0,92.
I = (50 × 746) / (600 × 1,732 × 0,88 × 0,92) = 37300 / 841,4 = **44,3 A**
Courant de démarrage (6 × In) : 44,3 A × 6 = **266 A** (important pour le dimensionnement des protections — art. 28-202)

### 3.4 Équilibrage des phases

Le **Code de construction du Québec, article 4-014** exige que les circuits de dérivation soient équilibrés dans la mesure du possible pour minimiser le courant dans le neutre.

**Exemple pratique :** Dans un panneau 120/208 V avec :
- Phase A : 60 A (logements 1, 4, 7, 10)
- Phase B : 55 A (logements 2, 5, 8, 11)
- Phase C : 50 A (logements 3, 6, 9, 12)

Courant dans le neutre (si charges équilibrées sans harmoniques) : In ≈ 0 A (différence vectorielle), mais avec des charges non linéaires, le neutre peut porter jusqu'à 173 % du courant de phase (triplen harmoniques — art. 4-022 exige de comptabiliser le neutre pour les charges non linéaires).

## Section 4 — Facteur de Puissance

### 4.1 Définition

Le **facteur de puissance (cos φ)** est le rapport entre la puissance active (P, en watts) et la puissance apparente (S, en voltampères) :

**cos φ = P / S**

Il représente l'efficacité avec laquelle l'énergie électrique est convertie en travail utile.

**Valeurs typiques :**
- Charge résistive pure (plinthe, radiateur) : **cos φ = 1,0**
- Moteur asynchrone à pleine charge : **cos φ = 0,80-0,90**
- Moteur asynchrone à faible charge : **cos φ = 0,30-0,50**
- Éclairage LED avec bon driver : **cos φ = 0,90-0,98**
- Éclairage fluorescent avec ballast : **cos φ = 0,50-0,90**
- Tube fluorescent T8 avec ballast électronique : **cos φ = 0,95**

### 4.2 Triangle des puissances

\`\`\`
        [ S (VA) ]
       /|
      / |
     /  | Q (VAR)
    /   |
   /    |
  [─────]
    P (W)
\`\`\`

**Relations :**
- S² = P² + Q²
- P = S × cos φ
- Q = S × sin φ

### 4.3 Exemples de calcul

**Exemple 1 : Un moteur industriel de 20 HP, 575 V triphasé, cos φ = 0,85.**
I = (20 × 746) / (575 × 1,732 × 0,85) = 14920 / 846 = **17,6 A**
P = 17,6 × 575 × 1,732 × 0,85 = **14 920 W**
S = 17,6 × 575 × 1,732 = **17 553 VA**
Q = 17,6 × 575 × 1,732 × sin(cos⁻¹(0,85)) = 17 553 × 0,527 = **9 250 VAR**

**Exemple 2 — Compensation de puissance réactive :** Pour corriger le facteur de puissance de 0,85 à 0,95, on ajoute des condensateurs :
Qc = P × (tan φ1 — tan φ2) = 14920 × (tan(31,8°) — tan(18,2°)) = 14920 × (0,620 — 0,329) = 14920 × 0,291 = **4 342 VAR**

Il faudrait installer environ **4,3 kVAR** de condensateurs par moteur. Au Québec, Hydro-Québec peut facturer des pénalités pour les facteurs de puissance inférieurs à 0,90 (selon le tarif applicable, généralement les clients de moyenne et grande puissance).

### 4.4 Conséquences d'un faible facteur de puissance

1. **Courant plus élevé** pour la même puissance active
2. **Pertes I²R augmentées** dans les conducteurs
3. **Chute de tension plus importante**
4. **Capacité du transformateur réduite**
5. **Pénalités financières** d'Hydro-Québec (tarifs M, G, LG)

## Section 5 — Transformateurs

### 5.1 Principes de base

Un transformateur utilise l'induction électromagnétique pour transférer l'énergie entre deux circuits. Le rapport de transformation est :

**Vprim / Vsec = Nprim / Nsec = a** (rapport de transformation)

Où N est le nombre de spires.

**Relation courant :** Isec / Iprim = Nprim / Nsec = a

**Puissance :** Pprim = Psec (idéalement, avec pertes : rendement η = 95-99 %)

### 5.2 Types de transformateurs rencontrés au Québec

**Transformateur de distribution :** Abaisse la tension de 25 kV (distribution Hydro-Québec) à 120/240 V (résidentiel) ou 347/600 V (industriel). Monté sur poteau ou dans un boîtier au sol. Puissance typique : 50 kVA à 300 kVA pour un quartier résidentiel.

**Transformateur d'isolement :** Utilisé dans les hôpitaux et salles blanches pour assurer la sécurité des patients (système de mise à la terre isolée — art. 24-100 du Code).

**Autotransformateur :** Utilisé pour de faibles variations de tension (ex. : 208 V → 240 V pour un climatiseur). Plus petit et moins cher qu'un transformateur à deux enroulements.

**Transformateur de mesure :** Transformateurs de potentiel (PT) et de courant (CT) utilisés avec les compteurs et les relais de protection.

### 5.3 Exemple de calcul — Transformateur résidentiel

Un transformateur de 50 kVA, 25 kV / 240-120 V, monophasé.
Vprim = 25 000 V, Vsec = 240 V (avec prise centrale à 120 V)
Iprim max = 50 000 / 25 000 = **2 A**
Isec max = 50 000 / 240 = **208 A** (par côté, 104 A par phase 120 V)

Rapport de transformation : a = 25000 / 240 = **104,2**

### 5.4 Transformateurs triphasés

Un transformateur triphasé peut être réalisé par trois transformateurs monophasés (banque de transformateurs) ou par un transformateur triphasé unique. Les couplages courants :

- **Étoile-Étoile (Y-Y) :** Simple, mais sensible aux harmoniques
- **Étoile-Triangle (Y-Δ) :** Décale la tension de 30°, utilisé pour réduire les harmoniques
- **Triangle-Étoile (Δ-Y) :** Très courant pour la distribution (ex. : 25 kV Δ → 600 V Y avec neutre accessible)
- **Triangle-Triangle (Δ-Δ) :** Pas de neutre, robuste

**Exemple — Alimentation d'usine :** Un transformateur de 500 kVA, 25 kV Δ / 600 V Y (347/600 V).
Iprim = 500 000 / (25 000 × 1,732) = **11,5 A** par phase
Isec = 500 000 / (600 × 1,732) = **481 A** par phase
Courant par phase côté 600 V : 481 A (art. 26-000 série couvre les installations de transformateurs)

## Section 6 — Code de Construction — Articles Pertinents

### 6.1 Article 26-000 — Règles générales pour les transformateurs

La **Section 26** du Code est la section qui traite des équipements électriques, incluant les transformateurs. L'article 26-010 exige que tout transformateur soit :
- Installé dans un endroit accessible
- Protégé contre les surintensités des deux côtés (primaire et secondaire)
- Ventilé adéquatement
- Installé sur une surface incombustible

### 6.2 Article 26-100 — Disjoncteurs et sectionneurs

Les transformateurs de plus de 750 VA doivent avoir un sectionneur à leur primaire. Les transformateurs de plus de 3 kVA doivent avoir un sectionneur visible ou un disjoncteur verrouillable.

### 6.3 Article 4-004 — Tensions normalisées

Cet article établit les tensions nominales des installations : 120/240 V (monophasé), 120/208 V (triphasé), 347/600 V (triphasé), 277/480 V (triphasé). Au Québec, le 347/600 V est plus répandu que le 277/480 V en raison des amendements québécois au Code.

### 6.4 Article 14-010 (via Section 26) — Protection des conducteurs

Les conducteurs au secondaire d'un transformateur doivent être protégés conformément à leur capacité. Le disjoncteur côté secondaire doit être dimensionné pour la charge réelle, mais ne doit pas dépasser la capacité des conducteurs.

## Section 7 — Questions d'Examen CMEQ Typiques

**Question 1 :** Quelle est la tension de crête d'un circuit 347 V ?
**Approche :** Vmax = Vrms × √2 = 347 × 1,414 = **491 V**

**Question 2 :** Un moteur triphasé de 25 HP, 600 V, cos φ = 0,87, η = 0,90. Quel est le courant nominal ?
**Approche :** I = (25 × 746) / (600 × 1,732 × 0,87 × 0,90) = 18650 / 814 = **22,9 A**

**Question 3 :** Dans un système 120/208 V, quelle est la tension phase-neutre ?
**Approche :** Vpn = Vpp / √3 = 208 / 1,732 = **120 V**

**Question 4 :** Quelle est la période du 60 Hz ?
**Approche :** T = 1/f = 1/60 = **16,67 ms**

**Question 5 :** Un transformateur 25 kV / 600 V. Rapport de transformation ?
**Approche :** a = 25000 / 600 = **41,67**

**Question 6 :** Trois résistances de 30 Ω en triangle sur 600 V. Courant de ligne ?
**Approche :** Courant de phase = 600 V / 30 Ω = 20 A. Courant de ligne = 20 × √3 = **34,6 A**

## Section 8 — Conseils Pratiques pour le Terrain

1. **Toujours mesurer avec un multimètre RMS** pour les circuits avec des charges non linéaires (VFD, LED). Un multimètre à moyenne (average responding) peut sous-estimer la tension réelle jusqu'à 40 % avec des ondes déformées.
2. **Le déséquilibre entre phases** ne doit pas dépasser 2-3 % entre phases (art. 4-014). Au-delà, vérifier l'équilibrage des charges.
3. **Pour les longs feeders triphasés, toujours valider la chute de tension** en triphasé (ΔV = √3 × L × R × I × cos φ) et pas en monophasé (qui sous-estimerait la chute d'un facteur 1,155).
4. **Les batteries de condensateurs (Power Factor Correction)** doivent être installées avec des fusibles ou disjoncteurs dédiés et des résistances de décharge (art. 26-200).
5. **Les transformateurs produisent de la chaleur** — ne jamais obstruer les grilles de ventilation. La température ambiante max est généralement de 40 °C (art. 26-012).
6. **Sur un système triphasé 120/208**, chaque phase peut alimenter des circuits 120 V. Les disjonctures bipolaires sont utilisés pour le 208 V (ex. : climatiseur).
7. **Les harmoniques des VFD et des LED** peuvent surcharger le neutre. L'art. 4-022 exige que le neutre soit compté comme conducteur actif pour le calcul de groupement quand plus de 50 % de la charge est non linéaire.
8. **Pour les branchements temporaires de chantier**, Hydro-Québec peut exiger un transformateur de chantier pour réduire la tension de distribution. Voir le Guide du maître électricien d'Hydro-Québec.

## Section 9 — Sécurité et Normes RBQ

- **Les transformateurs à huile** doivent être installés dans des locaux résistant au feu (2 h minimum) ou avec des systèmes de confinement (bac de rétention) selon l'art. 26-010 et le Code du bâtiment (Chapitre I).
- **L'étiquetage des panneaux** doit indiquer la tension, le courant de défaut disponible, et la date de l'étude (art. 2-004).
- **Les travaux sous tension** sont interdits sauf exceptions strictes (art. 2-006). L'équipement de protection contre l'arc électrique (EPI arc flash) est obligatoire selon la norme CSA Z462 et la CNESST.
- **Distance de approche limite (Limite d'approche) :** Pour un système 600 V et moins, la distance pour personne qualifiée est de 300 mm sans protection (NFPA 70E / CSA Z462).
- **RBQ :** Tout transformateur de plus de 112,5 kVA nécessite un plan d'ingénieur déposé à la RBQ.`,
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
- Prises avec protection DDFT requises

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
Le DDFT coupe le circuit lorsqu'il détecte une différence de courant entre le fil sous tension et le fil neutre (aussi faible que 5 mA). Obligatoire dans :
- Salles de bain
- Cuisines
- Sous-sols
- Extérieur
- Garages

### Disjoncteur DFARC (AFCI)
Le DFARC détecte les arcs électriques dangereux qui pourraient causer un incendie. Obligatoire dans :
- Chambres à coucher
- Pièces de séjour
- Circuits d'éclairage

## Fusibles

Bien que moins courants aujourd'hui, les fusibles existent encore :
- **Fusible à cartouche** : Pour applications industrielles
- **Fusible à vis (type Edison)** : Anciennes installations résidentielles
- **Fusible à haut pouvoir de coupure** : Pour applications spéciales

## Calibrage des protections

Le calibre du disjoncteur doit correspondre à la capacité du conducteur.

## Sélectivité et coordination

La coordination des protections permet d'isoler un défaut sans couper l'alimentation des autres circuits.

## Entretien et inspection

- Tester mensuellement les DDFT en appuyant sur le bouton « Test »
- Vérifier visuellement les signes de surchauffe`,
    5: `# Moteurs Électriques — Principes et Installations

## Introduction

Les moteurs électriques transforment l'énergie électrique en énergie mécanique. Ils sont omniprésents dans l'industrie, le commerce et les résidences.

## Principes de fonctionnement

Un moteur électrique repose sur le principe qu'un conducteur parcouru par un courant dans un champ magnétique subit une force (principe de Lorentz). Les composants principaux sont :

- **Stator** : Partie fixe qui génère le champ magnétique
- **Rotor** : Partie rotative qui produit le couple
- **Collecteur ou bagues** : Assure la transmission du courant au rotor

## Types de moteurs

### Moteur à courant continu (CC)
- **Moteur série** : Fort couple de démarrage (grues, treuils)
- **Moteur shunt** : Vitesse constante (machines-outils)

### Moteur à courant alternatif (CA)
- **Moteur asynchrone (induction)** : Le plus répandu dans l'industrie
- **Moteur synchrone** : Vitesse exactement synchronisée avec la fréquence du réseau
- **Moteur universel** : Fonctionne sur CC et CA (outils électriques)

## Protection des moteurs

La protection d'un moteur électrique est plus complexe qu'un simple circuit d'éclairage.

## Démarrage des moteurs

### Démarrage direct
Le plus simple mais avec un appel de courant très élevé (5-8× le courant nominal)

### Démarrage étoile-triangle
Pour moteurs triphasés, divise le courant de démarrage par 3

### Variateur de fréquence (VFD/VSD)
Contrôle la vitesse du moteur en faisant varier la fréquence d'alimentation

## Câblage et installation

- Conducteurs dimensionnés à 125% du courant nominal du moteur
- Sectionneur visible à proximité du moteur
- Mise à la terre du châssis obligatoire`,
    6: `# Panneaux Solaires — Installation et Raccordement

## Introduction

L'énergie solaire photovoltaïque connaît une croissance rapide au Québec. Les électriciens doivent maîtriser les spécificités de l'installation de panneaux solaires.

## Principes du photovoltaïque

L'effet photovoltaïque permet de convertir directement la lumière du soleil en électricité.

### Types de panneaux
- **Monocristallin** : Rendement élevé (18-22%), coût plus élevé
- **Polycristallin** : Rendement moyen (15-18%), bon rapport qualité-prix
- **Couche mince** : Rendement plus faible (10-12%), flexible

## Composants d'un système solaire

### Panneaux solaires
Génèrent du courant continu (CC) lorsqu'ils sont exposés au soleil.

### Onduleur (Inverter)
Convertit le courant continu (CC) des panneaux en courant alternatif (CA) compatible avec le réseau.

### Régulateur de charge
Protège les batteries contre la surcharge et la décharge profonde.

## Raccordement au réseau

### Au Québec
- **Net metering** : L'énergie injectée dans le réseau est créditée
- Doit respecter la norme CSA C22.2 No. 257

### Sécurité
- Sectionneur CC entre les panneaux et l'onduleur
- Sectionneur CA entre l'onduleur et le tableau principal`,
    7: `# Systèmes de Sécurité — Câblage et Installation

## Introduction

Les systèmes de sécurité sont devenus un élément essentiel des installations électriques modernes.

## Alarme Incendie

### Détecteurs
- **Détecteur de fumée ionisation** : Répond aux particules invisibles
- **Détecteur de fumée optique** : Répond aux particules visibles
- **Détecteur de chaleur** : Déclenchement à une température fixe
- **Détecteur de monoxyde de carbone** : Détecte le CO

### Normes
- **CAN/ULC-S524** : Installation des systèmes d'alarme incendie

## Alarme Intrusion

### Composants
- **Panneau de contrôle** : Cerveau du système
- **Contacts magnétiques** : Détection d'ouverture des portes/fenêtres
- **Détecteurs de mouvement (PIR)** : Détection infrarouge passive

## Vidéosurveillance (CCTV)

### Types de caméras
- **Caméra analogique (HD-CVI/TVI)** : Transmission coaxiale
- **Caméra IP** : Transmission réseau (PoE), haute résolution

## Alimentation de secours

Tout système de sécurité doit avoir une alimentation de secours avec batterie.

## Bonnes pratiques d'installation

1. Étiqueter tous les conducteurs aux deux extrémités
2. Éviter de faire passer les câbles de sécurité près de conducteurs 120 V`,
    8: `# Code de Construction — Électricité (Chapitre V)

## Introduction

Le Code de construction du Québec, Chapitre V — Électricité, est la référence obligatoire pour toute installation électrique au Québec.

## Structure du Code

### Section 0 — Objet, définition et administration
Définit le champ d'application, les termes techniques et les règles d'administration.

### Section 2 — Règles générales
Couvre les exigences de base pour toutes les installations électriques.

### Section 4 — Conducteurs
- Choix des conducteurs selon la température et le type d'isolant
- Capacité de courant (tableaux 1 à 4)
- Chute de tension maximale : 3% pour un circuit d'utilisation, 5% total

### Section 8 — Circuits de dérivation
- Nombre maximum de prises par circuit
- Exigences pour les DDFT et DFARC

## Exigences spécifiques du Québec

### Modifications québécoises
- Exigences plus strictes pour les DDFT
- Protection DFARC obligatoire dans toutes les chambres

### La RBQ
La Régie du bâtiment du Québec administre le Code et délivre les licences d'entrepreneur en électricité.

## Permis et inspections

Tout travail électrique important nécessite un permis et une inspection.

## Sanctions

Le non-respect du Code peut entraîner des amendes et la révocation de la licence.`,
    9: `# Schémas Électriques — Lecture et Interprétation

## Introduction

Les schémas électriques sont le langage universel de l'électricien.

## Types de schémas

### Schéma unifilaire
Représentation simplifiée où un seul trait représente tous les conducteurs d'un circuit.

### Schéma multifilaire
Tous les conducteurs sont représentés individuellement.

### Schéma de câblage
Montre le cheminement physique des conducteurs.

### Schéma de principe
Représente le fonctionnement logique du circuit.

## Symboles normalisés

- **Interrupteur unipolaire** : Trait avec une ouverture
- **Interrupteur à 3 voies** : Trait avec deux contacts
- **Prise de courant** : Demi-cercle avec deux traits
- **Luminaire** : Croix ou cercle avec croix
- **Disjoncteur** : Trait avec un interrupteur
- **Moteur** : Cercle avec un M

### Symboles de commande
- **Contact normalement ouvert (NO)** : Deux traits parallèles
- **Contact normalement fermé (NF)** : Deux traits avec une barre oblique

## Lecture d'un schéma

1. Identifier la source d'alimentation
2. Suivre le chemin du courant
3. Repérer les protections
4. Analyser les circuits de commande
5. Vérifier les retours (neutre et mise à la terre)`,
    10: `# Calculs de Charge — Dimensionnement des Installations

## Introduction

Les calculs de charge sont essentiels pour dimensionner correctement une installation électrique.

## Concepts fondamentaux

### Charge électrique
La charge est la puissance consommée par les appareils et l'éclairage, exprimée en watts (W) ou en voltampères (VA).

### Facteur de demande
Coefficient qui réduit la charge totale installée, car tous les appareils ne fonctionnent pas simultanément.

## Méthode de calcul selon le Code

### Étape 1 : Calcul de l'éclairage général
- Résidentiel : 33 VA/m² de surface habitable (minimum)

### Étape 2 : Circuits de prises
- Chaque prise comptée à 150 VA dans les calculs de charge

### Étape 3 : Gros appareils
- Cuisinière : 8 000 W à 12 000 W selon la taille
- Sécheuse : 5 000 W
- Chauffe-eau : 3 000 W à 4 500 W

### Étape 4 : Facteur de demande
- Éclairage : 100% des premiers 2 000 VA, 35% du reste
- Prises : 100% des premiers 10 000 VA, 50% du reste

## Exemple de calcul résidentiel

Maison de 200 m² → total estimé ~40 000 VA → service de 200 A recommandé

## Erreurs courantes à éviter

1. Oublier d'appliquer les facteurs de demande
2. Sous-estimer les charges de chauffage
3. Négliger les charges futures prévisibles`,
  };

  return contents[chapterNumber] || `# Chapitre ${chapterNumber}\n\nContenu théorique à venir.`;
}

// ─── Questions ───────────────────────────────────────────────────

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
        explanation: "I = V / R = 120 V / 30 Ω = 4 A.",
      },
      {
        question: 'Un appareil consomme 5 A sous 120 V. Quelle est sa puissance ?',
        options: ['120 W', '300 W', '500 W', '600 W'],
        answer: '600 W',
        difficulty: 'MEDIUM',
        explanation: 'P = V × I = 120 V × 5 A = 600 W.',
      },
      {
        question: "Un chauffe-eau de 4 500 W fonctionne sur 240 V. Quel est le courant ?",
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
        explanation: 'Les diodes sont des composants non-linéaires.',
      },
    ],
    2: [
      {
        question: 'Quelle est la fréquence standard du courant alternatif au Québec ?',
        options: ['50 Hz', '60 Hz', '100 Hz', '120 Hz'],
        answer: '60 Hz',
        difficulty: 'EASY',
        explanation: 'Au Canada, la fréquence standard est de 60 Hz.',
      },
      {
        question: 'Un circuit parallèle avec R1=10Ω, R2=20Ω, R3=30Ω. Résistance totale ?',
        options: ["5,45 Ω", "10 Ω", "20 Ω", "60 Ω"],
        answer: '5,45 Ω',
        difficulty: 'MEDIUM',
        explanation: "1/Rt = 1/10 + 1/20 + 1/30 = 0,183 → Rt = 5,45 Ω.",
      },
      {
        question: 'Dans un circuit série, la tension se répartit :',
        options: ['Également entre les composants', 'Proportionnellement à chaque résistance', 'Uniquement sur la plus grande résistance', 'Aléatoirement'],
        answer: 'Proportionnellement à chaque résistance',
        difficulty: 'EASY',
        explanation: 'Dans un circuit série, la tension se divise proportionnellement à chaque résistance.',
      },
      {
        question: 'Quelle est la tension de crête pour 120 V CA ?',
        options: ['120 V', '150 V', '170 V', '200 V'],
        answer: '170 V',
        difficulty: 'MEDIUM',
        explanation: 'Vmax = Vrms × √2 ≈ 120 V × 1,414 ≈ 170 V.',
      },
      {
        question: "Pourquoi le CA est-il préféré pour le transport d'électricité ?",
        options: ['Il est moins dangereux', 'On peut le transformer facilement', 'Il ne perd pas d\'énergie', 'Il est plus rapide'],
        answer: 'On peut le transformer facilement',
        difficulty: 'MEDIUM',
        explanation: 'Le CA permet d\'utiliser des transformateurs pour élever la tension et réduire les pertes.',
      },
    ],
    3: [
      {
        question: 'Quel calibre de fil pour un circuit de cuisson de 40 A ?',
        options: ['14 AWG', '12 AWG', '10 AWG', '8 AWG'],
        answer: '8 AWG',
        difficulty: 'MEDIUM',
        explanation: 'Un circuit de 40 A nécessite un conducteur 8 AWG.',
      },
      {
        question: "Espacement maximal entre deux prises dans un salon ?",
        options: ['1,2 m', '1,8 m', '2,4 m', '3,0 m'],
        answer: '1,8 m',
        difficulty: 'MEDIUM',
        explanation: "Le Code exige un espacement maximal de 1,8 m entre les prises.",
      },
      {
        question: "Quel type de câble pour un sous-sol ou garage ?",
        options: ['NM-B (Romex)', 'AC90 (armé)', 'NMD90', 'TECK90'],
        answer: 'AC90 (armé)',
        difficulty: 'MEDIUM',
        explanation: "Le câble AC90 offre une protection mécanique supplémentaire.",
      },
      {
        question: "Quel est le calibre minimal du service électrique pour une maison neuve ?",
        options: ['60 A', '100 A', '150 A', '200 A'],
        answer: '100 A',
        difficulty: 'EASY',
        explanation: "Le Code exige un minimum de 100 A pour les maisons unifamiliales neuves.",
      },
      {
        question: 'Quelles pièces exigent des prises DDFT ?',
        options: ['Chambres', 'Salle de bain et cuisine', 'Débarras', 'Toutes les pièces'],
        answer: 'Salle de bain et cuisine',
        difficulty: 'EASY',
        explanation: 'Les salles de bain et cuisines exigent des DDFT car ce sont des pièces humides.',
      },
    ],
    4: [
      {
        question: "Quel dispositif protège contre les arcs électriques ?",
        options: ['DDFT (GFCI)', 'DFARC (AFCI)', 'Disjoncteur standard', 'Fusible'],
        answer: 'DFARC (AFCI)',
        difficulty: 'MEDIUM',
        explanation: "Le DFARC détecte les arcs électriques pouvant causer un incendie.",
      },
      {
        question: 'Quel disjoncteur pour un fil 14 AWG ?',
        options: ['10 A', '15 A', '20 A', '30 A'],
        answer: '15 A',
        difficulty: 'EASY',
        explanation: 'Un fil 14 AWG a une capacité de 15 A maximum.',
      },
      {
        question: 'Quelle est la différence entre défaut de terre et court-circuit ?',
        options: ['Ils sont identiques', 'Le défaut implique la terre, le court-circuit implique deux conducteurs', 'Le court-circuit est moins dangereux', 'Le défaut se produit à basse tension'],
        answer: 'Le défaut implique la terre, le court-circuit implique deux conducteurs',
        difficulty: 'MEDIUM',
        explanation: 'Un défaut à la terre implique un conducteur sous tension et une surface mise à la terre.',
      },
      {
        question: "À quelle fréquence tester les DDFT ?",
        options: ['Jamais', 'Mensuellement', 'Annuellement', 'Lors de chaque inspection'],
        answer: 'Mensuellement',
        difficulty: 'EASY',
        explanation: 'Les DDFT doivent être testés mensuellement.',
      },
      {
        question: 'Quel courant de fuite déclenche un DDFT typique ?',
        options: ['1 mA', '5 mA', '10 mA', '30 mA'],
        answer: '5 mA',
        difficulty: 'MEDIUM',
        explanation: 'Un DDFT standard se déclenche à 5 mA de courant de fuite.',
      },
    ],
    5: [
      {
        question: "Quel moteur est le plus répandu dans l'industrie ?",
        options: ['Synchrone', 'Asynchrone à cage d\'écureuil', 'CC', 'Universel'],
        answer: 'Asynchrone à cage d\'écureuil',
        difficulty: 'MEDIUM',
        explanation: 'Le moteur asynchrone à cage d\'écureuil est robuste, simple et économique.',
      },
      {
        question: 'Quel est l\'appel de courant au démarrage d\'un moteur ?',
        options: ['1-2× In', '3-4× In', '5-8× In', '10-15× In'],
        answer: '5-8× In',
        difficulty: 'MEDIUM',
        explanation: 'Au démarrage, un moteur peut tirer 5 à 8 fois son courant nominal.',
      },
      {
        question: 'Quel pourcentage pour dimensionner le conducteur d\'un moteur ?',
        options: ['100%', '115%', '125%', '150%'],
        answer: '125%',
        difficulty: 'MEDIUM',
        explanation: "Les conducteurs d'alimentation d'un moteur doivent être dimensionnés à 125%.",
      },
      {
        question: 'Quel dispositif fait varier la vitesse d\'un moteur CA ?',
        options: ['Relais thermique', 'Contacteur', 'Variateur de fréquence (VFD)', 'Transformateur'],
        answer: 'Variateur de fréquence (VFD)',
        difficulty: 'EASY',
        explanation: 'Le VFD contrôle la vitesse en faisant varier la fréquence.',
      },
      {
        question: 'Un moteur synchrone se caractérise par :',
        options: ['Sa vitesse variable', 'Sa vitesse synchrone avec la fréquence', 'Son faible coût', 'Sa petite taille'],
        answer: 'Sa vitesse synchrone avec la fréquence',
        difficulty: 'HARD',
        explanation: 'Le moteur synchrone tourne à la vitesse du champ magnétique.',
      },
    ],
    6: [
      {
        question: 'Quel type de panneau solaire offre le meilleur rendement ?',
        options: ['Polycristallin', 'Monocristallin', 'Couche mince', 'Amorphe'],
        answer: 'Monocristallin',
        difficulty: 'EASY',
        explanation: "Les panneaux monocristallins offrent le meilleur rendement (18-22%).",
      },
      {
        question: "À quoi sert un onduleur ?",
        options: ['Produire de l\'électricité', 'Convertir CC en CA', 'Stocker l\'énergie', 'Réguler la température'],
        answer: 'Convertir CC en CA',
        difficulty: 'EASY',
        explanation: "L'onduleur convertit le CC des panneaux en CA compatible avec le réseau.",
      },
      {
        question: "Qu'est-ce que le net metering ?",
        options: ['Un type de panneau', 'Un crédit pour l\'énergie injectée', 'Un dispositif de sécurité', 'Une batterie'],
        answer: 'Un crédit pour l\'énergie injectée',
        difficulty: 'MEDIUM',
        explanation: "Le net metering crédite l'énergie solaire injectée dans le réseau.",
      },
      {
        question: 'Quel composant protège les batteries solaires ?',
        options: ['Onduleur', 'Régulateur de charge', 'Compteur', 'Disjoncteur'],
        answer: 'Régulateur de charge',
        difficulty: 'MEDIUM',
        explanation: 'Le régulateur de charge protège contre la surcharge et la décharge profonde.',
      },
      {
        question: "Quel sectionneur entre panneaux et onduleur ?",
        options: ['Aucun', 'Sectionneur CC', 'Sectionneur CA', 'Sectionneurs CC et CA'],
        answer: 'Sectionneur CC',
        difficulty: 'HARD',
        explanation: 'Un sectionneur CC est requis entre les panneaux et l\'onduleur.',
      },
    ],
    7: [
      {
        question: 'Quels types de détecteurs de fumée sont les plus courants ?',
        options: ['Ionisation et optique', 'Thermique et barrière', 'Laser et ultrason', 'Capacitif et magnétique'],
        answer: 'Ionisation et optique',
        difficulty: 'EASY',
        explanation: 'Les deux types principaux sont ionisation et optique.',
      },
      {
        question: 'Quelle norme régit l\'installation des alarmes incendie au Canada ?',
        options: ['CSA C22.1', 'CAN/ULC-S524', 'CAN/ULC-S301', 'CSA B44'],
        answer: 'CAN/ULC-S524',
        difficulty: 'HARD',
        explanation: "La norme CAN/ULC-S524 est la norme d'installation des alarmes incendie.",
      },
      {
        question: 'Quel câble pour détecteurs de mouvement (PIR) ?',
        options: ['Non blindé', 'Blindé', 'Coaxial', 'Fil de terre'],
        answer: 'Blindé',
        difficulty: 'MEDIUM',
        explanation: 'Les détecteurs PIR nécessitent un câble blindé contre les interférences.',
      },
      {
        question: "Autonomie minimale pour alarme incendie ?",
        options: ['4 h', '12 h', '24 h', '48 h'],
        answer: '24 h',
        difficulty: 'MEDIUM',
        explanation: "Les normes exigent 24 heures d'autonomie pour l'alarme incendie.",
      },
      {
        question: "Boucle de Classe A dans un système d'alarme ?",
        options: ['Sans fin de ligne', 'Avec retour au panneau', 'Boucle ouverte', 'Sans résistance'],
        answer: 'Avec retour au panneau',
        difficulty: 'HARD',
        explanation: 'Une boucle Classe A offre un chemin de retour pour rester fonctionnelle après une rupture.',
      },
    ],
    8: [
      {
        question: "Quel organisme administre le Code Chapitre V — Électricité ?",
        options: ['CMEQ', 'RBQ', 'Hydro-Québec', 'CNESST'],
        answer: 'RBQ',
        difficulty: 'EASY',
        explanation: "Depuis 2017, la RBQ administre le Code de construction du Québec.",
      },
      {
        question: 'Chute de tension maximale pour un circuit d\'utilisation ?',
        options: ['1%', '3%', '5%', '10%'],
        answer: '3%',
        difficulty: 'MEDIUM',
        explanation: "Le Code limite la chute à 3% pour un circuit d'utilisation.",
      },
      {
        question: 'Quels locaux exigent une protection DFARC au Québec ?',
        options: ['Sous-sols', 'Chambres et pièces de séjour', 'Cuisines', 'Extérieurs'],
        answer: 'Chambres et pièces de séjour',
        difficulty: 'MEDIUM',
        explanation: 'La protection DFARC est obligatoire dans les chambres et pièces de séjour.',
      },
      {
        question: 'Conséquences du non-respect du Code ?',
        options: ['Avertissement', 'Amendes et révocation', 'Aucune', 'Prime réduite'],
        answer: 'Amendes et révocation',
        difficulty: 'EASY',
        explanation: 'Le non-respect peut entraîner amendes et révocation de licence.',
      },
      {
        question: "Qui inspecte les travaux électriques au Québec ?",
        options: ["L'entrepreneur", 'Hydro-Québec', 'La RBQ', 'La CMMTQ'],
        answer: 'La RBQ',
        difficulty: 'EASY',
        explanation: 'La RBQ inspecte les travaux électriques.',
      },
    ],
    9: [
      {
        question: "Quel schéma montre le cheminement physique des conducteurs ?",
        options: ['Unifilaire', 'Multifilaire', 'De câblage', 'De principe'],
        answer: 'De câblage',
        difficulty: 'MEDIUM',
        explanation: 'Le schéma de câblage représente le cheminement physique des conducteurs.',
      },
      {
        question: 'Dans un schéma de commande moteur, la puissance est en :',
        options: ['Traits minces', 'Traits épais', 'Pointillés', 'Rouge'],
        answer: 'Traits épais',
        difficulty: 'MEDIUM',
        explanation: 'Les circuits de puissance (fort courant) sont en traits épais.',
      },
      {
        question: 'Symbole d\'un contact normalement ouvert (NO) ?',
        options: ['Deux traits séparés', 'Deux traits avec barre', 'Cercle avec croix', 'Triangle'],
        answer: 'Deux traits séparés',
        difficulty: 'EASY',
        explanation: 'Le contact NO est deux traits parallèles séparés.',
      },
      {
        question: 'Couleur du fil neutre au Canada ?',
        options: ['Noir', 'Rouge', 'Blanc', 'Vert'],
        answer: 'Blanc',
        difficulty: 'EASY',
        explanation: 'Au Canada, le neutre est identifié par la couleur blanche.',
      },
      {
        question: "Comment les bornes sont-elles identifiées dans un schéma ?",
        options: ['Par lettres', 'Par numéros', 'Par couleurs', 'Par symboles'],
        answer: 'Par numéros',
        difficulty: 'MEDIUM',
        explanation: 'Les bornes sont numérotées pour faciliter le repérage.',
      },
    ],
    10: [
      {
        question: "Charge de calcul minimale pour l'éclairage résidentiel ?",
        options: ['22 VA/m²', '33 VA/m²', '40 VA/m²', '50 VA/m²'],
        answer: '33 VA/m²',
        difficulty: 'MEDIUM',
        explanation: "Le Code exige 33 VA/m² pour l'éclairage résidentiel.",
      },
      {
        question: "Facteur de demande pour l'éclairage au-delà de 2 000 VA ?",
        options: ['100%', '75%', '50%', '35%'],
        answer: '35%',
        difficulty: 'HARD',
        explanation: "On applique 35% sur l'éclairage au-delà de 2 000 VA.",
      },
      {
        question: 'Puissance typique d\'une cuisinière électrique ?',
        options: ['5 000 W', '8 000-12 000 W', '15 000 W', '20 000 W'],
        answer: '8 000-12 000 W',
        difficulty: 'MEDIUM',
        explanation: 'Une cuisinière électrique typique fait 8 000 à 12 000 W.',
      },
      {
        question: "Courant pour 40 000 VA sur 240 V ?",
        options: ['100 A', '150 A', '167 A', '200 A'],
        answer: '167 A',
        difficulty: 'MEDIUM',
        explanation: 'I = 40 000 VA / 240 V ≈ 167 A.',
      },
      {
        question: "Qu'est-ce qu'un facteur de demande ?",
        options: ['La puissance totale', 'Un coefficient réduisant la charge', 'La tension nominale', 'La capacité du disjoncteur'],
        answer: 'Un coefficient réduisant la charge',
        difficulty: 'EASY',
        explanation: 'Le facteur de demande réduit la charge car tous les appareils ne fonctionnent pas simultanément.',
      },
    ],
  };

  return questions[chapterNumber] || [];
}
