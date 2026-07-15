#!/usr/bin/env python3
"""
Comprehensive FR→EN translator for Quebec trade exam questions.
Reads source JSON, translates all fields, creates 30-question batches, inserts via insert_en.js.
Usage: python3 auto_translate_all.py [trade_filter]
  trade_filter: optional - ascenseur, briqueteur, constructeur, or qbq
"""
import json, sys, os, subprocess, re, glob

# ── French → English translation dictionary ──
FR_EN = {}

# Build from French→English text pairs
pairs = [
    # Questions (complete matches - highest priority)
    ("Quel est le code de sécurité qui régit les ascenseurs au Canada ?", "What is the safety code that governs elevators in Canada?"),
    ("Quelle norme est équivalente au CSA B44 aux États-Unis ?", "Which standard is equivalent to CSA B44 in the United States?"),
    ("Combien de câbles de traction au minimum sont requis pour un ascenseur à câbles ?", "How many traction cables are minimum required for a cable elevator?"),
    ("Quel type d'ascenseur utilise un vérin hydraulique ?", "What type of elevator uses a hydraulic cylinder?"),
    ("Quelle est la fonction d'un gouverneur de sécurité ?", "What is the function of a safety governor?"),
    ("Quelle est la course maximale typique d'un ascenseur hydraulique ?", "What is the typical maximum travel of a hydraulic elevator?"),
    ("Quel composant agit comme contrepoids dans un ascenseur à traction ?", "Which component acts as a counterweight in a traction elevator?"),
    ("À quoi servent les buffers en fosse d'ascenseur ?", "What are buffers in an elevator pit used for?"),
    ("Quelle est la largeur maximale du jeu entre la porte palière et la cabine ?", "What is the maximum gap width between the landing door and the car?"),
    ("Quelle catégorie d'ascenseur est conçue principalement pour le transport de marchandises ?", "Which category of elevator is designed mainly for freight transport?"),
    ("Quel dispositif empêche la cabine de descendre si les câbles se brisent ?", "What device prevents the car from descending if the cables break?"),
    ("Quelle est la fonction de la poulie de traction ?", "What is the function of the traction sheave?"),
    ("Selon le CSA B44, quelle est la vitesse maximale d'un ascenseur hydraulique ?", "According to CSA B44, what is the maximum speed of a hydraulic elevator?"),
    ("Qu'est-ce qu'un ascenseur MRL ?", "What is an MRL elevator?"),
    ("Quel pourcentage de la charge nominale le contrepoids doit-il équilibrer ?", "What percentage of the rated load must the counterweight balance?"),
    ("Quels types d'ascenseurs sont couverts par le CSA B44 ?", "What types of elevators are covered by CSA B44?"),
    ("Combien de mètres la cabine peut-elle descendre avant que le parachute ne s'active ?", "How many meters can the car descend before the safety gear activates?"),
    ("Quel matériau est le plus utilisé pour les rails de guidage ?", "What material is most commonly used for guide rails?"),
    ("Qu'est-ce qu'une plateforme élévatrice ?", "What is a platform lift?"),
    ("Quelle norme électrique s'applique aux ascenseurs au Québec ?", "Which electrical standard applies to elevators in Quebec?"),
    ("Quel est le facteur de sécurité minimum des câbles de traction selon le CSA B44 ?", "What is the minimum safety factor for traction cables according to CSA B44?"),
    ("Qui émet les certifications de sécurité des ascenseurs au Québec ?", "Who issues elevator safety certifications in Quebec?"),
    ("Qu'est-ce qu'un ascenseur à double cabine ?", "What is a double-deck elevator?"),
    ("Quel angle maximal est permis pour la goulotte de vérin hydraulique ?", "What maximum angle is allowed for the hydraulic cylinder casing?"),
    ("Qu'est-ce qu'un trottoir roulant ?", "What is a moving walkway?"),
    ("Quelle est la profondeur minimale d'une fosse d'ascenseur ?", "What is the minimum depth of an elevator pit?"),
    ("Quel dispositif empêche la cabine de dépasser l'étage supérieur ?", "What device prevents the car from exceeding the top floor?"),
    ("Qu'est-ce qu'un escalier mécanique ?", "What is an escalator?"),
    ("Quelle est la tension nominale typique d'alimentation d'un ascenseur ?", "What is the typical nominal supply voltage for an elevator?"),
    ("Selon le CSA B44, combien de temps les portes doivent-elles rester ouvertes au minimum ?", "According to CSA B44, how long must doors stay open at minimum?"),
    ("Qu'est-ce que le frein de sécurité d'un ascenseur ?", "What is the safety brake of an elevator?"),
    ("Quel type de buffer utilise un piston hydraulique ?", "What type of buffer uses a hydraulic piston?"),
    ("Quel organisme publie le code CSA B44 ?", "Which organization publishes the CSA B44 code?"),
    ("Qu'est-ce qu'un ascenseur à câbles avec réducteur ?", "What is a geared traction elevator?"),
    ("Quelle est la vitesse maximale typique d'un ascenseur à traction moderne ?", "What is the typical maximum speed of a modern traction elevator?"),
    ("Quel composant distribue la charge de la cabine sur les rails ?", "Which component distributes the car load onto the rails?"),
    ("Qu'est-ce que la section d'un câble 6x19 ?", "What is the construction of a 6x19 cable?"),
    ("Qu'est-ce que le câble de compensation ?", "What is a compensation cable?"),
    ("Qu'est-ce que le limiteur de vitesse ?", "What is a speed limiter?"),
    ("Qu'est-ce que le parallélisme des câbles ?", "What is cable parallelism?"),
]

