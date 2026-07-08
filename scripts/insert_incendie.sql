-- Technicien en sécurité incendie - Trade + Chapters
INSERT INTO "Trade" (id, code, name, "nameFr", description, "createdAt", "updatedAt")
VALUES (
  'cmt_incendie_001',
  'INCENDIE',
  'Fire Safety Technician',
  'Technicien en sécurité incendie',
  'Préparation à l''examen de certification RBQ en sécurité incendie — alarmes, gicleurs, détection et signalisation.',
  NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

-- Chapters
INSERT INTO "Chapter" (id, "tradeId", number, name, "nameFr", "theoryContent", "createdAt", "updatedAt") VALUES
('ch_inc_01', 'cmt_incendie_001', 1, 'Fire Alarm Systems', 'Systèmes d''alarme incendie',
'Types de systèmes : conventionnels (zone commune, délai d''alerte) et adressables (chaque détecteur a une adresse unique).
Composants : panneau de contrôle incendie (FACP), détecteurs (fumée, chaleur, CO), avertisseurs (cloches, stroboscopes, sirènes), stations manuelles, modules de relais.
Normes : CAN/ULC-S524 (installation), CAN/ULC-S561 (maintenance).
Zonage et supervision : délai d''alarme conforme, supervision des ouvertures de circuits (défaut, supervision, alarme).
Espacement : max 9m entre détecteurs de fumée, max 6m dans les corridors.',
NOW(), NOW()),

('ch_inc_02', 'cmt_incendie_001', 2, 'Sprinkler Systems', 'Systèmes de gicleurs',
'Types : systèmes humides (eau sous pression), secs (air sous pression, zones non-chauffées), pré-action (détection avant eau), déluge (têtes ouvertes).
Composants : têtes de gicleurs (pendent, upright, latéral, encastré), vannes d''alarme, clapets, alarmes de débit.
Températures : 68°C standard, 93°C haute température, 141°C très haute température.
Espacement : max 4.9m entre têtes, max 2.5m d''un mur.
Normes : NFPA 13 (installation), NFPA 25 (inspection et entretien), CSA B44.
Classification bâtiments : léger, ordinaire, extra-haut risque (EHR).
Entretien : inspection trimestrielle, test annuel, essai hydrostatique aux 5 ans.',
NOW(), NOW()),

('ch_inc_03', 'cmt_incendie_001', 3, 'Detection and Signaling', 'Détection et signalisation',
'Détecteurs de fumée : ionisation (feux à flammes vives), photodétecteurs (feux couvants).
Norme : CAN/ULC-S529.
Détecteurs de chaleur : thermovélocimétriques (variation rapide), température fixe (63°C, 93°C). Norme : CAN/ULC-S530.
Avertisseurs : cloches, sirènes, stroboscopes, avertisseurs vocaux.
Stroboscopes : 75 cd (chambres), 110 cd (corridors). Synchronisation des clignotements.
Normes : CAN/ULC-S526, ADA, CSA B651.
Signalisation : panneaux verts à pictogramme, visibilité à 25m minimum.',
NOW(), NOW()),

('ch_inc_04', 'cmt_incendie_001', 4, 'Portable Fire Extinguishers', 'Extincteurs portatifs',
'Classes de feux : A (solides), B (liquides inflammables), C (électriques), D (métaux), K (huiles cuisson).
Types : eau pulvérisée (A), CO2 (B, C), poudre ABC (A, B, C), agent humide (K).
Normes : CAN/ULC-S508, NFPA 10, CSA B52.
Espacement : max 25m (A), max 15m (B, C) entre extincteurs.
Hauteur : max 1.5m du sol.
Inspection : visuelle mensuelle, essai hydrostatique aux 5-12 ans selon type.',
NOW(), NOW()),

('ch_inc_05', 'cmt_incendie_001', 5, 'Building Fire Safety Codes', 'Codes de sécurité incendie',
'Code de construction (CCQ Ch.I): section 3.2 sécurité incendie.
Classification bâtiments : A (résidentiel), B (soins), C (réunion), D (commerce), E (industrie), F (entrepôt).
Code de sécurité RBQ : obligations propriétaires, entretien, exercices évacuation.
Normes : ULC, CSA, NFPA.
Hauteur/superficie maximales selon type construction.
Murs coupe-feu : résistance 45 min, 1h, 1.5h, 2h selon bâtiment.
Portes coupe-feu : fermeture automatique sur alarme.',
NOW(), NOW()),

('ch_inc_06', 'cmt_incendie_001', 6, 'Ventilation and Smoke Control', 'Ventilation et contrôle des fumées',
'Pressurisation cages escalier : min 50 Pa.
Sas d''évacuation, puits d''ascenseur.
Arrêt ventilation mécanique sur alarme.
Volets coupe-feu : fusibles thermiques 72°C.
Désenfumage mécanique stationnements intérieurs.
Normes : CNB 3.2.6, NFPA 92.
Issues secours : largeur min 900mm (60 occ.), 1050mm (>60 occ.).
Distance max vers issue : 45m non-résidentiel.
Éclairage urgence : 30 min (rés.), 60 min (autres), min 10 lux au sol.',
NOW(), NOW()),

('ch_inc_07', 'cmt_incendie_001', 7, 'Emergency Lighting and Signage', 'Éclairage d''urgence et signalisation',
'Éclairage d''urgence : durée 30 min résidentiel, 60 min autres.
Niveau éclairement : min 10 lux au sol.
Vérification : mensuelle 30s, annuelle complète 30 min.
Panneaux sortie : pictogramme vert, visibilité 25m.
Double circuit ou batterie intégrée (min 30 min).
Batteries : plomb scellé, NiMH, Li-ion. Test capacité annuel.
Normes : CNB 3.2.7, CNB 3.4.5, CSA C22.2 No.141, Code électricité Section 46.',
NOW(), NOW()),

('ch_inc_08', 'cmt_incendie_001', 8, 'Occupancy and Evacuation', 'Occupation et évacuation',
'Plans évacuation : obligatoires bâtiments 3+ étages ou usage public.
Affichage : chemin évacuation, extincteurs, points rassemblement. Mise à jour annuelle.
Exercices : 1x/3 mois garderies, écoles. 1x/6 mois commerces. 1x/an bureaux.
Registre obligatoire des exercices.
Délais alarme : 15s avant assourdissement.
Alarme générale : son continue min 65 dB tous locaux.
Normes : RBQ Code de sécurité, CNB 3.4, CAN/ULC-S524.',
NOW(), NOW());
