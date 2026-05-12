# Architecture

The site is a single-page static site with no build tools or frameworks.

## Pages

- **`index.html`** — The main page. Loads the CSS, then `table.js` and `show_image.js`.
- **`info.html`** — A simple info/about page.

## Frontend

### `table.js`

On page load it fetches `src/data/data.json`, filters out rows with no title, then:

1. Builds a sticky alphabet navigation bar from the first letters of all titles.
2. Renders an HTML table sorted alphabetically, with letter section headers.
3. Each row carries a `data-image-path` attribute with the thumbnail path.

### `show_image.js`

Uses a `MutationObserver` to wait for the table to render, then attaches:

- **Hover preview** — a small fixed-position thumbnail appears (bottom-left) after a 300ms delay.
- **Click modal** — clicking a row opens a full-screen lightbox with the image.
- Only rows that have a loadable image get these interactions.

### `style.css`

- Custom fonts via `@font-face`.
- Sticky header and alphabet nav using `position: sticky` and a CSS variable (`--alphabet-nav-height`) for offset.
- Optional row/column hover highlighting (toggled via `HOVER_HIGHLIGHT` in `table.js`).
- Mobile breakpoint at 850px (still a work in progress).

## Data

`src/data/data.json` is a flat JSON array of objects. Each entry has:

| Field            | Description                          |
|------------------|--------------------------------------|
| `ID`             | Zero-padded row number (e.g. `0001`) |
| `IMAGE`          | Path to thumbnail (`src/img/<ID>.jpg`) |
| `TITLE`          | Publication title                    |
| `ISSUE NUMBER`   | Issue/volume number                  |
| `AUTHOR(S)`      | Author names                         |
| `TYPE`           | Format (zine, magazine, book, etc.)  |
| `PLACE`          | Country/location                     |
| `YEAR`           | Publication year                     |
| `DESCRIPTION`    | Free-text description                |
| `PUBLISHER`      | Publisher name                       |
| `PRINT DETAILS`  | Physical/print specs                 |

The table hides `ID`, `IMAGE`, and `DESCRIPTION` columns from the display.
