-- Constructeur-rénovateur / Builder-Renovator License (RBQ) - Trade + Chapters
INSERT INTO "Trade" (id, code, name, "nameFr", description, "createdAt", "updatedAt")
VALUES (
  'cmt_constructeur_001',
  'CONSTR',
  'Builder-Renovator',
  'Constructeur-rénovateur',
  'Préparation à l''examen de licence RBQ pour constructeur-rénovateur — gestion d''entreprise, code de construction, sécurité et réglementation.',
  NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Chapter" (id, "tradeId", number, name, "nameFr", "theoryContent", "createdAt", "updatedAt") VALUES
('ch_con_01', 'cmt_constructeur_001', 1, 'RBQ License and Regulations', 'Licence RBQ et réglementation',
'Loi sur le bâtiment (RLRQ c. B-1.1) : cadre légal pour toute construction au Québec.
Catégories de licence : 1.1 (constructeur-propriétaire), 1.2 (promoteur immobilier).
Sous-catégories : résidentiel (maison, condo), commercial (bureau, commerce), industriel (usine, entrepôt).
Obligations : assurance RC (2M$), garantie habitation (neuf), registre RBQ, affichage chantier.
Inspection RBQ : avant début, pendant travaux, après finition. Avis de non-conformité.
Sanctions : amende (500-50000$), suspension licence, radiation.
Règlement sur la qualification : formation (AEC/DEP en construction), expérience (3-5 ans), examen réussi.
Code de déontologie : honnêteté, intégrité, compétence, secret professionnel.',
NOW(), NOW()),

('ch_con_02', 'cmt_constructeur_001', 2, 'Business Management', 'Gestion d''entreprise',
'Plan d''affaires : mission, marché, financement, prévisions. Budget annuel.
Comptabilité : bilan (actif/passif), état des résultats (revenus/dépenses), flux trésorerie.
Structure : entreprise individuelle, société (inc., SENC), coopérative.
Fiscalité : TPS/TVQ (inscription, déclaration), retenues à la source (CNT, RQAP).
Paiement des sous-traitants : délai max 31 jours après réception du paiement.
Loi sur les relations de travail : convention collective (CCQ), syndicat.
Assurances : RC (2M$ min), cautionnement, bris de machine, vol.
Ressources humaines : CNT (Commission des normes), équité, harcèlement, SST.',
NOW(), NOW()),

('ch_con_03', 'cmt_constructeur_001', 3, 'Construction Contracts and Law', 'Contrats et droit de la construction',
'Types de contrats : forfait (prix fixe), à forfait avec plafond, à prix coûtant majoré, géré (CPM).
Clauses essentielles : description travaux, prix, échéancier, pénalité retard, garantie.
Loi sur le bâtiment : obligations constructeur/rénovateur, garantie obligatoire.
CCDC (Canadian Construction Documents Committee) : contrats types (CCDC-1, 2, 5A, 9A).
Sous-traitance : contrat écrit obligatoire. Paiement direct (Loi) si sous-traitant non payé.
Hypothèques légales : privilège constructeur (30 jours après fin), préavis (60 jours).
Règlement de différends : médiation, arbitrage, Cour supérieure (50k$+).
Garantie habitation : GCR (3 ans matériaux, 5 ans bâtiment).',
NOW(), NOW()),

('ch_con_04', 'cmt_constructeur_001', 4, 'Building Code and Plans', 'Code de construction et plans',
'Code de construction (CCQ) : Chapitre I (bâtiment), Chapitre III (plomberie), Chapitre V (électricité).
Classification bâtiments : A (résidentiel), B (soins), C (réunion), D (commerce), E (industrie), F (entrepôt).
Plans et devis : architecturaux, structures, mécaniques, électriques. Échelles, symboles.
Permis : municipal (construction, rénovation), CSST, RBQ. Délais 15-60 jours.
Zonage : municipal (usage, hauteur, superficie, marges de recul).
Droits acquis : modifications avant nouvelles normes. Vert vs terrain existant.
Permis/certificats : conformité (RBQ), attestation (municipal), déclaration ouverture chantier.
Échéancier : loi sur les délais (construction, livraison maison neuve).',
NOW(), NOW()),

('ch_con_05', 'cmt_constructeur_001', 5, 'Site Management and Safety', 'Gestion de chantier et sécurité',
'Plan de chantier : accès, clôture, entreposage, circulation, signalisation.
Santé-sécurité : coordonnateur SST (ASP Construction) obligatoire si >200 000$.
SIMDUT : fiches signalétiques produits dangereux (carburant, colle, solvant, peinture).
Risques : chute (gardes, harnais), effondrement excavation, électrocution.
Équipements : échafaudage (montage, inspecteur qualifié), plateforme élévatrice.
Commission des normes (CNT) : affichage heures, pauses, repas, congés.
RSST : Règlement sur la santé et la sécurité du travail. Obligation employeur.
Registre SST : formation (ASP), rapports d''incidents, statistiques, affichage.',
NOW(), NOW()),

('ch_con_06', 'cmt_constructeur_001', 6, 'Project Estimation and Budget', 'Estimation et budget de projet',
'Types d''estimation : préliminaire (±30%), sommaire (±15%), détaillée (±5%).
Quantités : m2 (surface de plancher), m3 (béton), unités (portes, fenêtres).
Coûts directs : matériaux, main-d''œuvre, équipement, sous-traitants.
Coûts indirects : assurance, permis, supervision, nettoyage, entreposage.
Marge bénéficiaire : 10-15% (résidentiel), 15-25% (commercial), 5-10% (institutionnel).
Contingence : 5-10% sur estimation (imprévus, changements de dernière minute).
Soumission : préparée, signée, datée. Délai de validité indiqué (30-60 jours).
Logiciels : estimation assistée par ordinateur, tableur, spécialisé construction.',
NOW(), NOW()),

('ch_con_07', 'cmt_constructeur_001', 7, 'Materials and Methods', 'Matériaux et méthodes',
'Fondations : semelle (béton armé, largeur min 300mm), mur fondation (béton, blocs).
Structure : bois (2x4, 2x6, 2x10, bois d''ingénierie LVL), acier (charpente), béton (poteau/dalle).
Toiture : fermes de toit (bois), pente (4:12 à 12:12), couverture (bardeau asphalte, acier).
Isolation : laine minérale (R3.8/po), polyuréthane (R6.5/po), polystyrène (R4/po).
Fenêtres : double/triple vitrage, U-value (0.30-0.50), ENERGIE STAR.
Revêtement extérieur : brique, pierre, vinyle, bois, fibre-ciment.
Planchers : bois franc, stratifié, céramique, vinyle. Sous-plancher (OSB 5/8).
Finitions : peinture, gypse, céramique, armoires, comptoirs, plomberie, électricité.',
NOW(), NOW()),

('ch_con_08', 'cmt_constructeur_001', 8, 'Quality Control and Warranty', 'Contrôle qualité et garantie',
'Inspections obligatoires : fondation (avant coulage), structure (mur, toit), isolation, finition RBQ.
Garantie habitation : GCR (Garantie Construction Résidentielle). Matériaux 3 ans, structure 5 ans.
Garantie légale : vice caché (5 ans bâtiment, découverte dans 2 premières années).
Bon de commande : description précise des travaux, prix, délais, garanties.
Réception des travaux : procès-verbal (PV), réserves (liste déficiences), correction 30 jours.
Service après-vente : 3 mois pour ajustements mineurs, 12 mois pour garantie matériaux.
Registre qualité : photos avant/après, rapports d''inspection, certificats matériaux.
Satisfaction client : communication, transparence, respect des délais et du budget.',
NOW(), NOW());
