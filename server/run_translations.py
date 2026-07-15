#!/usr/bin/env python3
"""
Full translation pipeline: read raw batches, translate, write en_batches, insert.
Usage: python3 run_translations.py [trade_filter]
  trade_filter: optional substring to filter (ascenseur, briqueteur, constructeur, qbq)
"""
import json, sys, os, subprocess, glob

# Translation maps for recurring terms
TRADE_NAMES = {
    "cmt_ascenseur_001": "Elevator Mechanic",
    "cmt_briqueteur_001": "Bricklayer",
    "cmt_constructeur_001": "Builder",
    "cmrbe6r1h0002eap3qxylo6mr": "QBQ Welder",
}

CHAPTER_NAMES = {}

def translate_text(text):
    """Simple lookup-based French to English translation for technical exam Qs."""
    replacements = {
        "Quel est le code de sécurité qui régit les ascenseurs au Canada ?": "What is the safety code that governs elevators in Canada?",
        "Quelle norme est équivalente au CSA B44 aux États-Unis ?": "Which standard is equivalent to CSA B44 in the United States?",
        "Combien de câbles de traction au minimum sont requis pour un ascenseur à câbles ?": "How many traction cables are minimum required for a cable elevator?",
        "Quel type d'ascenseur utilise un vérin hydraulique ?": "What type of elevator uses a hydraulic cylinder?",
        "Quelle est la fonction d'un gouverneur de sécurité ?": "What is the function of a safety governor?",
        "Quelle est la course maximale typique d'un ascenseur hydraulique ?": "What is the typical maximum travel of a hydraulic elevator?",
        "Quel composant agit comme contrepoids dans un ascenseur à traction ?": "Which component acts as a counterweight in a traction elevator?",
        "À quoi servent les buffers en fosse d'ascenseur ?": "What are buffers in an elevator pit used for?",
        "Quelle est la largeur maximale du jeu entre la porte palière et la cabine ?": "What is the maximum gap width between the landing door and the car?",
        "Quelle catégorie d'ascenseur est conçue principalement pour le transport de marchandises ?": "Which category of elevator is designed mainly for freight transport?",
        "Quel dispositif empêche la cabine de descendre si les câbles se brisent ?": "What device prevents the car from descending if the cables break?",
        "Quelle est la fonction de la poulie de traction ?": "What is the function of the traction sheave?",
        "Selon le CSA B44, quelle est la vitesse maximale d'un ascenseur hydraulique ?": "According to CSA B44, what is the maximum speed of a hydraulic elevator?",
        "Qu'est-ce qu'un ascenseur MRL ?": "What is an MRL elevator?",
        "Quel pourcentage de la charge nominale le contrepoids doit-il équilibrer ?": "What percentage of the rated load must the counterweight balance?",
        "Quels types d'ascenseurs sont couverts par le CSA B44 ?": "What types of elevators are covered by CSA B44?",
        "Combien de mètres la cabine peut-elle descendre avant que le parachute ne s'active ?": "How many meters can the car descend before the safety gear activates?",
        "Quel matériau est le plus utilisé pour les rails de guidage ?": "What material is most commonly used for guide rails?",
        "Qu'est-ce qu'une plateforme élévatrice ?": "What is a platform lift?",
        "Quelle norme électrique s'applique aux ascenseurs au Québec ?": "Which electrical standard applies to elevators in Quebec?",
        "Quel est le facteur de sécurité minimum des câbles de traction selon le CSA B44 ?": "What is the minimum safety factor for traction cables according to CSA B44?",
        "Qui émet les certifications de sécurité des ascenseurs au Québec ?": "Who issues elevator safety certifications in Quebec?",
        "Qu'est-ce qu'un ascenseur à double cabine ?": "What is a double-deck elevator?",
        "Quel angle maximal est permis pour la goulotte de vérin hydraulique ?": "What maximum angle is allowed for the hydraulic cylinder casing?",
        "Qu'est-ce qu'un trottoir roulant ?": "What is a moving walkway?",
        "Quelle est la profondeur minimale d'une fosse d'ascenseur ?": "What is the minimum depth of an elevator pit?",
        "Quel dispositif empêche la cabine de dépasser l'étage supérieur ?": "What device prevents the car from exceeding the top floor?",
        "Qu'est-ce qu'un escalier mécanique ?": "What is an escalator?",
        "Quelle est la tension nominale typique d'alimentation d'un ascenseur ?": "What is the typical nominal supply voltage for an elevator?",
        "Selon le CSA B44, combien de temps les portes doivent-elles rester ouvertes au minimum ?": "According to CSA B44, how long must doors stay open at minimum?",
        "Détecter la survitesse et déclencher le parachute": "Detect overspeed and trigger the safety gear",
        "Réguler la vitesse du moteur": "Regulate the motor speed",
        "Contrôler l'ouverture des portes": "Control door opening",
        "Alimenter l'éclairage d'urgence": "Power emergency lighting",
        "Le contrepoids": "The counterweight",
        "Le vérin": "The cylinder",
        "La poulie": "The sheave",
        "Le buffet": "The buffer",
        "Amortir la cabine en fin de course": "Cushion the car at end of travel",
        "Stocker l'énergie hydraulique": "Store hydraulic energy",
        "Alimenter le moteur": "Power the motor",
        "Refroidir l'huile": "Cool the oil",
        "Monte-charge": "Freight elevator",
        "Ascenseur à passagers": "Passenger elevator",
        "Escalier mécanique": "Escalator",
        "Plateforme élévatrice": "Platform lift",
        "Le parachute": "The safety gear",
        "Le buffer": "The buffer",
        "Le frein": "The brake",
        "Le limiteur de vitesse": "The speed limiter",
        "Entraîner les câbles par adhérence": "Drive the cables by friction",
        "Guider la cabine": "Guide the car",
        "Tendre les câbles": "Tension the cables",
        "Compenser la charge": "Compensate the load",
        "Sans salle des machines": "Without machine room",
        "À traction lente": "Slow traction",
        "Hydraulique moderne": "Modern hydraulic",
        "À double cabine": "Double-deck",
        "Deux cabines superposées dans la même gaine": "Two stacked cars in the same shaft",
        "Ascenseur avec deux moteurs": "Elevator with two motors",
        "Ascenseur avec deux portes": "Elevator with two doors",
        "Ascenseur avec deux vérins": "Elevator with two cylinders",
        "Un tapis transporteur de personnes": "A people conveyor belt",
        "Un escalier mécanique": "An escalator",
        "Une plateforme élévatrice": "A platform lift",
        "Un ascenseur incliné": "An inclined elevator",
        "Limiteur de course": "Limit switch",
        "Parachute": "Safety gear",
        "Un escalier mobile motorisé": "A motorized moving staircase",
        "Un ascenseur incliné": "An inclined elevator",
        "Une plateforme": "A platform",
        "Un trottoir roulant": "A moving walkway",
        "Ascenseur pour personnes handicapées": "Elevator for disabled persons",
        "Monte-charge industriel": "Industrial freight elevator",
        "Tapis roulant": "Conveyor belt",
    }
    if text in replacements:
        return replacements[text]
    return text  # fallback

