#!/usr/bin/env python3
"""
Translate a raw batch JSON file to English, preserving structure.
Reads raw batch, outputs translated batch as JSON.
Usage: python3 translate_batch.py <raw_batch.json> <output_path>
"""
import json, sys, os

def translate_batch(qs):
    """Translate each question in the batch. Returns translated list."""
    translated = []
    for q in qs:
        t = {
            "id": q["id"],
            "tradeId": q["tradeId"],
            "chapterId": q.get("chapterId"),
            "type": q.get("type", "MCQ"),
            "difficulty": q.get("difficulty", "MEDIUM"),
        }
        # These need to be filled in per-batch
        # The script outputs the FR source and a placeholder
        t["question"] = q["question"]  # FR original
        t["options"] = q.get("options", [])
        t["answer"] = q["answer"]
        t["explanation"] = q.get("explanation", "")
        translated.append(t)
    return translated

def main():
    src = sys.argv[1]
    dst = sys.argv[2] if len(sys.argv) > 2 else src.replace("_raw.json", "_en.json")
    
    questions = json.load(open(src))
    
    # Print source questions for translation
    print(f"=== TRANSLATE BATCH: {os.path.basename(src)} ===")
    print(f"COUNT: {len(questions)}")
    print(f"OUTPUT: {dst}")
    for i, q in enumerate(questions):
        print(f"\n--- Q{i+1} ---")
        print(f"QUESTION: {q['question']}")
        print(f"OPTIONS: {json.dumps(q.get('options', []), ensure_ascii=False)}")
        print(f"ANSWER: {q['answer']}")
        print(f"EXPLANATION: {q.get('explanation', '')}")
    print(f"\n=== END BATCH ===")

if __name__ == "__main__":
    main()
