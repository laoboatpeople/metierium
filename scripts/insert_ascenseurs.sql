-- Mécanicien d'ascenseurs / Elevator Mechanic (RBQ) - Trade + Chapters
INSERT INTO "Trade" (id, code, name, "nameFr", description, "createdAt", "updatedAt")
VALUES (
  'cmt_ascenseur_001',
  'ASCEN',
  'Elevator Mechanic',
  'Mécanicien d''ascenseurs',
  'Préparation à l''examen de certification RBQ en mécanique d''ascenseurs — code CSA B44, installation, entretien et sécurité.',
  NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Chapter" (id, "tradeId", number, name, "nameFr", "theoryContent", "createdAt", "updatedAt") VALUES
('ch_asc_01', 'cmt_ascenseur_001', 1, 'CSA B44 Safety Code', 'Code CSA B44 — Sécurité',
'CSA B44 : Code de sécurité des ascenseurs et monte-charge. Aussi ASME A17.1.
Champ d''application : ascenseurs électriques, hydrauliques, monte-charge, escaliers mécaniques, trottoirs roulants.
Catégories : passagers, marchandises, service, monte-charge, monte-voiture, plateforme élévatrice.
Composants : cabine, contrepoids, rails de guidage, câbles (3-10 selon capacité), poulie de traction.
Machinerie : salle des machines (en haut, en bas, sans salle MRL).
Systèmes de sécurité : parachute (gouverneur de sécurité), limiteurs de vitesse, buffers, verrouillage portes.
Portes : palières (automatiques, manuelles), cabine. Dispositif de réouverture (détecteur).
Normes : CSA B44 (Canada), ASME A17.1 (USA), RBQ Code de sécurité.',
NOW(), NOW()),

('ch_asc_02', 'cmt_ascenseur_001', 2, 'Electrical and Control Systems', 'Systèmes électriques et commandes',
'Moteurs : AC (asynchrone, synchrone), DC. Moteur à courant continu pour vitesse variable.
Variateur de vitesse : VFD (variable frequency drive) pour accélération/décélération progressives.
Contrôle : relais (vieux), microprocesseur (moderne), destination dispatch (groupe d''ascenseurs).
Signaux : boutons cabine, boutons paliers, indicateurs position (étage), sonnerie, alarme.
Alimentation : 208V/600V triphasé, 120V monophasé (éclairage, contrôle).
Éclairage cabine : normal + urgence (90 min batterie). Ventilation cabine.
Alarme : téléphone/interphone cabine (obligatoire), alarme incendie (rappel au rez-de-chaussée).
Normes : Code électrique CSA C22.1, CSA B44.',
NOW(), NOW()),

('ch_asc_03', 'cmt_ascenseur_001', 3, 'Hydraulic Elevators', 'Ascenseurs hydrauliques',
'Principe : vérin hydraulique pousse la cabine par le bas. Pression 50-100 bars.
Vérins : simple (télescopique), à câble (roto-hydraulique). Course max 6 étages.
Pompe hydraulique : moteur électrique + pompe (engrenages, palettes). Débit 20-100 L/min.
Huile : hydraulique ISO 32, 46, 68 (viscosité). Filtre, refroidisseur, réservoir.
Vannes : de descente (proportionnelle), de sécurité (arrêt), de trop-plein.
Système de sécurité : valve de rupture (décente contrôlée si bris de conduite).
Cylindre : enterré (protection anticorrosion), monobloc (fosse sèche).
Entretien : niveau d''huile, filtres, pression, fuites, tige de vérin (corrosion).
Normes : CSA B44 Section 2 (hydraulique), RBQ.',
NOW(), NOW()),

('ch_asc_04', 'cmt_ascenseur_001', 4, 'Traction Elevators', 'Ascenseurs à traction',
'Principe : câbles d''acier (3-10) sur poulie de traction, cabine d''un côté, contrepoids de l''autre.
Poulie : motrice (traction), de renvoi (déflection), de compensation.
Câbles : diamètre 8-16mm, construction 6x19, 8x19. Facteur de sécurité (12:1 minimum).
Contrepoids : 40-50% de la charge nominale + cabine. En fonte, acier, béton.
Moteur : synchrone (aimants permanents, MRL), asynchrone (avec réducteur).
Frein : disque ou tambour, à ressort (fail-safe). Ouverture électrique, fermeture mécanique.
Gouverneur de sécurité : câble de gouverneur, poulie de gouverneur, déclenchement mécanique.
Buffers : ressort (1-2 m/s), huile (2-10 m/s). Arrêt d''urgence à décélération contrôlée.
Normes : CSA B44 Section 2 (traction), RBQ.',
NOW(), NOW()),

('ch_asc_05', 'cmt_ascenseur_001', 5, 'Doors and Interlocks', 'Portes et verrouillages',
'Portes palières : coulissantes (centre-ouvrant, latéral), accordéon (vieux).
Verrouillage : électromécanique (solénoïde + loquet). Contact de porte série.
Portes cabine : coulissantes (centre-ouvrant, latéral), télescopique (grande ouverture).
Dispositif de réouverture : détecteur infrarouge (nappe), mécanique (contact palpeur).
Jeu porte palière/cabine : max 38mm horizontal, 25mm vertical.
Délais : porte reste ouverte 5-10 sec (réglable). Fermeture après délai. Sonnerie de fermeture.
Sécurité : interdiction d''ouvrir la porte palière sans cabine à l''étage.
Normes : CSA B44 Section 4 (portes), RBQ.',
NOW(), NOW()),

('ch_asc_06', 'cmt_ascenseur_001', 6, 'Installation and Maintenance', 'Installation et entretien',
'Installation : guide-rail, cabine, machinerie, câblage, mise en service alignement.
Alignement rails : tolérance verticalité 1mm par mètre. Équerrage, niveau laser.
Câbles : mise en tension (égalisation 5% max), inspection visuelle (fils cassés, corrosion).
Graissage : rails (huile ISO 68), guides cabine (garniture), chaîne de compensation.
Entretien préventif : mensuel (niveaux, bruits), trimestriel (freins, portes), annuel (câbles, gouverneur).
Registre d''entretien : obligatoire. Inspections RBQ aux 6 mois (public), 12 mois (privé).
Modernisation : remplacement contrôle, portes, câbles, cabine (après 20-30 ans).
Outils : multimètre, alésomètre, pied à coulisse, laser d''alignement, dynamomètre (câbles).
Normes : CSA B44, RBQ Code de sécurité.',
NOW(), NOW()),

('ch_asc_07', 'cmt_ascenseur_001', 7, 'Inspection and Testing', 'Inspection et essais',
'Essais périodiques : gouverneur de sécurité, parachute, buffers, frein d''urgence.
Essai parachute : pleine charge, à vitesse nominale. Déclenchement en 1-2 mètres.
Essai buffers : pleine charge, vitesse de déclenchement. Déplacement max du piston.
Essai frein : arrêt d''urgence, distance d''arrêt, déclaration.
Inspection RBQ : vérification complète aux 6-12 mois. Délivrance certificat de sécurité.
Inspection réception : après installation/modification. Plans as-built, essais complets.
Niveaux sonores : cabine max 55 dB, machinerie max 85 dB.
Documentation : rapport d''inspection, certificat, registre, manuel d''entretien.
Normes : CSA B44 Section 8 (essais), RBQ.',
NOW(), NOW()),

('ch_asc_08', 'cmt_ascenseur_001', 8, 'Safety and Emergency Response', 'Sécurité et interventions',
'Sauvetage : dégagement passagers coincés. Procédure : couper puissance, vérifier position, ouvrir portes manuellement.
Verrouillage : lockout/tagout (LOTO) avant toute intervention. Cadenassage de l''interrupteur principal.
Travail en fosse : espace confiné. Dégagement min 600mm, éclairage, prise électrique.
Travail en hauteur : garde-corps (1m), harnais (antichute), ligne de vie (toit cabine).
Risques : écrasement (cabine, contrepoids), électrocution (600V), chute (fosse, toit cabine).
EPI : casque, gants isolants (600V), harnais, lunettes, chaussures sécurité.
Procédure urgence : incendie (rappel automatique RDC), séisme (arrêt, inspection), panne (dépannage).
Premiers soins : kit trousse, formation sauvetage passagers, communication.
Normes : LST, CSA B44, RBQ Code de sécurité, RSST.',
NOW(), NOW());
