import re

with open('/home/chuck/projects/metierium/scripts/insert_hvac_mvl.py', 'r') as f:
    content = f.read()

# Fix: answer letter stuck inside options list after flattening
# Pattern: [\"...\", \"...\", \"...\", \"...\", \"A\")
# Should be: [\"...\", \"...\", \"...\", \"...\"], \"A\")

# Find: comma, open bracket, 4+ quoted strings, comma, answer letter, close paren
# But where the last comma comes right before the answer (not another option)

# Simpler approach: find each bracket pair and check if the last element is an answer letter
import re as re2

fixed = re2.sub(
    r',\s*\[('
    r'(?:\"[^\"]*\",\s*){3,}'   # 3+ quoted strings with commas
    r'\"[^\"]*\"'               # final quoted option  
    r'),\s*\"([A-D])\"\)',      # answer letter trapped
    r', [\1], "\2")',
    content
)

with open('/home/chuck/projects/metierium/scripts/insert_hvac_mvl.py', 'w') as f:
    f.write(fixed)

# Verify
import py_compile
try:
    py_compile.compile('/home/chuck/projects/metierium/scripts/insert_hvac_mvl.py', doraise=True)
    print("SYNTAX OK")
except py_compile.PyCompileError as e:
    print(f"Still error: {e}")
