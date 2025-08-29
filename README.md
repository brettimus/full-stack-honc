# Cloudflare Worker + React SPA with HONC Stack + Better Auth

This project combines a React SPA frontend with a powerful Cloudflare Worker API backend using the HONC stack (Hono + OpenAPI + NoSQL + Cloudflare), enhanced with Better Auth for GitHub OAuth authentication.

## Architecture

### Frontend (React SPA)
- **React 19** with TypeScript
- **Vite** for development and build tooling
- **Better Auth React Client** for authentication
- **Biome** for code formatting and linting
- **SWC** for fast refresh during development

### Backend (Cloudflare Worker - HONC Stack)
- **Hono** - Ultra-fast web framework for the edge
- **Better Auth** - Modern authentication with GitHub OAuth
- **OpenAPI** - Auto-generated API documentation with Swagger UI
- **D1 Database** - Serverless SQLite database 
- **Drizzle ORM** - TypeScript ORM with schema validation
- **Zod** - Runtime type validation and OpenAPI schema generation
- **Fiberplane** - API explorer and testing interface
- **Vitest** - Unit and integration testing with Cloudflare Workers pool
- **Biome** - Fast code formatting and linting

## Getting Started

### Installation
```bash
pnpm install
```

### Authentication Setup

This project uses Better Auth with GitHub OAuth for authentication.

#### 1. Create GitHub OAuth App

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App with:
   - **Application name**: Your app name
   - **Homepage URL**: `http://localhost:8787` (development) or your production URL
   - **Authorization callback URL**: `http://localhost:8787/api/auth/callback/github`

#### 2. Environment Variables

Create a `.dev.vars` file in the project root:

```bash
# Better Auth Configuration
BETTER_AUTH_SECRET=your-secret-key-here-replace-with-random-string
BETTER_AUTH_URL="http://localhost:8787"

# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your-github-oauth-app-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-app-client-secret
```

**Important**: Replace the placeholder values with:
- A secure random string for `BETTER_AUTH_SECRET`
- Your actual GitHub OAuth app credentials

#### 3. Generate Auth Schema

Generate the authentication database tables:

```bash
pnpm auth:generate
```

This creates the necessary database tables for Better Auth (user, session, account, verification).

### Development

#### Frontend Development
```bash
pnpm dev  # Start React development server
```

#### Worker Development
```bash
pnpm worker:dev  # Start Cloudflare Worker development server
```

#### Database Setup
```bash
# Set up local D1 database with migrations and seed data
pnpm db:setup

# Individual database commands:
pnpm db:touch      # Create/verify database connection
pnpm db:generate   # Generate migrations from schema changes
pnpm db:migrate    # Apply migrations to local database
pnpm db:seed       # Seed database with sample data
pnpm db:studio     # Open Drizzle Studio (database GUI)
```

#### Authentication Commands
```bash
pnpm auth:generate # Generate Better Auth database schema
```

### Testing
```bash
pnpm worker:test       # Run worker tests once
pnpm worker:test:watch # Run worker tests in watch mode
```

### Code Quality
```bash
pnpm lint   # Lint and fix all code with Biome
pnpm format # Format all code with Biome
```

### Production Deployment

#### Database Setup for Production
Before deploying, set up a production D1 database:

1. **Create D1 database instance:**
   ```bash
   wrangler d1 create your-database-name
   ```

2. **Update `wrangler.jsonc`** with the production database ID:
   ```json
   "d1_databases": [
     {
       "binding": "DB",
       "database_name": "your-database-name", 
       "database_id": "your-production-database-id"
     }
   ]
   ```

3. **Create `.prod.vars` file** with production credentials:
   ```bash
   CLOUDFLARE_D1_TOKEN=your-api-token
   CLOUDFLARE_ACCOUNT_ID=your-account-id  
   CLOUDFLARE_DATABASE_ID=your-database-id
   ```

4. **Run production migrations:**
   ```bash
   pnpm db:generate        # Generate latest migration files
   pnpm db:migrate:prod    # Apply migrations to production
   pnpm db:seed:prod       # Seed production database (optional)
   ```

#### Deploy to Cloudflare
```bash
pnpm deploy  # Build and deploy both frontend and worker
```

## API Features

The worker provides a full-featured REST API with:

- **CRUD operations** for user management
- **OpenAPI specification** available at `/openapi.json`
- **Interactive API explorer** at `/fp` (Fiberplane)
- **Type-safe validation** using Zod schemas
- **Database integration** with Drizzle ORM and D1
- **Comprehensive error handling**

### API Endpoints

#### Public Endpoints
- `GET /` - Health check endpoint (shows user info if authenticated)
- `GET /openapi.json` - OpenAPI specification
- `GET /fp/*` - Fiberplane API explorer