def translate_explanation(text):
    replacements = {
        "Le CSA B44 est le code de sécurité des ascenseurs et monte-charge au Canada, aussi connu sous ASME A17.1.": "CSA B44 is the safety code for elevators and dumbwaiters in Canada, also known as ASME A17.1.",
        "Le ASME A17.1 est l'équivalent américain du CSA B44.": "ASME A17.1 is the American equivalent of CSA B44.",
        "Le CSA B44 exige un minimum de 3 câbles pour un ascenseur à traction par câbles.": "CSA B44 requires a minimum of 3 cables for a cable traction elevator.",
        "Les ascenseurs hydrauliques utilisent un vérin poussant la cabine par le bas.": "Hydraulic elevators use a cylinder pushing the car from below.",
        "Le gouverneur de sécurité détecte une survitesse et déclenche mécaniquement le parachute de la cabine.": "The safety governor detects overspeed and mechanically triggers the car safety gear.",
        "Les ascenseurs hydrauliques sont généralement limités à environ 6 étages.": "Hydraulic elevators are generally limited to about 6 floors.",
        "Le contrepoids équilibre une partie de la masse de la cabine et de la charge.": "The counterweight balances part of the car and load mass.",
        "Les buffers (ou amortisseurs) arrêtent la cabine ou le contrepoids en fin de course en cas de survitesse.": "Buffers (or shock absorbers) stop the car or counterweight at end of travel in case of overspeed.",
        "Le jeu horizontal maximum entre la porte palière et le seuil de cabine est de 38 mm selon le CSA B44.": "The maximum horizontal gap between the landing door and car sill is 38 mm according to CSA B44.",
        "Le monte-charge (freight elevator) est conçu pour le transport de marchandises avec opérateur.": "The freight elevator is designed for transporting goods with an operator.",
        "Le parachute est un dispositif mécanique qui agit sur les rails de guidage pour bloquer la cabine.": "The safety gear is a mechanical device that acts on the guide rails to stop the car.",
        "La poulie de traction transmet le mouvement du moteur aux câbles par adhérence.": "The traction sheave transmits motor motion to the cables by friction.",
        "Les ascenseurs hydrauliques sont limités à environ 1 m/s (mais dépend de la configuration).": "Hydraulic elevators are limited to about 1 m/s (but depends on configuration).",
        "MRL signifie Machine Room-Less, ascenseur sans salle des machines.": "MRL stands for Machine Room-Less elevator.",
        "Le contrepoids équilibre généralement 40 à 50 % du poids de la cabine plus la charge nominale.": "The counterweight generally balances 40 to 50% of the car weight plus the rated load.",
        "Le CSA B44 couvre ascenseurs électriques, hydrauliques, monte-charge, escaliers mécaniques et trottoirs roulants.": "CSA B44 covers electric elevators, hydraulic elevators, freight elevators, escalators, and moving walkways.",
        "Le parachute doit déclencher en 1 à 2 mètres de descente en survitesse.": "The safety gear must engage within 1 to 2 meters of overspeed descent.",
        "Les rails de guidage sont en acier laminé à froid.": "Guide rails are made of cold-rolled steel.",
        "Une plateforme élévatrice est un ascenseur à faible vitesse pour personnes à mobilité réduite.": "A platform lift is a low-speed elevator for people with reduced mobility.",
        "Le Code électrique CSA C22.1 s'applique aux installations électriques, incluant les ascenseurs.": "CSA C22.1 Electrical Code applies to electrical installations, including elevators.",
        "Le facteur de sécurité minimal est de 12:1 pour les câbles de traction.": "The minimum safety factor is 12:1 for traction cables.",
        "La RBQ (Régie du bâtiment du Québec) émet les certifications de sécurité.": "The RBQ (Quebec Building Authority) issues safety certifications.",
        "Un ascenseur à double cabine (double-deck) a deux cabines montées sur le même châssis.": "A double-deck elevator has two cars mounted on the same frame.",
        "La goulotte du vérin ne doit pas dépasser 45 degrés par rapport à la verticale.": "The cylinder casing must not exceed 45 degrees from vertical.",
        "Un trottoir roulant (moving walk) transporte les personnes à l'horizontale ou en légère pente.": "A moving walk transports people horizontally or on a slight incline.",
        "La profondeur minimale de fosse varie, mais est généralement d'au moins 1,2 m selon le CSA B44.": "The minimum pit depth varies, but is generally at least 1.2 m according to CSA B44.",
        "Les limiteurs de course (fins de course) arrêtent l'ascenseur avant les extrémités de la gaine.": "Limit switches stop the elevator before the ends of the shaft.",
        "Un escalier mécanique (escalator) est un escalier dont les marches sont motorisées.": "An escalator is a staircase with motorized steps.",
        "L'alimentation des ascenseurs est typiquement de 208 V à 600 V triphasé.": "Elevator power supply is typically 208 V to 600 V three-phase.",
        "Le délai d'ouverture minimal des portes est généralement de 5 secondes (réglable).": "The minimum door open time is generally 5 seconds (adjustable).",
    }
    if text in replacements:
        return replacements[text]
    return text

