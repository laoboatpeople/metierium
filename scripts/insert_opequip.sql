-- Opérateur d'équipement lourd / Heavy Equipment Operator (CCQ) - Trade + Chapters
INSERT INTO "Trade" (id, code, name, "nameFr", description, "createdAt", "updatedAt")
VALUES (
  'cmt_opequip_001',
  'OPEQUIP',
  'Heavy Equipment Operator',
  'Opérateur d''équipement lourd',
  'Préparation à l''examen de certification CCQ en opération d''équipement lourd — pelles, bulldozers, niveleuses, sécurité et normes.',
  NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Chapter" (id, "tradeId", number, name, "nameFr", "theoryContent", "createdAt", "updatedAt") VALUES
('ch_op_01', 'cmt_opequip_001', 1, 'Heavy Equipment Types', 'Types d''équipement lourd',
'Pelle hydraulique (excavator) : sur chenilles, sur pneus. Usage : excavation, tranchée, démolition. Capacité 1-100 tonnes.
Bulldozer : lame avant (angle, droite, universelle). Usage : décapage, nivellement, poussage.
Niveleuse (grader) : lame centrale ajustable. Usage : finition de surface, pente, entretien chemin.
Chargeuse (loader) : godet avant. Usage : chargement, transport court, déblai.
Camion lourd : benne basculante (dump truck), hors-route (articulé, rigide). Capacité 10-100 tonnes.
Compacteur : rouleau vibrant, pied dameur, pneumatique. Usage : compactage sol/asphalte.
Bouteur (dozer) : grands volumes, déboisement, poussage longue distance.',
NOW(), NOW()),

('ch_op_02', 'cmt_opequip_001', 2, 'Operation and Controls', 'Opération et commandes',
'Système hydraulique : pompe, distributeur, vérins, moteurs hydrauliques. Pression (200-350 bars).
Commandes : joysticks (ISO/JIT), pédales, leviers. Commande pilote (joystick proportionnel).
Marche avant/arrière : transmission hydrostatique, powershift, manuelle.
Direction : articulée (chargeuse), différentielle (niveleuse), à glissement (skid-steer).
Freins : disque (sec/baigné), à ressort (fail-safe), service/stationnement/secondaire.
Instruments : compteur vitesse, compte-tours, température hydraulique, jauge carburant.
Systèmes de sécurité : alarme recul, caméra, détecteur piétons, ROPS/FOPS.
Normes : ISO 5006 (visibilité), CSA B352 (ROPS).',
NOW(), NOW()),

('ch_op_03', 'cmt_opequip_001', 3, 'Excavation and Earthworks', 'Excavation et terrassement',
'Types d''excavation : en pleine masse (décapage), en rigole (tranchée, fondation), en butte (remblai).
Talutage : pente sécuritaire selon type de sol (1:1 sable, 2:1 argile, 3:1 roche).
Buttage : hauteur max d''un talus selon angle de frottement interne.
Compacité : Proctor (densité maximale), degré de compactage (95-100% Proctor modifié).
Calculs volumes : section moyenne, prismatoïdale, grid method. Facteur de foisonnement (1.1-1.4).
Drainage : pente minimale 1%, tranchée drainante, géotextile, pierre nette.
Normes : CNB 4.2 (fondations), MTQ (ouvrages routiers), RBQ.',
NOW(), NOW()),

('ch_op_04', 'cmt_opequip_001', 4, 'Load and Transport', 'Chargement et transport',
'Capacité godet : remplissage (facteur 0.8-1.1), densité matériau (kg/m3).
Cycle chargement : pénétration, remplissage, levage, rotation, déchargement, retour.
Transport : nombre de camions pour alimenter une pelle. Formule : cycle pelle / cycle camion.
Types de matériaux : terre végétale (1.2 t/m3), sable/gravier (1.6 t/m3), roche (2.4 t/m3), roc (2.7 t/m3).
Pesée : balance embarquée, pesée station. Limite de charge (PNBV).
Sécurité chargement : répartition charge, arrimage (chaînes, courroies).
Normes : CNB (transport).',
NOW(), NOW()),

('ch_op_05', 'cmt_opequip_001', 5, 'Grading and Leveling', 'Nivellement et finition',
'Niveler : niveau laser, niveau optique, GPS (machine control). Coupe de référence.
Types de nivellement : décapage, remblai, finition, pente (2% drainage).
Piquetage : repères de nivellement (bornes, tiges), lecture de niveau (mètre pliant/ruban).
Machine control : GPS 3D, station totale, laser. Précision 20mm (GPS), 5mm (laser).
Niveleuse (grader) : réglage lame (angle 30-45 degrés, hauteur, inclinaison).
Cycles nivellement : première passe (gros volume), passe de finition (1cm).
To : compactage après nivellement, vérification pente.',
NOW(), NOW()),

('ch_op_06', 'cmt_opequip_001', 6, 'Haul Roads and Dumps', 'Chemins et sites d''enfouissement',
'Chemins de halage : largeur (min 5m voie simple), pente (max 10% chargé), courbe (rayon min 15m).
Entretien chemin : nivellement (grader), arrosage (poussière), empierrement.
Sites d''enfouissement : déchargement (en bout, en gradins), épandage, compactage.
Couverture : terre végétale (300mm min), géomembrane, drainage biogaz.
Eau : gestion eaux de ruissellement, bassins sédimentation, pompage.
Sécurité site : signaleur, recul (alarme), séparation camions/équipement.
Normes : MTQ (chemins), MDDELCC (environnement), CNB.',
NOW(), NOW()),

('ch_op_07', 'cmt_opequip_001', 7, 'Plans and Surveying', 'Plans et topographie',
'Lecture plans : plans topographiques (courbes niveau), profils en long, profils en travers.
Symboles : type de sol, ligne de lot, conduite, bâtiment existant.
Courbes de niveau : équidistance (1m, 5m), lecture dénivelé.
Calculs : volume excavation (méthode des sections), pente (%), cubature.
Topographie : GNSS (GPS), station totale, théodolite, niveau, mètre à ruban.
Bornes : points de contrôle (x,y,z), repères temporaires, piquets de chaînage.
Logiciels : AutoCAD Civil 3D, Trimble Business Center.
Normes : MTQ normes topographiques, CNB.',
NOW(), NOW()),

('ch_op_08', 'cmt_opequip_001', 8, 'Health and Safety', 'Santé et sécurité',
'ROPS (Roll-Over Protective Structure) : obligatoire sur tout équipement >700kg.
FOPS (Falling Object Protective Structure) : pour démolition, abattage, forêt.
Vérification avant opération (inspection) : pneus/chainilles, niveaux, freins, lumières, alarme.
Tranchée sécurité : étaiement (bois, hydraulique), pente sécuritaire (1:1 sol meuble).
Angle de repos : sable 30-35 degrés, argile 45 degrés, roche 60 degrés.
Utilitaires : localisation (Info-Excavation), dégagement manuel, vides 600mm.
SIMDUT : carburant diesel, huile hydraulique, antigel.
Voisinage : bruit (>85dB limites), poussière, vibration.
Normes : LST, Règlement SST CCQ, Code sécurité pour travaux excavation (RSST).',
NOW(), NOW());
