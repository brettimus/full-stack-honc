# Setup Guide

Setup instructions for the HONC stack template.

## Prerequisites

- Node.js 18+
- pnpm
- GitHub account for OAuth
- Cloudflare account for deployment (optional)

## Installation

```bash
# Clone the repository (if not already done)
git clone <your-repo-url>
cd <your-repo-name>

# Install all dependencies
pnpm install
```

## Environment Setup

### 1. Create GitHub OAuth App

1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: Your app name (e.g., "My HONC App")
   - **Homepage URL**: `http://localhost:8787` (for development)
   - **Authorization callback URL**: `http://localhost:8787/api/auth/callback/github`
4. Click "Register application"
5. Note down your **Client ID** and generate a **Client Secret**

### 2. Environment Variables

Create a `.dev.vars` file in the project root:

```bash
# Better Auth Configuration
BETTER_AUTH_SECRET=your-secret-key-here-replace-with-random-string-at-least-32-chars
BETTER_AUTH_URL="http://localhost:8787"

# GitHub OAuth Configuration  
GITHUB_CLIENT_ID=your-github-oauth-app-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-app-client-secret
```

Replace `BETTER_AUTH_SECRET` with a secure random string and keep `.dev.vars` private.

### 3. Authentication Setup

Generate the auth schema if needed:

```bash
pnpm auth:generate
```

### 4. Database Setup

Set up the local D1 database:

```bash
pnpm db:setup
```

## Verification

### 1. Start Development Server

```bash
pnpm dev
```

Visit `http://localhost:4284` for the app and `http://localhost:4284/openapi.json` for API docs.

### 3. Database Verification

```bash
# Open Drizzle Studio to inspect your database
pnpm db:studio
```

You should see application tables, auth tables, and sample data if seeded.

## Troubleshooting

### Common Issues

**❌ Database connection errors**
- Run `pnpm db:touch` to verify database connection
- Try `pnpm db:migrate` to apply any missing migrations
- Check that `wrangler.jsonc` has correct D1 database configuration

**❌ Auth tables missing**
- Run `pnpm auth:generate` to regenerate auth schema
- Run `pnpm db:generate && pnpm db:migrate` to apply auth table migrations
- Verify `better-auth.config.ts` configuration is correct

**❌ TypeScript errors**
- Run `pnpm install`
- Ensure you're using Node.js 18+ and latest pnpm
- Restart your TypeScript language server

### Getting Help

1. Check logs for error messages
2. Use `pnpm db:studio` to inspect database state
3. Verify configuration files

## Configuration Checklist

Before development, ensure:

- `.dev.vars` with required variables
- GitHub OAuth app with correct callback URL
- Auth schema generated (`pnpm auth:generate`)
- Database set up (`pnpm db:setup`)
- Dev server runs without errors
- GitHub OAuth sign-in works
- Database accessible via Drizzle Studio

## Next Steps

Once setup is complete, see:
- [Development Guide](README.DEVELOPMENT.md)
- [Architecture Guide](README.ARCHITECTURE.md)
