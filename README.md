# HONC Stack Template with Better Auth

A full-stack TypeScript template combining React 19 SPA with Cloudflare Workers backend, featuring the HONC stack (Hono + OpenAPI + D1 + Cloudflare) and GitHub OAuth authentication via Better Auth.

## Tech Stack

### Frontend
- **React 19** - Latest React with concurrent features
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
pnpm auth:generate
pnpm db:setup

# Start development servers
pnpm dev          # Frontend (React)
pnpm worker:dev   # Backend (Worker)
```

## Documentation

- **[Setup Guide](README.SETUP.md)** - Installation, environment setup, and GitHub OAuth configuration
- **[Development Guide](README.DEVELOPMENT.md)** - Development commands, testing, code quality, and deployment
- **[Architecture Guide](README.ARCHITECTURE.md)** - Project structure, authentication system, and API reference

## Features

- ✅ **GitHub OAuth** - Secure authentication with Better Auth
- ✅ **Type-Safe APIs** - Full TypeScript coverage with Zod validation
- ✅ **Edge Computing** - Global performance with Cloudflare Workers
- ✅ **Modern Stack** - React 19, Hono, D1, and latest tooling
- ✅ **Developer Experience** - Fast builds, hot reload, and comprehensive testing
- ✅ **Production Ready** - Deployment automation and environment management
