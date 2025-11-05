# Random Chicago Employee
A Nuxt.js application that displays random City of Chicago employees from a Supabase database.

## Setup
Install dependencies:

```bash
npm install
```

## Development
Start the development server:

```bash
npm run dev
```

## Production
Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Environment Variables
Supabase credentials are configured as server-only environment variables to prevent exposure in client bundles.

### Local Development
Create a `.env` file with the following Supabase connection variables:

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

### Production (Netlify)

#### Required Environment Variables
Add these Supabase connection variables in your Netlify project settings (Site settings → Environment variables):

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

**Important:** Do NOT use the `NUXT_` prefix for these variables, as variables with that prefix are exposed to the client by default. These credentials are accessed via `process.env` and are server-only.