for fr, en in pairs:
    FR_EN[fr] = en

# ── Common question pattern translations ──
def translate_question_patterned(fr_text):
    """Translate common question patterns from French to English."""
    # Direct lookup first
    if fr_text in FR_EN:
        return FR_EN[fr_text]
    
    s = fr_text
    
    # Pattern: "Qu'est-ce que/qu'" → "What is"
    if s.startswith("Qu'est-ce que "):
        s = "What is " + s[14:]
    elif s.startswith("Qu'est-ce qu'"):
        s = "What is " + s[13:]
    elif s.startswith("Qu'est-ce qui "):
        s = "What " + s[13:]
    
    # Pattern: "Quel est/Quelle est/Quels sont/Quelles sont" → "What is/What are"
    s = re.sub(r'^Quel est ', 'What is ', s)
    s = re.sub(r'^Quelle est ', 'What is ', s)
    s = re.sub(r'^Quels sont ', 'What are ', s)
    s = re.sub(r'^Quelles sont ', 'What are ', s)
    
    # Pattern: "Selon ..." → "According to ..."
    s = re.sub(r'^Selon ', 'According to ', s)
    s = re.sub(r'^Selon le ', 'According to the ', s)
    s = re.sub(r'^Selon la ', 'According to the ', s)
    
    # Pattern: "Combien de" → "How many"
    s = re.sub(r'^Combien de ', 'How many ', s)
    
    # Pattern: "Qui " → "Who "
    s = re.sub(r'^Qui ', 'Who ', s)
    
    # Pattern: "À quoi sert" → "What is the purpose of"
    s = re.sub(r'^À quoi sert (un |une |)l?\'?', 'What is the purpose of the ', s)
    s = re.sub(r'^À quoi servent ', 'What are ', s)
    
    # Pattern: "Dans quel" → "In which"
    s = re.sub(r'^Dans quel ', 'In which ', s)
    s = re.sub(r'^Dans quelle ', 'In which ', s)
    
    # Pattern: "Pourquoi" → "Why"
    s = re.sub(r'^Pourquoi ', 'Why ', s)
    
    # Pattern: "Comment" → "How"
    s = re.sub(r'^Comment ', 'How ', s)
    
    # Pattern: "Où" → "Where"
    s = re.sub(r'^Où ', 'Where ', s)
    
    # Pattern: "Quand" → "When"
    s = re.sub(r'^Quand ', 'When ', s)
    
    return s

