#!/usr/bin/env python3
"""Generate and insert chapters, theory content, and questions for HVAC and MVL trades."""
import subprocess, json, uuid, sys, time

DB_CMD = ["psql", "$(grep DATABASE_URL /home/chuck/projects/metierium/server/.env | head -1 | cut -d= -f2-)"]

def run_sql(sql):
    cmd = f'cd /home/chuck/projects/metierium && psql "$(grep DATABASE_URL server/.env | head -1 | cut -d= -f2-)" -c {shq(sql)}'
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
    if r.returncode != 0:
        print(f"SQL ERROR: {r.stderr[:200]}")
    return r.stdout

def shq(s):
    return "'" + s.replace("'", "'\\''") + "'"

# ── CHAPTERS ──────────────────────────────────────────

HVAC_CHAPTERS = [
    {
        "number": 1,
        "name": "Thermodynamics and Heat Transfer",
        "nameFr": "Thermodynamique et transfert thermique",
        "theoryContent": """# Thermodynamique et transfert thermique

## Principes fondamentaux de la thermodynamique
La thermodynamique est la science qui étudie les transformations de l'énergie, particulièrement les échanges de chaleur et de travail. En HVAC, elle est essentielle pour comprendre le fonctionnement des systèmes de chauffage, de climatisation et de réfrigération.

### Les lois de la thermodynamique en HVAC
**Première loi (conservation de l'énergie)** : L'énergie ne se crée ni ne se détruit, elle se transforme. Dans un système HVAC, l'énergie électrique consommée par le compresseur se transforme en énergie thermique transférée entre les échangeurs.

**Deuxième loi (entropie)** : La chaleur se déplace naturellement d'un corps chaud vers un corps froid. Les systèmes HVAC doivent fournir un travail mécanique pour inverser ce transfert naturel.

## Unités de mesure utilisées au Québec
- **BTU/h** (British Thermal Units per hour) : unité impériale standard en Amérique du Nord pour mesurer la puissance des systèmes de chauffage et de climatisation
- **kW** (kilowatt) : unité SI de puissance, de plus en plus utilisée
- **Tonne de réfrigération** : 12 000 BTU/h = 3,517 kW
- **SEER** (Seasonal Energy Efficiency Ratio) : ratio d'efficacité énergétique saisonnier
- **AFUE** (Annual Fuel Utilization Efficiency) : rendement de combustion annuel

## Transfert thermique
Trois modes de transfert de chaleur sont essentiels en HVAC :

**Conduction** : Transfert à travers un matériau solide (tuyaux, parois). Régie par la loi de Fourier. La résistance thermique R (valeur R) est cruciale pour l'isolation des conduits.

**Convection** : Transfert par mouvement d'un fluide (air, eau). Les échangeurs à plaques et les ailettes augmentent la surface de convection.

**Rayonnement** : Transfert par ondes électromagnétiques (infrarouge). Les planchers radiants et les radiateurs utilisent principalement ce mode.

## Cycles thermodynamiques en HVAC
### Cycle de réfrigération à compression
1. **Compression** : Le compresseur augmente la pression et la température du réfrigérant
2. **Condensation** : Le réfrigérant chaud cède sa chaleur au condenseur et devient liquide
3. **Détente** : Le détendeur abaisse la pression du réfrigérant liquide
4. **Évaporation** : Le réfrigérant froid absorbe la chaleur de l'air ambiant à l'évaporateur

### Cycle de pompe à chaleur
Le cycle est réversible grâce à une vanne d'inversion qui permet d'alimenter soit le chauffage, soit la climatisation avec le même équipement.
"""
    },
    {
        "number": 2,
        "name": "Heating Systems",
        "nameFr": "Systèmes de chauffage",
        "theoryContent": """# Systèmes de chauffage

## Types de systèmes de chauffage résidentiels et commerciaux

### Fournaises
Les fournaises sont les systèmes de chauffage les plus répandus au Québec. Elles fonctionnent au gaz naturel, au propane, à l'huile ou à l'électricité.

**Fournaise au gaz** : Brûleur à gaz qui chauffe un échangeur de chaleur. L'air est poussé par un ventilateur à travers l'échangeur. Rendement AFUE de 80% à 98%.

**Fournaise électrique** : Éléments chauffants électriques. Rendement proche de 100%, mais coût d'opération plus élevé que le gaz au Québec.

### Chaudières
Les chaudières chauffent de l'eau (ou de la vapeur) qui circule dans des radiateurs ou un plancher radiant.

**Chaudière à gaz** : Eau chaude à basse température (60-80°C) ou vapeur haute température.

**Chaudière à haute efficacité** : Condensation des gaz de combustion pour récupérer la chaleur latente. Rendement jusqu'à 95%.

### Pompes à chaleur
**Pompe à chaleur air-air** : Transfère la chaleur de l'air extérieur vers l'intérieur. Efficace jusqu'à environ -25°C au Québec. COP (Coefficient de Performance) de 2 à 4.

**Pompe à chaleur géothermique** : Utilise la température stable du sol (8-12°C). COP de 3 à 5. Investissement initial élevé mais très efficace.

### Chauffage électrique
Plinthes électriques, convecteurs, radiateurs. Simple à installer, mais coûteux à opérer.

## Rendement et efficacité
- **AFUE** : Ratio entre l'énergie produite et l'énergie consommée (gaz)
- **COP** : Ratio entre l'énergie thermique produite et l'énergie électrique consommée
- **HSPF** (Heating Seasonal Performance Factor) : efficacité saisonnière des pompes à chaleur

## Normes québécoises
- Le Code de construction du Québec exige un rendement minimal AFUE de 90% pour les nouvelles fournaises au gaz
- Les thermostats programmables ou intelligents sont obligatoires dans les nouvelles constructions
- Les systèmes de chauffage doivent être installés par un technicien certifié CMMTQ
"""
    },
    {
        "number": 3,
        "name": "Air Conditioning and Refrigeration",
        "nameFr": "Climatisation et réfrigération",
        "theoryContent": """# Climatisation et réfrigération

## Principes de la climatisation
La climatisation est le processus de contrôle de la température, de l'humidité et de la qualité de l'air dans un espace fermé. Au Québec, les systèmes résidentiels et commerciaux doivent être dimensionnés pour une température extérieure de conception de 30°C à 35°C en été.

## Composants principaux d'un système de climatisation

### Compresseur
Cœur du système, il comprime le réfrigérant gazeux à haute pression et haute température.

**Types de compresseurs** :
- **Alternatif (piston)** : Utilisé dans les systèmes plus anciens, moins efficace
- **Rotatif (spiral/scroll)** : Le plus courant au Québec, fiable et silencieux
- **Centrifuge** : Utilisé dans les systèmes commerciaux de grande capacité
- **Vis** : Pour les applications industrielles

### Condenseur
Échangeur thermique où le réfrigérant chaud se condense et devient liquide. Peut être refroidi à l'air ou à l'eau.

### Détendeur
Dispositif qui réduit la pression du réfrigérant liquide avant l'évaporateur. Types : détendeur thermostatique (TXV), tube capillaire, orifice fixe.

### Évaporateur
Échangeur où le réfrigérant liquide à basse pression absorbe la chaleur de l'air ambiant. L'air refroidi est distribué dans le bâtiment.

## Réfrigération
### Applications au Québec
- Chambres froides dans les épiceries et restaurants
- Entreposage frigorifique des aliments
- Réfrigération industrielle (glacières, patinoires)
- Transport réfrigéré

### Cycles de dégivrage
Au Québec, les systèmes doivent gérer le givrage de l'évaporateur par temps froid :
- **Dégivrage par arrêt** : Cycle naturel (pompe à chaleur)
- **Dégivrage par résistance électrique** : Éléments chauffants sur l'évaporateur
- **Dégivrage par inversion de cycle** : Le système fonctionne temporairement en mode chauffage

## Dimensionnement
Le calcul de charge thermique (Manual J aux États-Unis, norme CSA F280 au Canada) détermine la capacité requise. Un sous-dimensionnement cause un confort insuffisant, un surdimensionnement cause un gaspillage énergétique et une mauvaise déshumidification.
"""
    },
    {
        "number": 4,
        "name": "Ventilation and Air Distribution",
        "nameFr": "Ventilation et distribution d'air",
        "theoryContent": """# Ventilation et distribution d'air

## Importance de la ventilation
La ventilation assure la qualité de l'air intérieur en renouvelant l'air vicié par de l'air frais. Au Québec, les normes de ventilation sont strictes en raison des maisons très étanches nécessaires pour l'efficacité énergétique.

## Types de systèmes de ventilation

### Ventilation naturelle
Infiltration d'air par les fenêtres et portes. Insuffisante dans les bâtiments modernes étanches.

### Ventilation mécanique
**VRC (Ventilateur Récupérateur de Chaleur)** : Transfère la chaleur de l'air vicié sortant à l'air frais entrant. Efficacité de 60% à 85%. Le VRC est obligatoire dans les nouvelles constructions résidentielles au Québec depuis le Code 2015.

**VRE (Ventilateur Récupérateur d'Énergie)** : Similaire au VRC mais transfère également l'humidité. Utilisé dans les climats très humides.

## Distribution d'air

### Conduits
- **Conduits rigides** : Acier galvanisé, aluminium. Meilleure efficacité, moins de pertes de charge
- **Conduits flexibles** : Isolation intégrée, faciles à installer dans les espaces restreints
- **Conduits circulaires vs rectangulaires** : Circulaires = 20-30% moins de pertes de charge

### Calculs de débit d'air
- **CFM** (Cubic Feet per Minute) : Unité standard de débit d'air en Amérique du Nord
- **Vitesse d'air recommandée** : 2-4 m/s dans les conduits principaux, 1-2 m/s dans les branches
- **Pression statique** : 0,1 à 0,5 po CE (pouces de colonne d'eau) pour les systèmes résidentiels

### Registres et diffuseurs
- **Registres** : Contrôle du débit d'air par section
- **Diffuseurs** : Distribution uniforme de l'air dans les pièces
- **Grilles de retour** : Reprise d'air vers le système

## Équilibrage
L'équilibrage du système de distribution d'air est essentiel pour assurer un confort uniforme. Les volets de réglage (dampers) permettent d'ajuster le débit vers chaque pièce. La mesure se fait avec un anémomètre et un manomètre.

## Normes québécoises
- **CSA F326** : Norme de ventilation résidentielle
- **Code de construction du Québec** : Exigences minimales de ventilation
- **Régie du bâtiment du Québec (RBQ)** : Supervision des installations commerciales
"""
    },
    {
        "number": 5,
        "name": "Controls and Thermostatics",
        "nameFr": "Contrôles et thermostatiques",
        "theoryContent": """# Contrôles et thermostatiques

## Introduction aux systèmes de contrôle HVAC
Les systèmes de contrôle régulent le fonctionnement des équipements HVAC pour maintenir le confort thermique tout en optimisant la consommation d'énergie. Au Québec, les systèmes de contrôle deviennent de plus en plus sophistiqués avec l'intégration des technologies IoT.

## Thermostats

### Thermostat mécanique
Bilame métallique qui se dilate avec la chaleur. Simple, peu coûteux, mais imprécis (±1°C).

### Thermostat électronique
Capteur thermique (thermistance NTC ou PTC) qui mesure la température. Précision de ±0,3°C. Programmable par plages horaires.

### Thermostat intelligent
Connecté Wi-Fi, apprentissage des habitudes, contrôle à distance via application mobile. Compatible avec les systèmes de domotique (Google Home, Apple HomeKit).

### Thermostat à zone
Permet de contrôler indépendamment plusieurs zones d'un bâtiment avec des volets motorisés et des thermostats dédiés.

## Séquences de contrôle
### Chauffage
1. Appel de chaleur du thermostat
2. Activation de la vanne gaz ou des éléments électriques
3. Vérification de la flamme (détecteur de flamme)
4. Activation du ventilateur après délai (fan-on delay, 30-60 secondes)
5. Arrêt du brûleur à la satisfaction
6. Refroidissement du ventilateur (fan-off delay, 60-120 secondes)

### Climatisation
1. Appel de froid du thermostat
2. Activation du compresseur avec délai de protection (3-5 minutes minimum)
3. Activation du ventilateur
4. Arrêt à la satisfaction du thermostat

## Actionneurs et vannes
- **Vanne motorisée 2 voies** : Ouverture/fermeture du débit d'eau chaude ou glacée
- **Vanne 3 voies** : Dérivation du débit entre deux circuits
- **Actionneur à retour par ressort** : Sécurité (retour en position fermée sur perte de courant)
- **Servomoteur pour registre** : Contrôle de l'air dans les conduits

## Systèmes DDC (Direct Digital Control)
- Contrôle centralisé d'un bâtiment via réseau de contrôleurs
- Programmation horaire, optimisation de démarrage/arrêt
- Alarmes et historique des données
- Interface web pour la gestion à distance

## Normes et réglementations
- **CSA C828** : Performance des thermostats au Canada
- **RBQ** : Exigences pour les systèmes de contrôle dans les bâtiments multirésidentiels
- **Code de l'énergie** : Exigences minimales d'efficacité pour les systèmes de contrôle
"""
    },
    {
        "number": 6,
        "name": "Refrigerants and Environment",
        "nameFr": "Réfrigérants et environnement",
        "theoryContent": """# Réfrigérants et environnement

## Histoire et réglementation des réfrigérants
La réglementation sur les réfrigérants a considérablement évolué au Québec et au Canada. Les techniciens HVAC doivent connaître les types de réfrigérants, leur impact environnemental et les procédures de manipulation sécuritaires.

## Types de réfrigérants

### CFC (Chlorofluorocarbures)
- **R-12** : Interdit depuis 1995 (Protocole de Montréal). ODP (Ozone Depletion Potential) élevé.
- A contribué au trou dans la couche d'ozone.

### HCFC (Hydrochlorofluorocarbures)
- **R-22** : Phase progressive au Canada. Production arrêtée depuis 2020. ODP modéré.
- **R-123** : Utilisé dans les systèmes centrifuges. Remplacement en cours.

### HFC (Hydrofluorocarbures)
- **R-410A** : Réfrigérant le plus courant pour les systèmes résidentiels au Québec. Remplace le R-22. GWP (Global Warming Potential) élevé de 2088.
- **R-134a** : Utilisé dans les systèmes automobiles et les refroidisseurs. GWP de 1430.
- **R-404A** : Utilisé en réfrigération commerciale. GWP très élevé de 3922.

### HFO et réfrigérants naturels
- **R-32** : GWP de 675. Adoption croissante (climatiseurs muraux).
- **R-290 (Propane)** : Naturel, GWP de 3, inflammable (A3). Utilisé dans les systèmes hermétiques.
- **R-744 (CO₂)** : GWP de 1, haute pression. Utilisé en réfrigération commerciale et transport.
- **R-1234yf** : GWP de 4, utilisé dans l'automobile.

## Réglementation canadienne et québécoise
- **Règlement sur les substances appauvrissant l'ozone et les halocarbures de remplacement** (Canada) : Réduction progressive des HFC
- **L'Accord de Kigali** (2016) : Amendement au Protocole de Montréal pour réduire les HFC de 85% d'ici 2036
- **Code de sécurité de la RBQ** : Manipulation des réfrigérants dans les bâtiments

## Manipulation sécuritaire des réfrigérants
### Récupération
Obligatoire avant toute réparation ou démolition d'un système. Utilisation d'une machine de récupération certifiée.

### Détection de fuites
- Détecteur électronique
- Lampe UV (avec traceur)
- Solution moussante
- Test de pression à l'azote

### Certification obligatoire
Au Québec, les techniciens doivent détenir une **certification de manipulation des réfrigérants** valide (classe 1 pour les systèmes de 5 kg et plus, classe 2 pour les petits systèmes). L'émission de réfrigérant dans l'atmosphère est illégale et passible d'amendes sévères.

## Tendances futures
- Transition vers les réfrigérants à faible GWP (R-32, R-290, R-744)
- Interdiction progressive des HFC à haut GWP
- Normes plus strictes sur les fuites et la maintenance
- Formation continue obligatoire pour les techniciens
"""
    },
    {
        "number": 7,
        "name": "Codes and Standards (RBQ/B149)",
        "nameFr": "Codes et normes (RBQ/B149)",
        "theoryContent": """# Codes et normes (RBQ/B149)

## Cadre réglementaire québécois
Au Québec, les installations HVAC sont régies par plusieurs codes et normes. La Régie du bâtiment du Québec (RBQ) est l'organisme responsable de l'application du Code de construction et du Code de sécurité.

## Code de construction du Québec
### Chapitre I — Bâtiment (CNB)
- Exigences structurelles et architecturales
- Isolation thermique et étanchéité à l'air
- Ventilation et qualité de l'air intérieur
- Protection contre l'incendie (conduits coupe-feu)

### Chapitre III — Plomberie
- Alimentation en eau des systèmes HVAC (chaudières, refroidisseurs)
- Évacuation des condensats
- Protection antigel des réseaux extérieurs

## CSA B149 — Code sur le gaz naturel et le propane
Cette norme est fondamentale pour les installations de chauffage au gaz au Québec.

### Sections importantes
**Partie 1 - B149.1** : Installation des appareils et des canalisations
- Dégagement minimal autour des appareils (24 pouces pour l'accès d'entretien)
- Éventilation des gaz de combustion (conduits de fumée)
- Ventilation des locaux techniques (apport d'air de combustion)
- Robinets d'arrêt obligatoires à chaque appareil

**Partie 2 - B149.2** : Appareils au propane (réservoirs)  
**Partie 3 - B149.3** : Code des systèmes de gaz de pétrole liquéfiés

### Exigences spécifiques pour les techniciens HVAC
- Détecteurs de monoxyde de carbone obligatoires dans les locaux contenant des appareils à gaz
- Les conduits d'évacuation doivent être inspectés annuellement
- La mise à la terre électrique des appareils à gaz est obligatoire
- Le purgeage des canalisations doit être effectué avant la mise en service

## CSA F280 — Détermination de la puissance des systèmes de chauffage et de climatisation
Méthode de calcul standard au Canada pour dimensionner les équipements HVAC résidentiels.

## RBQ — Régulation et inspections
- Licence RBQ requise pour les entrepreneurs en HVAC (sous-catégorie 15)
- Inspections obligatoires pour les installations commerciales
- Amendes pour travail non conforme ou sans licence

## Codes d'efficacité énergétique
- **Code de l'énergie du Québec** : Normes minimales d'efficacité
- **NRCan** : Règlement sur l'efficacité énergétique (Energy Star)
- **Réglementation sur l'étiquetage ÉnerGuide** : Cote de rendement obligatoire

## Santé et sécurité
- **CNESST** : Normes de sécurité pour les travaux en hauteur (conduits, toitures)
- **SIMDUT** : Signalement des produits dangereux (réfrigérants, solvants)
- **ASP Construction** : Formation obligatoire en santé et sécurité sur les chantiers
"""
    },
    {
        "number": 8,
        "name": "Safety and Tools",
        "nameFr": "Sécurité et outils",
        "theoryContent": """# Sécurité et outils

## Équipement de protection individuelle (EPI)
Les techniciens HVAC doivent porter l'EPI approprié pour chaque tâche. Au Québec, la CNESST et l'ASP Construction imposent des normes strictes.

### EPI obligatoires sur un chantier
- **Casque de sécurité** : Classe E (électrique) pour le travail sur les systèmes électriques
- **Lunettes de sécurité** : Protection contre les projections de réfrigérant, poussières, débris
- **Gants de protection** : Gants chimiques pour la manipulation des réfrigérants, gants thermiques pour les surfaces chaudes/froides
- **Chaussures de sécurité** : Embout d'acier, semelle antidérapante
- **Protection auditive** : Bouchons ou coquilles dans les salles de machines bruyantes
- **Harnais de sécurité** : Travail en hauteur sur les toits et les conduits

## Sécurité électrique
- Vérifier l'absence de tension avant toute intervention (multimètre certifié CAT III ou IV)
- Verrouillage/étiquetage (lockout/tagout) des disjoncteurs
- Respect des distances minimales par rapport aux pièces sous tension
- Ne jamais travailler sur un système humide ou sous la pluie

## Manipulation des réfrigérants
- **Toujours** récupérer les réfrigérants avant d'ouvrir un circuit
- Ne jamais exposer la peau au réfrigérant liquide (risque de brûlure par le froid)
- Utiliser des bouteilles de récupération certifiées (pression de service minimale de 400 psi pour R-410A)
- Ne jamais mélanger différents réfrigérants
- Ventiler la zone de travail en cas de fuite

## Travail en hauteur
- Échelles : Angle de 75 degrés (4:1), dépassement de 1 mètre au-dessus du point d'appui
- Escabeaux : Ne pas se tenir sur les deux derniers échelons
- Toits : Ligne de vie ou harnais si pente supérieure à 4:12
- Plateformes élévatrices : Formation obligatoire

## Outils spécifiques au métier

### Outils de mesure
- **Thermomètre infrarouge** : Mesure sans contact des surfaces
- **Manomètre** : Pression des réfrigérants (bas et haut côté)
- **Thermomètre à sonde** : Température des conduits et des fluides
- **Anémomètre** : Vitesse de l'air dans les conduits
- **Détecteur de gaz** : Monoxyde de carbone, gaz combustible
- **Détecteur de fuites électronique** : Localisation des fuites de réfrigérant

### Outils de coupe
- **Coupe-tube** : Tuyaux de cuivre
- **Cintreuse** : Coudes dans les tuyaux de cuivre (éviter les plis)
- **Ébavureur** : Nettoyage des extrémités de tuyaux

### Outils de soudure et brasage
- **Torche oxyacétylénique** : Brasage fort des tuyaux de cuivre
- **Alliage de brasage** : 15% argent (silver solder) pour les connexions HVAC
- **Flux** : Nettoyage des surfaces avant brasage

## Premiers soins et urgences
- Connaître l'emplacement des trousses de premiers soins
- En cas de brûlure par le froid (réfrigérant) : Réchauffer progressivement avec de l'eau tiède (pas chaude)
- En cas d'inhalation de réfrigérant : Sortir la personne à l'air frais, appeler le 911
- En cas de contact oculaire : Rincer abondamment à l'eau pendant 15 minutes
"""
    }
]

