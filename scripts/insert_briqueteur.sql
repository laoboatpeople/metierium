-- Briqueteur-maçon / Bricklayer (CCQ) - Trade + Chapters
INSERT INTO "Trade" (id, code, name, "nameFr", description, "createdAt", "updatedAt")
VALUES (
  'cmt_briqueteur_001',
  'BRIQUE',
  'Bricklayer',
  'Briqueteur-maçon',
  'Préparation à l''examen de certification CCQ en maçonnerie — brique, bloc, pierre, mortier et normes de construction.',
  NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Chapter" (id, "tradeId", number, name, "nameFr", "theoryContent", "createdAt", "updatedAt") VALUES
('ch_bri_01', 'cmt_briqueteur_001', 1, 'Materials and Masonry Units', 'Matériaux et unités de maçonnerie',
'Types briques : argile cuite (commune, face view), silico-calcaire, réfractaire.
Blocs de béton : standard (200x200x400mm), léger, lourd, isolé.
Pierres : granit, calcaire, grès, pierre de taille, moellon.
Normes : CSA A82 (briques), CSA A165 (blocs), BNQ.
Propriétés : résistance à la compression (MPa), absorption d''eau, résistance au gel.
Classes d''exposition : N (normal), S (sévère), A (agressif).
Couleurs et textures : lisse, texturée, émaillée, vieillie.',
NOW(), NOW()),

('ch_bri_02', 'cmt_briqueteur_001', 2, 'Mortar and Grout', 'Mortier et coulis',
'Types de mortier : M (forte résistance, 17.2MPa), S (standard, 12.4MPa), N (moyen, 5.2MPa), O (faible, 2.4MPa), K (très faible).
Composition : ciment Portland, chaux hydratée, sable, eau. Proportions selon type.
Sable : granulométrie (passant tamis 4.75mm), module de finesse, propreté.
Coulis : pour armature dans blocs (coulis fin, gros), coule dans les vides.
Préparation : malaxage (machine à mortier), temps de prise (2h), gâchée (30 min).
Essais : cône d''affaissement (mortier), résistance à la compression (cubes 50mm).
Normes : CSA A179 (mortier), CSA A371 (maçonnerie).',
NOW(), NOW()),

('ch_bri_03', 'cmt_briqueteur_001', 3, 'Bond Patterns and Laying', 'Appareillage et pose',
'Appareillages : courant (en panneresse), anglais (alterné panneresse/boutisse), flamand (panneresse-boutisse sur chaque rang), en pile, en chevron.
Pose : brique sur lit de mortier, joint de 10mm (±2mm). Arasement (niveau, fil à plomb).
Joints : creux (concave, en V, en gouge), plein, brossé, tiré.
Règles : recouvrement min 1/4 de brique, joints verticaux alternés, mailles de 600mm.
Coupes : briquette (3/4), demi-brique, quart de brique. Meuleuse ou scie à maçonnerie.
Murs : simple (100mm), double (200mm), avec cavité (250mm+).
Normes : CSA A371, CNB 9.20.2.',
NOW(), NOW()),

('ch_bri_04', 'cmt_briqueteur_001', 4, 'Cavity Walls and Veneer', 'Murs creux et parement',
'Murs à cavité : mur intérieur (bloc porteur), cavité (50-100mm), parement extérieur (brique).
Cavité : drainante (gravier, panneau drainant), trous d''égouttement (weepholes) au 600mm.
Ancrages : attaches métalliques (corrosion résistante), une par 0.2m2. Type Z, truss, à âme.
Isolation : panneaux rigides (polyisocyanurate, XPS), laine minérale dans cavité pare-vapeur.
Pare-air/pare-vapeur : membrane, feuille polyéthylène, côté chaud de l''isolant.
Solins : métal (alu, cuivre, acier inox) ou caoutchouc (EPDM). Au-dessus des ouvertures.
Normes : CNB 5.4.1, CSA A371, RBQ.',
NOW(), NOW()),

('ch_bri_05', 'cmt_briqueteur_001', 5, 'Openings and Arches', 'Ouvertures et arcs',
'Linteaux : acier (cornière, UPN), béton préfabriqué, pierre. Portée min 150mm appui.
Arcs : en plein cintre, surbaissé, en anse de panier, en ogive, plat.
Construction arc : cintre de support, claveaux (pierres taillées en coin), clef au centre.
Appuis de fenêtre : pierre calcaire, béton préfabriqué, brique d''appui inclinée (15 degrés).
Seuils de porte : pierre naturelle, granit, béton. Épaisseur selon portée.
Joints de dilatation : verticaux, tous les 6-10m selon type de mur. Mastic élastomère.
Normes : CNB 9.20, RBQ.',
NOW(), NOW()),

('ch_bri_06', 'cmt_briqueteur_001', 6, 'Stone Masonry', 'Maçonnerie de pierre',
'Types de pierre : granit (très dur), calcaire (tendre à mi-dur), grès, ardoise, marbre.
Appareillage : assisé (lits horizontaux réguliers), irrégulier (moellon), en opus.
Taille : sciage, bouchardage, ciselage, sablage. Finitions : adoucie, flammée, brossée.
Mortier pour pierre : type N ou O (faible résistance pour ne pas abîmer la pierre). Chaux importante.
Fixation : ancrages en acier inoxydable pour pierre de parement. Patins, agrafes, chevilles chimiques.
Mur de soutènement : pierre sèche (sans mortier), drain perforé au pied, gravier.
Restaurations : remplacement de pierre, nettoyage (vapeur, microbillage), rejointoiement.
Normes : CSA A371, RBQ.',
NOW(), NOW()),

('ch_bri_07', 'cmt_briqueteur_001', 7, 'Plans and Specifications', 'Plans et devis',
'Lecture de plans : plans architecturaux, élévations, coupes, détails de maçonnerie.
Symboles : brique, bloc, pierre, isolation, solin, ancrage.
Échelles : 1:50 (façades), 1:10, 1:5 (détails d''ancrage, solins).
Devis : CCQ Devis-type, clauses techniques. Sections maçonnerie, pierre, isolation.
Quantités : brique (unités/m2), bloc (unités/m2), mortier (L/m2), pierre (tonne/m3).
Brique/m2 : 60 briques standard (65x100x215mm) par m2 de mur.
Temps : estimation heures/tâche, productivité journalière (400-500 briques/jour).
BIM : modèles 3D, REP (relevé existant de précision).',
NOW(), NOW()),

('ch_bri_08', 'cmt_briqueteur_001', 8, 'Health and Safety', 'Santé et sécurité',
'Silice cristalline : poussière de brique/bloc/pierre (tronçonnage, sablage). Danger : silicose.
Contrôle : eau, aspiration à la source, masque N95, limite exposition (0.025 mg/m3).
Manutention : brique (40 unités max par palette, 25kg par brique de pavé). Levage mécanique.
Échafaudage : montage conforme (plans de montage, garde-corps 1m, plinthes).
Travail en hauteur : harnais antichute (>3m), points d''ancrage, longe avec absorbeur d''énergie.
Bruit : meuleuse (>100dB), scie à béton. Protection auditive obligatoire >85dB.
Météo : travail au froid/gel. Mortier ne doit pas geler. Protection des matériaux (bâche).
Équipements : casque, lunettes, gants, bottes à embout d''acier, protecteurs auditifs.
Normes : LST, Règlement SST CCQ, CNB 3.2.',
NOW(), NOW());