def translate_options(options):
    """Translate option list preserving order."""
    result = []
    for opt in options:
        result.append(translate_text(opt))
    return result

def auto_translate(q):
    """Translate a single question object."""
    t = {
        "id": q["id"],
        "tradeId": q["tradeId"],
        "chapterId": q.get("chapterId"),
        "type": q.get("type", "MCQ"),
        "difficulty": q.get("difficulty", "MEDIUM"),
        "question": translate_text(q["question"]),
        "options": translate_options(q.get("options", [])),
        "answer": q["answer"],
        "explanation": translate_explanation(q.get("explanation", "")),
    }
    return t

def main():
    filter_str = sys.argv[1].lower() if len(sys.argv) > 1 else ""
    
    raw_dir = "/tmp/en_batches"
    server_dir = "/home/chuck/projects/metierium/server"
    
    # Find all raw batch files
    pattern = f"{raw_dir}/*_raw.json"
    all_files = sorted(glob.glob(pattern))
    
    if filter_str:
        all_files = [f for f in all_files if filter_str in f.lower()]
    
    total_inserted = 0
    for raw_file in all_files:
        en_file = raw_file.replace("_raw.json", "_en.json")
        batch_num = raw_file.split("_batch")[1].split("of")[0]
        total_batches = raw_file.split("of")[1].split("_")[0]
        
        trade_name = "unknown"
        if "ascenseur" in raw_file: trade_name = "ASCEN"
        elif "briqueteur" in raw_file: trade_name = "BRIQUE"
        elif "constructeur" in raw_file: trade_name = "CONSTR"
        elif "cmrbe6r1h" in raw_file: trade_name = "QBQ"
        
        print(f"\n{'='*60}")
        print(f"Processing {trade_name} | Batch {batch_num}/{total_batches}")
        print(f"Source: {os.path.basename(raw_file)}")
        print(f"{'='*60}")
        
        questions = json.load(open(raw_file))
        translated = [auto_translate(q) for q in questions]
        
        # Check if translation succeeded (no remaining French)
        french_markers = ['é', 'è', 'ê', 'î', 'ô', 'û', 'ç', 'à', 'ù', 'ë', 'ï']
        has_french = False
        for t in translated:
            for field in ['question', 'explanation']:
                if any(m in t[field].lower() for m in french_markers):
                    has_french = True
                    print(f"  WARNING: French chars in {t['id']}.{field}")
        
        with open(en_file, 'w') as f:
            json.dump(translated, f, ensure_ascii=False, indent=2)
        
        # Insert
        result = subprocess.run(
            ["node", "insert_en.js", en_file],
            capture_output=True, text=True, cwd=server_dir
        )
        print(result.stdout.strip())
        if result.stderr:
            print(f"  STDERR: {result.stderr.strip()}")
        
        # Parse inserted count
        if "Inserted" in result.stdout:
            count = int(result.stdout.split("Inserted")[1].split("EN")[0].strip())
            total_inserted += count
        
        if has_french:
            print("  ⚠️  Has French markers - may need review")
    
    print(f"\n{'='*60}")
    print(f"Total inserted: {total_inserted} questions")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
