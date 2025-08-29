# AI Agent Project Guide

## Project Overview

This is a full-stack web application built with the HONC stack (Hono + OpenAPI + NoSQL + Cloudflare) and enhanced with Better Auth for GitHub OAuth authentication. The project serves as a comprehensive example of modern web development with:

- **React 19 SPA** frontend with TypeScript and Better Auth client
- **Cloudflare Worker** backend with Hono framework and Better Auth server
- **D1 Database** with Drizzle ORM and auto-generated auth tables
- **GitHub OAuth** authentication with session management
- **Type-safe APIs** with OpenAPI documentation
- **Comprehensive testing** with Vitest and Workers pool

This guide provides AI agents with the context needed to understand, maintain, and extend this application.

## Architecture

### Frontend (React SPA)
- **Framework**: React 19 with TypeScript
- **Authentication**: Better Auth React client with GitHub OAuth
- **Build Tool**: Vite with SWC for fast refresh
- **Styling**: CSS with dark theme and responsive design
- **State Management**: React hooks for local state and auth
- **API Integration**: Type-safe client with error handling

### Backend (Cloudflare Worker - HONC Stack)
- **Runtime**: Cloudflare Workers (V8 isolates)
- **Framework**: Hono - ultra-fast web framework for the edge
- **Authentication**: Better Auth with GitHub OAuth provider
- **Database**: Cloudflare D1 (serverless SQLite)
- **ORM**: Drizzle ORM with type-safe schema
- **Validation**: Zod schemas with OpenAPI integration
- **API Documentation**: Auto-generated OpenAPI spec with Swagger UI
- **Testing**: Vitest with Cloudflare Workers pool
- **Code Quality**: Biome for formatting and linting

## Project Structure

This is a full-stack HONC application with:
- **`src/`** - React SPA frontend with TypeScript and Better Auth client
- **`worker/`** - Cloudflare Worker API with Hono framework, Better Auth server, D1 database, and comprehensive testing

For detailed project structure, development commands, and deployment instructions, see the [README.md](./README.md).

## Key Technologies

### Frontend Stack
- **React 19**: Latest React with concurrent features
- **Better Auth**: React client for authentication
- **TypeScript**: Type safety and developer experience
- **Vite**: Fast build tool with HMR
- **Biome**: Fast code formatting and linting

### Backend Stack
- **Hono**: High-performance web framework
- **Better Auth**: Modern authentication with GitHub OAuth
- **Cloudflare D1**: Serverless SQLite database
- **Drizzle ORM**: Type-safe SQL operations
- **Zod**: Runtime validation and schema generation
- **hono-openapi**: OpenAPI specification generation
- **Fiberplane**: Interactive API explorer
- **Vitest**: Testing framework with Workers integration
- **Biome**: Fast code formatting and linting for entire codebase

## Development Workflow

### Getting Started
```bash
pnpm install                    # Install dependencies
pnpm auth:generate              # Generate Better Auth schema
pnpm db:setup                   # Set up local database
pnpm dev                        # Start frontend dev server
pnpm worker:dev                 # Start worker dev server (separate terminal)
```

### Authentication Setup
```bash
pnpm auth:generate              # Generate auth database schema
```

### Database Operations
```bash
pnpm db:touch                   # Create/verify database connection
pnpm db:generate                # Generate migrations from schema changes
pnpm db:migrate                 # Apply migrations to local database
pnpm db:seed                    # Seed database with sample data
pnpm db:studio                  # Open Drizzle Studio (database GUI)
```

### Testing and Quality
```bash
pnpm worker:test                # Run API tests
pnpm worker:test:watch          # Run tests in watch mode
pnpm lint                       # Lint and fix all code with Biome
pnpm format                     # Format all code with Biome
```

### Production Deployment
```bash
pnpm deploy                     # Build and deploy to Cloudflare
```

## API Features

### Public Endpoints
- `GET /` - Health check (shows user info if authenticated)
- `GET /openapi.json` - OpenAPI specification
- `GET /fp/*` - Fiberplane interactive API explorer

### Authentication Endpoints
- `GET /api/auth/sign-in/github` - Initiate GitHub OAuth sign-in
- `GET /api/auth/callback/github` - GitHub OAuth callback
- `POST /api/auth/sign-out` - Sign out current user
- `GET /api/auth/session` - Get current session

