# HONC Stack Template with Better Auth

A full-stack TypeScript template combining a React 19 SPA with a Cloudflare Workers backend.

The backend uses the HONC stack:
- Hono OpenAPI
- Drizzle ORM on D1 (SQLite)
- Cloudflare Workers

`@cloudflare/vite-plugin` enables deployment to Cloudflare.

Docs on the HONC stack: https://docs.honc.dev

GitHub OAuth authentication is implemented with Better Auth.

## Tech Stack

### Frontend
- React 19 for UI
- TanStack Router for file-based routing
- TypeScript
- Vite
- Better Auth client

### Backend
- Cloudflare Workers runtime
- Hono web framework
- D1 database
- Drizzle ORM
- Better Auth for GitHub OAuth
- OpenAPI with Zod schemas

### Development
- Biome for formatting and linting
- Vitest for tests
- TypeScript
- pnpm

## Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment (see README.SETUP.md)
cp .dev.vars.example .dev.vars  # Add your GitHub OAuth credentials

# Generate auth schema and set up database (optional if schema exists)
pnpm auth:generate
pnpm db:setup

# Start development server
pnpm dev
```

## Documentation

- **[Setup Guide](README.SETUP.md)** - Installation, environment setup, and GitHub OAuth configuration
- **[Development Guide](README.DEVELOPMENT.md)** - Development commands, testing, code quality, and deployment
- **[Architecture Guide](README.ARCHITECTURE.md)** - Project structure, authentication system, and API reference