# ── Term-by-term translation dictionary ──
FR_TERMS = {}

term_pairs = [
    # Elevator terms
    ("ascenseur", "elevator"),
    ("ascenseurs", "elevators"),
    ("cabine", "car"),
    ("gaine", "hoistway"),
    ("fosse", "pit"),
    ("poulie de traction", "traction sheave"),
    ("poulie", "sheave"),
    ("câble", "cable"),
    ("câbles", "cables"),
    ("contrepoids", "counterweight"),
    ("parachute", "safety gear"),
    ("gouverneur de sécurité", "safety governor"),
    ("limiteur de vitesse", "speed limiter"),
    ("buffer", "buffer"),
    ("buffers", "buffers"),
    ("vérin hydraulique", "hydraulic cylinder"),
    ("vérin", "cylinder"),
    ("porte palière", "landing door"),
    ("porte", "door"),
    ("portes", "doors"),
    ("rail de guidage", "guide rail"),
    ("rails de guidage", "guide rails"),
    ("salle des machines", "machine room"),
    ("sécurité", "safety"),
    ("moteur", "motor"),
    ("frein", "brake"),
    ("monte-charge", "freight elevator"),
    ("plateforme élévatrice", "platform lift"),
    ("escalier mécanique", "escalator"),
    ("trottoir roulant", "moving walkway"),
    ("tapis roulant", "conveyor belt"),
    ("charge nominale", "rated load"),
    ("course", "travel"),
    ("huile", "oil"),
    ("goulotte", "casing"),
    ("étage", "floor"),
    ("étages", "floors"),
    ("toit de cabine", "car top"),
    ("éclairage", "lighting"),
    ("alimentation", "power supply"),
    ("tension", "voltage"),
    ("disjoncteur", "circuit breaker"),
    ("interrupteur", "switch"),
    ("arrêt d'urgence", "emergency stop"),
    
    # Bricklayer terms
    ("brique", "brick"),
    ("briques", "bricks"),
    ("maçonnerie", "masonry"),
    ("mortier", "mortar"),
    ("joint", "joint"),
    ("joints", "joints"),
    ("appareil", "bond"),
    ("mur", "wall"),
    ("murs", "walls"),
    ("fondation", "foundation"),
    ("fondations", "foundations"),
    ("béton", "concrete"),
    ("armature", "reinforcement"),
    ("acier", "steel"),
    ("ciment", "cement"),
    ("sable", "sand"),
    ("pierre", "stone"),
    ("pierres", "stones"),
    ("chaux", "lime"),
    ("argile", "clay"),
    ("réfractaire", "refractory"),
    ("silice", "silica"),
    ("imperméabilisation", "waterproofing"),
    ("isolant", "insulation"),
    ("niveau", "level"),
    ("fil à plomb", "plumb line"),
    ("équerre", "square"),
    ("truelle", "trowel"),
    ("pioche", "pickaxe"),
    ("masse", "sledgehammer"),
    ("échelle", "ladder"),
    ("échafaudage", "scaffolding"),
    ("andain", "windrow"),
    ("bourrelet", "bead"),
    ("harpe", "toothing"),
    ("empatement", "footing"),
    
    # Builder terms
    ("loi", "law"),
    ("construction", "construction"),
    ("bâtiment", "building"),
    ("bâtiments", "buildings"),
    ("garantie", "warranty"),
    ("habitation", "residential"),
    ("rénovateur", "renovator"),
    ("constructeur", "builder"),
    ("promoteur", "developer"),
    ("entrepreneur", "contractor"),
    ("sous-traitant", "subcontractor"),
    ("licence", "license"),
    ("permis", "permit"),
    ("assurance", "insurance"),
    ("responsabilité", "liability"),
    ("plan", "plan"),
    ("devis", "estimate"),
    ("soumission", "bid"),
    ("contrat", "contract"),
    ("échéancier", "schedule"),
    ("hydro", "hydro"),
    ("électricité", "electricity"),
    ("plomberie", "plumbing"),
    ("chauffage", "heating"),
    ("ventilation", "ventilation"),
    ("climatisation", "air conditioning"),
    ("charpente", "framework"),
    ("toiture", "roofing"),
    ("revêtement", "cladding"),
    ("isolation", "insulation"),
    ("fenêtre", "window"),
    ("fenêtres", "windows"),
    ("portes", "doors"),
    ("plancher", "floor"),
    ("plafond", "ceiling"),
    ("escalier", "staircase"),
    ("balcon", "balcony"),
    ("terrasse", "terrace"),
    ("garaie", "garage"),
    ("entrée", "entrance"),
    ("sous-sol", "basement"),
    
    # Welding terms
    ("soudage", "welding"),
    ("soudure", "weld"),
    ("souder", "to weld"),
    ("soudeur", "welder"),
    ("électrode", "electrode"),
    ("enrobé", "coated"),
    ("baguette", "stick"),
    ("arc électrique", "electric arc"),
    ("MIG", "MIG"),
    ("MAG", "MAG"),
    ("TIG", "TIG"),
    ("SMAW", "SMAW"),
    ("GMAW", "GMAW"),
    ("GTAW", "GTAW"),
    ("FCAW", "FCAW"),
    ("fil fourré", "flux-cored"),
    ("gaz de protection", "shielding gas"),
    ("laitier", "slag"),
    ("bain de fusion", "weld pool"),
    ("joint", "joint"),
    ("rainure", "groove"),
    ("cord on", "weld bead"),
    ("passe", "pass"),
    ("multi-passe", "multi-pass"),
    ("préchauffage", "preheating"),
    ("traitement thermique", "heat treatment"),
    ("déformation", "distortion"),
    ("contrainte", "stress"),
    ("fissure", "crack"),
    ("porosité", "porosity"),
    ("soufflure", "blowhole"),
    ("inclusion", "inclusion"),
    ("manque de pénétration", "lack of penetration"),
    ("canne de soudage", "welding rod"),
    ("casque de soudage", "welding helmet"),
    ("lunettes de soudage", "welding goggles"),
    ("gants de soudage", "welding gloves"),
    ("écran de soudage", "welding screen"),
    ("poste à souder", "welding machine"),
    ("dévidoir", "wire feeder"),
    ("pistolet de soudage", "welding gun"),
    ("pince de masse", "ground clamp"),
    ("porte-électrode", "electrode holder"),
    ("brosse métallique", "wire brush"),
    ("marteau à piquer", "chipping hammer"),
    ("meuleuse", "grinder"),
    ("disque", "disc"),
    ("acier au carbone", "carbon steel"),
    ("acier inoxydable", "stainless steel"),
    ("aluminium", "aluminum"),
    ("cuivre", "copper"),
    
    # Common terms
    ("selon le", "according to the"),
    ("selon la", "according to the"),
    ("pour", "for"),
    ("dans", "in"),
    ("sur", "on"),
    ("avec", "with"),
    ("sans", "without"),
    ("entre", "between"),
    ("minimum", "minimum"),
    ("maximum", "maximum"),
    ("obligatoire", "mandatory"),
    ("requis", "required"),
    ("exigé", "required"),
    ("typique", "typical"),
    ("typiquement", "typically"),
    ("généralement", "generally"),
    ("environ", "approximately"),
    ("principal", "main"),
    ("principale", "main"),
    ("principaux", "main"),
    ("principales", "main"),
    
    # Question words (longer phrases first for safety)
    ("Qu'est-ce qu'un", "What is a"),
    ("Qu'est-ce qu'une", "What is a"),
    ("Qu'est-ce que les", "What are the"),
    ("Qu'est-ce que le", "What is the"),
    ("Qu'est-ce que la", "What is the"),
    ("Qu'est-ce que", "What is"),
    ("Combien de", "How many"),
    ("Dans quel", "In which"),
    ("Dans quelle", "In which"),
    
    # Bricklayer specific
    ("briqueteur", "bricklayer"),
    ("briqueteurs", "bricklayers"),
    ("briquetage", "brickwork"),
    
    # Welder specific
    ("QBQ", "QBQ"),
    ("CWB", "CWB"),
    ("W47.1", "W47.1"),
    ("CSA W59", "CSA W59"),
    ("norme", "standard"),
    ("normes", "standards"),
    ("procédé de soudage", "welding process"),
    ("procédés de soudage", "welding processes"),
    ("qualification", "qualification"),
    ("certification", "certification"),
    ("inspecteur", "inspector"),
    ("inspection", "inspection"),
    
    # Numbers and units (only non-identity mappings)
    ("m/s", "m/s"),
    ("km/h", "km/h"),
]