MVL_CHAPTERS = [
    {
        "number": 1,
        "name": "Diesel Engines",
        "nameFr": "Moteurs diesel",
        "theoryContent": """# Moteurs diesel

## Principes de fonctionnement
Le moteur diesel est le cœur des véhicules lourds. Contrairement au moteur à essence, il fonctionne par auto-inflammation du carburant injecté dans l'air comprimé à haute température.

### Cycle diesel à quatre temps
1. **Admission** : La soupape d'admission s'ouvre, l'air est aspiré dans le cylindre
2. **Compression** : Le piston remplit et comprime l'air à un rapport de 14:1 à 25:1 (température de 500-700°C)
3. **Détente** : Le carburant diesel est injecté directement dans la chambre de combustion. L'auto-inflammation propulse le piston vers le bas
4. **Échappement** : La soupape d'échappement s'ouvre, les gaz brûlés sont expulsés

### Différences avec l'essence
- Allumage par compression, pas par bougie
- Rapport de compression beaucoup plus élevé
- Meilleur rendement thermique (35-45% vs 25-30%)
- Plus de couple à bas régime
- Durée de vie plus longue (800 000 à 1 500 000 km pour un moteur bien entretenu)

## Système d'injection
### Composants
- **Pompe d'injection** : Alimente les injecteurs en carburant à haute pression
- **Injecteurs** : Pulvérisent le carburant dans la chambre de combustion (pression de 1 000 à 3 000 bars)
- **Rampe commune (Common Rail)** : Système moderne avec pression constante dans une rampe commune à tous les injecteurs
- **HEUI (Hydraulic Electronic Unit Injection)** : Injection hydraulique commandée électroniquement

### Types d'injection
- Injection directe (DI) : La plus courante sur les moteurs modernes
- Injection indirecte (IDI) : Ancienne technologie, préchambre de combustion

## Turbocompresseur
Le turbocompresseur utilise l'énergie des gaz d'échappement pour comprimer l'air d'admission. Avantages :
- Augmentation de la puissance (30-50%)
- Meilleur rendement à haute altitude
- Réduction des émissions par meilleure combustion

### Wastegate
Soupape de décharge qui régule la pression de suralimentation en contournant les gaz d'échappement de la turbine.

## Refroidissement intermédiaire (intercooler)
Refroidit l'air comprimé par le turbocompresseur avant l'admission. L'air plus dense contient plus d'oxygène, ce qui améliore la combustion.

## Système de carburant
- **Réservoir** : Capacité typique de 200 à 600 litres
- **Filtre à carburant** : Sépare l'eau et les impuretés du diesel
- **Séparateur d'eau** : Essentiel au Québec (condensation hivernale)
- **Durites** : Résistance au froid et à la pression

## Entretien préventif
- Vidange d'huile : Tous les 15 000 à 25 000 km
- Remplacement des filtres à carburant : Aux 2 vidanges
- Vérification des bougies de préchauffage : Avant l'hiver
- Analyse d'huile : Détection précoce de l'usure
- Jeu aux soupapes : Vérification aux 100 000 km
"""
    },
    {
        "number": 2,
        "name": "Transmissions and Gearboxes",
        "nameFr": "Transmissions et boîtes de vitesses",
        "theoryContent": """# Transmissions et boîtes de vitesses

## Introduction
La transmission transmet la puissance du moteur aux roues motrices. Les véhicules lourds utilisent principalement des transmissions manuelles ou automatisées.

## Transmissions manuelles
### Boîte manuelle non synchronisée
- Utilisée sur les gros porteurs (classe 8)
- Double débrayage requis
- Avantages : Robustesse, simplicité mécanique
- Inconvénient : Compétence du conducteur requise

### Boîte manuelle synchronisée
- Synchroniseurs (cônes de friction) qui égalisent la vitesse des engrenages avant l'engagement
- Plus facile à opérer, utilisée sur les camions moyens
- Les synchroniseurs s'usent avec le temps

### Composants
- **Arbre primaire** : Entraîné par l'embrayage
- **Arbre intermédiaire** : Engrenages fixes
- **Arbre secondaire** : Engrenages fous sélectionnés par les fourchettes
- **Fourchettes de sélection** : Actionnées par le levier de vitesses
- **Roulements** : Supportent les arbres et réduisent la friction

## Transmissions automatisées
### Transmission à embrayage simple (AMT)
- Robotisation d'une boîte manuelle
- Actionneurs électriques ou pneumatiques
- Exemple : Eaton UltraShift

### Transmission à double embrayage (DCT)
- Deux embrayages indépendants pour les rapports pairs et impairs
- Passage de vitesse sans interruption de couple
- Exemple : Allison Transmission

### Transmission automatique (torque converter)
- Convertisseur de couple hydraulique
- Train épicycloïdal
- Exemple : Allison 3000/4000 Series

## Convertisseur de couple
Composé de trois éléments :
1. **Pompe (impeller)** : Reliée au moteur, projette l'huile
2. **Turbine** : Reliée à la transmission, reçoit l'huile
3. **Stator** : Multiplie le couple en redirigeant l'huile

## Prise de force (PTO)
Mécanisme qui prélève une partie de la puissance du moteur pour actionner un équipement annexe (benne basculante, grue, pompe hydraulique).

## Entretien
- Niveau et qualité de l'huile de transmission : Vérification mensuelle
- Remplacement du filtre de transmission : Aux 50 000 km
- Vidange de l'huile : Aux 100 000 km pour les boîtes manuelles, aux 50 000 km pour les automatiques
- Usure des synchroniseurs : Difficulté à passer les vitesses
- Fuites d'huile : Vérification des joints et des conduits
"""
    },
    {
        "number": 3,
        "name": "Hydraulic Systems",
        "nameFr": "Systèmes hydrauliques",
        "theoryContent": """# Systèmes hydrauliques

## Principes fondamentaux
Les systèmes hydrauliques utilisent un fluide incompressible (huile) pour transmettre et multiplier la force. Le principe de Pascal stipule que la pression appliquée à un fluide confiné se transmet uniformément dans toutes les directions.

## Composants principaux

### Pompe hydraulique
Transforme l'énergie mécanique en énergie hydraulique.

**Types de pompes** :
- **Pompe à engrenages** : Simple, robuste, pression jusqu'à 250 bars. La plus courante sur les véhicules lourds
- **Pompe à palettes** : Débit plus régulier, pression jusqu'à 200 bars
- **Pompe à pistons** : Haute pression (jusqu'à 400 bars), utilisée dans les applications exigeantes
- **Pompe à débit variable** : Ajuste le débit selon la demande (économie d'énergie)

### Vannes hydrauliques
- **Vanne de direction** : Contrôle la direction du fluide (4/3, 4/2 voies)
- **Vanne de régulation de pression** : Limite la pression maximale (soupape de sécurité)
- **Vanne de régulation de débit** : Contrôle la vitesse des vérins
- **Clapet anti-retour** : Permet le passage dans une seule direction

### Vérins hydrauliques
- **Vérin simple effet** : L'huile pousse dans une direction, le retour par ressort
- **Vérin double effet** : L'huile pousse dans les deux directions
- **Vérin télescopique** : Plusieurs sections pour une longue course (benne basculante)

### Accumulateur
Réservoir d'énergie hydraulique qui emmagasine l'huile sous pression. Utilisé pour :
- Compenser les pics de demande
- Maintenir la pression en cas d'arrêt de la pompe
- Amortir les chocs hydrauliques

## Fluides hydrauliques
### Types
- **Huile minérale** : Standard, lubrifiante et résistante à l'oxydation
- **Huile biodégradable** : Pour les applications environnementales sensibles
- **Fluide résistant au feu** : Pour les applications à haut risque (eau-glycol, phosphate ester)

### Viscosité
La viscosité est essentielle au bon fonctionnement. Un fluide trop épais (froid) pompe mal, un fluide trop liquide (chaud) lubrifie mal. Indice de viscosité élevé recommandé pour le climat québécois.

## Entretien des systèmes hydrauliques
- **Niveau d'huile** : Vérification quotidienne avec la jauge
- **Filtre hydraulique** : Remplacement aux 500 heures d'opération
- **Analyse d'huile** : Détection de contamination (eau, particules métalliques, oxydation)
- **Purge de l'air** : Essentiel après toute intervention (l'air comprime et cause des mouvements irréguliers)
- **Contamination** : 80% des pannes hydrauliques sont causées par une contamination du fluide

## Problèmes courants
- **Surchauffe** : Mauvaise viscosité, obstruction du refroidisseur
- **Cavitation** : Air dans la pompe (mauvaise aspiration)
- **Baisse de pression** : Pompe usée, fuite interne, vanne de sécurité déréglée
- **Mouvement saccadé** : Air dans le circuit, fluide contaminé
"""
    },
    {
        "number": 4,
        "name": "Electrical Systems",
        "nameFr": "Systèmes électriques",
        "theoryContent": """# Systèmes électriques

## Principes de base de l'électricité des véhicules lourds
Les véhicules lourds utilisent un système électrique 12V ou 24V (camions lourds) pour alimenter tous les systèmes : démarrage, éclairage, instrumentation, calculateurs et accessoires.

## Batteries
### Batteries au plomb-acide
- 2V par élément, 6 éléments = batterie 12V
- Capacité typique : 100-200 Ah (ampères-heures) par batterie sur les poids lourds
- Groupes de 2 à 4 batteries en parallèle sur les camions (12V) ou en série (24V)

### Types de batteries
- **AGM (Absorbent Glass Mat)** : Meilleure résistance aux vibrations, maintenance réduite
- **Gel** : Utilisée dans les climats froids, excellente résistance aux décharges profondes
- **Lithium-ion** : Légère, longue durée de vie, mais coûteuse

### CCA (Cold Cranking Amps)
Critère essentiel au Québec : capacité de démarrage à froid. Une batterie de 900-1000 CCA est typique pour un moteur diesel lourd.

## Alternateur
Génère le courant alternatif (AC) et le redresse en courant continu (DC) pour recharger les batteries et alimenter les systèmes électriques.
- Tension de charge : 13,8-14,4V
- Puissance typique : 100-200A sur les camions lourds
- Régulateur de tension intégré : Maintient la tension constante

## Démarreur
Moteur électrique puissant qui fait tourner le moteur diesel jusqu'à ce qu'il démarre.
- Puissance : 4 à 9 kW
- Consommation : 200-600A en pleine charge
- Solénoïde : Engage le pignon du démarreur sur la couronne du volant moteur

## Système de câblage
### Couleurs standardisées SAE
- Rouge : Alimentation positive (+)
- Noir : Masse (-)
- Bleu : Feux de route
- Vert : Feux de position
- Jaune : Clignotants
- Blanc : Retour de masse

### Multiplexage (CAN bus)
Les véhicules modernes utilisent un réseau CAN (Controller Area Network) pour transmettre les données entre les modules.
- **CAN bus** : Paire torsadée (CAN H, CAN L)
- **Terminaison** : Résistance de 120Ω à chaque extrémité
- **Modules typiques** : ECM (moteur), TCM (transmission), ABS, BCM, instrument cluster

## Éclairage
- **Phares** : Halogène, HID (xénon) ou LED
- **Feux arrière** : LED obligatoires sur les nouveaux véhicules
- **Éclairage de travail** : LED haute intensité pour les opérations de nuit

## Diagnostic électrique
- **Multimètre** : Mesure de tension, résistance, courant
- **Pince ampèremétrique** : Mesure de courant sans contact
- **Test de chute de tension** : Détection des résistances parasites dans les connexions
- **Vérification de la masse** : La masse est responsable de 50% des problèmes électriques

## Hivernage
Au Québec, les systèmes électriques subissent des contraintes particulières :
- Chauffe-bloc : Obligatoire dans les flottes, puissance de 1000-1500W
- Batteries à haute capacité de démarrage à froid
- Vérification des connexions nettoyées et protégées contre la corrosion
- Test de charge de l'alternateur à l'automne
"""
    },
    {
        "number": 5,
        "name": "Air Brake Systems",
        "nameFr": "Freins pneumatiques",
        "theoryContent": """# Freins pneumatiques

## Principes des freins pneumatiques
Les freins pneumatiques (air brakes) sont le système de freinage standard des véhicules lourds au Québec et en Amérique du Nord. Ils utilisent de l'air comprimé pour actionner les freins.

## Composants principaux

### Compresseur d'air
Pompe à air entraînée par le moteur (généralement par courroie ou pignon).
- Pression de consigne : 100-120 psi (6,9-8,3 bars)
- Cycle de compression/décompression
- Refroidi par air ou par liquide de refroidissement

### Réservoirs d'air
Stockent l'air comprimé pour le système de freinage.
- Réservoir humide (primaire) : Première étape de stockage, condense l'humidité
- Réservoirs secs (secondaires) : Air pur pour les circuits de freinage
- Purge manuelle ou automatique : Évacuation de l'eau et des contaminants
- Capacité typique : 60-120 litres au total

### Régulateur de pression
Contrôle la pression maximale du système. Décharge le compresseur lorsque la pression atteint la consigne.

### Valve de protection
Sépare les circuits de freinage. Si un circuit tombe en pression (fuite), l'autre circuit reste fonctionnel.

### Freins de service
**Freins à tambour** : Les plus courants sur les véhicules lourds
- Chambre de frein : Convertit la pression d'air en force mécanique
- Tige de poussée : Actionne le mécanisme de frein
- Came (camshaft) : Écarte les mâchoires contre le tambour
- Mâchoires et garnitures : Matériau de friction

**Freins à disque** : De plus en plus courants
- Étagère de frein (caliper) : Pince le disque
- Plaquettes de frein : Remplacement plus simple que les mâchoires

## Frein de stationnement (ressort)
- Les ressorts puissants serrent les freins lorsque la pression d'air est absente (sécurité)
- La pression d'air comprime les ressorts pour libérer les freins (roulage)
- Vanne de contrôle du frein de stationnement au tableau de bord

## ABS (Antilock Braking System)
Système qui empêche le blocage des roues lors d'un freinage d'urgence.
- Capteurs de vitesse de roue (excitateur + capteur magnétique)
- Modulateurs ABS : Réduisent la pression de freinage individuellement par roue
- Calculateur ABS : Contrôle le système et vérifie les anomalies
- Témoin ABS au tableau de bord : S'allume au démarrage, s'éteint après autotest

## Sécurité et maintenance obligatoire
- Test de fuite : Le moteur arrêté, la pression ne doit pas chuter de plus de 2 psi/minute
- Réglage des freins : Vérification aux 3 mois (jeu de la tige de poussée)
- Purge des réservoirs : Quotidienne (manuelle ou automatique)
- Inspection annuelle : Vérification complète des composants
- Freinage et rodage des freins refaits : 500 km en conduite modérée

## Hivernage
- L'humidité dans l'air comprimé gèle par temps froid
- Déshydrateur d'air (air dryer) : Filtre l'humidité et les contaminants
- Alcool injecté dans le système pour abaisser le point de congélation
- Protection des conduits d'air contre le gel
"""
    },
    {
        "number": 6,
        "name": "Steering and Suspension",
        "nameFr": "Direction et suspension",
        "theoryContent": """# Direction et suspension

## Système de direction des véhicules lourds

### Direction assistée hydraulique
La majorité des véhicules lourds utilisent une direction assistée hydraulique.
- **Pompe de direction** : Entraînée par le moteur, génère la pression hydraulique
- **Crémaillère ou boîtier de direction** : Convertit le mouvement rotatif du volant en mouvement linéaire des roues
- **Vanne rotative** : Distribue l'huile selon la direction du volant tourné
- **Vérin de puissance** : Cylindre hydraulique qui assiste le mouvement

### Direction électro-hydraulique
Système plus récent où une pompe électrique remplace la pompe mécanique. Économie de carburant (pompe fonctionne seulement quand nécessaire).

### Géométrie de direction
- **Angle de chasse (caster)** : Inclinaison de l'axe de pivotement vers l'avant ou l'arrière. Favorise la stabilité en ligne droite
- **Carrossage (camber)** : Inclinaison de la roue vue de face. Usure des pneus et tenue de route
- **Parallélisme (toe-in/toe-out)** : Écart entre l'avant et l'arrière des roues. Influence la stabilité et l'usure des pneus

## Suspension des véhicules lourds

### Suspension à ressorts à lames
La plus courante sur les camions lourds.
- **Lames maîtresses** : Feuilles d'acier empilées qui supportent le poids
- **Boulon centre** : Maintient les lames alignées
- **Silentblocs** : Amortissent les vibrations aux points d'attache
- **Tasseaux de cabrage** : Empêchent les lames de se déplacer latéralement

### Suspension pneumatique (air ride)
Utilisée sur les tracteurs routiers et les autobus.
- **Coussins d'air** : Sacs en caoutchouc renforcé gonflés à l'air comprimé
- **Compresseur d'air** : Maintient la pression
- **Vanne de nivellement** : Ajuste la hauteur de la suspension
- Avantages : Confort amélioré, charge égale sur tous les essieux

### Suspension à barre de torsion
Utilisée sur certains camions moyens et véhicules militaires.

## Essieux
- **Essieu moteur** : Transmet la puissance du différentiel aux roues
- **Essieu directeur** : Porte les roues avant directrices
- **Essieu relevable ou tag axle** : Essieu supplémentaire qui peut être levé quand non chargé
- **Réducteur de moyeu (hub reduction)** : Engrenage planétaire dans le moyeu pour réduire la vitesse et augmenter le couple

## Alignement et équilibrage
- **Alignement** : Vérification aux 100 000 km ou après un impact
- **Équilibrage des roues** : Évite les vibrations à haute vitesse
- **Usure des pneus** : Indicateur de problèmes de suspension ou de direction
- Usure en dent de scie : Problème de parallélisme
- Usure sur les bords extérieurs : Problème de carrossage
- Usure au centre : Surcharge ou surgonflage
"""
    },
    {
        "number": 7,
        "name": "Electronic Diagnostics",
        "nameFr": "Diagnostic électronique",
        "theoryContent": """# Diagnostic électronique

## Introduction au diagnostic des véhicules lourds
Les véhicules lourds modernes sont équipés de multiples calculateurs électroniques (ECU) qui contrôlent tous les systèmes : moteur, transmission, freins, suspension, climatisation. Le diagnostic électronique est une compétence essentielle pour le mécanicien de véhicules lourds.

## Calculateurs principaux

### ECM (Engine Control Module)
Contrôle et surveille le moteur diesel.
- Injection de carburant (timing, quantité, pression)
- Turbocompresseur (pression de suralimentation)
- Recyclage des gaz d'échappement (EGR)
- Post-traitement des gaz (SCR, DPF)
- Régime de ralenti et limitation de vitesse

### TCM (Transmission Control Module)
Gère les passages de vitesses sur les transmissions automatisées.
- Points de changement de vitesse selon la charge
- Rétrogradation automatique en côte
- Protection du convertisseur de couple

### ABS/ESP Module
Contrôle les systèmes de freinage et de stabilité.

## Protocoles de communication

### SAE J1939 (CAN bus)
Protocole standard pour les véhicules lourds. Communication sur 2 fils (CAN H, CAN L) à 250 kbit/s.

### J1587 / J1708
Protocole plus ancien, encore présent sur les véhicules pré-2010.

### Diagnostic Link Connector (DLC)
Prise de diagnostic standard à 6 ou 9 broches sur les véhicules lourds (différent du OBDII des véhicules légers).

## Codes DTC (Diagnostic Trouble Codes)
Format standard SAE J1939 : SPN-FMI (Suspect Parameter Number - Failure Mode Identifier)

**Exemples SPN-FMI** :
- SPN 100 - Pression d'huile moteur
- SPN 94 - Pression de suralimentation
- SPN 190 - Régime moteur
- SPN 174 - Température du liquide de refroidissement

**FMI (Failure Mode Identifier)** :
- 0 - Données trop élevées
- 1 - Données trop basses
- 2 - Données erratiques/intermittentes
- 3 - Tension trop élevée
- 4 - Tension trop basse
- 5 - Courant trop bas
- 6 - Courant trop élevé

## Outils de diagnostic
- **Scanneur multimarque** : Compatible avec les principales marques (Cummins, Detroit, Volvo, Mack, PACCAR)
- **Logiciel propriétaire** : Insite (Cummins), DDDL (Detroit), Tech Tool (Volvo)
- **Multimètre oscilloscope** : Analyse des signaux CAN bus, capteurs
- **Testeur de composants** : Injecteurs, vannes, actionneurs

## Capteurs courants
- **Capteur de pression d'huile** : Résistance variable ou piézo-électrique
- **Capteur de température** : Thermistance NTC
- **Capteur de pression de suralimentation** : Piézo ou piézorésistif
- **Capteur de régime moteur (CKP)** : Magnétique ou effet Hall
- **Capteur de position de l'arbre à cames (CMP)** : Effet Hall
- **Capteur de débit d'air massique (MAF)** : Film chaud ou fil chaud
- **Capteur de pression différentielle DPF** : Mesure de colmatage

## Procédure de diagnostic
1. **Connexion et lecture des codes** : Identifier les DTC actifs et inactifs
2. **Analyse des données en direct** : Live data des paramètres moteur
3. **Tests d'actionneurs** : Activation commandée des composants
4. **Vérification des circuits** : Tension, résistance, continuité des faisceaux
5. **Tests de composants** : Mesure directe sur capteurs et actionneurs
6. **Réinitialisation et validation** : Effacer les codes, essai routier
""" 
    },
    {
        "number": 8,
        "name": "Safety and CCQ Standards",
        "nameFr": "Sécurité et normes CCQ",
        "theoryContent": """# Sécurité et normes CCQ

## Commission de la construction du Québec (CCQ)
La CCQ est l'organisme qui régit la formation professionnelle, l'accès aux métiers et les conditions de travail dans l'industrie de la construction au Québec. Les mécaniciens de véhicules lourds doivent détenir une certification CCQ valide.

## Certifications obligatoires

### Carte de compétence CCQ
- Obligatoire pour travailler sur les chantiers de construction
- Renouvellement aux 2 ans
- Mention du métier et de la spécialisation

### Formation santé et sécurité (ASP Construction)
- **Cours SST-01** : Santé et sécurité générale sur les chantiers
- **Carte de chantier** : Preuve de formation SST valide
- **SIMDUT** : Signalement et manipulation des produits dangereux

## Sécurité en atelier de mécanique lourde

### Risques mécaniques
- **Points de pincement** : Courroies, chaînes, engrenages
- **Pièces en rotation** : Arbres de transmission, ventilateurs
- **Pièces sous tension** : Ressorts, vérins hydrauliques sous pression
- **Chutes d'objets** : Pièces lourdes, outillage

### Procédures de sécurité
- **Verrouillage/étiquetage (lockout/tagout)** : Couper l'alimentation électrique, hydraulique, pneumatique avant toute intervention
- **Cales de roues** : Obligatoires sous tous les véhicules soulevés
- **Crics et ponts élévateurs** : Capacité de levage minimale de 1,5x le poids du véhicule
- **Support auxiliaire** : Chandelles de sécurité sous le véhicule pour tout travail sous le véhicule

### Travail avec des ponts élévateurs
- **Pont à deux colonnes** : Jusqu'à 12 000 lb, positionnement symétrique requis
- **Pont à quatre colonnes** : Jusqu'à 40 000 lb, rampes ou plateforme
- **Pont ciseau** : Pour les travaux sous le châssis
- **Inspection mensuelle** : Câbles, chaînes, vérins hydrauliques, sécurités mécaniques

## Inspection des véhicules lourds

### Normes NVIS (National Vehicle Inspection Standards)
- Inspection obligatoire aux 12 mois au Québec
- Vérification des freins, direction, suspension, éclairage, pneus
- Rapport d'inspection signé par le technicien certifié

### CVOR (Commercial Vehicle Operator Registration)
Registre de la sécurité des transporteurs routiers. Les infractions graves peuvent mener à la suspension du CVOR.

## Équipement de protection individuelle (EPI)
- **Casque** : Classe E pour travail mécanique
- **Lunettes de sécurité** : Protection contre projections (huile, métal)
- **Gants** : Gants mécaniques (coupe) et gants chimiques
- **Souliers de sécurité** : Embout d'acier, semaine anti-crevaison
- **Protection auditive** : Bouchons ou coquilles (atelier > 85 dB)
- **Vêtements haute visibilité** : Travail près de la circulation

## Premiers soins et sécurité incendie
- **Extincteur** : Classe ABC obligatoire dans l'atelier
- **Trousse de premiers soins** : Complète, vérifiée mensuellement
- **Déversement de produits** : Trousse de décontamination (huile, solvants, acide de batterie)
- **Issues de secours** : Dégagées, signalées

## Règlementation environnementale
- **Stockage des huiles usées** : Contenants étanches identifiés, zone de rétention
- **Batteries usagées** : Recyclage obligatoire
- **Liquides de refroidissement** : Récupération et traitement
- **Pneus usagés** : Recyclage via un centre autorisé
- **Chiffons souillés** : Contenants métalliques à couvercle, vidange régulière
"""
    }
]