#### Authentication Endpoints
- `GET /api/auth/sign-in/github` - Initiate GitHub OAuth sign-in
- `GET /api/auth/callback/github` - GitHub OAuth callback
- `POST /api/auth/sign-out` - Sign out current user
- `GET /api/auth/session` - Get current session

#### Protected Endpoints (require authentication)
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID
- `DELETE /api/users/:id` - Delete user by ID

## Project Structure

```
├── src/                       # React SPA source code
│   ├── components/
│   │   └── Navigation.tsx     # Authentication navigation component
│   └── lib/
│       └── auth.ts           # Better Auth React client
├── worker/                    # Cloudflare Worker source code
│   ├── src/
│   │   ├── db/
│   │   │   ├── auth.ts       # Better Auth database schema (generated)
│   │   │   └── schema.ts     # Drizzle database schema + auth tables
│   │   ├── dtos/
│   │   │   └── index.ts      # Zod validation schemas
│   │   ├── lib/
│   │   │   └── auth.ts       # Better Auth server configuration
│   │   ├── middleware/
│   │   │   ├── auth.ts       # Authentication middleware
│   │   │   ├── dbProvider.ts # Database connection middleware
│   │   │   └── validator.ts  # Request validation middleware
│   │   ├── utils/
│   │   │   └── allow-list.ts # Optional user access control
│   │   └── index.ts          # Main Hono application with auth routes
│   ├── tests/                # Worker test files
│   ├── drizzle/             # Database utilities and migrations
│   ├── drizzle.config.ts    # Drizzle configuration
│   ├── vitest.config.ts     # Test configuration
│   └── seed.ts              # Database seeding script
├── better-auth.config.ts     # Better Auth schema generation config
├── .dev.vars                 # Development environment variables
├── wrangler.jsonc           # Cloudflare Worker configuration
├── biome.json               # Code formatting and linting configuration  
└── package.json             # Project dependencies and scripts
```

## Authentication with Better Auth

This project uses [Better Auth](https://www.better-auth.com/) for modern, secure authentication.

### Features

- **GitHub OAuth Integration** - Sign in with GitHub accounts
- **Session Management** - Secure session handling with cookies
- **Type Safety** - Full TypeScript support across client and server
- **Edge Computing** - Optimized for Cloudflare Workers
- **Custom User Fields** - GitHub username tracking
- **Access Control** - Optional user allowlist functionality

### Key Components

#### Server-Side (`worker/src/`)

- **`lib/auth.ts`** - Better Auth server configuration with GitHub OAuth
- **`middleware/auth.ts`** - Authentication middleware for protected routes
- **`utils/allow-list.ts`** - Optional user access control (currently allows all users)
- **Database Tables** - Automatically generated auth tables (user, session, account, verification)

#### Client-Side (`src/`)

- **`lib/auth.ts`** - Better Auth React client configuration
- **`components/Navigation.tsx`** - Authentication UI component with sign-in/out
- **App.tsx** - Auth state management and conditional rendering

### Configuration

#### Environment Variables

- **`BETTER_AUTH_SECRET`** - Secret key for session encryption
- **`BETTER_AUTH_URL`** - Base URL for auth callbacks
- **`GITHUB_CLIENT_ID`** - GitHub OAuth app client ID
- **`GITHUB_CLIENT_SECRET`** - GitHub OAuth app client secret

#### User Access Control

To restrict access to specific GitHub users, edit `worker/src/utils/allow-list.ts`:

```typescript
const allowedGitHubUsernames = new Set<string>([
  "your-username",
  "teammate-username",
]);
```

By default, all authenticated GitHub users are allowed access.

### Production Setup

For production deployment, update your environment variables:

1. **Create production GitHub OAuth app** with your production URL
2. **Set production environment variables** in Cloudflare dashboard or `.prod.vars`
3. **Update `wrangler.jsonc`** with production `BETTER_AUTH_URL`

## Code Quality with Biome

This project uses [Biome](https://biomejs.dev/) for fast code formatting and linting across both frontend and backend code.

### Configuration

The `biome.json` configuration includes:

- **Unified formatting** for TypeScript, JavaScript, and JSON files
- **Import organization** with automatic sorting
- **React-specific linting** including accessibility rules
- **Consistent code style** with single quotes and ES5 trailing commas
- **Console logging** allowed in tests, seeds, and configuration files

### Usage

```bash
# Format all code
pnpm format

# Lint and auto-fix all code  
pnpm lint

# Check specific files
pnpm biome check src/

# Format specific files
pnpm biome format --write src/
```

### Key Features

- **Fast performance** - significantly faster than ESLint
- **Built-in formatter** - no need for separate Prettier
- **TypeScript-first** - excellent TypeScript support out of the box
- **Import organization** - automatically sorts and organizes imports
- **Accessibility checking** - built-in a11y rules for React components
