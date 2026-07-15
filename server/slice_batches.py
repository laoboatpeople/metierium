#!/usr/bin/env python3
"""Slice a source JSON file into batches of N for translation."""
import json, sys, os

def main():
    source = sys.argv[1]
    batch_size = int(sys.argv[2]) if len(sys.argv) > 2 else 30
    
    questions = json.load(open(source))
    total = len(questions)
    batches = (total + batch_size - 1) // batch_size
    
    basename = os.path.splitext(os.path.basename(source))[0]
    outdir = "/tmp/en_batches"
    os.makedirs(outdir, exist_ok=True)
    
    for b in range(batches):
        start = b * batch_size
        end = min(start + batch_size, total)
        batch = questions[start:end]
        outfile = f"{outdir}/{basename}_batch{b+1}of{batches}_raw.json"
        json.dump(batch, open(outfile, "w"), ensure_ascii=False, indent=2)
        print(f"Batch {b+1}/{batches}: questions {start+1}-{end} -> {outfile}")

if __name__ == "__main__":
    main()