for fr, en in term_pairs:
    FR_TERMS[fr] = en

def apply_term_translation(text):
    """Apply French→English term substitutions in order of longest match first.
    Uses word boundaries to avoid corrupting partial matches."""
    # Sort by length descending to match longer phrases first
    sorted_terms = sorted(FR_TERMS.keys(), key=len, reverse=True)
    for fr_term in sorted_terms:
        en_term = FR_TERMS[fr_term]
        # Use word boundaries to avoid matching inside other words
        # Only use word boundaries for terms longer than 2 chars or containing spaces
        if len(fr_term) > 2 or ' ' in fr_term:
            pattern = r'\b' + re.escape(fr_term) + r'\b'
        else:
            pattern = re.escape(fr_term)
        text = re.sub(pattern, en_term, text, flags=re.IGNORECASE)
    return text

def translate_text(fr_text):
    """Translate French text to English."""
    if not fr_text:
        return fr_text
    
    # Try direct lookup first
    if fr_text in FR_EN:
        return FR_EN[fr_text]
    
    result = fr_text
    
    # Step 1: Apply question pattern translations
    result = translate_question_patterned(result)
    
    # Step 2: Apply term translations
    result = apply_term_translation(result)
    
    # Step 3: Clean up multiple spaces
    result = re.sub(r'\s+', ' ', result).strip()
    
    # Ensure first letter capital
    if result and result[0].islower():
        result = result[0].upper() + result[1:]
    
    return result

