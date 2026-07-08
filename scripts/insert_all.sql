#!/bin/bash
# Insert chapters and questions for HVAC and MVL
DB="sudo -u postgres psql -d certificationquebec"

# ---- HVAC CHAPTERS ----
$DB <<SQL
INSERT INTO "Chapter" (id, "tradeId", number, name, "nameFr", "theoryContent", "createdAt", "updatedAt") VALUES
('ch_hvac_01', 'cmt_hvac_001', 1, 'Thermodynamics and Heat Transfer', 'Thermodynamique et transfert thermique',
E'La thermodynamique etudie les transformations de l energie en HVAC.\n\nUnites : BTU/h (imperial), kW (SI). 1 tonne refrigeration = 12 000 BTU/h.\nSEER : ratio efficacite energetique saisonnier.\n\nTransfert thermique :\n1. Conduction (loi de Fourier, valeur R)\n2. Convection (echangeurs, ailettes)\n3. Rayonnement (planchers radiants)\n\nCycle refrigeration :\n1. Compression : pression et temperature augmentent\n2. Condensation : gaz devient liquide, cede chaleur\n3. Detente : pression diminue\n4. Evaporation : liquide absorbe chaleur de l air',
NOW(), NOW());

INSERT INTO "Chapter" (id, "tradeId", number, name, "nameFr", "theoryContent", "createdAt", "updatedAt") VALUES
('ch_hvac_02', 'cmt_hvac_001', 2, 'Heating Systems', 'Systemes de chauffage',
E'Fournaises : gaz (AFUE 80-98%), electrique (100%).\nChaudieres : gaz standard (60-80C), condensation (95%).\nPompes a chaleur : air-air (COP 2-4, -25C mini), geothermique (COP 3-5).\nAFUE minimal 90% pour nouvelles fournaises au Quebec.',
NOW(), NOW());

INSERT INTO "Chapter" (id, "tradeId", number, name, "nameFr", "theoryContent", "createdAt", "updatedAt") VALUES
('ch_hvac_03', 'cmt_hvac_001', 3, 'Air Conditioning and Refrigeration', 'Climatisation et refrigeration',
E'Composants : compresseur (scroll, alternatif), condenseur, detendeur (TXV), evaporateur.\nNorme CSA F280 pour dimensionnement.\nDegivrage : arret naturel, resistance electrique, inversion cycle.',
NOW(), NOW());

INSERT INTO "Chapter" (id, "tradeId", number, name, "nameFr", "theoryContent", "createdAt", "updatedAt") VALUES
('ch_hvac_04', 'cmt_hvac_001', 4, 'Ventilation and Air Distribution', 'Ventilation et distribution d air',
E'VRC : transfere chaleur air vicie vers air frais, efficacite 60-85%, obligatoire nouvelles constructions.\nVRE : transfere aussi humidite.\nConduits : rigides (acier) vs flexibles.\nCFM : debit d air. Pression statique : 0.1-0.5 po CE.\nEquilibrage essentiel.',
NOW(), NOW());

INSERT INTO "Chapter" (id, "tradeId", number, name, "nameFr", "theoryContent", "createdAt", "updatedAt") VALUES
('ch_hvac_05', 'cmt_hvac_001', 5, 'Controls and Thermostatics', 'Controles et thermostatiques',
E'Thermostats : mecanique (±1C), electronique (±0.3C, programmable), intelligent (Wi-Fi).\nSequence chauffage : appel chaleur -> vanne gaz -> flamme -> ventilateur (30-60s).\nSequence climatisation : appel froid -> compresseur (3-5min) -> ventilateur.\nDDC : controle centralise automatise.',
NOW(), NOW());

INSERT INTO "Chapter" (id, "tradeId", number, name, "nameFr", "theoryContent", "createdAt", "updatedAt") VALUES
('ch_hvac_06', 'cmt_hvac_001', 6, 'Refrigerants and Environment', 'Refrigerants et environnement',
E'CFC (R-12) : interdit. HCFC (R-22) : phase progressive.\nHFC (R-410A) : courant, GWP 2088.\nHFO (R-32) : GWP 675.\nNaturels : R-290 propane (GWP 3, inflammable), R-744 CO2 (GWP 1).\nProtocole Montreal : elimination CFC/HCFC.\nAccord Kigali : reduction HFC 85% d ici 2036.\nCertification obligatoire manipulation refrigerants.',
NOW(), NOW());

