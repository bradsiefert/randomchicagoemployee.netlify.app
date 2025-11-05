# Random Chicago Employee
A Nuxt.js application that displays random City of Chicago employees from a Snowflake database.

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

Or use Netlify CLI for local development with function support:

```bash
netlify dev
```

**Note:** Use `netlify dev` (not `netlify serve`) for local development, as it properly handles Netlify Functions bundling.

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
Snowflake credentials are configured as server-only environment variables to prevent exposure in client bundles.

### Local Development
Create a `.env` file with the following Snowflake connection variables:

```
SNOWFLAKE_ACCOUNT=your_account
SNOWFLAKE_USERNAME=your_username
SNOWFLAKE_PASSWORD=your_password
SNOWFLAKE_WAREHOUSE=your_warehouse
SNOWFLAKE_DATABASE=your_database
SNOWFLAKE_SCHEMA=your_schema
```

### Production (Netlify)

#### Required Environment Variables
Add these Snowflake connection variables in your Netlify project settings (Site settings → Environment variables):

```
SNOWFLAKE_ACCOUNT=your_account
SNOWFLAKE_USERNAME=your_username
SNOWFLAKE_PASSWORD=your_password
SNOWFLAKE_WAREHOUSE=your_warehouse
SNOWFLAKE_DATABASE=your_database
SNOWFLAKE_SCHEMA=your_schema
```

**Important:** Do NOT use the `NUXT_` prefix for these variables, as variables with that prefix are exposed to the client by default. These credentials are accessed via `runtimeConfig.private` and are server-only.