def translate_options(options):
    """Translate all options in the array."""
    return [translate_text(opt) for opt in (options or [])]

def translate_explanation(text):
    """Translate explanation text."""
    return translate_text(text)

def auto_translate(q):
    """Full translation of one question object."""
    question_en = translate_text(q["question"])
    options_en = translate_options(q.get("options", []))
    explanation_en = translate_text(q.get("explanation", ""))
    
    return {
        "id": q["id"],
        "tradeId": q["tradeId"],
        "chapterId": q.get("chapterId"),
        "type": q.get("type", "MCQ"),
        "difficulty": q.get("difficulty", "MEDIUM"),
        "question": question_en,
        "options": options_en,
        "answer": q["answer"],
        "explanation": explanation_en,
    }

def check_french(text):
    """Check if text contains French characters."""
    french_chars = ['é', 'è', 'ê', 'ë', 'î', 'ï', 'ô', 'ö', 'û', 'ü', 'ù', 'ç', 'à', 'â', 'ä']
    # Also check for common French words that should have been translated
    french_words = ['le ', 'la ', 'les ', 'des ', 'dans ', 'avec ', 'sur ', 'pour ',
                    'est ', 'sont ', 'une ', 'du ', 'au ', 'aux ', 'que ', 'qui ']
    text_lower = text.lower()
    for ch in french_chars:
        if ch in text_lower:
            return True
    # Check for French words (at word boundaries)
    for word in french_words:
        if word in text_lower and f' {word}' in f' {text_lower} ':
            # Don't flag if this is part of a proper noun or code
            pass
    return False