CHAPTER_NAMES = {
    "HVAC": HVAC_CHAPTERS,
    "MVL": MVL_CHAPTERS
}

TRADE_IDS = {
    "HVAC": "cmt_hvac_001",
    "MVL": "cmt_mvl_001"
}

def insert_chapters(trade_code):
    trade_id = TRADE_IDS[trade_code]
    chapters = CHAPTER_NAMES[trade_code]
    
    for ch in chapters:
        cid = str(uuid.uuid4())[:20]
        sql = f"""
        INSERT INTO "Chapter" (id, "tradeId", number, name, "nameFr", "theoryContent", "createdAt", "updatedAt")
        VALUES ('{cid}', '{trade_id}', {ch['number']}, {shq(ch['name'])}, {shq(ch['nameFr'])}, {shq(ch['theoryContent'])}, NOW(), NOW());
        """
        r = run_sql(sql)
        ch['id'] = cid
        print(f"  Chapitre {ch['number']}: {ch['nameFr']} → {cid}")
    return chapters

print("=" * 60)
print("PHASE 1: Insertion des chapitres HVAC")
print("=" * 60)
hvac = insert_chapters("HVAC")

print("\n" + "=" * 60)
print("PHASE 2: Insertion des chapitres MVL")
print("=" * 60)
mvl = insert_chapters("MVL")

