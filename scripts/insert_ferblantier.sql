-- Ferblantier / Tôlier (CCQ) - Trade + Chapters
INSERT INTO "Trade" (id, code, name, "nameFr", description, "createdAt", "updatedAt")
VALUES (
  'cmt_ferblantier_001',
  'FERBLAN',
  'Sheet Metal Worker',
  'Ferblantier / Tôlier',
  'Préparation à l''examen de certification CCQ en ferblanterie et tôlerie — ventilation, toiture, métaux en feuilles et soudage.',
  NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

-- Chapters
INSERT INTO "Chapter" (id, "tradeId", number, name, "nameFr", "theoryContent", "createdAt", "updatedAt") VALUES
('ch_fer_01', 'cmt_ferblantier_001', 1, 'Materials and Metals', 'Matériaux et métaux',
'Types de métaux : acier galvanisé, aluminium, cuivre, acier inoxydable, zinc-titane.
Épaisseurs : calibre (ga) américain, de 26 ga (0.5mm) à 16 ga (1.6mm).
Tôles : plane, ondulée, perforée, nervurée.
Revêtements : galvanisation (G90, G60), aluzinc, peinture, pural.
Propriétés : résistance à la corrosion, dilatation thermique, malléabilité.
Normes : CSA G40.20, ASTM A653, CAN/CGSB.
Facteurs de choix : usage (toiture, ventilation, ornemental), climat, budget.',
NOW(), NOW()),

('ch_fer_02', 'cmt_ferblantier_001', 2, 'Layout and Development', 'Tracé et développement',
'Techniques de tracé : géométrie descriptive, développement de surfaces.
Développements : cylindre, cône, pyramide, transition rectangulaire-circulaire.
Lignes de coupe et pliage : angle de pli, facteur K, déduction de pli.
Outils : compas, équerre, rapporteur, pointe à tracer, chasse carré.
Calculs : longueur développée, tolérance de pliage, angle de pliage.
Logiciels : AutoCAD, SolidWorks (dépliage automatique).
Normes : ASME Y14.5 (tolérances), SMACNA.',
NOW(), NOW()),

('ch_fer_03', 'cmt_ferblantier_001', 3, 'Cutting and Forming', 'Coupe et formage',
'Coupe manuelle : cisaille à main, grignoteuse, cisailles mécaniques.
Coupe industrielle : laser, plasma, jet d''eau, oxycoupage.
Formage : pliage (presse-plieuse), roulage, emboutissage.
Machine : frein à main, frein hydraulique, rouleuse, plieuse CNC.
Pliage : angle obtus, angle droit, ourlet, nervure, jonc.
Pli minimum selon épaisseur : ratio 2:1 (intérieur).
Sécurité : Protecteur, arrêt d''urgence, EPC.
Normes : CSA Z432 (sécurité des machines), Règlement SST CCQ.',
NOW(), NOW()),

('ch_fer_04', 'cmt_ferblantier_001', 4, 'Joining and Fastening', 'Assemblage et fixation',
'Méthodes d''assemblage : rivets (pop, aveugle), vis auto-perceuses, boulons, soudage (MIG, TIG, spot).
Soudure MIG : fil plein avec gaz (Argon/CO2), pour acier léger, alu, inox.
Soudure TIG : électrode tungstène + gaz Argon, meilleure qualité, plus lent.
Soudure par points : résistance électrique, surtout en industrie.
Rivets pop : en acier, alu, inox. Diamètres 3/32 à 1/4.
Espacement : 25-50mm centre-centre pour rivets/vis en toiture.
Colles et mastics : silicone, polyuréthane, butyl.
Normes : CSA W59 (soudage), Code CCQ.',
NOW(), NOW()),

('ch_fer_05', 'cmt_ferblantier_001', 5, 'Ventilation and Ductwork', 'Ventilation et conduits',
'Conduits : rectangulaires, ronds, flexibles. Matériaux : acier galvanisé, alu, acier inox.
Dimensions : selon les besoins de débit d''air (CFM, m3/h).
Raccords : coude (45, 90 degrés), té, réduction, cône, registre.
Étanchéité : joints agrafés, brides, collerettes, mastic, ruban adhésif.
Suspension : tiges filetées, cornières, supports (max 2.5m entre supports).
Isolation : prévention de condensation (vapeur), thermique, acoustique.
Normes : CSA B44, CNB, SMACNA Duct Construction Standards, RBQ.
Types de bâtiments : résidentiel, commercial, industriel.',
NOW(), NOW()),

('ch_fer_06', 'cmt_ferblantier_001', 6, 'Roofing and Cladding', 'Toiture et bardage',
'Types de toitures : joint debout, tôle nervurée, tuiles métalliques, bac acier.
Pentes minimales : joint debout (3:12), tuiles métalliques (5:12).
Fixation : clips cachés (joint debout), vis auto-perceuses (tôle nervurée). Espacement: 0.6m.
Bardage : panneaux muraux, vertical/horizontal, acier/aluminium.
Accessoires : solins, noues, faîtières, rives, chéneaux, descentes pluviales.
Étanchéité : membrane sous toiture, recouvrement minimal 100mm.
Dilatation thermique : joints de dilatation tous les 15m pour acier.
Normes : CNB 9.26 (couverture), CSA A123.5, RBQ.',
NOW(), NOW()),

('ch_fer_07', 'cmt_ferblantier_001', 7, 'Plans and Specifications', 'Plans et devis',
'Lecture de plans : plans d''architecture, plans de structure, plans mécaniques.
Symboles : conduits, registres, diffuseurs, grilles.
Échelles : 1:50, 1:100 (plans généraux), 1:10, 1:20 (détails).
Devis : clauses techniques, spécifications (CCDC), normes CCQ.
Quantités : métrique (m, m2, m3), impérial (pi, pi2, pi3).
Estimation des matériaux : pertes 5-10% selon complexité.
BIM (Building Information Modeling) : lecture de modèles 3D.
Normes : CNB, CCQ Devis-type, RBQ.',
NOW(), NOW()),

('ch_fer_08', 'cmt_ferblantier_001', 8, 'Health and Safety', 'Santé et sécurité',
'Équipements de protection : casque, lunettes, gants, harnais anti-chute, protecteurs auditifs.
Travail en hauteur : échafaudage (montage/inspection), plateforme élévatrice (formation).
Risques : coupures (tôles tranchantes), chutes, bruit (>85dB), inhalation de fumée de soudage.
Soudage : ventilation locale, masque à souder, gants de soudage.
Manutention : charges lourdes (tôles 1.2x2.4m max 40kg). Techniques de levage.
SIMDUT : Fiches de données de sécurité (FDS). Produits : mastics, solvants, gaz.
Procédures d''urgence : incendie, premiers soins, signalement CCQ.
Normes : LST (Loi santé-travail), Règlement SST CCQ, CNB 3.2.',
NOW(), NOW());
