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
# Process the first line (Header) - remove first (image) and last (bron) columns
NR == 1 { 
    printf "#id"
    for(i=2; i<=NF-1; i++) printf ",%s", $i
    printf "\n"
    next; 
}
# Process data rows, skipping rows that are empty or just commas
# Remove first (image) and last (bron) columns
/[^,]/ { 
    count++;
    printf "%04d", count
    for(i=2; i<=NF-1; i++) printf ",%s", $i
    printf "\n"
}
' "$INPUT" > "$OUTPUT"

echo "Done! Created $OUTPUT with $(grep -c "^" "$OUTPUT") rows."