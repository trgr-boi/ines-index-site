#!/usr/bin/env python3
import csv
import json
from pathlib import Path

INPUT_PATH = Path("src/tsv/a_post_porn_art_index_original.tsv")
OUTPUT_PATH = Path("src/data/data.json")

FIELDS = [
    "ID",
    "IMAGE",
    "TITLE",
    "ISSUE NUMBER",
    "AUTHOR(S)",
    "TYPE",
    "PLACE",
    "YEAR",
    "DESCRIPTION",
    "PUBLISHER",
    "PRINT DETAILS",
]

TSV_COLUMNS = {
    "TITLE": "TITLE",
    "ISSUE NUMBER": "ISSUE N°",
    "AUTHOR(S)": "AUTHOR(S)",
    "TYPE": "TYPE",
    "PLACE": "PLACE",
    "YEAR": "YEAR",
    "DESCRIPTION": "DESCRIPTION",
    "PUBLISHER": "PUBLISHER",
    "PRINT DETAILS": "PRINT DETAILS",
}


def main() -> None:
    if not INPUT_PATH.exists():
        raise SystemExit(f"Input file not found: {INPUT_PATH}")

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    with INPUT_PATH.open(newline="", encoding="utf-8") as f:
        reader = csv.reader(f, delimiter="\t")
        headers = next(reader, [])
        if headers:
            headers = headers[1:]

        rows = []
        row_index = 0
        for values in reader:
            values = values[1:] if values else []
            raw_row = dict(zip(headers, values))
            item = {}
            for field in FIELDS:
                if field == "ID":
                    continue
                if field == "IMAGE":
                    continue
                tsv_key = TSV_COLUMNS[field]
                item[field] = (raw_row.get(tsv_key) or "").strip()
            if not any(item.values()):
                continue
            row_index += 1
            item["ID"] = f"{row_index:04d}"
            item["IMAGE"] = f"src/img/{item['ID']}.jpg"
            rows.append(item)

    with OUTPUT_PATH.open("w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=2)

    print(f"Wrote {len(rows)} rows to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