INSERT INTO "Chapter" (id, "tradeId", number, name, "nameFr", "theoryContent", "createdAt", "updatedAt") VALUES
('ch_hvac_07', 'cmt_hvac_001', 7, 'Codes and Standards (RBQ/B149)', 'Codes et normes (RBQ/B149)',
E'RBQ : Regie du batiment du Quebec.\nCSA B149.1 : installation appareils a gaz (degagement 24 pouces).\nCSA F280 : dimensionnement CVC residentiel.\nAFUE minimal 90% nouvelles fournaises.\nLicence RBQ sous-categorie 15 pour entrepreneurs HVAC.',
NOW(), NOW());

INSERT INTO "Chapter" (id, "tradeId", number, name, "nameFr", "theoryContent", "createdAt", "updatedAt") VALUES
('ch_hvac_08', 'cmt_hvac_001', 8, 'Safety and Tools', 'Securite et outils',
E'EPI : casque, lunettes, gants, chaussures, protection auditive, harnais.\nSecurite electrique : verifier absence tension, lockout/tagout.\nManipulation refrigerants : recuperation obligatoire, bouteilles certifiees 400+ psi.\nOutils : anemometre, manometre, thermometre infrarouge, detecteur fuites.',
NOW(), NOW());
SQL

# ---- MVL CHAPTERS ----
$DB <<SQL
INSERT INTO "Chapter" (id, "tradeId", number, name, "nameFr", "theoryContent", "createdAt", "updatedAt") VALUES
('ch_mvl_01', 'cmt_mvl_001', 1, 'Diesel Engines', 'Moteurs diesel',
E'Cycle 4 temps : admission, compression (14:1 a 25:1), detente (auto-inflammation), echappement.\nInjection common rail : 1000-3000 bars.\nTurbocompresseur : entraine par gaz echappement.\nIntercooler : refroidit air admission.\nVidange huile : 15 000-25 000 km. Duree vie : 800 000-1 500 000 km.',
NOW(), NOW());

INSERT INTO "Chapter" (id, "tradeId", number, name, "nameFr", "theoryContent", "createdAt", "updatedAt") VALUES
('ch_mvl_02', 'cmt_mvl_001', 2, 'Transmissions and Gearboxes', 'Transmissions et boites de vitesses',
E'Manuelle : non synchronisee (double debrayage), synchronisee.\nAutomatisee : AMT (Eaton), DCT, automatique (Allison convertisseur couple).\nConvertisseur couple : pompe, turbine, stator.\nPTO : prise de force pour equipement annexe.\nVidange : manuelle 100 000 km, automatique 50 000 km.',
NOW(), NOW());

INSERT INTO "Chapter" (id, "tradeId", number, name, "nameFr", "theoryContent", "createdAt", "updatedAt") VALUES
('ch_mvl_03', 'cmt_mvl_001', 3, 'Hydraulic Systems', 'Systemes hydrauliques',
E'Principe Pascal : pression transmise uniformement.\nPompes : engrenages (courant, 250 bars), pistons (400 bars).\n80% pannes = contamination fluide.\nVerin simple/double effet, telescopique.\nFiltre : 500 heures. Purge air apres intervention.',
NOW(), NOW());

INSERT INTO "Chapter" (id, "tradeId", number, name, "nameFr", "theoryContent", "createdAt", "updatedAt") VALUES
('ch_mvl_04', 'cmt_mvl_001', 4, 'Electrical Systems', 'Systemes electriques',
E'12V ou 24V (camions lourds).\nBatteries : plomb-acide, AGM, gel, lithium. CCA 900-1000 au Quebec.\nAlternateur : 13.8-14.4V, 100-200A.\nCAN bus : 250 kbit/s, terminaison 120 ohms.\n50% problemes = masse.\nChauffe-bloc : 1000-1500W.',
NOW(), NOW());

INSERT INTO "Chapter" (id, "tradeId", number, name, "nameFr", "theoryContent", "createdAt", "updatedAt") VALUES
('ch_mvl_05', 'cmt_mvl_001', 5, 'Air Brake Systems', 'Freins pneumatiques',
E'Pression service : 100-120 psi.\nComposants : compresseur, reservoirs (humide+secs), regulateur, valve protection.\nFreins : tambour (came, machoires), disque (etrier).\nABS : capteurs vitesse + modulateurs.\nPurge reservoirs : quotidienne. Test fuite : max 2 psi/min.',
NOW(), NOW());

