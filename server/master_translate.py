#!/usr/bin/env python3
"""
Master translation processor: reads French source, applies translations from a JSON map,
creates en_batch JSON files, and inserts via insert_en.js.

Usage:
  # Step 1: Extract source questions to a translation template
  python3 master_translate.py extract /tmp/question_batches/cmt_ascenseur_001.json > /tmp/ascen_to_translate.json
  
  # Step 2: Fill in the "question_en", "options_en", "explanation_en" fields
  
  # Step 3: Process the filled translation file
  python3 master_translate.py process /tmp/ascen_filled.json
"""
import json, sys, os, subprocess

def extract():
    """Extract questions with French source and empty English fields."""
    src = sys.argv[2]
    questions = json.load(open(src))
    
    template = []
    for q in questions:
        template.append({
            "id": q["id"],
            "tradeId": q["tradeId"],
            "chapterId": q.get("chapterId"),
            "type": q.get("type", "MCQ"),
            "difficulty": q.get("difficulty", "MEDIUM"),
            "answer": q["answer"],
            "question_fr": q["question"],
            "options_fr": q.get("options", []),
            "explanation_fr": q.get("explanation", ""),
            "question_en": "",
            "options_en": [],
            "explanation_en": "",
        })
    
    json.dump(template, sys.stdout, ensure_ascii=False, indent=2)

def process():
    """Process a filled translation file - create batches and insert."""
    filled_file = sys.argv[2]
    translations = json.load(open(filled_file))
    
    # Determine trade from first entry
    trade_id = translations[0]["tradeId"]
    batch_size = 30
    total = len(translations)
    batches = (total + batch_size - 1) // batch_size
    
    server_dir = "/home/chuck/projects/metierium/server"
    total_inserted = 0
    
    trade_short = trade_id.split("_")[1] if "_" in trade_id else trade_id[:4]
    if "cmrbe" in trade_id:
        trade_short = "qbq"
    
    for b in range(batches):
        start = b * batch_size
        end = min(start + batch_size, total)
        batch = translations[start:end]
        
        # Build translated question objects for insert_en.js
        en_questions = []
        for t in batch:
            # Use English if provided, otherwise fallback to French
            q_en = t.get("question_en") or t["question_fr"]
            opts_en = t.get("options_en") or t["options_fr"]
            expl_en = t.get("explanation_en") or t["explanation_fr"]
            
            if isinstance(opts_en, str):
                try:
                    opts_en = json.loads(opts_en)
                except:
                    opts_en = [opts_en]
            
            en_questions.append({
                "id": t["id"],
                "tradeId": t["tradeId"],
                "chapterId": t.get("chapterId"),
                "type": t.get("type", "MCQ"),
                "difficulty": t.get("difficulty", "MEDIUM"),
                "question": q_en,
                "options": opts_en,
                "answer": t["answer"],
                "explanation": expl_en,
            })
        
        # Write batch file
        outfile = f"/tmp/en_batches/{trade_short}_batch{b+1}of{batches}_en.json"
        with open(outfile, "w") as f:
            json.dump(en_questions, f, ensure_ascii=False, indent=2)
        
        # Insert
        result = subprocess.run(
            ["node", "insert_en.js", outfile],
            capture_output=True, text=True, cwd=server_dir
        )
        out = result.stdout.strip()
        print(f"[Batch {b+1}/{batches}] {out}")
        if result.stderr and "Error" in result.stderr:
            print(f"  ERR: {result.stderr.strip()}")
        
        if "Inserted" in out:
            count = int(out.split("Inserted")[1].split("EN")[0].strip())
            total_inserted += count
    
    print(f"\nTotal inserted for {trade_id}: {total_inserted}/{total}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 master_translate.py [extract|process] <file>")
        sys.exit(1)
    
    action = sys.argv[1]
    if action == "extract":
        extract()
    elif action == "process":
        process()
    else:
        print(f"Unknown action: {action}")
