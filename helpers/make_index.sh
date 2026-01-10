#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_PATH="$(dirname "$SCRIPT_DIR")"
cd "$ROOT_PATH" || exit 1

INPUT="src/csv/data.csv"
OUTPUT="src/csv/data_indexed.csv"

if [ ! -f "$INPUT" ]; then
    echo "Error: Cannot find $INPUT"
    echo "Current Absolute Path: $(pwd)"
    exit 1
fi

echo "Processing: $INPUT..."

awk -F',' '
BEGIN { 
    OFS=","; 
    count=0; 
}
# Process the first line (Header)
NR == 1 { 
    print "#id", $0; 
    next; 
}
# Process data rows, skipping rows that are empty or just commas
/[^,]/ { 
    count++;
    printf "%07d,%s\n", count, $0;
}
' "$INPUT" > "$OUTPUT"

echo "Done! Created $OUTPUT with $(grep -c "^" "$OUTPUT") rows."