INSERT INTO "Chapter" (id, "tradeId", number, name, "nameFr", "theoryContent", "createdAt", "updatedAt") VALUES
('ch_mvl_06', 'cmt_mvl_001', 6, 'Steering and Suspension', 'Direction et suspension',
E'Direction hydraulique : pompe + cremaillere + verin.\nAngles : chasse (stabilite), carrossage (usure pneus), parallellisme.\nSuspension : ressorts lames (courant), pneumatique air ride (confort).\nAlignement : 100 000 km.',
NOW(), NOW());

INSERT INTO "Chapter" (id, "tradeId", number, name, "nameFr", "theoryContent", "createdAt", "updatedAt") VALUES
('ch_mvl_07', 'cmt_mvl_001', 7, 'Electronic Diagnostics', 'Diagnostic electronique',
E'Calculateurs : ECM (moteur), TCM (transmission), ABS/ESP.\nProtocole SAE J1939 : CAN bus, DTC = SPN-FMI.\nSPN 100 = pression d huile, FMI 3 = tension haute.\nOutils : scanneur Insite (Cummins), DDDL (Detroit).',
NOW(), NOW());

INSERT INTO "Chapter" (id, "tradeId", number, name, "nameFr", "theoryContent", "createdAt", "updatedAt") VALUES
('ch_mvl_08', 'cmt_mvl_001', 8, 'Safety and CCQ Standards', 'Securite et normes CCQ',
E'CCQ : Commission construction Quebec.\nCarte competence CCQ (2 ans). SST-01 : sante securite chantiers.\nLockout/tagout, cales roues, chandelles securite.\nPont elevateur : capacite 1.5x poids.\nNVIS : inspection annuelle. CVOR : registre securite transporteurs.',
NOW(), NOW());
SQL

echo "=== Chapters inserted ==="

