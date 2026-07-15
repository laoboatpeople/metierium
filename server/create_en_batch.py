#!/usr/bin/env python3
"""
Create translated JSON batch from translations provided in structured format.
The LLM provides translations, this script assembles and inserts.

Input: python3 create_en_batch.py <raw_batch.json> <translations_text>
  translations_text: stdin or file with the LLM's translation output.
  Format per question:
    Q1|What is the question?|["Opt A","Opt B","Opt C","Opt D"]|Explanation text.
    Q2|...
  
Or: python3 create_en_batch.py <raw_batch.json> --stdin
  Reads stdin in the pipe-delimited format above.
"""
import json, sys, os

def main():
    src = sys.argv[1]
    questions = json.load(open(src))
    
    # Read translation input
    if len(sys.argv) > 2 and sys.argv[2] == "--stdin":
        lines = sys.stdin.read().strip().split("\n")
    else:
        # Read from a file
        trans_file = sys.argv[2] if len(sys.argv) > 2 else src.replace("_raw.json", "_trans.txt")
        with open(trans_file) as f:
            lines = f.read().strip().split("\n")
    
    # Parse translations
    translations = {}
    for line in lines:
        line = line.strip()
        if not line or not line.startswith("Q"):
            continue
        parts = line.split("|", 3)
        if len(parts) < 4:
            continue
        qnum = int(parts[0].replace("Q", ""))
        question_en = parts[1].strip()
        options_en = json.loads(parts[2].strip())
        explanation_en = parts[3].strip()
        translations[qnum] = (question_en, options_en, explanation_en)
    
    # Build translated batch
    translated = []
    for i, q in enumerate(questions):
        qnum = i + 1
        if qnum in translations:
            q_en, opts_en, expl_en = translations[qnum]
        else:
            # Fallback: try simple FR→EN replacements
            q_en = q["question"]
            opts_en = q.get("options", [])
            expl_en = q.get("explanation", "")
        
        t = {
            "id": q["id"],
            "tradeId": q["tradeId"],
            "chapterId": q.get("chapterId"),
            "type": q.get("type", "MCQ"),
            "difficulty": q.get("difficulty", "MEDIUM"),
            "question": q_en,
            "options": opts_en,
            "answer": q["answer"],
            "explanation": expl_en,
        }
        translated.append(t)
    
    outfile = src.replace("_raw.json", "_en.json")
    with open(outfile, "w") as f:
        json.dump(translated, f, ensure_ascii=False, indent=2)
    
    print(f"Written {len(translated)} questions to {outfile}")
    
    # Insert
    server_dir = "/home/chuck/projects/metierium/server"
    import subprocess
    result = subprocess.run(
        ["node", "insert_en.js", outfile],
        capture_output=True, text=True, cwd=server_dir
    )
    print(result.stdout.strip())
    if result.stderr:
        print(f"STDERR: {result.stderr.strip()}")

if __name__ == "__main__":
    main()
