-- Inspecteur en bâtiment / Building Inspector (RBQ) - Trade + Chapters
INSERT INTO "Trade" (id, code, name, "nameFr", description, "createdAt", "updatedAt")
VALUES (
  'cmt_inspecteur_001',
  'INSPECT',
  'Building Inspector',
  'Inspecteur en bâtiment',
  'Préparation à l''examen de certification RBQ en inspection de bâtiments — code du bâtiment, structures, enveloppe, systèmes et sécurité.',
  NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Chapter" (id, "tradeId", number, name, "nameFr", "theoryContent", "createdAt", "updatedAt") VALUES
('ch_ins_01', 'cmt_inspecteur_001', 1, 'Building Code and Regulations', 'Code du bâtiment et réglementation',
'Code de construction du Québec (CCQ) : Chapitre I Bâtiment (CNB 2015 adapté).
Classification bâtiments : A (résidentiel), B (soins), C (réunion), D (commerce), E (industrie), F (entrepôt).
Hauteur et superficie max selon type de construction (combustible/incombustible).
Résistance au feu : murs coupe-feu (45min à 2h selon bâtiment), portes coupe-feu.
Issues de secours : nombre (1 issue par 60 occupants), largeur (900mm), distance max 45m.
Sécurité incendie : gicleurs, alarme, détecteurs fumée (obligatoire résidentiel 2005+).
Code de sécurité : entretien des systèmes, inspections obligatoires, certificats.
Normes : RBQ, CNB 3.2 à 3.8, CNB 9 (logements).',
NOW(), NOW()),

('ch_ins_02', 'cmt_inspecteur_001', 2, 'Structural Systems', 'Systèmes structuraux',
'Fondations : semelle (béton armé, largeur min 300mm), mur fondation (béton, blocs de béton).
Drainage : drain français (pierre 150mm, géotextile), pompe de puisard (si sous niveau).
Structure bois : poteaux, poutres, fermes de toit, solives (portée max 4.9m 2x10).
Structure acier : poteaux (HSS, W-shape), poutrelles, connexions boulonnées/soudées.
Structure béton : armature, coulis, coffrage, dalle (150mm min), poteau (300mm min).
Toit : pente (4:12 min bardeau), fermes en bois, panneaux de toit.
Plancher : solives (bois, acier), sous-plancher OSB (5/8 min), dalle sur sol.
Défauts : fissures fondation, affaissement, bois pourri, infiltration, corrosion acier.',
NOW(), NOW()),

('ch_ins_03', 'cmt_inspecteur_001', 3, 'Building Envelope', 'Enveloppe du bâtiment',
'Murs extérieurs : brique, pierre, vinyle, bois, fibre-ciment, EIFS (enduit).
Isolation : laine minérale (R3.8/po), polyuréthane giclé (R6/po), polystyrène (R4/po).
Pare-vapeur : polyéthylène (6mil), côté chaud isolation.
Pare-air : membrane extérieure, ruban adhésif joints, scellant pénétrations.
Fenêtres : double/triple vitrage, U-value (0.30-1.20), condensation, étanchéité.
Portes : extérieure (acier, bois, fibre verre), coupe-feu (20min, 45min, 1h).
Toiture : bardeau asphalte (25 ans durée), membrane (plat), solins, noues.
Défauts : infiltration d''eau, pont thermique, moisissure, bris de verre, détérioration.',
NOW(), NOW()),

('ch_ins_04', 'cmt_inspecteur_001', 4, 'Plumbing and Mechanical', 'Plomberie et systèmes mécaniques',
'Plomberie : tuyaux (cuivre M, PEX, PVC Sch40), pente drainage (1/4 po/pi), ventilation.
Chauffe-eau : électrique (60L, 180L), gaz (40L, 75L). Évacuation des gaz brûlés.
Chauffage : fournaise (gaz, électrique), thermopompe, plinthes électriques, radiant.
Climatisation : split, centrale, thermopompe (SEER 13-18 minimum).
Ventilation : VRC/VER (récupérateur chaleur), hotte cuisine (100 CFM min), salle de bain (50 CFM).
Gaz : conduite (acier sch40, cuivre L), raccordement (certifié, test pression).
Défauts : fuite eau/gaz, pression inadéquate, ventilation insuffisante, corrosion.
Normes : Code plomberie (CMMTQ), CSA B149 (gaz), RBQ Code sécurité.',
NOW(), NOW()),

('ch_ins_05', 'cmt_inspecteur_001', 5, 'Electrical Systems', 'Systèmes électriques',
'Entrée électrique : 100A (résidentiel min), 200A (neuf recommandé), panneau principal.
Câblage : cuivre (14 AWG 15A, 12 AWG 20A), aluminium (ancien, risque surchauffe).
Prises : GFCI (salle de bain, cuisine, extérieur), AFCI (chambres, salon).
Luminaires : encastrés (IC, non-IC), éclairage extérieur, ventilateur plafond.
Alarme incendie : détecteurs fumée (chaque étage/chambre), CO (adjacent chambres).
Systèmes sécurité : câblage (22-18 AWG), caméras (cat5, coax), interphone.
Défauts : surcharge panneau, connexions desserrées, fils dénudés, absence GFCI/AFCI.
Normes : Code électricité CSA C22.1 (CCQ Chapitre V), RBQ.',
NOW(), NOW()),

('ch_ins_06', 'cmt_inspecteur_001', 6, 'Interior Finishes and Safety', 'Finitions intérieures et sécurité',
'Gypse : 1/2 standard, 5/8 coupe-feu (murs adjacents garage), finition joints.
Planchers : bois franc, stratifié, céramique, vinyle, tapis. Sous-plancher (OSB 5/8, CDX).
Armoires : cuisine (MDF, contreplaqué, mélamine), comptoirs (stratifié, quartz, granit).
Peinture : latex (intérieur), acrylique, huile. Apprêt nécessaire sur gypse neuf.
Escaliers : contremarche max 200mm, giron min 210mm, garde-corps (900mm, 4 balustres max).
Garde-corps : balcon (min 1 067mm), rampe escalier (900mm). Espacement max 100mm.
Foyer : maçonné, préfabriqué, gaz, électrique. Conformité (étincelles, dégagement).
Défauts : escalier non conforme, garde-corps manquant, moisissure, peinture écaillée.',
NOW(), NOW()),

('ch_ins_07', 'cmt_inspecteur_001', 7, 'Inspection Process and Reporting', 'Processus et rapport d''inspection',
'Types d''inspection : pré-achat (résidentiel), préréception (neuf), thermographique, code.
Étapes : extérieur, toiture, structure, intérieur, plomberie, électricité, CVC.
Outils : lampe torche, tournevis (test GFCI), niveau, détecteur humidité, caméra thermique.
Rapport : photos (annotées), descriptions, déficiences (majeure/mineure/esthétique).
Déficiences majeures : structurelle, infiltration, sécurité, systèmes défectueux.
Photo : extérieur (4 faces toit), intérieur (chaque pièce), défauts (macro).
Rapport écrit : format standardisé, clair, objectif, sans alarmisme. Délai 24-48h.
Limites : inspection visuelle seulement. Zone inaccessible = non inspectée. Clause exclusion.
Normes : RBQ, OIQ, AITQ (Association des Inspecteurs).',
NOW(), NOW()),

('ch_ins_08', 'cmt_inspecteur_001', 8, 'Liability and Ethics', 'Responsabilité et éthique',
'Responsabilité civile : RC professionnelle (1-2M$ recommandé). Signalement erreur/omission.
Obligations : compétence, diligence, honnêteté. Inspection selon normes reconnues.
Conflit d''intérêts : ne pas inspecter pour un proche, ne pas recommander entrepreneur.
Secret professionnel : rapport confidentiel, pas de divulgation sans consentement.
Rapport non-conformité : signaler aux autorités (RBQ, ville) si danger immédiat.
Limites de responsabilité : contrat stipulant inspection visuelle, valeur max rapport.
Formation continue : AITQ exige 24h/2 ans, OIQ exige 30h/2 ans.
Normes : OIQ (Ordre des ingénieurs), AITQ, Code de déontologie RBQ.',
NOW(), NOW());