### Protected Endpoints (require authentication)
- `GET /api/health` - Health check with database status
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID
- `DELETE /api/users/:id` - Delete user

### Developer Tools
- `GET /openapi.json` - OpenAPI specification
- `GET /fp/*` - Fiberplane interactive API explorer

### Key Features
- **GitHub OAuth Authentication** with Better Auth
- **Session Management** with secure cookies
- **Protected API Routes** with authentication middleware
- **Type-safe validation** using Zod schemas
- **Comprehensive error handling** with structured responses
- **Database integration** with connection pooling
- **OpenAPI documentation** auto-generated from code
- **Interactive testing** via Fiberplane interface

## Database Schema

### Application Tables

#### Users Table (Application Data)
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,           -- UUID generated automatically
  name TEXT NOT NULL,            -- User's display name
  email TEXT NOT NULL,           -- User's email (unique, case-insensitive)
  created_at TEXT NOT NULL,      -- ISO timestamp
  updated_at TEXT NOT NULL       -- ISO timestamp
);

CREATE UNIQUE INDEX emailUniqueIndex ON users(LOWER(email));
```

### Authentication Tables (Better Auth)

#### User Table (Auth)
```sql
CREATE TABLE user (
  id TEXT PRIMARY KEY,           -- Auth user ID
  name TEXT NOT NULL,            -- User's display name
  email TEXT NOT NULL UNIQUE,   -- User's email
  email_verified INTEGER NOT NULL DEFAULT 0, -- Email verification status
  image TEXT,                    -- Profile image URL
  github_username TEXT,          -- GitHub username (custom field)
  created_at INTEGER NOT NULL,   -- Timestamp (Unix)
  updated_at INTEGER NOT NULL    -- Timestamp (Unix)
);
```

#### Session Table
```sql
CREATE TABLE session (
  id TEXT PRIMARY KEY,           -- Session ID
  expires_at INTEGER NOT NULL,   -- Session expiration (Unix timestamp)
  token TEXT NOT NULL UNIQUE,   -- Session token
  user_id TEXT NOT NULL,        -- Foreign key to user.id
  ip_address TEXT,              -- Client IP address
  user_agent TEXT,              -- Client user agent
  created_at INTEGER NOT NULL,   -- Creation timestamp
  updated_at INTEGER NOT NULL    -- Update timestamp
);
```

#### Account Table (OAuth)
```sql
CREATE TABLE account (
  id TEXT PRIMARY KEY,           -- Account ID
  account_id TEXT NOT NULL,      -- Provider account ID
  provider_id TEXT NOT NULL,     -- OAuth provider (github)
  user_id TEXT NOT NULL,        -- Foreign key to user.id
  access_token TEXT,            -- OAuth access token
  refresh_token TEXT,           -- OAuth refresh token
  id_token TEXT,                -- OAuth ID token
  access_token_expires_at INTEGER, -- Token expiration
  refresh_token_expires_at INTEGER, -- Refresh token expiration
  scope TEXT,                   -- OAuth scopes
  created_at INTEGER NOT NULL,   -- Creation timestamp
  updated_at INTEGER NOT NULL    -- Update timestamp
);
```

#### Verification Table
```sql
CREATE TABLE verification (
  id TEXT PRIMARY KEY,           -- Verification ID
  identifier TEXT NOT NULL,      -- Email or other identifier
  value TEXT NOT NULL,          -- Verification code/token
  expires_at INTEGER NOT NULL,   -- Expiration timestamp
  created_at INTEGER,           -- Creation timestamp
  updated_at INTEGER            -- Update timestamp
);
```

### Schema Features
- **UUID Primary Keys**: Auto-generated using crypto.randomUUID()
- **Case-insensitive Email**: Unique index on lowercase email
- **Timestamps**: Automatic creation and update tracking
- **Type Safety**: Drizzle schema with TypeScript inference
- **Authentication Integration**: Better Auth manages user sessions and OAuth accounts
- **GitHub Integration**: Custom githubUsername field for GitHub user tracking

## Configuration Files

### Key Configuration
- **`wrangler.jsonc`**: Cloudflare Worker deployment settings
  - D1 database binding configuration
  - Asset handling for SPA routing
  - Compatibility flags and date settings
  - Environment variables for production auth URLs
- **`better-auth.config.ts`**: Better Auth schema generation configuration
  - Local D1 database connection for schema generation
  - GitHub OAuth provider configuration
  - Custom user fields definition
- **`.dev.vars`**: Development environment variables
  - Better Auth secret and URL configuration
  - GitHub OAuth client credentials
- **`drizzle.config.ts`**: Database ORM configuration
  - Local and production database connections
  - Migration directory and schema location
- **`vitest.config.ts`**: Test configuration
  - Cloudflare Workers pool integration
  - D1 database testing setup
- **`biome.json`**: Code formatting and linting configuration  
  - Unified formatting and linting for all TypeScript, JavaScript, and JSON files
  - Import organization and React accessibility rules
  - Local schema reference for offline support

## Common Tasks

### Adding New API Endpoints
1. **Define schema** in `worker/src/db/schema.ts`
2. **Create DTOs** in `worker/src/dtos/index.ts`
3. **Add route** in `worker/src/index.ts` with OpenAPI docs
4. **Write tests** in `worker/tests/index.spec.ts`
5. **Update frontend** API client and components

### Database Changes
1. **Modify schema** in `worker/src/db/schema.ts`
2. **Generate migration**: `pnpm db:generate`
3. **Apply locally**: `pnpm db:migrate`
4. **Update seed data** in `worker/seed.ts` if needed
5. **Test changes**: `pnpm worker:test`

### Frontend Development
1. **Create components** in `src/components/`
2. **Update API client** in `src/api.ts`
3. **Add types** in `src/types.ts`
4. **Style components** in `src/App.css`
5. **Test in browser** with `pnpm dev`

## Deployment

### Production Setup
1. **Create D1 database**: `wrangler d1 create your-database-name`
2. **Update wrangler.jsonc** with production database ID
3. **Set environment variables** in `.prod.vars`
4. **Run migrations**: `pnpm db:migrate:prod`
5. **Deploy**: `pnpm deploy`

### Environment Variables

#### Database
- **`CLOUDFLARE_D1_TOKEN`**: API token with D1 permissions
- **`CLOUDFLARE_ACCOUNT_ID`**: Cloudflare account identifier
- **`CLOUDFLARE_DATABASE_ID`**: Production database identifier

#### Authentication
- **`BETTER_AUTH_SECRET`**: Secret key for session encryption (required)
- **`BETTER_AUTH_URL`**: Base URL for auth callbacks (required)
- **`GITHUB_CLIENT_ID`**: GitHub OAuth app client ID (required)
- **`GITHUB_CLIENT_SECRET`**: GitHub OAuth app client secret (required)

## Testing Strategy

### API Testing
- **Unit tests** for individual endpoints
- **Integration tests** with real D1 database
- **Error handling** validation
- **Type safety** verification

### Test Environment
- **Isolated databases** per test suite
- **Automatic migrations** applied before tests
- **Mock data** generation for consistent testing
- **CI/CD ready** with Vitest and Cloudflare integration

## Important Notes for AI Agents

### Authentication System
- All API routes except auth endpoints require authentication
- Users must sign in with GitHub OAuth to access the application
- Session management is handled automatically by Better Auth
- User access can be controlled via the allowlist in `worker/src/utils/allow-list.ts`

### Key Files to Understand
- **`worker/src/lib/auth.ts`** - Better Auth server configuration
- **`worker/src/middleware/auth.ts`** - Authentication middleware
- **`src/lib/auth.ts`** - Better Auth React client
- **`src/components/Navigation.tsx`** - Auth UI component
- **`.dev.vars`** - Environment variables (not committed to repo)

### Development Commands
- **`pnpm auth:generate`** - Generate auth schema (run after auth config changes)
- **`pnpm db:generate`** - Generate database migrations
- **`pnpm db:migrate`** - Apply migrations locally
- **`pnpm worker:dev`** - Start worker dev server with auth
- **`pnpm dev`** - Start React dev server

### Common Issues
- Ensure `.dev.vars` has valid GitHub OAuth credentials
- Auth routes must bypass auth middleware (handled in `worker/src/index.ts`)
- Client and server auth configurations must match base URLs
- Database must include auth tables (generated via `pnpm auth:generate`)

This project demonstrates modern full-stack development with edge computing and secure authentication, providing a solid foundation for scalable web applications on Cloudflare's platform with GitHub OAuth integration.