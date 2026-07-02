# Random Chicago Employee
A Nuxt.js application that displays random City of Chicago employees from a Convex database.

## Setup
Install dependencies:

```bash
npm install
```

Link to your Convex project:

```bash
npx convex dev
```

This creates `.env.local` with `CONVEX_URL`.

## Development
Run Convex and Nuxt in separate terminals:

```bash
npx convex dev
```

```bash
npm run dev
```

## Production
Deploy Convex functions:

```bash
npx convex deploy
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Local Production Preview

Test the Netlify production build locally before deploying. Stop `npm run dev` and `npx convex dev` first.

```bash
npm run build
npm run serve
```

Open the URL printed by Netlify (usually `http://localhost:8888`). The dev `CONVEX_URL` from `.env.local` is used for this test.

Alternatively:

```bash
npx netlify serve
```

Requires Netlify CLI (installed automatically via `npx` when running `npm run serve`).

## Environment Variables

### Local Development
`.env.local` is created by `npx convex dev` and is loaded by `npm run dev`, `npm run build`, `npm run preview`, and `npm run serve`:

```
CONVEX_URL=https://your-deployment.convex.cloud
```

### Production (Netlify)

Add in Netlify project settings (Site settings → Environment variables):

```
CONVEX_URL=https://your-production-deployment.convex.cloud
CONVEX_DEPLOY_KEY=your_production_deploy_key
```

Remove legacy Supabase variables if still present:

```
SUPABASE_URL
SUPABASE_KEY
```

## Data

Employee data lives in the Convex `randomchicagoemployee` table. After uploading data, run the one-time backfill to add row indexes:

```bash
npx convex run backfill:addRowIndex
```
