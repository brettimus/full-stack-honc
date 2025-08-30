# HONC Stack Template with Better Auth

A full-stack TypeScript template combining React 19 SPA with Cloudflare Workers backend.

The backend features the HONC stack: 
- Hono OpenAPI
- Drizzle ORM on D1 (sqlite)
- Cloudflare. 

The `@cloudflare/vite-plugin` package makes everything deployable to Cloudflare.

Docs on the HONC stack are here: https://docs.honc.dev

This template also uses GitHub OAuth authentication, implemented with Better Auth, since Better Auth has sensible adapters for both Hono and Drizzle.

## Tech Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **TanStack Router** - Type-safe file-based routing with automatic code splitting
- **TypeScript** - Full type safety
- **Vite** - Fast build tool with HMR
- **Better Auth Client** - Type-safe authentication

### Backend  
- **Cloudflare Workers** - Edge computing runtime
- **Hono** - Ultra-fast web framework
- **D1 Database** - Serverless SQLite
- **Drizzle ORM** - Type-safe database operations
- **Better Auth** - Modern authentication with GitHub OAuth
- **OpenAPI** - Auto-generated API documentation
- **Zod** - Runtime validation and schema generation

### Development
- **Biome** - Fast formatting and linting
- **Vitest** - Testing with Cloudflare Workers pool
- **TypeScript** - Strict type checking
- **pnpm** - Fast package management

## Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment (see README.SETUP.md)
cp .dev.vars.example .dev.vars  # Add your GitHub OAuth credentials

# Generate auth schema and set up database
pnpm auth:generate # you probably do not need to do this as the template has the schema already
pnpm db:setup

# Start development server
pnpm dev
```

## Documentation

- **[Setup Guide](README.SETUP.md)** - Installation, environment setup, and GitHub OAuth configuration
- **[Development Guide](README.DEVELOPMENT.md)** - Development commands, testing, code quality, and deployment
- **[Architecture Guide](README.ARCHITECTURE.md)** - Project structure, authentication system, and API reference

## Features

- ✅ **GitHub OAuth** - Secure authentication with Better Auth
- ✅ **Type-Safe APIs** - Full TypeScript coverage with Zod validation
- ✅ **Type-Safe Routing** - File-based routing with TanStack Router
- ✅ **Edge Computing** - Global performance with Cloudflare Workers
- ✅ **Modern Stack** - React 19, TanStack Router, Hono, D1, and latest tooling
- ✅ **Developer Experience** - Fast builds, hot reload, and comprehensive testing
- ✅ **Production Ready** - Deployment automation and environment management
