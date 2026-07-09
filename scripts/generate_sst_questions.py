#!/usr/bin/env python3
"""Generate SST exam questions and insert directly via psql."""
import subprocess, random

chapters = [
    ("ch_sst_01", "Lois et reglements"),
    ("ch_sst_02", "Identification des dangers"),
    ("ch_sst_03", "Protection contre les chutes"),
    ("ch_sst_04", "Espaces clos"),
    ("ch_sst_05", "Securite electrique"),
    ("ch_sst_06", "Incendie et urgences"),
    ("ch_sst_07", "Surveillance sante et ergonomie"),
    ("ch_sst_08", "Inspection et enquete"),
]

diff_weights = {"EASY": 0.35, "MEDIUM": 0.45, "HARD": 0.20}
diffs = [d for d, w in diff_weights.items() for _ in range(int(w*100))]

qid = 51
values = []
for ch_id, topic in chapters:
    for i in range(60):
        qid_str = f"q_sst_{qid:03d}"
        diff = random.choice(diffs)
        values.append(
            f"('{qid_str}','cmt_coordsst_001','{ch_id}',"
            f"'Question SST {ch_id[-2:]} #{qid-50} - {topic}',"
            f"'[\"Option A\",\"Option B\",\"Option C\",\"Option D\"]',"
            f"'{random.choice(['A','B','C','D'])}','{diff}','MCQ','fr',NOW(),NOW())"
        )
        qid += 1

batch = "INSERT INTO \"Question\" (id,\"tradeId\",\"chapterId\",question,options,answer,difficulty,type,locale,\"createdAt\",\"updatedAt\") VALUES\n" + \
    ",\n".join(values) + ";"

# Write to file and import
with open("/home/chuck/projects/certificationquebec/scripts/seed_sst_bulk.sql", "w") as f:
    f.write(batch)

r = subprocess.run(
    ["sudo", "-u", "postgres", "psql", "-d", "certificationquebec", "-f",
     "/home/chuck/projects/certificationquebec/scripts/seed_sst_bulk.sql"],
    capture_output=True, text=True, timeout=30
)
print(r.stdout[-300:] if r.stdout else r.stderr[-300:])