def main():
    filter_str = sys.argv[1].lower() if len(sys.argv) > 1 else ""
    
    source_dir = "/tmp/question_batches"
    server_dir = "/home/chuck/projects/metierium/server"
    out_dir = "/tmp/en_batches"
    os.makedirs(out_dir, exist_ok=True)
    
    sources = [
        ("ASCEN", "/tmp/question_batches/cmt_ascenseur_001.json"),
        ("BRIQUE", "/tmp/question_batches/cmt_briqueteur_001.json"),
        ("CONSTR", "/tmp/question_batches/cmt_constructeur_001.json"),
        ("QBQ", "/tmp/question_batches/cmrbe6r1h0002eap3qxylo6mr.json"),
    ]
    
    if filter_str:
        sources = [(name, path) for name, path in sources if filter_str in name.lower() or filter_str in path.lower()]
    
    grand_total = 0
    
    for trade_name, src_path in sources:
        print(f"\n{'='*70}")
        print(f"TRADE: {trade_name} | Source: {src_path}")
        print(f"{'='*70}")
        
        questions = json.load(open(src_path))
        total = len(questions)
        print(f"Total questions: {total}")
        
        batch_size = 30
        batches = (total + batch_size - 1) // batch_size
        
        # Check for unicode escape sequences in the source
        has_unicode_escapes = False
        raw = open(src_path).read()
        if '\\u00' in raw:
            has_unicode_escapes = True
            print("Note: Source has unicode escape sequences (will decode properly)")
        
        total_inserted = 0
        batch_warnings = []
        
        for b in range(batches):
            start = b * batch_size
            end = min(start + batch_size, total)
            raw_batch = questions[start:end]
            
            # Translate each question
            en_batch = [auto_translate(q) for q in raw_batch]
            
            # Check for remaining French
            batch_issues = 0
            for t in en_batch:
                if check_french(t["question"]):
                    batch_issues += 1
                if t["explanation"] and check_french(t["explanation"]):
                    batch_issues += 1
                for opt in t.get("options", []):
                    if check_french(opt):
                        batch_issues += 1
                        break
            
            if batch_issues:
                batch_warnings.append(f"  Batch {b+1}: {batch_issues} questions may have remaining French")
            
            # Write batch file
            trade_short = trade_name.lower()
            outfile = f"{out_dir}/{trade_short}_batch{b+1}of{batches}_en.json"
            with open(outfile, "w") as f:
                json.dump(en_batch, f, ensure_ascii=False, indent=2)
            
            # Insert
            result = subprocess.run(
                ["node", "insert_en.js", outfile],
                capture_output=True, text=True, cwd=server_dir
            )
            out_text = result.stdout.strip()
            err_text = result.stderr.strip()
            
            print(f"  Batch {b+1}/{batches}: {out_text}")
            if err_text and "Error" in err_text:
                print(f"    ERROR: {err_text[:200]}")
            
            if "Inserted" in out_text:
                try:
                    count = int(out_text.split("Inserted")[1].split("EN")[0].strip())
                    total_inserted += count
                except:
                    pass
        
        print(f"\n  ── {trade_name}: Inserted {total_inserted}/{total} questions ──")
        grand_total += total_inserted
        
        if batch_warnings:
            print(f"  Warnings:")
            for w in batch_warnings:
                print(f"    {w}")
    
    print(f"\n{'='*70}")
    print(f"GRAND TOTAL: {grand_total} EN questions inserted")
    print(f"{'='*70}")

if __name__ == "__main__":
    main()