# ── QUESTIONS ──────────────────────────────────────────

import random

def gen_hvac_q(chapter_id, chapter_number, idx):
    """Generate a single HVAC question for the given chapter."""
    questions_pool = {
        1: [  # Thermodynamique
            ("Quelle unité est utilisée pour mesurer la puissance des systèmes de climatisation en Amérique du Nord ?", ["Watts", "BTU/h", "Joules", "Pascals"], "B"),
            ("Un système de 3 tonnes de réfrigération équivaut à combien de BTU/h ?", ["24 000", "36 000", "48 000", "12 000"], "B"),
            ("Quel mode de transfert thermique est prédominant dans un échangeur à plaques ?", ["Conduction", "Convection", "Rayonnement", "Évaporation"], "B"),
            ("Le SEER mesure quoi dans un système de climatisation ?", ["La puissance sonore", "L'efficacité énergétique saisonnière", "La pression du réfrigérant", "Le débit d'air"], "B"),
            ("Quel composant d'un cycle de réfrigération augmente la pression du réfrigérant ?", ["Évaporateur", "Détendeur", "Compresseur", "Condenseur"], "C"),
            ("La première loi de la thermodynamique stipule que :", ["L'entropie augmente toujours", "L'énergie se conserve", "La chaleur va du froid au chaud", "La pression est constante"], "B"),
            ("Quelle est l'unité SI équivalente à 12 000 BTU/h ?", ["1 kW", "3,517 kW", "5 kW", "10 kW"], "B"),
            ("Le coefficient de performance (COP) d'une pompe à chaleur de 3 signifie que :", ["Elle consomme 3 kW pour produire 1 kW", "Elle produit 3 kW de chaleur pour 1 kW consommé", "Elle a un rendement de 30%", "Elle produit 3 tonnes de froid"], "B"),
            ("Dans un condenseur, le réfrigérant passe de :", ["Liquide à gazeux", "Gazeux à liquide", "Solide à liquide", "Gazeux à plasma"], "B"),
            ("La valeur R d'un matériau mesure :", ["Sa résistance électrique", "Sa résistance thermique", "Sa rigidité", "Sa densité"], "B"),
            ("Quel est le principal inconvénient d'un système surdimensionné en climatisation ?", ["Bruit excessif", "Mauvaise déshumidification", "Consommation réduite", "Durée de vie prolongée"], "B"),
        ],
        2: [  # Chauffage
            ("Qu'est-ce que l'AFUE mesure ?", ["Le débit d'air", "Le rendement de combustion annuel", "La pression du gaz", "La température de l'air"], "B"),
            ("Une fournaise au gaz à condensation a un AFUE typique de :", ["80%", "90%", "95%+", "70%"], "C"),
            ("Quel type de système de chauffage est le plus efficace au Québec pour les températures très froides ?", ["Pompe à chaleur air-air", "Fournaise au gaz à condensation", "Plinthe électrique", "Thermopompe sans chauffage d'appoint"], "B"),
            ("Le COP d'une pompe à chaleur diminue quand :", ["La température extérieure augmente", "La température extérieure diminue", "Le débit d'air augmente", "L'humidité diminue"], "B"),
            ("Quelle est la température minimale de fonctionnement recommandée pour une pompe à chaleur air-air standard au Québec ?", ["-10°C", "-15°C", "-25°C", "-40°C"], "C"),
            ("Un thermostat programmable permet :", ["D'augmenter la pression du gaz", "De réduire la consommation d'énergie", "D'augmenter le débit d'air", "De changer le réfrigérant"], "B"),
            ("Lequel de ces appareils utilise un échangeur de chaleur ?", ["Un ventilateur", "Une fournaise à gaz", "Un humidificateur", "Un filtre à air"], "B"),
            ("Quel type de chaudière a le rendement le plus élevé ?", ["Chaudière standard", "Chaudière à condensation", "Chaudière à vapeur", "Chaudière électrique"], "B"),
            ("Une pompe à chaleur géothermique utilise comme source de chaleur :", ["L'air extérieur", "Le sol ou l'eau souterraine", "Le gaz naturel", "L'électricité"], "B"),
        ],
        3: [  # Climatisation
            ("Quel type de compresseur est le plus couramment utilisé dans les systèmes résidentiels au Québec ?", ["Alternatif", "Scroll (spiral)", "Centrifuge", "Vis"], "B"),
            ("Le rôle du détendeur thermostatique (TXV) est de :", ["Comprimer le réfrigérant", "Réduire la pression du réfrigérant liquide", "Chauffer le réfrigérant", "Filtrer le réfrigérant"], "B"),
            ("Dans l'évaporateur, le réfrigérant absorbe la chaleur de :", ["L'air extérieur", "L'air ambiant intérieur", "Le compresseur", "Le condenseur"], "B"),
            ("Quelle est la pression typique du côté bas d'un système R-410A en fonctionnement ?", ["50-70 psi", "100-150 psi", "200-300 psi", "400-500 psi"], "B"),
            ("Le dégivrage par inversion de cycle signifie que :", ["Le système s'arrête complètement", "Le système fonctionne temporairement en mode chauffage", "Le ventilateur inverse son sens", "Le filtre est inversé"], "B"),
            ("Une tonne de réfrigération correspond à :", ["6 000 BTU/h", "12 000 BTU/h", "24 000 BTU/h", "3 000 BTU/h"], "B"),
            ("Quel composant est situé entre le condenseur et le détendeur ?", ["Compresseur", "Réceptrice (réservoir de liquide)", "Évaporateur", "Ventilateur"], "B"),
            ("La norme CSA F280 sert à :", ["Dimensionner les systèmes de chauffage et climatisation", "Mesurer le rendement des compresseurs", "Certifier les réfrigérants", "Calculer les pertes de charge"], "A"),
        ],
        4: [  # Ventilation
            ("Au Québec, un VRC (ventilateur récupérateur de chaleur) est obligatoire dans :", ["Tous les bâtiments", "Les nouvelles constructions résidentielles", "Les garages", "Les entrepôts"], "B"),
            ("Quelle est l'efficacité typique d'un VRC ?", ["30-40%", "60-85%", "90-99%", "10-20%"], "B"),
            ("Un VRE se distingue d'un VRC par sa capacité à transférer :", ["La pression", "L'humidité", "Le son", "Les particules"], "B"),
            ("Le débit d'air dans les conduits se mesure en :", ["BTU/h", "CFM", "PSI", "Watt"], "B"),
            ("Quel type de conduit est le plus efficace pour minimiser les pertes de charge ?", ["Conduit rectangulaire", "Conduit circulaire", "Conduit flexible", "Conduit carré"], "B"),
            ("La pression statique d'un système résidentiel typique est de :", ["0,01-0,05 po CE", "0,1-0,5 po CE", "2-5 po CE", "10-20 po CE"], "B"),
            ("À quoi sert un registre (damper) dans un conduit ?", ["À mesurer le débit", "À ajuster le débit d'air par section", "À filtrer l'air", "À chauffer l'air"], "B"),
            ("L'équilibrage d'un système de ventilation consiste à :", ["Nettoyer les conduits", "Ajuster les débits d'air pour un confort uniforme", "Changer les filtres", "Vérifier la pression du réfrigérant"], "B"),
        ],
        5: [  # Contrôles
            ("Quel type de capteur de température est le plus précis dans un thermostat électronique ?", ["Bilame métallique", "Thermistance NTC", "Thermocouple", "Thermostat à mercure"], "B"),
            ("Le délai de protection d'un compresseur avant redémarrage est généralement de :", ["30 secondes", "3 à 5 minutes", "30 minutes", "1 heure"], "B"),
            ("Une vanne motorisée à retour par ressort sert à :", ["Augmenter le débit", "Assurer la sécurité (retour position fermée sur perte de courant)", "Mesurer la pression", "Filtrer l'eau"], "B"),
            ("Le DDC (Direct Digital Control) permet :", ["Le chauffage manuel", "Le contrôle centralisé automatisé d'un bâtiment", "La mesure de débit", "Le diagnostic des réfrigérants"], "B"),
            ("Un système de zonage utilise :", ["Un seul thermostat", "Plusieurs thermostats avec des volets motorisés", "Un compresseur supplémentaire", "Un réservoir d'expansion"], "B"),
            ("La séquence de chauffage typique démarre par :", ["L'activation du ventilateur", "L'appel de chaleur du thermostat", "L'ouverture de la vanne gaz", "La vérification de la flamme"], "B"),
        ],
        6: [  # Réfrigérants
            ("Le réfrigérant R-410A remplace principalement le :", ["R-12", "R-22", "R-134a", "R-404A"], "B"),
            ("Le GWP (Global Warming Potential) du R-410A est d'environ :", ["675", "2088", "3922", "4"], "B"),
            ("Quel réfrigérant naturel a un GWP de 3 et est inflammable ?", ["R-744 (CO₂)", "R-290 (Propane)", "R-32", "R-1234yf"], "B"),
            ("Le Protocole de Montréal a principalement visé à réduire :", ["Les gaz à effet de serre", "Les substances appauvrissant l'ozone", "Les composés organiques volatils", "Les particules fines"], "B"),
            ("Avant d'ouvrir un circuit de réfrigération, le technicien doit :", ["Vidanger l'huile", "Récupérer le réfrigérant", "Dépressuriser avec de l'air", "Chauffer le circuit"], "B"),
            ("Quelle certification est requise au Québec pour manipuler des réfrigérants ?", ["Certification électrique", "Certification de manipulation des réfrigérants", "Certification en soudage", "Permis de conduire"], "B"),
            ("Le R-32 a un GWP de :", ["2088", "675", "1430", "4"], "B"),
            ("Qu'est-ce que l'Accord de Kigali vise à réduire ?", ["Les CFC", "Les HFC", "Les HCFC", "Les COV"], "B"),
        ],
        7: [  # Codes et normes
            ("Quel organisme supervise les installations HVAC au Québec ?", ["CCQ", "RBQ", "CNESST", "CSA"], "B"),
            ("La norme CSA B149 concerne :", ["Les installations électriques", "Les installations au gaz", "La plomberie", "La ventilation"], "B"),
            ("Quel dégagement minimum est requis devant un appareil à gaz pour l'entretien ?", ["6 pouces", "12 pouces", "24 pouces", "48 pouces"], "C"),
            ("Le Code de construction du Québec exige un AFUE minimal de :", ["70%", "80%", "90%", "95%"], "C"),
            ("La norme CSA F280 sert à :", ["Dimensionner les systèmes CVC résidentiels", "Certifier les réfrigérants", "Installer les chaudières", "Régler les thermostats"], "A"),
            ("Une licence RBQ est requise pour :", ["Conduire un camion", "Installer des systèmes HVAC commerciaux", "Vendre des thermostats", "Enseigner la HVAC"], "B"),
            ("Quels gaz de combustion doivent être évacués par un conduit de fumée ?", ["Air", "Gaz de combustion d'un appareil au gaz", "Vapeur d'eau", "Air climatisé"], "B"),
        ],
        8: [  # Sécurité et outils
            ("Quel équipement de protection est obligatoire sur un chantier de construction au Québec ?", ["Casque de sécurité", "Gants en cuir", "Bottes en caoutchouc", "Masque à gaz"], "A"),
            ("Avant de travailler sur un circuit électrique, il faut :", ["Vérifier l'absence de tension avec un multimètre", "Débrancher la batterie", "Porter des gants isolants", "Toutes ces réponses"], "D"),
            ("Quel outil est utilisé pour mesurer la vitesse de l'air dans les conduits ?", ["Manomètre", "Anémomètre", "Thermomètre", "Multimètre"], "B"),
            ("L'angle d'une échelle par rapport au mur doit être de :", ["45 degrés", "60 degrés", "75 degrés", "90 degrés"], "C"),
            ("En cas d'inhalation de réfrigérant, la première action est :", ["Appeler le 911", "Sortir la personne à l'air frais", "Donner de l'eau", "Pratiquer le bouche-à-bouche"], "B"),
            ("Le brasage des tuyaux de cuivre en HVAC utilise généralement un alliage à :", ["5% argent", "15% argent", "30% argent", "50% argent"], "B"),
            ("Un détecteur de monoxyde de carbone doit être installé :", ["Dans la salle de bain", "Dans les locaux contenant des appareils à gaz", "À l'extérieur", "Dans le garage"], "B"),
        ]
    }
    pool = questions_pool.get(chapter_number, [])
    if idx < len(pool):
        q, opts, ans = pool[idx]
        diff = "EASY" if idx % 10 < 3 else ("HARD" if idx % 10 > 7 else "MEDIUM")
        return q, json.dumps(opts), ans, diff
    # Generate synthetic questions for remaining slots
    return None, None, None, None

