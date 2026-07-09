-- Opérateur de réfrigération / Refrigeration Operator (RBQ) - Trade + Chapters
INSERT INTO "Trade" (id, code, name, "nameFr", description, "createdAt", "updatedAt")
VALUES (
  'cmt_refrig_001',
  'REFRIG',
  'Refrigeration Operator',
  'Opérateur de réfrigération',
  'Préparation à l''examen de certification RBQ en opération de systèmes de réfrigération — code CSA B44, gaz frigorigènes, sécurité.',
  NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Chapter" (id, "tradeId", number, name, "nameFr", "theoryContent", "createdAt", "updatedAt") VALUES
('ch_ref_01', 'cmt_refrig_001', 1, 'Thermodynamics and Refrigeration Cycle', 'Thermodynamique et cycle frigorifique',
'Cycle de réfrigération : compression, condensation, détente, évaporation.
Loi des gaz parfaits : PV=nRT. Pression absolue vs relative (psig vs psia).
Propriétés : enthalpie (h), entropie (s), température, pression. Diagramme PH.
COP (Coefficient de Performance) : Qe/Wc. Idéal (Carnot) vs réel.
Surchauffe (superheat) : T évaporation + différence (6-12°C typique).
Sous-refroidissement (subcooling) : T condensation - différence (5-10°C).
Détente : détendeur thermostatique (TXV), capillaire, orifice fixe.
Rendement : EER (Energy Efficiency Ratio), SEER (résidentiel), IPLV (commercial).
Normes : CSA B52, ASHRAE 15.',
NOW(), NOW()),

('ch_ref_02', 'cmt_refrig_001', 2, 'Refrigerants and Ozone', 'Gaz frigorigènes et ozone',
'Types : CFC (R-12, banni), HCFC (R-22, phase-out 2020), HFC (R-134a, R-404a, R-410a, phase-down).
HFO : R-1234yf, R-1234ze (faible GWP, nouvelle génération).
Naturels : R-717 (ammoniac), R-744 (CO2), R-290 (propane), R-1270 (propylène).
ODP (Ozone Depletion Potential) : R-12=1.0, R-22=0.05, R-134a=0, R-410a=0.
GWP (Global Warming Potential) : R-404a=3922, R-410a=2088, R-134a=1430, R-32=675.
Protocole de Montréal (1987) : bannissement CFC, phase-out HCFC.
Accord de Kigali (2016) : phase-down HFC de 85% d''ici 2047.
Récupération des gaz : obligatoire. Équipement certifié. Recyclage vs réclamation.
Normes : CSA B52, ASHRAE 34, RSG (Règlement sur les gaz SFC).',
NOW(), NOW()),

('ch_ref_03', 'cmt_refrig_001', 3, 'Compressors', 'Compresseurs',
'Types : alternatif (piston), rotatif (spiro, palette), centrifuge, vis.
Alternatif : 2-8 cylindres, 50-5000 CFM. Fluide à l''huile, refroidi par air/eau.
Vis : simple vis, double vis. 100-10000 CFM. Efficacité élevée, continu.
Centrifuge : grandes capacités, 1000-100000 CFM. Industriel, tour de refroidissement.
Spiro (Scroll) : 2-40 tonnes. Résidentiel/commercial. Silencieux, fiable.
Moteur : hermétique (dans le gaz), semi-hermétique (accès boulonné), ouvert (couplage externe).
Lubrification : huile (ISO 32, 46, 68). Séparateur d''huile, niveau, filtre.
Protection : pressostat (HP/BP), thermostat (enroulement), protecteur de surcharge.
Normes : CSA B52, ASHRAE 15.',
NOW(), NOW()),

('ch_ref_04', 'cmt_refrig_001', 4, 'Condensers and Evaporators', 'Condenseurs et évaporateurs',
'Condenseurs : à air (ventilé, résidentiel), à eau (tour refroidissement, commercial), évaporatif (industrie).
Tour de refroidissement : ouverte, fermée, circuit ouvert/fermé. Traitement eau.
Évaporateurs : à air (ventilé, résidentiel), à eau (refroidisseur), à détente directe/noyé.
Dégivrage : air (échangeurs), électrique (résistance), gaz chaud (inverse cycle), eau.
Surface d''échange : tubes ailetés (cuivre-alu), microcanaux, plaques brasées (échangeur).
DT (Delta T) : 8-12°C évaporateur, 10-15°C condenseur.
Détendeur thermostatique (TXV) : bulbe, pression égalisation, MOP (Maximum Operating Pressure).
Capacité : évaporateur = débit air × DT × facteur (4.5 CFM/BTU).
Normes : CSA B52, ASHRAE 15.',
NOW(), NOW()),

('ch_ref_05', 'cmt_refrig_001', 5, 'Controls and Safeties', 'Contrôles et sécurités',
'Pressostats : HP (arrêt haute pression), BP (arrêt basse pression), différentiel.
Thermostats : température ambiante, liquide (aquastat), à immersion.
Contrôle de capacité : cylindre(s)/étage(s) (alternatif), VSD/VFD (vis, centrifuge).
Vannes : solénoïde, régulation (EVR), d''expansion (TXV, EXV électronique).
EXV (Expansion Valve Electronique) : contrôle précis surchauffe via microprocesseur.
Sécurités : pressostat HP (manuel reset), soupape de sécurité (reservoir), fusible thermique.
Détection fuite : détecteur électronique (infrarouge, semi-conducteur), bulles, UV (fluo).
Séquence démarrage : vérification pressostat, délai anti-cycle, lubrification préalable.
Normes : CSA B52, ASHRAE 15.',
NOW(), NOW()),

('ch_ref_06', 'cmt_refrig_001', 6, 'Piping and Insulation', 'Tuyauterie et calorifuge',
'Tuyauterie : cuivre (type L, ACR déshydraté), acier (sch 40, sch 80), inox (ammoniac).
Diamètres : ligne liquide (petite), ligne aspiration (large, évite chute pression), ligne gaz chaud.
Pente : ligne aspiration (1/4 po/pi vers compresseur), ligne liquide (pas de boucle).
Supports : max 3m cuivre, 5m acier. Collier caoutchouc pour éviter vibration.
Isolation : caoutchouc cellulaire (Armaflex), polyéthylène, polyuréthane.
Épaisseur isolation : selon température. -40°C=50mm, -20°C=32mm, 5°C=19mm.
Pare-vapeur : obligatoire côté extérieur de l''isolant (évite condensation).
Déshydrateur (filtre) : ligne liquide. Bloque humidité, acide, particules.
Normes : CSA B52, ASHRAE 15.',
NOW(), NOW()),

('ch_ref_07', 'cmt_refrig_001', 7, 'Commissioning and Maintenance', 'Mise en service et entretien',
'Tirage au vide : vide poussé <500 microns. Double vide (break with N2) si changement gaz.
Charge de gaz : charge liquide (ligne liquide), charge vapeur (ligne aspiration). Poids exact.
Mise en marche : calibration pressostats, vérification pressions, surchauffe, sous-refroidissement.
Entretien préventif : filtres (air, huile, déshydrateur), condenseur (nettoyage ailettes), drains.
Analyse d''huile : acidité, humidité, particules, couleur. Changement annuel si nécessaire.
Détection fuites : routine (1x/an), obligatoire avant recharge. Réparation dans 30 jours.
Registre : gaz chargé, récupéré, ajouté. Fiche d''entretien (date, travaux).
Arrêt saisonnier : pompage du gaz, isolation, protection antigel, tour refroidissement vidangée.
Normes : CSA B52, RSG, RBQ.',
NOW(), NOW()),

('ch_ref_08', 'cmt_refrig_001', 8, 'Safety and Regulations', 'Sécurité et réglementation',
'Gaz toxiques : ammoniac (R-717) >25 ppm dangereux. Détecteur obligatoire (salle des machines).
Salle des machines : ventilation, détecteur gaz (R-717: 300ppm alarme, 700ppm évacuation).
ASE (Appareil Sous Pression) : réservoirs classés, inspection TQ (Travaux Québec) périodique.
EPI : lunettes (éclaboussures gaz liquide), gants cryogéniques, masque ammoniac.
Brûlure cryogénique : contact R-134a liquide -26°C. Déshabiller, eau tiède 15 min.
Espaces clos : fosse, réservoir, tunnel. Atmosphère appauvrie (CO2, N2). Détection O2 obligatoire.
RSG : Règlement sur les gaz SFC. Certification manipulateur (cat. S1, S2, S3, S4).
Déclaration : consommation annuelle de gaz (MDDELCC). Frais pour émissions GES >10kg CO2e.
Normes : CSA B52, RSG, RBQ Code de sécurité, ASHRAE 15, CPI (Appareils sous pression).',
NOW(), NOW());
