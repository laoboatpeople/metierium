-- Technicien en gaz / Gas Technician (RBQ) - Trade + Chapters
INSERT INTO "Trade" (id, code, name, "nameFr", description, "createdAt", "updatedAt")
VALUES (
  'cmt_gaz_001',
  'GAZ',
  'Gas Technician',
  'Technicien en gaz',
  'Préparation à l''examen de certification RBQ en technique de gaz — CSA B149.1, B149.2, installation, entretien et sécurité.',
  NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Chapter" (id, "tradeId", number, name, "nameFr", "theoryContent", "createdAt", "updatedAt") VALUES
('ch_gaz_01', 'cmt_gaz_001', 1, 'CSA B149.1 Gas Code', 'Code CSA B149.1 — Gaz naturel',
'Champ d''application : bâtiments neufs et existants, résidentiel, commercial, industriel.
Gaz naturel : composition (méthane 90%+), propriétés (densité 0.6, point éclair -188°C).
Pression : basse (0-7 po CE), moyenne (7-70 po CE), haute (>70 po CE).
Tuyauterie : acier (sch 40, sch 80), cuivre (type K/L), PEHD (polyéthylène).
Raccords : filetés, soudés, à compression, union diélectrique (dissimilar metals).
Robinets : robinet d''arrêt (obligatoire avant chaque appareil), robinet principal.
Normes : CSA B149.1 (installation), CSA B149.2 (propane), CSA B149.3 (code d''entretien).',
NOW(), NOW()),

('ch_gaz_02', 'cmt_gaz_001', 2, 'CSA B149.2 Propane', 'Code CSA B149.2 — Propane',
'Propane : composition (C3H8), densité 1.5 (plus lourd que l''air), point ébullition -42°C.
Réservoirs : fixes (120L, 500L, 1000L, 2000L+), amovibles (20lb, 100lb).
Installation réservoir : distance bâtiment (min 3m pour 500L), évent, dalle béton.
Soupapes : de sécurité (OPSO/PRV), de remplissage, de gaz, de niveau.
Régulateurs : première étape (réservoir → bâti), deuxième étape (bâti → bâtiment).
Détendeurs : pression de sortie 11 po CE (résidentiel), 7 po CE (commercial léger).
Propane vs gaz naturel : conversion brûleurs, orifices, pression différente.
Normes : CSA B149.2, CSA B149.5 (installation réservoirs).',
NOW(), NOW()),

('ch_gaz_03', 'cmt_gaz_001', 3, 'Venting and Combustion Air', 'Évacuation et air de combustion',
'Évacuation : type I (cheminée maçonnée), type II (conduit métallique isolé), type III (conduit simple), type IV (concentrique).
Tirage : naturel, assisté (ventilateur), forcé (brûleur scellé). Hauteur min cheminée 1m au-dessus du toit.
Air de combustion : direct (prise extérieure), indirect (volume de la pièce). Pièce doit avoir min 50 pi3/1000 BTU/h.
Conduits : B vent (gaz), L vent (huile/propane), AL29-4C (condensation haute efficacité).
Évacuation condenseurs : PVC (Sch 40/80), polypropylène, résistant à l''acide. Pente min 1/4 po/pi.
Distance des terminaisons : 1m d''une fenêtre/porte, 3m d''une entrée d''air mécanique.
Normes : CSA B149.1 Section 8 (évacuation), NFPA 54.',
NOW(), NOW()),

('ch_gaz_04', 'cmt_gaz_001', 4, 'Gas Appliances and Controls', 'Appareils et contrôles',
'Types d''appareils : chaudière (eau chaude), générateur d''air chaud (fournaise), chauffe-eau, cuisinière, sécheuse, foyer.
Brûleurs : atmosphérique (primaire + secondaire), à tirage forcé, à condensation >90% efficacité.
Thermostats : chaud (24V ligne basse tension), froid (réfrigération), programmable, intelligent.
Vannes : gaz principal (solenoïde), modulateur, de sécurité (thermocouple, thermopile).
Allumage : veilleuse continue, allumage électronique (étincelle, surface chaude).
Sécurité : limiteur de température (aquastat), pressostat, commutateur de tirage, flamme de contrôle.
Rendement : AFUE (Annual Fuel Utilization Efficiency). Min 90% neuf, 80% existant.
Normes : CSA B149.1, CSA B149.3.',
NOW(), NOW()),

('ch_gaz_05', 'cmt_gaz_001', 5, 'Sizing and Pipe Sizing', 'Dimensionnement et tuyauterie',
'Calcul de charge : BTU/h total = somme de tous les appareils. Facteur de diversité.
Longueur équivalente : ajout 50% pour raccords (coude 90 = 5pi, té = 10pi, vanne = 2pi).
Tableau de dimensionnement : CSA B149.1 Tableau 4.1 à 4.5. Selon longueur et BTU/h.
Cuivre : capacité BTU/h selon longueur. Acier : capacité BTU/h selon longueur et pression.
Chute de pression : max 0.5 po CE entre compteur et appareil. Pression départ 7-11 po CE.
Gaz propane : dimensionnement identique mais pression différente (11 po CE sortie régulateur).
Pipeline : calcul chute pression pour longues distances (100m+). Utilisation logiciel.
Normes : CSA B149.1 Annexe A (tableaux).',
NOW(), NOW()),

('ch_gaz_06', 'cmt_gaz_001', 6, 'Leak Testing and Commissioning', 'Tests et mise en service',
'Essai d''étanchéité : air comprimé ou gaz inerte (azote). Pression essai 35 kPa (5 psi) min.
Durée essai : 15 min (résidentiel), 30 min (commercial), 1h (industriel).
Recherche fuites : détecteur électronique, solution moussante (Snoop), manomètre digital.
Purge gaz : élimination de l''air dans la tuyauterie avant mise en service.
Mise en service : vérification pression, allumage séquentiel, mesure combustion (CO2, CO, O2).
Analyse combustion : O2 (3-6%), CO2 (8-10%), CO (<100 ppm), excès d''air (30-50%).
Rapport de mise en service : document obligatoire signé par le technicien.
Normes : CSA B149.1 Section 7 (essai), CSA B149.3 (entretien).',
NOW(), NOW()),

('ch_gaz_07', 'cmt_gaz_001', 7, 'RBQ Regulations and Permits', 'Réglementation RBQ et permis',
'Licence RBQ : catégorie 12 (technicien en gaz), sous-catégorie 12.1 (gaz naturel), 12.2 (propane).
Permis : obligatoire pour toute installation/modification de gaz. Plans et devis requis.
Inspection RBQ : vérification des travaux. Non-conformités à corriger dans 30 jours.
Obligations : assurance RC (2M$), registre des travaux, affichage licence.
Qualification : DEP en gaz (900h), expérience pratique (2-3 ans), examen RBQ réussi.
Code de déontologie : honnêteté, compétence, confidentialité, sécurité du public.
Sanctions : amende (500-50000$), suspension, révocation de licence.
Normes : Loi sur le bâtiment, Règlement RBQ, CSA B149.1.',
NOW(), NOW()),

('ch_gaz_08', 'cmt_gaz_001', 8, 'Safety and Emergency Response', 'Sécurité et interventions',
'Détection fuite de gaz : odeur (mercaptan), détecteur fixe, gazomètre portatif.
Odeur de gaz : évacuer bâtiment, ne pas actionner interrupteurs, pas de flammes, appeler Gaz Métro/urgence.
CO (monoxyde de carbone) : sous-produit combustion incomplète. Détecteurs CO obligatoires (résidentiel neuf).
Symptômes CO : maux tête, étourdissements, nausée, perte conscience, mort (>400 ppm).
Niveaux CO : <9 ppm acceptable, 9-30 ppm (aération), 30-100 ppm (action immédiate), >100 ppm (évacuation).
Équipements : détecteur CO, gazomètre (gaz combustible), analyseur combustion, manomètre.
Verrouillage (lockout/tagout) : procédure avant intervention sur équipement gaz.
EPI : gants chimiques, lunettes, masque (poussières, CO), chaussures sécurité, casque (chantier).
Normes : CSA B149.1, CSA B149.3, RBQ Code de sécurité, CNB 3.2.',
NOW(), NOW());
