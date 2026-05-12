# Post Porn Print Index

A static website that presents a browsable, alphabetically organized index of print publications (zines, magazines, books, etc.). Inspired by classic directory-index pages.

**Live site:** [ines-list.trgr.site](https://ines-list.trgr.site)

## Quick Start

No build step required — it's plain HTML/CSS/JS.

1. Clone the repo
2. Open `index.html` in a browser, or serve it locally:
   ```bash
   python3 -m http.server 8000
   ```
3. Visit `http://localhost:8000`

## Project Overview

```
.
├── index.html                # Main page (loads the table)
├── info.html                 # Info/about page
├── CNAME                     # Custom domain for GitHub Pages
├── helpers/
│   └── tsv_to_json.py        # Converts the source TSV to data.json
├── src/
│   ├── css/style.css         # All styles
│   ├── data/data.json        # The indexed data (generated)
│   ├── fonts/                # Custom fonts
│   ├── img/                  # Thumbnail images (0001.jpg, etc.)
│   ├── img/original/         # Full-resolution source images
│   ├── js/table.js           # Renders the index table from JSON
│   ├── js/show_image.js      # Image preview overlay on hover/click
│   └── tsv/                  # Source TSV data
└── .github/workflows/
    └── static.yml            # Deploys to GitHub Pages on push to main
```

## How It Works

1. **Source data** lives in `src/tsv/` as a TSV spreadsheet.
2. Run `helpers/tsv_to_json.py` to convert it into `src/data/data.json`.
3. The frontend (`table.js`) fetches `data.json` and renders an alphabetically sorted, sectioned HTML table.
4. Each row can show an image preview on hover and a full-screen modal on click (`show_image.js`).
5. A sticky alphabet navigation bar lets you jump to any letter.
6. Pushing to `main` triggers a GitHub Actions workflow that deploys the entire repo as a static site to GitHub Pages.

## Data Pipeline

```bash
# Convert the source TSV into the JSON the frontend uses
python3 helpers/tsv_to_json.py
```

Each entry gets a zero-padded ID (e.g. `0001`) and an `IMAGE` path pointing to `src/img/<ID>.jpg`.

## Adding New Entries

1. Add rows to the TSV in `src/tsv/`.
2. Add a corresponding thumbnail image to `src/img/` named `<ID>.jpg`.
3. Re-run the conversion script.
4. Commit and push — the site redeploys automatically.

## Docs

More details are in the [`docs/`](docs/) directory.
