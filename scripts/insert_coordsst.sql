-- Coordonnateur SST / Safety Coordinator (ASP Const./RBQ) - Trade + Chapters
INSERT INTO "Trade" (id, code, name, "nameFr", description, "createdAt", "updatedAt")
VALUES (
  'cmt_coordsst_001',
  'SST',
  'Safety Coordinator',
  'Coordonnateur SST',
  'Préparation à l''examen de certification ASP Construction en coordination SST — prévention, IRSST, RSST, gestion de chantier.',
  NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Chapter" (id, "tradeId", number, name, "nameFr", "theoryContent", "createdAt", "updatedAt") VALUES
('ch_sst_01', 'cmt_coordsst_001', 1, 'Laws and Regulations', 'Lois et règlements',
'LST (Loi sur la santé et la sécurité du travail) : droits et obligations employeur/travailleur.
RSST (Règlement sur la santé et la sécurité du travail) : normes techniques.
Règlement SST de la CCQ : affichage chantier, rapport incidents, tenue registres.
Commission des normes, de l''équité, de la santé et de la sécurité du travail (CNESST).
ASP Construction : association sectorielle paritaire, formation, prévention.
Coffret chantier : affichage obligatoire (licences, assurances, SST).
Rôle coordonnateur : responsable SST sur chantier >200 000$.
Sanctions : amende (300-10 000$), fermeture chantier, arrêt de travail.',
NOW(), NOW()),

('ch_sst_02', 'cmt_coordsst_001', 2, 'Hazard Identification', 'Identification des dangers',
'Analyse des risques : AMDEC, JSA (Job Safety Analysis), analyse sécuritaire des tâches.
Dangers physiques : chute (hauteur), électrocution, effondrement, machine, bruit, vibration.
Dangers chimiques : SIMDUT (silicose, amiante, solvants, CO, plomb, isocyanates).
Dangers biologiques : moisissure, bactérie, eau stagnante, déchets.
Dangers psychosociaux : stress, harcèlement, charge mentale, horaire.
Hiérarchie des contrôles : élimination > substitution > ingénierie > administratif > EPI.
Signalisation : affiches, barricades, cônes, ruban danger, panneaux obligatoires.
Évaluation du risque : probabilité × gravité × exposition (matrice).',
NOW(), NOW()),

('ch_sst_03', 'cmt_coordsst_001', 3, 'Fall Protection', 'Protection contre les chutes',
'Obligation : protection antichute pour tout travail >3m (10 pieds).
Ligne de vie (horizontale, verticale) : câble acier (1/2, 5/8), absorbant énergie.
Harnais antichute : point d''ancrage dorsal, boucles cuisses, vérification annuelle.
Longe : simple (1.8m), double (pour déplacement), absorbeur d''énergie intégré.
Point d''ancrage : capacité 5000 lb (22kN) par personne. Délestage max 6 pieds.
Échafaudage : montage (plan approuvé), inspection (avant usage), plinthes, garde-corps.
Plateforme élévatrice : (ciseaux, articulée, télescopique) formation opérateur.
Échelles : type I (250 lb), II (225 lb), III (200 lb). Angle 4:1, dépassement 1m.',
NOW(), NOW()),

('ch_sst_04', 'cmt_coordsst_001', 4, 'Confined Spaces', 'Espaces clos',
'Définition : espace restreint, entrée/sortie limitée, non conçu pour occupation continue.
Exemples : réservoir, silo, fosse, tunnel, regard, conduite, cave.
Dangers : manque d''O2 (<19.5%), gaz toxiques (H2S, CO), explosif (CH4).
Procédure : permis (cadenassage, test atmosphère O2/LIE/toxique), ventilation, surveillant.
Gaz testé : O2 (19.5-23.5%), LIE (<10%), H2S (<10ppm), CO (<35ppm).
Surveillant : formé (secourisme, communication), rester à l''extérieur, jamais entrer.
Équipement : détecteur multigaz (O2, CO, H2S, LIE), harnais, treuil, communication.
Sauvetage : plan (préétabli), équipement extraction, premiers soins, ambulance.',
NOW(), NOW()),

('ch_sst_05', 'cmt_coordsst_001', 5, 'Electrical Safety', 'Sécurité électrique',
'Cadenassage (lockout/tagout) : procédure obligatoire avant intervention électrique.
Arc électrique : température 20 000°C, distance sécuritaire (2-15 pieds selon tension).
Tension : basse (<600V), moyenne (600-50 000V), haute (>50 000V).
Approbation (RBQ) : travaux électriques réservés aux maîtres électriciens.
GFCI : pris es extérieur, salle humide. Test mensuel.
Outils isolés : classe 0 (1000V), classe 1 (7500V), classe 2 (17000V).
Distance approche : limitée (3-10 pieds), prohibée (contact mains-nues).
EPI électrique : gants isolants (vérification 6 mois), matelas isolant, arc flash suit.',
NOW(), NOW()),

('ch_sst_06', 'cmt_coordsst_001', 6, 'Fire Safety and Emergencies', 'Sécurité incendie et urgences',
'Plan d''urgence : procédure évacuation, point rassemblement, extincteurs.
Extincteurs : classe A (solides), B (liquides), C (électrique), D (métaux), K (cuisine).
Inspection extincteurs : mensuelle (visuelle), annuelle (pression, recharge).
Alarme incendie : déclencheur manuel, avertisseur audible/visible, détecteurs.
Exercice évacuation : 1x/3 mois (garderie), 1x/6 mois (commercial), 1x/an (bureau).
Premiers soins : trousse (type I, II, III selon nombre employés), secouriste (1 par étage).
Trousse : gants, bandages, gaze, ruban, ciseaux, pince à écharde, masque RCP.
Débriefing : après tout incident, investigation, rapport, correctifs.',
NOW(), NOW()),

('ch_sst_07', 'cmt_coordsst_001', 7, 'Health Monitoring and Ergonomics', 'Surveillance santé et ergonomie',
'Bruit : limite 85 dB (8h), 90 dB (4h), 100 dB (15 min). Protection auditive obligatoire.
Amiante : risque (cancer poumon), inspection avant rénovation, confinement, décontamination.
Silice : tronçonnage, sablage, perçage béton/pierre. Masque P100/N95, eau, aspiration.
Ergonomie : manutention (max 23 kg femme, 34 kg homme, assis), posture, répétition.
Vibration : marteau-piqueur (syndrome main-bras), limite exposition (8h).
Contrôle biologique : prise sang, audiogramme, spirométrie (selon exposition).
Déclaration lésion : formulaire CNESST, 4 jours max. Délai traitement médical.
Registre : maladie professionnelle (période 5 ans), accident travail (2 ans réclamation).',
NOW(), NOW()),

('ch_sst_08', 'cmt_coordsst_001', 8, 'Inspection and Investigation', 'Inspection et enquête',
'Inspection chantier : quotidienne (coordonnateur), hebdomadaire (comité SST), mensuelle.
Liste vérification : équipement, EPI, chantier ordre/propreté, signalisation, déchets.
Comité SST : 5-20 employés (1 repr. employeur + 1 repr. travailleur). Réunion mensuelle.
Rapport d''inspection : déficiences (correction, délai, responsable), suivi.
Enquête accident : méthodes (arbre des causes, 5 pourquoi, diagramme Ishikawa).
Causes immédiates : acte dangereux, condition dangereuse.
Causes profondes : formation, procédure, équipement inadéquat, culture sécurité.
Plan d''action : correctif (court terme), préventif (long terme), suivi, échéancier.',
NOW(), NOW());
