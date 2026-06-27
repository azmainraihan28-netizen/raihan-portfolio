# Raihan Portfolio

Premium dark / minimal Next.js portfolio for the 30-day n8n automation challenge.

## Setup

```bash
npm install
npm run import   # parses the source folder once, generates 30 MDX case studies
npm run dev      # http://localhost:3000
```

## Where things live

- `content/site.ts` — name, headline, email, LinkedIn, stats, tools. Edit any time.
- `content/work/*.mdx` — generated case studies. Re-run `npm run import` to regenerate.
- `public/workflows/*.json` — downloadable n8n workflow JSONs (copied from source).
- `scripts/import-workflows.mjs` — the importer. Source path is hard-coded to `E:\Cowork\Linkedin growth`.
- `app/` — Next.js routes (home, work, work/[slug], services, about, contact, api/contact).
- `components/` — shared UI.

## Updating LinkedIn copy

Open `content/site.ts` and replace `headline`, `sub`, `role`, `location`, `tools` with whatever you want shown.
Profile photo goes to `public/avatar.jpg` (referenced from About later if you want it).

## Lead form

Form posts to `/api/contact`. Without `RESEND_API_KEY` set, leads are logged to the server console (dev mode).
With a key, leads are emailed to `site.email`.

Add a key:
```bash
cp .env.example .env.local
# paste RESEND_API_KEY=...
```

## Deploy

```bash
# Vercel:
npx vercel
# or push to GitHub and import in vercel.com — zero config needed.
```
