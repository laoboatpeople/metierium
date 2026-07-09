#!/usr/bin/env python3
import re

with open('/home/chuck/projects/metierium/client/src/i18n/translations.ts', 'r') as f:
    content = f.read()

# The broken pattern: 'Simulations d\\'examen' which is literally:
# 'Simulations d\examen' with a stray quote breaking the string
# Fix: replace the offending lines with double-quoted versions

# Fix line 57: heroPillExams
old_bad = "'Simulations d"
old_bad_quote = "'"
new_good = '"Simulations d'
new_good_quote = "'"
# Actually let me be more surgical

# Find all single-quoted strings containing d'examen and replace them with double-quoted versions
def fix_apostrophe(match):
    full = match.group(0)
    # Replace the outer single quotes with double quotes
    # and keep the inner apostrophe as-is
    if full.startswith("'") and full.endswith("'"):
        inner = full[1:-1]
        # Escape internal double quotes if any
        inner = inner.replace('"', '\\"')
        return '"' + inner + '"'
    return full

# Pattern: find single-quoted strings that contain d'examen or l'examen
content = re.sub(
    r"'([^']*d'examen[^']*)'",
    lambda m: '"' + m.group(1) + '"',
    content
)
content = re.sub(
    r"'([^']*l'examen[^']*)'",
    lambda m: '"' + m.group(1) + '"',
    content
)

with open('/home/chuck/projects/metierium/client/src/i18n/translations.ts', 'w') as f:
    f.write(content)

print("Fixed!")

# Verify
with open('/home/chuck/projects/metierium/client/src/i18n/translations.ts', 'r') as f:
    for i, line in enumerate(f.readlines(), 1):
        if 'Simulation' in line or 'examen' in line:
            print(f"L{i}: {line.rstrip()}")