def gen_mvl_q(chapter_id, chapter_number, idx):
    questions_pool = {
        1: [  # Moteurs diesel
            ("Quel est le rapport de compression typique d'un moteur diesel ?", ["8:1 à 10:1", "14:1 à 25:1", "5:1 à 7:1", "30:1 à 40:1"], "B"),
            ("Quel composant pulvérise le carburant dans la chambre de combustion ?", ["Pompe d'injection", "Injecteur", "Turbocompresseur", "Soupape d'admission"], "B"),
            ("Le turbocompresseur est entraîné par :", ["Une courroie", "Les gaz d'échappement", "Un moteur électrique", "L'arbre à cames"], "B"),
            ("Un moteur diesel diffère d'un moteur à essence par :", ["L'utilisation de bougies", "L'allumage par compression", "Un carburateur", "Un vilebrequin plus long", "B"),
            ("La pompe à injection common rail maintient une pression de :", ["100-500 bars", "1 000-3 000 bars", "50-100 bars", "5 000-10 000 bars", "B"),
            ("À quelle fréquence doit-on effectuer la vidange d'huile sur un moteur diesel lourd ?", ["Tous les 5 000 km", "Tous les 15 000-25 000 km", "Tous les 50 000 km", "Une fois par année", "B"),
            ("Le refroidissement intermédiaire (intercooler) sert à :", ["Refroidir l'huile", "Refroidir l'air d'admission après le turbo", "Refroidir le carburant", "Refroidir les gaz d'échappement", "B"),
            ("Un filtre à carburant avec séparateur d'eau est essentiel au Québec à cause :", ["De la chaleur estivale", "De la condensation hivernale dans le réservoir", "De la poussière", "Des vibrations", "B"),
        ],
        2: [  # Transmissions
            ("Une transmission manuelle non synchronisée nécessite :", ["Un convertisseur de couple", "Un double débrayage", "Un embrayage automatique", "Un arbre de transmission", "B"),
            ("Le convertisseur de couple d'une transmission automatique comprend :", ["Pompe, turbine et stator", "Embrayage, volant et arbre", "Pistons, cylindres et vannes", "Ressorts et amortisseurs"], "A"),
            ("Une PTO (prise de force) sert à :", ["Augmenter la vitesse", "Alimenter un équipement annexe", "Freiner le véhicule", "Changer de vitesse", "B"),
            ("La vidange d'huile de transmission automatique est recommandée aux :", ["25 000 km", "50 000 km", "100 000 km", "200 000 km", "B"),
            ("Le symptôme d'un synchroniseur usé est :", ["Bruit de grincement au freinage", "Difficulté à passer les vitesses", "Vibration à haute vitesse", "Fuite d'huile", "B"),
            ("Allison est un fabricant de :", ["Moteurs diesel", "Transmissions automatiques lourdes", "Pneus", "Batteries", "B"),
        ],
        3: [  # Hydraulique
            ("Quel type de pompe hydraulique est le plus courant sur les véhicules lourds ?", ["Pompe à pistons", "Pompe à engrenages", "Pompe à palettes", "Pompe centrifuge", "B"),
            ("La contamination est responsable de quel pourcentage des pannes hydrauliques ?", ["20%", "50%", "80%", "95%", "C"),
            ("Un vérin double effet permet :", ["Une seule direction", "Le déplacement dans les deux directions", "Un mouvement rotatif", "Un mouvement intermittent", "B"),
            ("Un accumulateur hydraulique sert à :", ["Augmenter la pression", "Stocker de l'énergie hydraulique", "Filtrer l'huile", "Refroidir le fluide", "B"),
            ("La cavitation dans une pompe hydraulique est causée par :", ["Une pression trop élevée", "Un manque d'huile à l'aspiration", "Un excès d'huile", "Une température trop basse", "B"),
            ("La vidange d'huile hydraulique est recommandée aux :", ["100 heures", "500 heures", "2 000 heures", "10 000 heures", "C"),
        ],
        4: [  # Électrique
            ("Quelle est la tension typique du système électrique sur un camion lourd ?", ["12V", "24V", "48V", "6V", "B"),
            ("Le CCA (Cold Cranking Amps) mesure :", ["La capacité de la batterie", "La capacité de démarrage à froid", "La tension à vide", "Le courant de charge", "B"),
            ("Un alternateur de camion lourd produit typiquement :", ["50-80A", "100-200A", "300-500A", "20-40A", "B"),
            ("Le CAN bus utilise quelle résistance de terminaison ?", ["60Ω", "120Ω", "240Ω", "1kΩ", "B"),
            ("Quel pourcentage des problèmes électriques est causé par la masse ?", ["10%", "50%", "75%", "90%", "B"),
            ("Un chauffe-bloc de moteur diesel a une puissance typique de :", ["100W", "500W", "1 000-1 500W", "3 000W", "C"),
            ("Le régulateur de tension de l'alternateur maintient la tension entre :", ["12,0-12,6V", "13,8-14,4V", "14,8-15,5V", "11,5-12,0V", "B"),
        ],
        5: [  # Freins pneumatiques
            ("La pression de service normale d'un système de freins pneumatiques est de :", ["60-80 psi", "100-120 psi", "150-200 psi", "30-50 psi", "B"),
            ("Le réservoir humide dans un système d'air comprimé sert à :", ["Stocker l'air pour les freins de stationnement", "Condenser l'humidité de l'air comprimé", "Alimenter la suspension", "Refroidir le compresseur", "B"),
            ("Un déshydrateur d'air (air dryer) sert à :", ["Augmenter la pression", "Filtrer l'humidité et les contaminants", "Réchauffer l'air", "Lubrifier le système", "B"),
            ("L'ABS empêche :", ["Le freinage", "Le blocage des roues lors du freinage d'urgence", "L'accélération", "Le dérapage en virage", "B"),
            ("Le frein de stationnement à ressort se libère quand :", ["La pression d'air est présente", "Le ressort est comprimé", "La pédale de frein est enfoncée", "Le moteur tourne", "A"),
            ("À quelle fréquence doit-on purger les réservoirs d'air ?", ["Aux 6 mois", "Quotidiennement", "Aux 50 000 km", "Annuellement", "B"),
        ],
        6: [  # Direction et suspension
            ("La suspension pneumatique (air ride) utilise quoi pour supporter la charge ?", ["Des ressorts à lames", "Des coussins d'air gonflables", "Des barres de torsion", "Des amortisseurs hydrauliques", "B"),
            ("L'angle de chasse (caster) influence :", ["L'usure des pneus", "La stabilité en ligne droite", "La capacité de charge", "La puissance du moteur", "B"),
            ("Une usure des pneus en dent de scie indique :", ["Un problème de carrossage", "Un problème de parallélisme", "Un surgonflage", "Une surcharge", "B"),
            ("Un essieu relevable (tag axle) sert à :", ["Augmenter la puissance", "Supporter plus de poids quand le véhicule est chargé", "Améliorer la direction", "Réduire le bruit", "B"),
            ("Un silentbloc usé dans une suspension à lames cause :", ["Une fuite d'huile", "Un jeu et des bruits dans la suspension", "Une surchauffe", "Une perte de puissance", "B"),
        ],
        7: [  # Diagnostic
            ("Le protocole de communication standard des véhicules lourds est :", ["OBDII", "SAE J1939", "Bluetooth", "WiFi", "B"),
            ("SPN 100 dans un code DTC J1939 correspond à :", ["Régime moteur", "Pression d'huile moteur", "Température du liquide", "Pression de suralimentation", "B"),
            ("FMI 3 signifie :", ["Données trop basses", "Tension trop élevée", "Courant trop bas", "Données erratiques", "B"),
            ("Le DLC (Diagnostic Link Connector) d'un véhicule lourd a :", ["16 broches", "6 ou 9 broches", "4 broches", "12 broches", "B"),
            ("Un capteur de régime moteur (CKP) peut être de type :", ["Résistance variable", "Magnétique ou effet Hall", "Piézo-électrique", "Thermocouple", "B"),
            ("Le logiciel Insite est utilisé pour diagnostiquer les moteurs :", ["Detroit Diesel", "Cummins", "Volvo", "PACCAR", "B"),
        ],
        8: [  # Sécurité CCQ
            ("Quel organisme régit la formation professionnelle dans la construction au Québec ?", ["RBQ", "CCQ", "CNESST", "MTQ", "B"),
            ("Le cours SST-01 de l'ASP Construction couvre :", ["La mécanique diesel", "La santé et sécurité sur les chantiers", "L'hydraulique", "L'électricité", "B"),
            ("Avant de travailler sous un véhicule levé, il faut :", ["Démarrer le moteur", "Utiliser des chandelles de sécurité", "Retirer les roues", "Vidanger l'huile", "B"),
            ("Quelle est la capacité de levage minimale requise pour un pont élévateur ?", ["1x le poids du véhicule", "1,5x le poids du véhicule", "2x le poids du véhicule", "3x le poids du véhicule", "B"),
            ("La norme NVIS concerne :", ["Les émissions des véhicules", "L'inspection des véhicules lourds", "Le bruit des moteurs", "La formation des conducteurs", "B"),
            ("CVOR est un registre de :", ["Formation des mécaniciens", "Sécurité des transporteurs routiers", "Certification des véhicules", "Assurance des flottes", "B"),
        ]
    }
    pool = questions_pool.get(chapter_number, [])
    if idx < len(pool):
        q, opts, ans = pool[idx]
        diff = "EASY" if idx % 10 < 3 else ("HARD" if idx % 10 > 7 else "MEDIUM")
        return q, json.dumps(opts), ans, diff
    return None, None, None, None

QUESTIONS = {
    "HVAC": gen_hvac_q,
    "MVL": gen_mvl_q
}

def insert_questions(trade_code, chapters, target=250):
    trade_id = TRADE_IDS[trade_code]
    gen_fn = QUESTIONS[trade_code]
    q_count = 0
    
    for ch in chapters:
        cid = ch['id']
        for i in range(40):  # up to 40 per chapter (8*40=320)
            q, opts_json, ans, diff = gen_fn(cid, ch['number'], i)
            if q is None:
                continue
            
            qid = str(uuid.uuid4())[:24]
            sql = f"""
            INSERT INTO "Question" (id, "tradeId", "chapterId", question, options, answer, difficulty, type, locale, "createdAt", "updatedAt")
            VALUES ('{qid}', '{trade_id}', '{cid}', {shq(q)}, '{opts_json}', '{ans}', '{diff}', 'MCQ', 'fr', NOW(), NOW());
            """
            run_sql(sql)
            q_count += 1
            
            if q_count % 50 == 0:
                print(f"  → {q_count} questions insérées...")
    
    return q_count

print("\n" + "=" * 60)
print("PHASE 3: Questions HVAC")
print("=" * 60)
q_hvac = insert_questions("HVAC", hvac)
print(f"  Total HVAC: {q_hvac} questions")

print("\n" + "=" * 60)
print("PHASE 4: Questions MVL")
print("=" * 60)
q_mvl = insert_questions("MVL", mvl)
print(f"  Total MVL: {q_mvl} questions")

print("\n" + "=" * 60)
print("RÉSULTATS FINAUX")
print("=" * 60)
r = run_sql("""
SELECT t.code, t."nameFr", 
  (SELECT COUNT(*) FROM "Chapter" c WHERE c."tradeId" = t.id) as chapitres, 
  (SELECT COUNT(*) FROM "Question" q WHERE q."tradeId" = t.id) as questions 
FROM "Trade" t ORDER BY t.code;
""")
print(r)
