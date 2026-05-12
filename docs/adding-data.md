# Adding Data

## Steps

1. **Edit the source TSV** at `src/tsv/a_post_porn_art_index_original.tsv`.
   - Each row is a publication. The columns must match the expected headers (TITLE, ISSUE N°, AUTHOR(S), TYPE, PLACE, YEAR, DESCRIPTION, PUBLISHER, PRINT DETAILS).
   - The first column in the TSV is ignored by the conversion script.

2. **Add a thumbnail image** to `src/img/`.
   - Name it `<ID>.jpg` (e.g. `0042.jpg`) where the ID matches the zero-padded row number that will be assigned.
   - The original full-resolution image can optionally go in `src/img/original/`.

3. **Run the conversion script**:
   ```bash
   python3 helpers/tsv_to_json.py
   ```
   This reads the TSV and writes `src/data/data.json`. It skips empty rows and auto-assigns sequential IDs.

4. **Commit and push** to `main` — the site redeploys automatically.

## Notes

- IDs are re-generated every time the script runs based on row order. If you insert a row in the middle, all subsequent IDs shift. Make sure image filenames still match after re-running.
- Empty rows (where all fields are blank) are skipped.
