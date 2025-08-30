# Setup Guide

Complete setup instructions for the HONC Stack template with Better Auth.

## Prerequisites

- **Node.js 18+** - Required for development
- **pnpm** - Package manager (faster than npm/yarn)
- **GitHub Account** - For OAuth authentication
- **Cloudflare Account** - For deployment (optional for local development)

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

**Important Notes:**
- Replace `BETTER_AUTH_SECRET` with a secure random string (at least 32 characters)
- Use your actual GitHub OAuth app Client ID and Client Secret
- Keep `.dev.vars` private - it's already in `.gitignore`

**Generate a secure secret:**
```bash
# Option 1: Use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Use OpenSSL  
openssl rand -hex 32

# Option 3: Use a password manager or online generator
```

### 3. Authentication Setup

Generate the Better Auth database schema:

```bash
pnpm auth:generate
```

This command:
- Reads your `better-auth.config.ts` configuration
- Generates authentication database tables (user, session, account, verification)
- Creates the necessary schema files

### 4. Database Setup

Set up your local D1 database:

```bash
# Complete database setup (recommended)
pnpm db:setup
```

This runs:
1. `pnpm db:touch` - Creates/verifies database connection
2. `pnpm db:migrate` - Applies all migrations
3. `pnpm db:seed` - Seeds database with sample data

**Individual commands (if needed):**
```bash
pnpm db:touch      # Create/verify database connection
pnpm db:generate   # Generate new migrations from schema changes  
pnpm db:migrate    # Apply migrations to local database
pnpm db:seed       # Seed database with sample data
pnpm db:studio     # Open Drizzle Studio (database GUI)
```

## Verification

### 1. Start Development Servers

```bash
# Terminal 1: Start React frontend
pnpm dev

# Terminal 2: Start Cloudflare Worker backend  
pnpm worker:dev
```

### 2. Test the Setup

1. **Frontend**: Visit `http://localhost:5173` - Should show the React app
2. **Backend**: Visit `http://localhost:8787` - Should show API health check
3. **Authentication**: Click "Sign in with GitHub" - Should redirect to GitHub OAuth
4. **API Explorer**: Visit `http://localhost:8787/fp` - Fiberplane API explorer
5. **OpenAPI Docs**: Visit `http://localhost:8787/openapi.json` - API specification

### 3. Database Verification

```bash
# Open Drizzle Studio to inspect your database
pnpm db:studio
```

You should see:
- **Application tables** (e.g., `users`) 
- **Auth tables** (user, session, account, verification)
- **Sample data** (if you ran the seed command)

## Troubleshooting

### Common Issues

**❌ GitHub OAuth not working**
- Verify your `.dev.vars` has correct `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`
- Check that your GitHub OAuth app callback URL matches `http://localhost:8787/api/auth/callback/github`
- Ensure `BETTER_AUTH_URL` matches your worker dev server URL

**❌ Database connection errors**
- Run `pnpm db:touch` to verify database connection
- Try `pnpm db:migrate` to apply any missing migrations
- Check that `wrangler.jsonc` has correct D1 database configuration

**❌ Auth tables missing**
- Run `pnpm auth:generate` to regenerate auth schema
- Run `pnpm db:migrate` to apply auth table migrations
- Verify `better-auth.config.ts` configuration is correct

**❌ TypeScript errors**
- Run `pnpm install` to ensure all dependencies are installed
- Check that you're using Node.js 18+ and latest pnpm version
- Try restarting your TypeScript language server

### Getting Help

1. **Check logs**: Look at terminal output for specific error messages
2. **Database inspection**: Use `pnpm db:studio` to inspect database state
3. **API testing**: Use `http://localhost:8787/fp` to test API endpoints
4. **Configuration**: Verify all files in the checklist below

## Configuration Checklist

Before proceeding to development, ensure you have:

- [ ] `.dev.vars` file with all required environment variables
- [ ] GitHub OAuth app created with correct callback URL
- [ ] Auth schema generated (`pnpm auth:generate`)
- [ ] Database set up and migrated (`pnpm db:setup`)
- [ ] Both dev servers running without errors
- [ ] GitHub OAuth sign-in working
- [ ] Database accessible via Drizzle Studio

## Next Steps

Once setup is complete, see:
- **[Development Guide](README.DEVELOPMENT.md)** - Development workflow and commands
- **[Architecture Guide](README.ARCHITECTURE.md)** - Understanding the codebase structure