# ---- QUESTIONS HVAC ----
$DB <<SQL
INSERT INTO "Question" (id, "tradeId", "chapterId", question, options, answer, difficulty, type, locale, "createdAt", "updatedAt") VALUES
('qh_01', 'cmt_hvac_001', 'ch_hvac_01', 'Quelle unite mesure la puissance des systemes de climatisation en Amerique du Nord ?', '["Watts", "BTU/h", "Joules", "Pascals"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qh_02', 'cmt_hvac_001', 'ch_hvac_01', '3 tonnes de refrigeration = ? BTU/h', '["24 000", "36 000", "48 000", "12 000"]', 'B', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qh_03', 'cmt_hvac_001', 'ch_hvac_01', 'Quel mode de transfert thermique predomine dans un echangeur a plaques ?', '["Conduction", "Convection", "Rayonnement", "Evaporation"]', 'B', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qh_04', 'cmt_hvac_001', 'ch_hvac_01', 'Le SEER mesure :', '["La puissance sonore", "L efficacite energetique saisonniere", "La pression du refriger ant", "Le debit d air"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qh_05', 'cmt_hvac_001', 'ch_hvac_01', 'Quel composant augmente la pression du refrigerant ?', '["Evaporateur", "Detendeur", "Compresseur", "Condenseur"]', 'C', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qh_06', 'cmt_hvac_001', 'ch_hvac_01', '12 000 BTU/h = ? kW', '["1 kW", "3,517 kW", "5 kW", "10 kW"]', 'B', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qh_07', 'cmt_hvac_001', 'ch_hvac_01', 'Un COP de 3 signifie :', '["Consomme 3 kW pour produire 1 kW", "Produit 3 kW de chaleur pour 1 kW consomme", "Rendement 30%", "3 tonnes de froid"]', 'B', 'HARD', 'MCQ', 'fr', NOW(), NOW()),
('qh_08', 'cmt_hvac_001', 'ch_hvac_01', 'Dans un condenseur, le refrigerant passe de :', '["Liquide a gazeux", "Gazeux a liquide", "Solide a liquide", "Gazeux a plasma"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qh_09', 'cmt_hvac_001', 'ch_hvac_01', 'La valeur R mesure :', '["La resistance electrique", "La resistance thermique", "La rigidite", "La densite"]', 'B', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qh_10', 'cmt_hvac_001', 'ch_hvac_01', 'Le cycle de refrigeration commence par :', '["Evaporation", "Compression", "Detente", "Condensation"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qh_11', 'cmt_hvac_001', 'ch_hvac_02', 'L AFUE mesure :', '["Le debit d air", "Le rendement de combustion annuel", "La pression du gaz", "La temperature"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qh_12', 'cmt_hvac_001', 'ch_hvac_02', 'AFUE d une fournaise a condensation ?', '["80%", "90%", "95%+", "70%"]', 'C', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qh_13', 'cmt_hvac_001', 'ch_hvac_02', 'Quel systeme est le plus efficace par grand froid au Quebec ?', '["PAC air-air", "Fournaise gaz condensation", "Plinthe electrique", "PAC seule"]', 'B', 'HARD', 'MCQ', 'fr', NOW(), NOW()),
('qh_14', 'cmt_hvac_001', 'ch_hvac_02', 'Le COP d une PAC diminue quand :', '["T ext augmente", "T ext diminue", "Debit air augmente", "Humidite diminue"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qh_15', 'cmt_hvac_001', 'ch_hvac_02', 'Temperature mini PAC air-air standard ?', '["-10C", "-15C", "-25C", "-40C"]', 'C', 'HARD', 'MCQ', 'fr', NOW(), NOW()),
('qh_16', 'cmt_hvac_001', 'ch_hvac_02', 'PAC geothermique utilise comme source :', '["L air exterieur", "Le sol ou l eau souterraine", "Le gaz naturel", "L electricite"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qh_17', 'cmt_hvac_001', 'ch_hvac_02', 'Quel appareil utilise un echangeur de chaleur ?', '["Ventilateur", "Fournaise a gaz", "Humidificateur", "Filtre a air"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qh_18', 'cmt_hvac_001', 'ch_hvac_02', 'Rendement le plus eleve pour une chaudiere ?', '["Standard", "Condensation", "Vapeur", "Electrique"]', 'B', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qh_19', 'cmt_hvac_001', 'ch_hvac_03', 'Compresseur le plus courant en residentiel Quebec ?', '["Alternatif", "Scroll (spiral)", "Centrifuge", "Vis"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qh_20', 'cmt_hvac_001', 'ch_hvac_03', 'Role du TXV ?', '["Comprimer le refrigerant", "Reduire la pression du liquide", "Chauffer le refrigerant", "Filtrer le refrigerant"]', 'B', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qh_21', 'cmt_hvac_001', 'ch_hvac_03', 'A l evaporateur, le refrigerant absorbe la chaleur de :', '["L air exterieur", "L air ambiant interieur", "Le compresseur", "Le condenseur"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qh_22', 'cmt_hvac_001', 'ch_hvac_03', 'Pression basse cote d un systeme R-410A ?', '["50-70 psi", "100-150 psi", "200-300 psi", "400-500 psi"]', 'B', 'HARD', 'MCQ', 'fr', NOW(), NOW()),
('qh_23', 'cmt_hvac_001', 'ch_hvac_03', 'Degivrage par inversion de cycle :', '["Arret du systeme", "Mode chauffage temporaire", "Ventilateur inverse", "Filtre inverse"]', 'B', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qh_24', 'cmt_hvac_001', 'ch_hvac_03', 'Une tonne de refrigeration =', '["6 000 BTU/h", "12 000 BTU/h", "24 000 BTU/h", "3 000 BTU/h"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qh_25', 'cmt_hvac_001', 'ch_hvac_03', 'CSA F280 sert a :', '["Dimensionner les systemes CVC", "Rendement compresseur", "Certifier refrigerants", "Pertes de charge"]', 'A', 'HARD', 'MCQ', 'fr', NOW(), NOW()),
('qh_26', 'cmt_hvac_001', 'ch_hvac_04', 'VRC obligatoire dans :', '["Tous les batiments", "Nouvelles constructions residentielles", "Garages", "Entrepots"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qh_27', 'cmt_hvac_001', 'ch_hvac_04', 'Efficacite typique d un VRC ?', '["30-40%", "60-85%", "90-99%", "10-20%"]', 'B', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qh_28', 'cmt_hvac_001', 'ch_hvac_04', 'VRE se distingue par sa capacite a transferer :', '["La pression", "L humidite", "Le son", "Les particules"]', 'B', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qh_29', 'cmt_hvac_001', 'ch_hvac_04', 'Debit d air mesure en :', '["BTU/h", "CFM", "PSI", "Watt"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qh_30', 'cmt_hvac_001', 'ch_hvac_04', 'Quel conduit minimise les pertes de charge ?', '["Rectangulaire", "Circulaire", "Flexible", "Carre"]', 'B', 'HARD', 'MCQ', 'fr', NOW(), NOW()),
('qh_31', 'cmt_hvac_001', 'ch_hvac_04', 'Pression statique residentielle typique :', '["0.01-0.05 po CE", "0.1-0.5 po CE", "2-5 po CE", "10-20 po CE"]', 'B', 'HARD', 'MCQ', 'fr', NOW(), NOW()),
('qh_32', 'cmt_hvac_001', 'ch_hvac_04', 'Role d un registre (damper) ?', '["Mesurer le debit", "Ajuster le debit par section", "Filtrer l air", "Chauffer l air"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qh_33', 'cmt_hvac_001', 'ch_hvac_05', 'Capteur le plus precis dans un thermostat electronique ?', '["Bilame metallique", "Thermistance NTC", "Thermocouple", "A mercure"]', 'B', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qh_34', 'cmt_hvac_001', 'ch_hvac_05', 'Delai protection compresseur avant redemarrage ?', '["30 sec", "3-5 min", "30 min", "1 heure"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qh_35', 'cmt_hvac_001', 'ch_hvac_05', 'Vanne a retour par ressort : securite sur', '["Perte de courant", "Perte de debit", "Perte de pression", "Surchauffe"]', 'A', 'HARD', 'MCQ', 'fr', NOW(), NOW()),
('qh_36', 'cmt_hvac_001', 'ch_hvac_05', 'DDC permet :', '["Chauffage manuel", "Controle centralise automatise", "Mesure de debit", "Diagnostic refrigerants"]', 'B', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qh_37', 'cmt_hvac_001', 'ch_hvac_05', 'Zonage utilise :', '["Un thermostat", "Plusieurs thermostats + volets", "Compresseur supplementaire", "Reservoir expansion"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qh_38', 'cmt_hvac_001', 'ch_hvac_06', 'R-410A remplace principalement le :', '["R-12", "R-22", "R-134a", "R-404A"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qh_39', 'cmt_hvac_001', 'ch_hvac_06', 'GWP du R-410A ?', '["675", "2088", "3922", "4"]', 'B', 'HARD', 'MCQ', 'fr', NOW(), NOW()),
('qh_40', 'cmt_hvac_001', 'ch_hvac_06', 'Refrigerant naturel GWP 3, inflammable ?', '["R-744 (CO2)", "R-290 (Propane)", "R-32", "R-1234yf"]', 'B', 'HARD', 'MCQ', 'fr', NOW(), NOW()),
('qh_41', 'cmt_hvac_001', 'ch_hvac_06', 'Protocole de Montreal visait :', '["GES", "Substances appauvrissant ozone", "COV", "Particules"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qh_42', 'cmt_hvac_001', 'ch_hvac_06', 'Avant d ouvrir circuit refrigeration :', '["Vidanger huile", "Recuperer refrigerant", "Depressuriser a air", "Chauffer circuit"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qh_43', 'cmt_hvac_001', 'ch_hvac_06', 'GWP du R-32 ?', '["2088", "675", "1430", "4"]', 'B', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qh_44', 'cmt_hvac_001', 'ch_hvac_06', 'Accord Kigali reduit :', '["CFC", "HFC", "HCFC", "COV"]', 'B', 'HARD', 'MCQ', 'fr', NOW(), NOW()),
('qh_45', 'cmt_hvac_001', 'ch_hvac_07', 'Organisme superviseur installations HVAC Quebec ?', '["CCQ", "RBQ", "CNESST", "CSA"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qh_46', 'cmt_hvac_001', 'ch_hvac_07', 'CSA B149 concerne :', '["Electrique", "Gaz", "Plomberie", "Ventilation"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qh_47', 'cmt_hvac_001', 'ch_hvac_07', 'Degagement minimum devant appareil a gaz ?', '["6 po", "12 po", "24 po", "48 po"]', 'C', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qh_48', 'cmt_hvac_001', 'ch_hvac_07', 'AFUE minimal requis Quebec nouvelles fournaises ?', '["70%", "80%", "90%", "95%"]', 'C', 'HARD', 'MCQ', 'fr', NOW(), NOW()),
('qh_49', 'cmt_hvac_001', 'ch_hvac_07', 'Licence RBQ requise pour :', '["Conduire camion", "Installer HVAC commercial", "Vendre thermostats", "Enseigner HVAC"]', 'B', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qh_50', 'cmt_hvac_001', 'ch_hvac_08', 'EPI obligatoire chantier Quebec ?', '["Casque securite", "Gants cuir", "Bottes caoutchouc", "Masque gaz"]', 'A', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qh_51', 'cmt_hvac_001', 'ch_hvac_08', 'Avant circuit electrique :', '["Verifier absence tension", "Debrancher batterie", "Porter gants", "Tout ces reponses"]', 'D', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qh_52', 'cmt_hvac_001', 'ch_hvac_08', 'Outil mesure vitesse air conduits ?', '["Manometre", "Anemometre", "Thermometre", "Multimetre"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qh_53', 'cmt_hvac_001', 'ch_hvac_08', 'Angle echelle/mur ?', '["45 deg", "60 deg", "75 deg", "90 deg"]', 'C', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qh_54', 'cmt_hvac_001', 'ch_hvac_08', 'Inhalation refrigerant : premiere action ?', '["Appeler 911", "Sortir a air frais", "Donner eau", "Bouche-a-bouche"]', 'B', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qh_55', 'cmt_hvac_001', 'ch_hvac_08', 'Alliage brasage standard HVAC ?', '["5% argent", "15% argent", "30% argent", "50% argent"]', 'B', 'HARD', 'MCQ', 'fr', NOW(), NOW()),
('qh_56', 'cmt_hvac_001', 'ch_hvac_08', 'Detecteur CO installe :', '["Salle bain", "Locaux avec appareils gaz", "Exterieur", "Garage"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW());
SQL

# ---- QUESTIONS MVL ----
$DB <<SQL
INSERT INTO "Question" (id, "tradeId", "chapterId", question, options, answer, difficulty, type, locale, "createdAt", "updatedAt") VALUES
('qm_01', 'cmt_mvl_001', 'ch_mvl_01', 'Rapport compression typique moteur diesel ?', '["8:1-10:1", "14:1-25:1", "5:1-7:1", "30:1-40:1"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qm_02', 'cmt_mvl_001', 'ch_mvl_01', 'Composant qui pulverise carburant ?', '["Pompe injection", "Injecteur", "Turbocompresseur", "Soupape"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qm_03', 'cmt_mvl_001', 'ch_mvl_01', 'Turbocompresseur entraine par :', '["Courroie", "Gaz echappement", "Moteur electrique", "Arbre a cames"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qm_04', 'cmt_mvl_001', 'ch_mvl_01', 'Moteur diesel se distingue par :', '["Bougies", "Allumage compression", "Carburateur", "Vilebrequin long"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qm_05', 'cmt_mvl_001', 'ch_mvl_01', 'Pression injection common rail ?', '["100-500 bars", "1000-3000 bars", "50-100 bars", "5000-10000 bars"]', 'B', 'HARD', 'MCQ', 'fr', NOW(), NOW()),
('qm_06', 'cmt_mvl_001', 'ch_mvl_01', 'Vidange huile diesel lourd ?', '["5 000 km", "15 000-25 000 km", "50 000 km", "1x/annee"]', 'B', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qm_07', 'cmt_mvl_001', 'ch_mvl_01', 'Intercooler sert a :', '["Refroidir huile", "Refroidir air admission apres turbo", "Refroidir carburant", "Refroidir gaz echappement"]', 'B', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qm_08', 'cmt_mvl_001', 'ch_mvl_01', 'Separateur eau important au Quebec cause :', '["Chaleur", "Condensation hivernale", "Poussiere", "Vibrations"]', 'B', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qm_09', 'cmt_mvl_001', 'ch_mvl_02', 'Transmission non synchronisee necessite :', '["Convertisseur couple", "Double debrayage", "Embrayage auto", "Arbre transmission"]', 'B', 'HARD', 'MCQ', 'fr', NOW(), NOW()),
('qm_10', 'cmt_mvl_001', 'ch_mvl_02', 'Convertisseur couple comprend :', '["Pompe turbine stator", "Embrayage volant arbre", "Pistons cylindres vannes", "Ressorts amortisseurs"]', 'A', 'HARD', 'MCQ', 'fr', NOW(), NOW()),
('qm_11', 'cmt_mvl_001', 'ch_mvl_02', 'PTO sert a :', '["Augmenter vitesse", "Alimenter equipement annexe", "Freiner", "Changer vitesse"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qm_12', 'cmt_mvl_001', 'ch_mvl_02', 'Vidange transmission automatique ?', '["25 000 km", "50 000 km", "100 000 km", "200 000 km"]', 'B', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qm_13', 'cmt_mvl_001', 'ch_mvl_02', 'Symptome synchroniseur use :', '["Bruit freinage", "Difficulte passer vitesses", "Vibration haute vitesse", "Fuite huile"]', 'B', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qm_14', 'cmt_mvl_001', 'ch_mvl_03', 'Pompe hydraulique la plus courante ?', '["Pistons", "Engrenages", "Palettes", "Centrifuge"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qm_15', 'cmt_mvl_001', 'ch_mvl_03', '% pannes hydrauliques causees contamination ?', '["20%", "50%", "80%", "95%"]', 'C', 'HARD', 'MCQ', 'fr', NOW(), NOW()),
('qm_16', 'cmt_mvl_001', 'ch_mvl_03', 'Verin double effet permet :', '["Une direction", "Deux directions", "Rotation", "Mouvement intermittent"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qm_17', 'cmt_mvl_001', 'ch_mvl_03', 'Accumulateur sert a :', '["Augmenter pression", "Stocker energie hydraulique", "Filtrer huile", "Refroidir fluide"]', 'B', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qm_18', 'cmt_mvl_001', 'ch_mvl_03', 'Cavitation causee par :', '["Pression haute", "Manque huile aspiration", "Exces huile", "Temp basse"]', 'B', 'HARD', 'MCQ', 'fr', NOW(), NOW()),
('qm_19', 'cmt_mvl_001', 'ch_mvl_04', 'Tension electrique camion lourd ?', '["12V", "24V", "48V", "6V"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qm_20', 'cmt_mvl_001', 'ch_mvl_04', 'CCA mesure :', '["Capacite batterie", "Demarrage a froid", "Tension vide", "Courant charge"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qm_21', 'cmt_mvl_001', 'ch_mvl_04', 'Alternateur camion lourd produit :', '["50-80A", "100-200A", "300-500A", "20-40A"]', 'B', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qm_22', 'cmt_mvl_001', 'ch_mvl_04', 'Resistance terminaison CAN bus ?', '["60 ohms", "120 ohms", "240 ohms", "1k ohms"]', 'B', 'HARD', 'MCQ', 'fr', NOW(), NOW()),
('qm_23', 'cmt_mvl_001', 'ch_mvl_04', '% problemes electriques cause masse ?', '["10%", "50%", "75%", "90%"]', 'B', 'HARD', 'MCQ', 'fr', NOW(), NOW()),
('qm_24', 'cmt_mvl_001', 'ch_mvl_04', 'Puissance chauffe-bloc diesel ?', '["100W", "500W", "1000-1500W", "3000W"]', 'C', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qm_25', 'cmt_mvl_001', 'ch_mvl_04', 'Tension charge alternateur ?', '["12.0-12.6V", "13.8-14.4V", "14.8-15.5V", "11.5-12.0V"]', 'B', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qm_26', 'cmt_mvl_001', 'ch_mvl_05', 'Pression service freins pneumatiques ?', '["60-80 psi", "100-120 psi", "150-200 psi", "30-50 psi"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qm_27', 'cmt_mvl_001', 'ch_mvl_05', 'Reservoir humide sert a :', '["Stocker air parking", "Condenser humidite", "Alimenter suspension", "Refroidir compresseur"]', 'B', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qm_28', 'cmt_mvl_001', 'ch_mvl_05', 'Deshydrateur air :', '["Augmente pression", "Filtre humidite contaminants", "Rechauffe air", "Lubrifie systeme"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qm_29', 'cmt_mvl_001', 'ch_mvl_05', 'ABS empeche :', '["Freinage", "Blocage roues freinage urgence", "Acceleration", "Derapage virage"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qm_30', 'cmt_mvl_001', 'ch_mvl_05', 'Frein stationnement se libere quand :', '["Pression air presente", "Ressort comprime", "Pedale frein enfoncee", "Moteur tourne"]', 'A', 'HARD', 'MCQ', 'fr', NOW(), NOW()),
('qm_31', 'cmt_mvl_001', 'ch_mvl_06', 'Suspension pneumatique utilise :', '["Ressorts lames", "Coussins air gonflables", "Barres torsion", "Amortisseurs hydrauliques"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qm_32', 'cmt_mvl_001', 'ch_mvl_06', 'Angle chasse influence :', '["Usure pneus", "Stabilite ligne droite", "Capacite charge", "Puissance"]', 'B', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qm_33', 'cmt_mvl_001', 'ch_mvl_06', 'Usure dent scie pneus indique :', '["Carrossage", "Parallellisme", "Surgonflage", "Surcharge"]', 'B', 'HARD', 'MCQ', 'fr', NOW(), NOW()),
('qm_34', 'cmt_mvl_001', 'ch_mvl_06', 'Essieu relevable sert a :', '["Augmenter puissance", "Plus de poids si charge", "Ameliorer direction", "Reduire bruit"]', 'B', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qm_35', 'cmt_mvl_001', 'ch_mvl_07', 'Protocole standard vehicules lourds ?', '["OBDII", "SAE J1939", "Bluetooth", "WiFi"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qm_36', 'cmt_mvl_001', 'ch_mvl_07', 'SPN 100 dans code J1939 =', '["Regime moteur", "Pression huile", "Temp liquide", "Pression suralim"]', 'B', 'HARD', 'MCQ', 'fr', NOW(), NOW()),
('qm_37', 'cmt_mvl_001', 'ch_mvl_07', 'FMI 3 signifie :', '["Donnees basses", "Tension haute", "Courant bas", "Donnees erratiques"]', 'B', 'HARD', 'MCQ', 'fr', NOW(), NOW()),
('qm_38', 'cmt_mvl_001', 'ch_mvl_07', 'DLC vehicule lourd a :', '["16 broches", "6 ou 9 broches", "4 broches", "12 broches"]', 'B', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qm_39', 'cmt_mvl_001', 'ch_mvl_07', 'Insite pour diagnostiquer moteurs :', '["Detroit", "Cummins", "Volvo", "PACCAR"]', 'B', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qm_40', 'cmt_mvl_001', 'ch_mvl_08', 'Organisme formation construction Quebec ?', '["RBQ", "CCQ", "CNESST", "MTQ"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qm_41', 'cmt_mvl_001', 'ch_mvl_08', 'SST-01 couvre :', '["Mecanique diesel", "Sante securite chantiers", "Hydraulique", "Electricite"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qm_42', 'cmt_mvl_001', 'ch_mvl_08', 'Avant vehicule leve :', '["Demarrer moteur", "Chandelles securite", "Retirer roues", "Vidanger huile"]', 'B', 'EASY', 'MCQ', 'fr', NOW(), NOW()),
('qm_43', 'cmt_mvl_001', 'ch_mvl_08', 'Capacite levage mini pont elevateur ?', '["1x poids", "1.5x poids", "2x poids", "3x poids"]', 'B', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qm_44', 'cmt_mvl_001', 'ch_mvl_08', 'NVIS concerne :', '["Emissions", "Inspection vehicules lourds", "Bruit", "Formation"]', 'B', 'MEDIUM', 'MCQ', 'fr', NOW(), NOW()),
('qm_45', 'cmt_mvl_001', 'ch_mvl_08', 'CVOR registre de :', '["Formation mecaniciens", "Securite transporteurs", "Certification", "Assurance"]', 'B', 'HARD', 'MCQ', 'fr', NOW(), NOW());
SQL

echo "=== Questions inserted ==="

# Verify
sudo -u postgres psql -d certificationquebec -c "SELECT t.code, t.\"nameFr\", (SELECT COUNT(*) FROM \"Chapter\" c WHERE c.\"tradeId\" = t.id) as chapitres, (SELECT COUNT(*) FROM \"Question\" q WHERE q.\"tradeId\" = t.id) as questions FROM \"Trade\" t ORDER BY t.code;"
