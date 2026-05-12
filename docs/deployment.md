# Deployment

The site is deployed to **GitHub Pages** automatically.

## How It Works

The workflow lives at `.github/workflows/static.yml`. It:

1. Triggers on every push to `main` (also manually triggerable via the Actions tab).
2. Uploads the entire repo as a static artifact.
3. Deploys it to GitHub Pages.

## Custom Domain

The `CNAME` file in the repo root sets the custom domain to `ines-list.trgr.site`. DNS must be configured on the domain side to point to GitHub Pages.

## Updating the Site

Just commit and push to `main`. There is no build step — whatever is in the repo is what gets served.
